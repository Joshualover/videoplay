import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 格式化时长（秒 -> MM:SS 或 HH:MM:SS）
export function formatDuration(seconds: number): string {
  if (!seconds || seconds < 0) return '00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 格式化日期
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // 小于1小时
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return minutes < 1 ? '刚刚' : `${minutes}分钟前`;
  }
  
  // 小于24小时
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}小时前`;
  }
  
  // 小于7天
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days}天前`;
  }
  
  // 大于7天，显示具体日期
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// 格式化数字（千位分隔符）
export function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// 格式化文件大小
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 生成唯一ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 防抖函数
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// 节流函数
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// 深拷贝
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// 随机打乱数组
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// 截取视频帧作为缩略图
export function captureVideoFrame(video: HTMLVideoElement, time: number = 5): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('无法创建canvas上下文'));
      return;
    }
    
    video.currentTime = time;
    
    video.addEventListener('seeked', function onSeeked() {
      video.removeEventListener('seeked', onSeeked);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    }, { once: true });
    
    video.addEventListener('error', function onError() {
      video.removeEventListener('error', onError);
      reject(new Error('视频加载失败'));
    }, { once: true });
  });
}

// 验证文件类型
export function isValidVideoFile(file: File): boolean {
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  return validTypes.includes(file.type);
}

// 获取视频时长
export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    
    video.onerror = () => {
      reject(new Error('无法加载视频'));
    };
    
    video.src = window.URL.createObjectURL(file);
  });
}
