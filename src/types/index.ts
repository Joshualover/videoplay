// 视频类型
export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number; // 秒
  fileSize?: number;
  resolution?: string;
  tags: string[];
  category?: string;
  uploadTime: string;
  publishTime?: string;
  status: 'draft' | 'published' | 'private' | 'processing';
  viewCount: number;
  progress?: number; // 播放进度（秒）
}

// 标签类型
export interface Tag {
  id: string;
  name: string;
  color?: string;
  usageCount: number;
}

// 视图类型
export type ViewMode = 'grid' | 'list' | 'timeline';

// 排序方式
export type SortMode = 'newest' | 'oldest' | 'mostViewed';

// 时间范围
export type TimeRange = 'today' | 'week' | 'month' | 'year' | 'all';

// 时长筛选
export type DurationFilter = 'short' | 'medium' | 'long' | 'all';

// 用户类型
export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  isAdmin: boolean;
}

// 播放记录
export interface PlayRecord {
  userId: string;
  videoId: string;
  progress: number;
  lastWatchedAt: string;
}

// 上传任务
export interface UploadTask {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  videoUrl?: string;
  video?: Video;
}
export interface UploadTask {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  video?: Video;
}
