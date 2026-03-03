import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Calendar, Tag, Share2, Heart, Download } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { VideoPlayer } from '@/components/VideoPlayer';
import { VideoCard } from '@/components/VideoCard';
import { Button } from '@/components/ui/button';
import { getVideoById, getVideos, savePlayRecord, getPlayRecord } from '@/data/mockData';
import { formatDate, formatNumber } from '@/lib/utils';
import type { Video } from '@/types';

export function VideoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [savedProgress, setSavedProgress] = useState(0);

  useEffect(() => {
    if (!id) return;

    const loadedVideo = getVideoById(id);
    if (loadedVideo) {
      setVideo(loadedVideo);
      // 获取保存的播放进度
      const progress = getPlayRecord(id);
      setSavedProgress(progress);

      // 获取相关视频（同标签或同分类）
      const allVideos = getVideos();
      const related = allVideos
        .filter(
          (v) =>
            v.id !== id &&
            (v.tags.some((t) => loadedVideo.tags.includes(t)) ||
              v.category === loadedVideo.category)
        )
        .slice(0, 4);
      setRelatedVideos(related);

      // 增加观看次数
      loadedVideo.viewCount += 1;
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  const handleProgressUpdate = (progress: number) => {
    if (id) {
      savePlayRecord(id, progress);
    }
  };

  const handleVideoEnded = () => {
    // 视频播放完成，可以显示推荐或自动播放下一个
  };

  if (!video) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#d4acfe] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#666666] hover:text-[#d4acfe] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">返回首页</span>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              <VideoPlayer
                src={video.videoUrl}
                poster={video.thumbnailUrl}
                title={video.title}
                initialProgress={savedProgress}
                onProgressUpdate={handleProgressUpdate}
                onEnded={handleVideoEnded}
              />

              {/* Video Info */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="font-poppins text-2xl font-semibold text-[#212121]">
                    {video.title}
                  </h1>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      className={
                        isLiked
                          ? 'bg-red-50 border-red-200 text-red-500'
                          : 'border-[#e0e0e0]'
                      }
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart
                        className="w-4 h-4"
                        fill={isLiked ? 'currentColor' : 'none'}
                      />
                    </Button>
                    <Button variant="outline" size="icon" className="border-[#e0e0e0]">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="border-[#e0e0e0]">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#666666]">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    {formatNumber(video.viewCount)} 次观看
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(video.uploadTime)}
                  </span>
                  {video.resolution && (
                    <span className="px-2 py-0.5 bg-[#f5f5f5] rounded text-xs">
                      {video.resolution}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {video.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/?tag=${encodeURIComponent(tag)}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#f5f5f5] hover:bg-[#d4acfe]/20 rounded-full text-sm text-[#666666] hover:text-[#d4acfe] transition-colors"
                      >
                        <Tag className="w-3.5 h-3.5" />
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Description */}
                <div className="pt-4 border-t border-[#e0e0e0]">
                  <h3 className="font-medium text-[#212121] mb-2">视频简介</h3>
                  <p className="text-[#666666] leading-relaxed whitespace-pre-line">
                    {video.description}
                  </p>
                </div>

                {/* Technical Info */}
                <div className="pt-4 border-t border-[#e0e0e0]">
                  <h3 className="font-medium text-[#212121] mb-3">技术信息</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-[#9e9e9e]">时长</div>
                      <div className="text-[#212121] font-medium">
                        {formatDate(video.duration.toString())}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#9e9e9e]">分辨率</div>
                      <div className="text-[#212121] font-medium">
                        {video.resolution || '未知'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#9e9e9e]">文件大小</div>
                      <div className="text-[#212121] font-medium">
                        {video.fileSize
                          ? `${(video.fileSize / 1024 / 1024).toFixed(2)} MB`
                          : '未知'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#9e9e9e]">状态</div>
                      <div className="text-[#212121] font-medium capitalize">
                        {video.status === 'published'
                          ? '已发布'
                          : video.status === 'draft'
                          ? '草稿'
                          : video.status === 'private'
                          ? '私密'
                          : '处理中'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Related Videos */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h2 className="font-poppins font-semibold text-lg text-[#212121] mb-4">
                  相关推荐
                </h2>
                <div className="space-y-4">
                  {relatedVideos.length > 0 ? (
                    relatedVideos.map((relatedVideo) => (
                      <VideoCard
                        key={relatedVideo.id}
                        video={relatedVideo}
                        viewMode="list"
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-[#9e9e9e]">
                      暂无相关视频
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f8f8fe] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#d4acfe] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-poppins font-semibold text-[#212121]">
                视频创作工作室
              </span>
            </div>
            <div className="text-sm text-[#9e9e9e]">
              © 2024 视频创作工作室. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
