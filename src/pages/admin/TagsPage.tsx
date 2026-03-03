import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag as TagIcon, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { getTags, getVideos, saveVideo } from '@/data/mockData';
import { generateId } from '@/lib/utils';
import type { Tag } from '@/types';

// Predefined tag colors
const TAG_COLORS = [
  '#d4acfe', // Purple
  '#ff4081', // Pink
  '#4caf50', // Green
  '#2196f3', // Blue
  '#ff9800', // Orange
  '#9c27b0', // Deep Purple
  '#e91e63', // Magenta
  '#00bcd4', // Cyan
  '#795548', // Brown
  '#607d8b', // Blue Grey
  '#8bc34a', // Light Green
  '#ffc107', // Amber
  '#f44336', // Red
  '#ffeb3b', // Yellow
];

export function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = () => {
    const loadedTags = getTags();
    setTags(loadedTags);
  };

  const handleAddTag = () => {
    if (!newTagName.trim()) return;

    const newTag: Tag = {
      id: generateId(),
      name: newTagName.trim(),
      color: newTagColor,
      usageCount: 0,
    };

    const updatedTags = [...tags, newTag];
    localStorage.setItem('video_studio_tags', JSON.stringify(updatedTags));
    loadTags();
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditTag = () => {
    if (!selectedTag || !newTagName.trim()) return;

    const updatedTags = tags.map((tag) =>
      tag.id === selectedTag.id
        ? { ...tag, name: newTagName.trim(), color: newTagColor }
        : tag
    );

    localStorage.setItem('video_studio_tags', JSON.stringify(updatedTags));
    loadTags();
    resetForm();
    setIsEditDialogOpen(false);
  };

  const handleDeleteTag = () => {
    if (!selectedTag) return;

    // Remove tag from all videos
    const videos = getVideos();
    videos.forEach((video) => {
      if (video.tags.includes(selectedTag.name)) {
        const updatedVideo = {
          ...video,
          tags: video.tags.filter((t) => t !== selectedTag.name),
        };
        saveVideo(updatedVideo);
      }
    });

    // Remove tag from tags list
    const updatedTags = tags.filter((tag) => tag.id !== selectedTag.id);
    localStorage.setItem('video_studio_tags', JSON.stringify(updatedTags));

    loadTags();
    setIsDeleteDialogOpen(false);
  };

  const openEditDialog = (tag: Tag) => {
    setSelectedTag(tag);
    setNewTagName(tag.name);
    setNewTagColor(tag.color || TAG_COLORS[0]);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (tag: Tag) => {
    setSelectedTag(tag);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setNewTagName('');
    setNewTagColor(TAG_COLORS[0]);
    setSelectedTag(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-poppins text-2xl font-semibold text-[#212121]">
            标签管理
          </h1>
          <p className="text-[#666666] mt-1">
            共 {tags.length} 个标签，用于分类和筛选视频
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}
          className="btn-primary gap-2"
        >
          <Plus className="w-4 h-4" />
          新建标签
        </Button>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="bg-white rounded-xl p-4 border border-[#e0e0e0] hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${tag.color}20` }}
                >
                  <TagIcon className="w-5 h-5" style={{ color: tag.color }} />
                </div>
                <div>
                  <h3 className="font-medium text-[#212121]">{tag.name}</h3>
                  <p className="text-sm text-[#9e9e9e]">
                    {tag.usageCount} 个视频
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openEditDialog(tag)}
                >
                  <Edit2 className="w-4 h-4 text-[#666666]" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openDeleteDialog(tag)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tags.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto mb-4">
            <Hash className="w-8 h-8 text-[#9e9e9e]" />
          </div>
          <p className="text-[#666666]">还没有标签</p>
          <Button
            variant="outline"
            onClick={() => setIsAddDialogOpen(true)}
            className="mt-4"
          >
            创建第一个标签
          </Button>
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建标签</DialogTitle>
            <DialogDescription>创建一个新的视频标签</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">标签名称</label>
              <Input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="输入标签名称"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag();
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">标签颜色</label>
              <div className="flex flex-wrap gap-2">
                {TAG_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewTagColor(color)}
                    className={`w-8 h-8 rounded-lg transition-transform ${
                      newTagColor === color ? 'ring-2 ring-offset-2 ring-[#212121] scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              取消
            </Button>
            <Button
              onClick={handleAddTag}
              className="bg-[#d4acfe]"
              disabled={!newTagName.trim()}
            >
              创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑标签</DialogTitle>
            <DialogDescription>修改标签名称和颜色</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">标签名称</label>
              <Input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="输入标签名称"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">标签颜色</label>
              <div className="flex flex-wrap gap-2">
                {TAG_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewTagColor(color)}
                    className={`w-8 h-8 rounded-lg transition-transform ${
                      newTagColor === color ? 'ring-2 ring-offset-2 ring-[#212121] scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button
              onClick={handleEditTag}
              className="bg-[#d4acfe]"
              disabled={!newTagName.trim()}
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除标签 "{selectedTag?.name}" 吗？此标签将从所有视频中移除，此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTag}
              className="bg-red-500 hover:bg-red-600"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
