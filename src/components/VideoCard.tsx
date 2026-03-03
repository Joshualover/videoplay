import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Eye, MoreVertical, Edit, Trash2, Clock } from 'lucide-react';
import { formatDuration, formatDate, formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Video, ViewMode } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VideoCardProps {
  video: Video;
  viewMode?: ViewMode;
  showActions?: boolean;
  onEdit?: (video: Video) => void;
  onDelete?: (video: Video) => void;
}

export function VideoCard({
  video,
  viewMode = 'grid',
  showActions = false,
  onEdit,
  onDelete,
}: VideoCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const isListView = viewMode === 'list';
  const isTimelineView = viewMode === 'timeline';

  const handleMouseEnter = () => {
    // 可以尝试预加载视频或播放预览
  };

  const handleMouseLeave = () => {
    // 清理预加载
  };

  if (isListView) {
    return (
      <div
        className="video-card group flex gap-4 p-3 rounded-xl bg-white hover:bg-[#f8f8fe] transition-all duration-300"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Thumbnail */}
        <Link to={`/video/${video.id}`} className="relative flex-shrink-0">
          <div className="w-48 h-28 rounded-lg overflow-hidden bg-[#f5f5f5]">
            {!imageLoaded && <div className="skeleton w-full h-full" />}
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className={cn(
                'thumbnail w-full h-full object-cover',
                !imageLoaded && 'opacity-0'
              )}
              onLoad={() => setImageLoaded(true)}
            />
            {/* Duration Badge */}
            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 rounded text-xs text-white font-medium">
              {formatDuration(video.duration)}
            </div>
            {/* Play Overlay */}
            <div className="play-overlay absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-12 h-12 bg-[#d4acfe] rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
              </div>
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0 py-1">
          <Link to={`/video/${video.id}`}>
            <h3 className="font-poppins font-medium text-[#212121] line-clamp-1 group-hover:text-[#d4acfe] transition-colors">
              {video.title}
            </h3>
          </Link>
          <p className="text-sm text-[#666666] line-clamp-2 mt-1">
            {video.description}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-[#9e9e9e]">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {formatNumber(video.viewCount)} 次观看
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDate(video.uploadTime)}
            </span>
          </div>
          {/* Tags */}
          {video.tags.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {video.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-[#f5f5f5] rounded-full text-xs text-[#666666]"
                >
                  {tag}
                </span>
              ))}
              {video.tags.length > 3 && (
                <span className="px-2 py-0.5 text-xs text-[#9e9e9e]">
                  +{video.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-lg hover:bg-[#e0e0e0] transition-colors">
                  <MoreVertical className="w-4 h-4 text-[#666666]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(video)}>
                  <Edit className="w-4 h-4 mr-2" />
                  编辑
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete?.(video)}
                  className="text-red-500"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    );
  }

  if (isTimelineView) {
    return (
      <div className="timeline-item group">
        <div
          className="video-card flex gap-4 p-3 rounded-xl bg-white hover:bg-[#f8f8fe] transition-all duration-300"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Date Indicator */}
          <div className="flex-shrink-0 w-20 text-right">
            <span className="text-xs text-[#9e9e9e]">
              {new Date(video.uploadTime).toLocaleDateString('zh-CN', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

          {/* Thumbnail */}
          <Link to={`/video/${video.id}`} className="relative flex-shrink-0">
            <div className="w-36 h-20 rounded-lg overflow-hidden bg-[#f5f5f5]">
              {!imageLoaded && <div className="skeleton w-full h-full" />}
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className={cn(
                  'thumbnail w-full h-full object-cover',
                  !imageLoaded && 'opacity-0'
                )}
                onLoad={() => setImageLoaded(true)}
              />
              <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/70 rounded text-xs text-white">
                {formatDuration(video.duration)}
              </div>
            </div>
          </Link>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <Link to={`/video/${video.id}`}>
              <h3 className="font-poppins font-medium text-sm text-[#212121] line-clamp-1 group-hover:text-[#d4acfe] transition-colors">
                {video.title}
              </h3>
            </Link>
            <p className="text-xs text-[#666666] line-clamp-1 mt-1">
              {video.description}
            </p>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-[#9e9e9e]">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {formatNumber(video.viewCount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (Default)
  return (
    <div
      className="video-card group rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail */}
      <Link to={`/video/${video.id}`} className="relative block">
        <div className="aspect-video bg-[#f5f5f5] overflow-hidden">
          {!imageLoaded && <div className="skeleton w-full h-full" />}
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className={cn(
              'thumbnail w-full h-full object-cover',
              !imageLoaded && 'opacity-0'
            )}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded-md text-xs text-white font-medium">
          {formatDuration(video.duration)}
        </div>
        {/* Play Overlay */}
        <div className="play-overlay absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center">
          <div className="w-14 h-14 bg-[#d4acfe] rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-all duration-300 shadow-lg shadow-[#d4acfe]/30">
            <Play className="w-6 h-6 text-white ml-1" fill="white" />
          </div>
        </div>
        {/* Progress Bar (if watched) */}
        {video.progress && video.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
            <div
              className="h-full bg-[#d4acfe]"
              style={{
                width: `${(video.progress / video.duration) * 100}%`,
              }}
            />
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/video/${video.id}`}>
          <h3 className="font-poppins font-medium text-[#212121] line-clamp-1 group-hover:text-[#d4acfe] transition-colors">
            {video.title}
          </h3>
        </Link>
        <p className="text-sm text-[#666666] line-clamp-2 mt-1.5">
          {video.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3 text-xs text-[#9e9e9e]">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {formatNumber(video.viewCount)}
            </span>
            <span>{formatDate(video.uploadTime)}</span>
          </div>
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 rounded-lg hover:bg-[#f5f5f5] transition-colors opacity-0 group-hover:opacity-100">
                  <MoreVertical className="w-4 h-4 text-[#666666]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(video)}>
                  <Edit className="w-4 h-4 mr-2" />
                  编辑
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete?.(video)}
                  className="text-red-500"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {/* Tags */}
        {video.tags.length > 0 && (
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {video.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-[#f5f5f5] hover:bg-[#d4acfe]/20 rounded-full text-xs text-[#666666] transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
