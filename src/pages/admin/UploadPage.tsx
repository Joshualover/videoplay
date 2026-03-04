import { useState, useRef, useCallback } from 'react';
import { Upload, X, Film, Image, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn, generateId, formatFileSize } from '@/lib/utils';
import { getTags, saveVideo } from '@/data/mockData';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import type { Video, UploadTask } from '@/types';


export function UploadPage() {
  const [uploadTasks, setUploadTasks] = useState<UploadTask[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [editingTask, setEditingTask] = useState<UploadTask | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states for editing
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [thumbnail, setThumbnail] = useState<string>('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');

  const availableTags = getTags().map((t) => t.name);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('video/')
    );

    files.forEach((file) => addUploadTask(file));
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).filter((file) =>
        file.type.startsWith('video/')
      );

      files.forEach((file) => addUploadTask(file));
    },
    []
);

  // Upload to Firebase Storage
  const uploadToFirebase = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot: any) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadTasks((prev) =>
            prev.map((t) =>
              t.file.name === file.name ? { ...t, progress, status: 'uploading' } : t
            )
          );
        },
        (error: any) => {
          console.error('Upload failed:', error);
          reject(error);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });
  };

  const addUploadTask = async (file: File) => {
    const task: UploadTask = {
      id: generateId(),
      file,
      progress: 0,
      status: 'pending',
    };

    setUploadTasks((prev) => [...prev, task]);

    try {
      const videoPath = `videos/${Date.now()}_${file.name}`;
      const videoUrl = await uploadToFirebase(file, videoPath);
      setUploadTasks((prev) =>
        prev.map((t) =>
          t.file.name === file.name
            ? { ...t, progress: 100, status: 'completed', videoUrl: videoUrl }
            : t
        )
      );

      setEditingTask({ ...task, progress: 100, status: 'completed', videoUrl: videoUrl });
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadTasks((prev) =>
        prev.map((t) =>
          t.file.name === file.name ? { ...t, status: 'error' } : t
        )
      );
    }
  };

  const removeTask = (taskId: string) => {
    setUploadTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (editingTask?.id === taskId) {
      setEditingTask(null);
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedTags([]);
    setNewTag('');
    setThumbnail('');
    setVisibility('public');
  };

  const handleThumbnailCapture = async (task: UploadTask) => {
    // 创建视频元素来捕获帧
    const video = document.createElement('video');
    video.src = URL.createObjectURL(task.file);
    video.currentTime = 5; // 第5秒

    video.addEventListener('loadeddata', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        setThumbnail(canvas.toDataURL('image/jpeg', 0.8));
      }
      URL.revokeObjectURL(video.src);
    });

    video.load();
  };

  const handleSaveVideo = async () => {
    if (!editingTask) return;

    // 获取视频时长
    const video = document.createElement('video');
    video.src = URL.createObjectURL(editingTask.file);

    video.addEventListener('loadedmetadata', () => {
      const newVideo: Video = {
        id: generateId(),
        title: title || editingTask.file.name,
        description,
        thumbnailUrl:
          thumbnail ||
          'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop',
        videoUrl: video.src, // 在实际应用中，这应该是上传后的URL
        duration: video.duration,
        fileSize: editingTask.file.size,
        tags: selectedTags,
        uploadTime: new Date().toISOString(),
        publishTime:
          visibility === 'public' ? new Date().toISOString() : undefined,
        status: visibility === 'public' ? 'published' : 'private',
        viewCount: 0,
      };

      saveVideo(newVideo);

      // 清除任务
      removeTask(editingTask.id);
      setEditingTask(null);
      resetForm();
    });

    video.load();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addNewTag = () => {
    if (newTag && !selectedTags.includes(newTag)) {
      setSelectedTags((prev) => [...prev, newTag]);
      setNewTag('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-poppins text-2xl font-semibold text-[#212121]">
          上传视频
        </h1>
        <p className="text-[#666666] mt-1">
          拖拽视频文件到下方区域，或点击选择文件上传
        </p>
      </div>

      {/* Upload Zone */}
      {!editingTask && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'drop-zone p-12 text-center cursor-pointer transition-all duration-300',
            isDragging && 'drag-over'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="w-20 h-20 bg-[#d4acfe]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-10 h-10 text-[#d4acfe]" />
          </div>
          <h3 className="text-lg font-medium text-[#212121] mb-2">
            拖拽视频文件到此处
          </h3>
          <p className="text-sm text-[#666666]">
            支持 MP4, WebM, OGG 格式，单个文件最大 2GB
          </p>
          <Button className="btn-primary mt-4">选择文件</Button>
        </div>
      )}

      {/* Upload Tasks */}
      {uploadTasks.length > 0 && !editingTask && (
        <div className="space-y-4">
          <h2 className="font-medium text-[#212121]">上传进度</h2>
          <div className="space-y-3">
            {uploadTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-xl p-4 border border-[#e0e0e0]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#f5f5f5] rounded-lg flex items-center justify-center">
                      <Film className="w-5 h-5 text-[#666666]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#212121] line-clamp-1">
                        {task.file.name}
                      </p>
                      <p className="text-sm text-[#9e9e9e]">
                        {formatFileSize(task.file.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.status === 'completed' ? (
                      <Button
                        size="sm"
                        onClick={() => {
                          setEditingTask(task);
                          setTitle(task.file.name.replace(/\.[^/.]+$/, ''));
                          handleThumbnailCapture(task);
                        }}
                      >
                        编辑信息
                      </Button>
                    ) : (
                      <span className="text-sm text-[#666666]">
                        {Math.round(task.progress)}%
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTask(task.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Progress value={task.progress} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Form */}
      {editingTask && (
        <div className="bg-white rounded-xl p-6 border border-[#e0e0e0] space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-poppins text-lg font-semibold text-[#212121]">
              编辑视频信息
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditingTask(null);
                resetForm();
              }}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Thumbnail Preview */}
          <div className="space-y-2">
            <Label>视频封面</Label>
            <div className="relative w-full max-w-md aspect-video bg-[#f5f5f5] rounded-xl overflow-hidden">
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Image className="w-12 h-12 text-[#9e9e9e]" />
                </div>
              )}
              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-3 right-3"
                onClick={() => handleThumbnailCapture(editingTask)}
              >
                <Image className="w-4 h-4 mr-1" />
                重新捕获
              </Button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              视频标题 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入视频标题"
              className="rounded-xl"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">视频描述</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="输入视频描述..."
              rows={4}
              className="rounded-xl resize-none"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>标签</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {availableTags.slice(0, 10).map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm transition-all duration-200',
                    selectedTags.includes(tag)
                      ? 'bg-[#d4acfe] text-white'
                      : 'bg-[#f5f5f5] text-[#666666] hover:bg-[#e0e0e0]'
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="添加新标签"
                className="rounded-xl flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addNewTag();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addNewTag}
                className="rounded-xl"
              >
                添加
              </Button>
            </div>
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-[#d4acfe]/20 text-[#212121] cursor-pointer hover:bg-[#d4acfe]/30"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <Label>可见性</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === 'public'}
                  onChange={() => setVisibility('public')}
                  className="w-4 h-4 accent-[#d4acfe]"
                />
                <span className="text-[#212121]">公开</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === 'private'}
                  onChange={() => setVisibility('private')}
                  className="w-4 h-4 accent-[#d4acfe]"
                />
                <span className="text-[#212121]">私密</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-[#e0e0e0]">
            <Button
              onClick={handleSaveVideo}
              className="btn-primary flex-1"
              disabled={!title}
            >
              <Check className="w-4 h-4 mr-2" />
              确认上传
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditingTask(null);
                resetForm();
              }}
              className="rounded-xl"
            >
              取消
            </Button>
          </div>
        </div>
      )}

      {/* Tips */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="w-4 h-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          提示：视频上传后会自动截取第5秒作为封面，您可以在编辑信息时重新捕获或上传自定义封面。
        </AlertDescription>
      </Alert>
    </div>
  );
}
