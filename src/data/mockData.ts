import type { Video, Tag, User } from '@/types';

export const mockVideos: Video[] = [];
  {
    id: '1',
    title: '城市夜景航拍 - 上海外滩',
    description: '使用无人机拍摄的上海外滩夜景，展现魔都的繁华与魅力。4K超高清画质，带你领略不一样的城市风光。',
    thumbnailUrl: 'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=800&h=450&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 184,
    resolution: '4K',
    tags: ['航拍', '夜景', '上海', '城市'],
    uploadTime: '2024-12-15T10:30:00Z',
    publishTime: '2024-12-15T10:30:00Z',
    status: 'published',
    viewCount: 12580,
    progress: 45
  },
  {
    id: '2',
    title: '美食制作教程 - 日式拉面',
    description: '详细讲解如何在家制作正宗的日式豚骨拉面，从汤底到配料，每一步都清晰可见。',
    thumbnailUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=450&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: 920,
    resolution: '1080p',
    tags: ['美食', '教程', '日式料理', '拉面'],
    uploadTime: '2024-12-14T15:20:00Z',
    publishTime: '2024-12-14T15:20:00Z',
    status: 'published',
    viewCount: 8932
  },
  {
    id: '3',
    title: '健身训练 - 30分钟全身燃脂',
    description: '无需器械，在家就能完成的全身燃脂训练。适合所有健身水平，跟随音乐节奏一起动起来！',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=450&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: 1800,
    resolution: '1080p',
    tags: ['健身', '燃脂', '运动', '教程'],
    uploadTime: '2024-12-13T09:00:00Z',
    publishTime: '2024-12-13T09:00:00Z',
    status: 'published',
    viewCount: 25670
  },
  {
    id: '4',
    title: '旅行Vlog - 日本京都红叶季',
    description: '秋天的京都，红叶漫山遍野。跟随镜头一起游览清水寺、岚山、伏见稻荷大社等著名景点。',
    thumbnailUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=450&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: 720,
    resolution: '4K',
    tags: ['旅行', '日本', '京都', '红叶'],
    uploadTime: '2024-12-12T14:30:00Z',
    publishTime: '2024-12-12T14:30:00Z',
    status: 'published',
    viewCount: 15620
  },
  {
    id: '5',
    title: '编程教程 - React Hooks深入浅出',
    description: '全面讲解React Hooks的使用方法和最佳实践，包括useState、useEffect、useContext等核心Hook。',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    duration: 3600,
    resolution: '1080p',
    tags: ['编程', 'React', '教程', '前端'],
    uploadTime: '2024-12-11T11:00:00Z',
    publishTime: '2024-12-11T11:00:00Z',
    status: 'published',
    viewCount: 32150
  },
  {
    id: '6',
    title: '宠物日常 - 猫咪的搞笑时刻',
    description: '记录家里三只猫咪的日常生活，各种搞笑、可爱的瞬间，治愈你的每一天。',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=450&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    duration: 420,
    resolution: '1080p',
    tags: ['宠物', '猫咪', '搞笑', '日常'],
    uploadTime: '2024-12-10T16:45:00Z',
    publishTime: '2024-12-10T16:45:00Z',
    status: 'published',
    viewCount: 45230
  },
  {
    id: '7',
    title: '音乐制作 - 如何写一首流行歌',
    description: '从旋律创作到编曲混音，完整展示一首流行歌曲的制作过程。适合音乐制作初学者。',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=450&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    duration: 2400,
    resolution: '1080p',
    tags: ['音乐', '制作', '教程', '创作'],
    uploadTime: '2024-12-09T13:20:00Z',
    publishTime: '2024-12-09T13:20:00Z',
    status: 'published',
    viewCount: 9870
  },
  {
    id: '8',
    title: '摄影技巧 - 人像摄影光线运用',
    description: '详细讲解人像摄影中的光线运用技巧，包括自然光、人造光、反光板的使用等。',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554048612-387768052bf7?w=800&h=450&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    duration: 1500,
    resolution: '4K',
    tags: ['摄影', '人像', '教程', '技巧'],
    uploadTime: '2024-12-08T10:00:00Z',
    publishTime: '2024-12-08T10:00:00Z',
    status: 'published',
    viewCount: 18760
  },
  {
    id: '9',
    title: 'DIY手工 - 制作木质书架',
    description: '从零开始制作一个简约风格的木质书架，包含材料清单、工具使用和详细步骤。',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    duration: 1800,
    resolution: '1080p',
    tags: ['DIY', '手工', '木工', '教程'],
    uploadTime: '2024-12-07T15:30:00Z',
    publishTime: '2024-12-07T15:30:00Z',
    status: 'published',
    viewCount: 7650
  },
  {
    id: '10',
    title: '科技评测 - 最新智能手机对比',
    description: '对比评测2024年最新旗舰智能手机，从性能、拍照、续航等多个维度进行全面分析。',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=450&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: 900,
    resolution: '4K',
    tags: ['科技', '评测', '手机', '对比'],
    uploadTime: '2024-12-06T09:45:00Z',
    publishTime: '2024-12-06T09:45:00Z',
    status: 'published',
    viewCount: 28900
  },
  {
    id: '11',
    title: '绘画教程 - 水彩风景入门',
    description: '适合零基础的水彩风景画教程，从调色到笔触，手把手教你画出美丽的风景画。',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=450&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    duration: 2100,
    resolution: '1080p',
    tags: ['绘画', '水彩', '教程', '艺术'],
    uploadTime: '2024-12-05T14:00:00Z',
    publishTime: '2024-12-05T14:00:00Z',
    status: 'published',
    viewCount: 11200
  },
  {
    id: '12',
    title: '汽车评测 - 电动车续航实测',
    description: '真实路况下测试主流电动车的续航能力，数据真实可靠，为购车提供参考。',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=450&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    duration: 1200,
    resolution: '1080p',
    tags: ['汽车', '电动车', '评测', '续航'],
    uploadTime: '2024-12-04T11:30:00Z',
    publishTime: '2024-12-04T11:30:00Z',
    status: 'published',
    viewCount: 19800
  }
];

export const mockTags: Tag[] = [];
  { id: '1', name: '航拍', color: '#d4acfe', usageCount: 15 },
  { id: '2', name: '美食', color: '#ff4081', usageCount: 23 },
  { id: '3', name: '教程', color: '#4caf50', usageCount: 45 },
  { id: '4', name: '旅行', color: '#2196f3', usageCount: 18 },
  { id: '5', name: '编程', color: '#ff9800', usageCount: 32 },
  { id: '6', name: '宠物', color: '#9c27b0', usageCount: 28 },
  { id: '7', name: '音乐', color: '#e91e63', usageCount: 12 },
  { id: '8', name: '摄影', color: '#00bcd4', usageCount: 20 },
  { id: '9', name: 'DIY', color: '#795548', usageCount: 8 },
  { id: '10', name: '科技', color: '#607d8b', usageCount: 35 },
  { id: '11', name: '绘画', color: '#8bc34a', usageCount: 14 },
  { id: '12', name: '汽车', color: '#ffc107', usageCount: 16 },
  { id: '13', name: '健身', color: '#f44336', usageCount: 22 },
  { id: '14', name: '搞笑', color: '#ffeb3b', usageCount: 19 }
];

export const mockUser: User | null = null;

// 本地存储键名
  id: '1',
  name: '管理员',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
  email: 'admin@example.com',
  isAdmin: true
};

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
export function initializeStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.VIDEOS)) {
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(mockVideos));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TAGS)) {
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(mockTags));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
  }
}

// 获取视频列表
export function getVideos(): Video[] {
  const data = localStorage.getItem(STORAGE_KEYS.VIDEOS);
  return data ? JSON.parse(data) : [];
}
export function getVideos(): Video[] {
  const data = localStorage.getItem(STORAGE_KEYS.VIDEOS);
  return data ? JSON.parse(data) : mockVideos;
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
export function getTags(): Tag[] {
  const data = localStorage.getItem(STORAGE_KEYS.TAGS);
  return data ? JSON.parse(data) : mockTags;
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
