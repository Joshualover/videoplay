import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { VideoCard } from '@/components/VideoCard';
import { SearchFilter } from '@/components/SearchFilter';
import { Button } from '@/components/ui/button';
import { getVideos, getTags, initializeStorage } from '@/data/mockData';
import { formatDuration } from '@/lib/utils';
import type { Video, ViewMode, SortMode, TimeRange, DurationFilter } from '@/types';
import { Play, ChevronRight, Sparkles, Zap, Shield } from 'lucide-react';

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState<Video[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [durationFilter, setDurationFilter] = useState<DurationFilter>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Initialize data
  useEffect(() => {
    initializeStorage();
    const loadedVideos = getVideos();
    const loadedTags = getTags();
    setVideos(loadedVideos);
    setAllTags(loadedTags.map((t) => t.name));
    setIsLoading(false);
  }, []);

  // Filter and sort videos
  const filteredVideos = useMemo(() => {
    let result = [...videos];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(query) ||
          v.description.toLowerCase().includes(query) ||
          v.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      result = result.filter((v) =>
        selectedTags.some((tag) => v.tags.includes(tag))
      );
    }

    // Time range filter
    if (timeRange !== 'all') {
      const now = new Date();
      const ranges: Record<TimeRange, number> = {
        today: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
        year: 365 * 24 * 60 * 60 * 1000,
        all: Infinity,
      };
      result = result.filter((v) => {
        const uploadTime = new Date(v.uploadTime).getTime();
        return now.getTime() - uploadTime < ranges[timeRange];
      });
    }

    // Duration filter
    if (durationFilter !== 'all') {
      result = result.filter((v) => {
        switch (durationFilter) {
          case 'short':
            return v.duration < 300;
          case 'medium':
            return v.duration >= 300 && v.duration <= 1800;
          case 'long':
            return v.duration > 1800;
          default:
            return true;
        }
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortMode) {
        case 'newest':
          return new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime();
        case 'oldest':
          return new Date(a.uploadTime).getTime() - new Date(b.uploadTime).getTime();
        case 'mostViewed':
          return b.viewCount - a.viewCount;
        default:
          return 0;
      }
    });

    return result;
  }, [videos, searchQuery, selectedTags, timeRange, durationFilter, sortMode]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  }, [setSearchParams]);

  // Hero section - Featured videos
  const featuredVideos = videos.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Navbar onSearch={handleSearch} />

      {/* Hero Section */}
      {!searchQuery && filteredVideos.length > 0 && (
        <section className="relative pt-24 pb-12 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#d4acfe] rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#f8f8fe] rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4acfe]/20 rounded-full">
                  <Sparkles className="w-4 h-4 text-[#d4acfe]" />
                  <span className="text-sm font-medium text-[#d4acfe]">
                    发现精彩视频
                  </span>
                </div>
                <h1 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold text-[#212121] leading-tight">
                  轻松创作
                  <br />
                  <span className="text-[#d4acfe]">惊艳视频</span>
                </h1>
                <p className="text-lg text-[#666666] max-w-md">
                  探索我们精选的视频作品，从航拍美景到美食教程，从旅行Vlog到编程教学，应有尽有。
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={() => document.getElementById('videos')?.scrollIntoView({ behavior: 'smooth' })}
                    className="btn-primary gap-2"
                  >
                    <Play className="w-4 h-4" />
                    开始探索
                  </Button>
                  <Button
                    variant="outline"
                    className="btn-secondary gap-2"
                    onClick={() => setSearchParams({ view: 'all' })}
                  >
                    浏览全部
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Stats */}
                <div className="flex gap-8 pt-4">
                  <div>
                    <div className="text-2xl font-bold text-[#212121]">
                      {videos.length}+
                    </div>
                    <div className="text-sm text-[#666666]">精选视频</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#212121]">
                      {allTags.length}+
                    </div>
                    <div className="text-sm text-[#666666]">内容标签</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#212121]">
                      {formatDuration(videos.reduce((acc, v) => acc + v.viewCount, 0))}
                    </div>
                    <div className="text-sm text-[#666666]">总播放量</div>
                  </div>
                </div>
              </div>

              {/* Right Content - Featured Video Preview */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[#d4acfe]/20 animate-breathe">
                  <img
                    src={featuredVideos[0]?.thumbnailUrl}
                    alt="Featured"
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white font-semibold text-lg">
                      {featuredVideos[0]?.title}
                    </h3>
                    <p className="text-white/80 text-sm mt-1">
                      {featuredVideos[0]?.description.slice(0, 80)}...
                    </p>
                  </div>
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-[#d4acfe] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-[#d4acfe]/50">
                      <Play className="w-6 h-6 text-white ml-1" fill="white" />
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl p-3 shadow-lg animate-float">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#d4acfe]/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-[#d4acfe]" />
                    </div>
                    <div>
                      <div className="text-xs text-[#666666]">高清画质</div>
                      <div className="text-sm font-medium">4K/1080p</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-3 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <div className="text-xs text-[#666666]">安全存储</div>
                      <div className="text-sm font-medium">云端备份</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main id="videos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filter */}
        <div className="mb-8">
          <SearchFilter
            onSearch={handleSearch}
            onViewModeChange={setViewMode}
            onSortChange={setSortMode}
            onTimeRangeChange={setTimeRange}
            onDurationFilterChange={setDurationFilter}
            onTagsChange={setSelectedTags}
            availableTags={allTags}
            viewMode={viewMode}
            sortMode={sortMode}
            timeRange={timeRange}
            durationFilter={durationFilter}
            selectedTags={selectedTags}
            initialQuery={searchQuery}
          />
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <h2 className="text-xl font-poppins font-semibold text-[#212121]">
            {searchQuery ? `"${searchQuery}" 的搜索结果` : '全部视频'}
          </h2>
          <p className="text-sm text-[#666666] mt-1">
            共 {filteredVideos.length} 个视频
          </p>
        </div>

        {/* Video Grid/List */}
        {isLoading ? (
          // Loading Skeleton
          <div className="video-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="skeleton aspect-video" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-5 w-3/4 rounded" />
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-4 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredVideos.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'video-grid'
                : viewMode === 'list'
                ? 'space-y-3'
                : 'space-y-2 max-w-3xl'
            }
          >
            {filteredVideos.map((video, index) => (
              <div
                key={video.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <VideoCard video={video} viewMode={viewMode} />
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-[#9e9e9e]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[#212121] mb-2">
              没有找到相关视频
            </h3>
            <p className="text-[#666666] mb-6">
              尝试调整搜索词或筛选条件
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedTags([]);
                setTimeRange('all');
                setDurationFilter('all');
                setSearchParams({});
              }}
            >
              清除筛选
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#f8f8fe] py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
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
            <div className="flex gap-8 text-sm text-[#666666]">
              <a href="#" className="hover:text-[#d4acfe] transition-colors">关于我们</a>
              <a href="#" className="hover:text-[#d4acfe] transition-colors">使用条款</a>
              <a href="#" className="hover:text-[#d4acfe] transition-colors">隐私政策</a>
              <a href="#" className="hover:text-[#d4acfe] transition-colors">联系我们</a>
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
