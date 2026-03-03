import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDuration } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  initialProgress?: number;
  onProgressUpdate?: (progress: number) => void;
  onEnded?: () => void;
}

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function VideoPlayer({
  src,
  poster,
  title,
  initialProgress = 0,
  onProgressUpdate,
  onEnded,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialProgress);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffered, setBuffered] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 初始化视频
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = initialProgress;
    
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [initialProgress, onEnded]);

  // 定期保存播放进度
  useEffect(() => {
    if (isPlaying && onProgressUpdate) {
      progressIntervalRef.current = setInterval(() => {
        onProgressUpdate(currentTime);
      }, 5000); // 每5秒保存一次
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, currentTime, onProgressUpdate]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seek(currentTime - 10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(currentTime + 10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTime, volume]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const seek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = Math.max(0, Math.min(time, duration));
    video.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleVolumeChange = useCallback((value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0];
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!isFullscreen) {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  }, [isFullscreen]);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seek(percent * duration);
  }, [duration, seek]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black rounded-xl overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full aspect-video cursor-pointer"
        onClick={togglePlay}
        preload="metadata"
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-12 h-12 border-4 border-[#d4acfe] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Big Play Button (when paused) */}
      {!isPlaying && !isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-20 h-20 bg-[#d4acfe]/90 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform shadow-lg shadow-[#d4acfe]/30">
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300',
          showControls ? 'opacity-100' : 'opacity-0'
        )}
      >
        {/* Progress Bar */}
        <div
          className="relative h-1.5 mx-4 mb-4 cursor-pointer group/progress"
          onClick={handleProgressClick}
        >
          {/* Buffered */}
          <div
            className="absolute inset-y-0 left-0 bg-white/30 rounded-full"
            style={{ width: `${(buffered / duration) * 100}%` }}
          />
          {/* Progress */}
          <div
            className="absolute inset-y-0 left-0 bg-[#d4acfe] rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
          {/* Hover Indicator */}
          <div className="absolute inset-y-0 left-0 right-0 bg-white/10 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#d4acfe] rounded-full shadow-md transform scale-0 group-hover/progress:scale-100 transition-transform"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Skip Buttons */}
            <button
              onClick={() => seek(currentTime - 10)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <SkipBack className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => seek(currentTime + 10)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <SkipForward className="w-4 h-4 text-white" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={toggleMute}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>
              <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                  className="w-16"
                />
              </div>
            </div>

            {/* Time Display */}
            <div className="text-sm text-white font-medium">
              {formatDuration(currentTime)} / {formatDuration(duration)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Playback Rate */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-2 py-1 rounded hover:bg-white/20 transition-colors text-sm text-white font-medium">
                  {playbackRate}x
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {PLAYBACK_RATES.map((rate) => (
                  <DropdownMenuItem
                    key={rate}
                    onClick={() => handlePlaybackRateChange(rate)}
                    className={cn(
                      'cursor-pointer',
                      playbackRate === rate && 'bg-[#d4acfe]/20'
                    )}
                  >
                    {rate}x
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
              <Settings className="w-5 h-5 text-white" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5 text-white" />
              ) : (
                <Maximize className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Title Overlay */}
      {title && showControls && (
        <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
          <h3 className="text-white font-medium truncate">{title}</h3>
        </div>
      )}
    </div>
  );
}
