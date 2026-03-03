import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, Calendar, Clock, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ViewMode, SortMode, TimeRange, DurationFilter } from '@/types';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onSortChange: (sort: SortMode) => void;
  onTimeRangeChange: (range: TimeRange) => void;
  onDurationFilterChange: (duration: DurationFilter) => void;
  onTagsChange: (tags: string[]) => void;
  availableTags: string[];
  viewMode: ViewMode;
  sortMode: SortMode;
  timeRange: TimeRange;
  durationFilter: DurationFilter;
  selectedTags: string[];
  initialQuery?: string;
}

const sortOptions: { value: SortMode; label: string; icon: typeof TrendingUp }[] = [
  { value: 'newest', label: '最新上传', icon: TrendingUp },
  { value: 'oldest', label: '最早上传', icon: Calendar },
  { value: 'mostViewed', label: '最多播放', icon: TrendingUp },
];

const timeRangeOptions: { value: TimeRange; label: string }[] = [
  { value: 'all', label: '全部时间' },
  { value: 'today', label: '今天' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'year', label: '今年' },
];

const durationOptions: { value: DurationFilter; label: string }[] = [
  { value: 'all', label: '全部时长' },
  { value: 'short', label: '短视频 (<5分钟)' },
  { value: 'medium', label: '中等 (5-30分钟)' },
  { value: 'long', label: '长视频 (>30分钟)' },
];

export function SearchFilter({
  onSearch,
  onViewModeChange,
  onSortChange,
  onTimeRangeChange,
  onDurationFilterChange,
  onTagsChange,
  availableTags,
  viewMode,
  sortMode,
  timeRange,
  durationFilter,
  selectedTags,
  initialQuery = '',
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(newTags);
  };

  const clearFilters = () => {
    setSearchQuery('');
    onSearch('');
    onTagsChange([]);
    onTimeRangeChange('all');
    onDurationFilterChange('all');
    onSortChange('newest');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedTags.length > 0 ||
    timeRange !== 'all' ||
    durationFilter !== 'all' ||
    sortMode !== 'newest';

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Input
            type="text"
            placeholder="搜索视频标题、描述或标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border-[#e0e0e0] rounded-xl text-sm focus:ring-2 focus:ring-[#d4acfe] focus:border-transparent transition-all"
          />
          <Search className="w-5 h-5 text-[#9e9e9e] absolute left-3.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                onSearch('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[#f5f5f5] transition-colors"
            >
              <X className="w-4 h-4 text-[#9e9e9e]" />
            </button>
          )}
        </form>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-[#e0e0e0]">
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn(
              'p-2 rounded-lg transition-all duration-200',
              viewMode === 'grid'
                ? 'bg-[#d4acfe] text-white'
                : 'text-[#666666] hover:bg-[#f5f5f5]'
            )}
            title="网格视图"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={cn(
              'p-2 rounded-lg transition-all duration-200',
              viewMode === 'list'
                ? 'bg-[#d4acfe] text-white'
                : 'text-[#666666] hover:bg-[#f5f5f5]'
            )}
            title="列表视图"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => onViewModeChange('timeline')}
            className={cn(
              'p-2 rounded-lg transition-all duration-200',
              viewMode === 'timeline'
                ? 'bg-[#d4acfe] text-white'
                : 'text-[#666666] hover:bg-[#f5f5f5]'
            )}
            title="时间线视图"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        {/* Filter Toggle */}
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={cn(
            'gap-2 rounded-xl border-[#e0e0e0] hover:bg-[#f5f5f5] transition-colors',
            isFilterOpen && 'bg-[#d4acfe]/10 border-[#d4acfe]'
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          筛选
          {hasActiveFilters && (
            <span className="w-5 h-5 bg-[#d4acfe] rounded-full text-xs text-white flex items-center justify-center">
              {(searchQuery ? 1 : 0) + selectedTags.length + (timeRange !== 'all' ? 1 : 0) + (durationFilter !== 'all' ? 1 : 0)}
            </span>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="bg-white rounded-xl p-4 border border-[#e0e0e0] space-y-4 animate-slide-up">
          {/* Sort & Time Range */}
          <div className="flex flex-wrap gap-4">
            {/* Sort */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#666666]">排序方式</label>
              <div className="flex gap-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onSortChange(option.value)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-1.5',
                      sortMode === option.value
                        ? 'bg-[#d4acfe] text-white'
                        : 'bg-[#f5f5f5] text-[#666666] hover:bg-[#e0e0e0]'
                    )}
                  >
                    <option.icon className="w-3.5 h-3.5" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#666666]">时间范围</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-lg border-[#e0e0e0]">
                    <Calendar className="w-4 h-4 mr-2" />
                    {timeRangeOptions.find((o) => o.value === timeRange)?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {timeRangeOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => onTimeRangeChange(option.value)}
                      className={cn(
                        'cursor-pointer',
                        timeRange === option.value && 'bg-[#d4acfe]/20'
                      )}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#666666]">视频时长</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-lg border-[#e0e0e0]">
                    <Clock className="w-4 h-4 mr-2" />
                    {durationOptions.find((o) => o.value === durationFilter)?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {durationOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => onDurationFilterChange(option.value)}
                      className={cn(
                        'cursor-pointer',
                        durationFilter === option.value && 'bg-[#d4acfe]/20'
                      )}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Tags */}
          {availableTags.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#666666]">标签筛选</label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
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
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex justify-end pt-2 border-t border-[#e0e0e0]">
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-[#666666] hover:text-red-500"
              >
                <X className="w-4 h-4 mr-2" />
                清除所有筛选
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-[#666666]">已选筛选:</span>
          {searchQuery && (
            <Badge
              variant="secondary"
              className="bg-[#d4acfe]/20 text-[#212121] hover:bg-[#d4acfe]/30 cursor-pointer"
              onClick={() => {
                setSearchQuery('');
                onSearch('');
              }}
            >
              搜索: {searchQuery}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-[#d4acfe]/20 text-[#212121] hover:bg-[#d4acfe]/30 cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
          {timeRange !== 'all' && (
            <Badge
              variant="secondary"
              className="bg-[#d4acfe]/20 text-[#212121] hover:bg-[#d4acfe]/30 cursor-pointer"
              onClick={() => onTimeRangeChange('all')}
            >
              {timeRangeOptions.find((o) => o.value === timeRange)?.label}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
          {durationFilter !== 'all' && (
            <Badge
              variant="secondary"
              className="bg-[#d4acfe]/20 text-[#212121] hover:bg-[#d4acfe]/30 cursor-pointer"
              onClick={() => onDurationFilterChange('all')}
            >
              {durationOptions.find((o) => o.value === durationFilter)?.label}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
