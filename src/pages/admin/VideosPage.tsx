import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Play,
  ExternalLink,
  Film,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { cn, formatDuration, formatDate, formatNumber } from '@/lib/utils';
import { getVideos, deleteVideo, saveVideo, getTags } from '@/data/mockData';
import type { Video } from '@/types';

export function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Video['status']>('all');
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [deletingVideo, setDeletingVideo] = useState<Video | null>(null);
  const [isBatchDeleteDialogOpen, setIsBatchDeleteDialogOpen] = useState(false);

  // Edit form states
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editStatus, setEditStatus] = useState<Video['status']>('published');

  const availableTags = getTags().map((t) => t.name);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = () => {
    const loadedVideos = getVideos();
    setVideos(loadedVideos);
  };

  const filteredVideos = useMemo(() => {
    let result = [...videos];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(query) ||
          v.description.toLowerCase().includes(query) ||
          v.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((v) => v.status === statusFilter);
    }

    return result;
  }, [videos, searchQuery, statusFilter]);

  const toggleSelectAll = () => {
    if (selectedVideos.length === filteredVideos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(filteredVideos.map((v) => v.id));
    }
  };

  const toggleSelectVideo = (id: string) => {
    setSelectedVideos((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setEditTitle(video.title);
    setEditDescription(video.description);
    setEditTags(video.tags);
    setEditStatus(video.status);
  };

  const handleSaveEdit = () => {
    if (!editingVideo) return;

    const updatedVideo: Video = {
      ...editingVideo,
      title: editTitle,
      description: editDescription,
      tags: editTags,
      status: editStatus,
    };

    saveVideo(updatedVideo);
    loadVideos();
    setEditingVideo(null);
  };

  const handleDelete = (video: Video) => {
    setDeletingVideo(video);
  };

  const confirmDelete = () => {
    if (!deletingVideo) return;

    deleteVideo(deletingVideo.id);
    loadVideos();
    setDeletingVideo(null);
  };

  const handleBatchDelete = () => {
    selectedVideos.forEach((id) => deleteVideo(id));
    loadVideos();
    setSelectedVideos([]);
    setIsBatchDeleteDialogOpen(false);
  };

  const handleBatchStatusChange = (status: Video['status']) => {
    selectedVideos.forEach((id) => {
      const video = videos.find((v) => v.id === id);
      if (video) {
        saveVideo({ ...video, status });
      }
    });
    loadVideos();
    setSelectedVideos([]);
  };

  const toggleTag = (tag: string) => {
    setEditTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const getStatusBadge = (status: Video['status']) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-700">已发布</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-700">草稿</Badge>;
      case 'private':
        return <Badge className="bg-yellow-100 text-yellow-700">私密</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-700">处理中</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-poppins text-2xl font-semibold text-[#212121]">
            视频管理
          </h1>
          <p className="text-[#666666] mt-1">
            共 {videos.length} 个视频，已选择 {selectedVideos.length} 个
          </p>
        </div>
        <div className="flex gap-2">
          {selectedVideos.length > 0 && (
            <>
              <Button
                variant="outline"
                onClick={() => handleBatchStatusChange('published')}
              >
                <Eye className="w-4 h-4 mr-2" />
                批量发布
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsBatchDeleteDialogOpen(true)}
                className="text-red-500 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                批量删除
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="搜索视频..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl"
          />
          <Search className="w-4 h-4 text-[#9e9e9e] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            className={statusFilter === 'all' ? 'bg-[#d4acfe]' : ''}
          >
            全部
          </Button>
          <Button
            variant={statusFilter === 'published' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('published')}
            className={statusFilter === 'published' ? 'bg-green-500' : ''}
          >
            已发布
          </Button>
          <Button
            variant={statusFilter === 'draft' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('draft')}
            className={statusFilter === 'draft' ? 'bg-gray-500' : ''}
          >
            草稿
          </Button>
          <Button
            variant={statusFilter === 'private' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('private')}
            className={statusFilter === 'private' ? 'bg-yellow-500' : ''}
          >
            私密
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f8f8fe]">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Checkbox
                    checked={
                      selectedVideos.length === filteredVideos.length &&
                      filteredVideos.length > 0
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#666666]">
                  视频
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#666666]">
                  标签
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#666666]">
                  时长
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#666666]">
                  播放量
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#666666]">
                  上传时间
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#666666]">
                  状态
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-[#666666]">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e0e0]">
              {filteredVideos.map((video) => (
                <tr key={video.id} className="hover:bg-[#f8f8fe]">
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedVideos.includes(video.id)}
                      onCheckedChange={() => toggleSelectVideo(video.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-24 h-14 rounded-lg overflow-hidden bg-[#f5f5f5] flex-shrink-0">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Play className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-[#212121] line-clamp-1">
                          {video.title}
                        </p>
                        <p className="text-sm text-[#9e9e9e] line-clamp-1">
                          {video.description.slice(0, 50)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {video.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-[#f5f5f5] text-[#666666] text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {video.tags.length > 2 && (
                        <Badge
                          variant="secondary"
                          className="bg-[#f5f5f5] text-[#666666] text-xs"
                        >
                          +{video.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#666666]">
                    {formatDuration(video.duration)}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#666666]">
                    {formatNumber(video.viewCount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#666666]">
                    {formatDate(video.uploadTime)}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(video.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            to={`/video/${video.id}`}
                            target="_blank"
                            className="flex items-center"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            查看
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(video)}>
                          <Edit className="w-4 h-4 mr-2" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(video)}
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto mb-4">
              <Film className="w-8 h-8 text-[#9e9e9e]" />
            </div>
            <p className="text-[#666666]">没有找到视频</p>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingVideo} onOpenChange={() => setEditingVideo(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>编辑视频</DialogTitle>
            <DialogDescription>修改视频信息和设置</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">标题</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">描述</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-[#e0e0e0] rounded-lg resize-none focus:ring-2 focus:ring-[#d4acfe] focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">标签</label>
              <div className="flex flex-wrap gap-2">
                {availableTags.slice(0, 8).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      'px-3 py-1 rounded-full text-sm transition-colors',
                      editTags.includes(tag)
                        ? 'bg-[#d4acfe] text-white'
                        : 'bg-[#f5f5f5] text-[#666666]'
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">状态</label>
              <select
                value={editStatus}
                onChange={(e) =>
                  setEditStatus(e.target.value as Video['status'])
                }
                className="w-full px-3 py-2 border border-[#e0e0e0] rounded-lg focus:ring-2 focus:ring-[#d4acfe]"
              >
                <option value="published">已发布</option>
                <option value="draft">草稿</option>
                <option value="private">私密</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingVideo(null)}>
              取消
            </Button>
            <Button onClick={handleSaveEdit} className="bg-[#d4acfe]">
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={!!deletingVideo}
        onOpenChange={() => setDeletingVideo(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除视频 "{deletingVideo?.title}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingVideo(null)}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Batch Delete Dialog */}
      <AlertDialog
        open={isBatchDeleteDialogOpen}
        onOpenChange={setIsBatchDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认批量删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除选中的 {selectedVideos.length} 个视频吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsBatchDeleteDialogOpen(false)}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBatchDelete}
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
