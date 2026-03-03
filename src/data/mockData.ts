import type { Video, Tag, User } from '@/types';

// Empty mock data - no preset content
export const mockVideos: Video[] = [];
export const mockTags: Tag[] = [];
export const mockUser: User | null = null;

// 本地存储键名
export const STORAGE_KEYS = {
  VIDEOS: 'video_studio_videos',
  TAGS: 'video_studio_tags',
  PLAY_RECORDS: 'video_studio_play_records',
  USER: 'video_studio_user'
};

// 初始化本地存储
export function initializeStorage(): void {
  // 不再预置数据
}

// 获取视频列表
export function getVideos(): Video[] {
  const data = localStorage.getItem(STORAGE_KEYS.VIDEOS);
  return data ? JSON.parse(data) : [];
}

// 获取单个视频
export function getVideoById(id: string): Video | undefined {
  const videos = getVideos();
  return videos.find(v => v.id === id);
}

// 保存视频
export function saveVideo(video: Video): void {
  const videos = getVideos();
  const index = videos.findIndex(v => v.id === video.id);
  if (index >= 0) {
    videos[index] = { ...videos[index], ...video };
  } else {
    videos.unshift(video);
  }
  localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
}

// 删除视频
export function deleteVideo(id: string): void {
  const videos = getVideos();
  const filtered = videos.filter(v => v.id !== id);
  localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(filtered));
}

// 获取标签列表
export function getTags(): Tag[] {
  const data = localStorage.getItem(STORAGE_KEYS.TAGS);
  return data ? JSON.parse(data) : [];
}

// 获取播放记录
export function getPlayRecord(videoId: string): number {
  const records = localStorage.getItem(STORAGE_KEYS.PLAY_RECORDS);
  if (records) {
    const parsed = JSON.parse(records);
    return parsed[videoId] || 0;
  }
  return 0;
}

// 保存播放记录
export function savePlayRecord(videoId: string, progress: number): void {
  const records = localStorage.getItem(STORAGE_KEYS.PLAY_RECORDS);
  const parsed = records ? JSON.parse(records) : {};
  parsed[videoId] = progress;
  localStorage.setItem(STORAGE_KEYS.PLAY_RECORDS, JSON.stringify(parsed));
}
