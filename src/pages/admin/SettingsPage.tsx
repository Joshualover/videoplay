import { useState, useEffect } from 'react';
import { Save, RefreshCw, Database, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import { toast } from 'sonner';

interface Settings {
  siteName: string;
  siteDescription: string;
  maxUploadSize: number;
  allowedFormats: string[];
  autoPublish: boolean;
  enableComments: boolean;
  enableDownloads: boolean;
  defaultThumbnail: string;
}

const defaultSettings: Settings = {
  siteName: '视频创作工作室',
  siteDescription: '轻松创作，惊艳呈现',
  maxUploadSize: 2048, // MB
  allowedFormats: ['mp4', 'webm', 'ogg', 'mov'],
  autoPublish: false,
  enableComments: true,
  enableDownloads: true,
  defaultThumbnail: '',
};

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isClearDataDialogOpen, setIsClearDataDialogOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('video_studio_settings');
    if (savedSettings) {
      setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('video_studio_settings', JSON.stringify(settings));
    setHasChanges(false);
    toast.success('设置已保存');
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('video_studio_settings');
    setIsResetDialogOpen(false);
    setHasChanges(false);
    toast.success('设置已重置为默认值');
  };

  const handleClearData = () => {
    localStorage.removeItem('video_studio_videos');
    localStorage.removeItem('video_studio_tags');
    localStorage.removeItem('video_studio_play_records');
    setIsClearDataDialogOpen(false);
    toast.success('所有数据已清除');
  };

  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-poppins text-2xl font-semibold text-[#212121]">
            系统设置
          </h1>
          <p className="text-[#666666] mt-1">管理网站的基本设置和配置</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsResetDialogOpen(true)}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            重置
          </Button>
          <Button
            onClick={handleSave}
            className="btn-primary gap-2"
            disabled={!hasChanges}
          >
            <Save className="w-4 h-4" />
            保存设置
          </Button>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-xl border border-[#e0e0e0] divide-y divide-[#e0e0e0]">
        {/* Site Settings */}
        <div className="p-6 space-y-4">
          <h2 className="font-poppins text-lg font-semibold text-[#212121]">
            网站设置
          </h2>
          <div className="grid gap-4 max-w-xl">
            <div className="space-y-2">
              <Label htmlFor="siteName">网站名称</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => updateSetting('siteName', e.target.value)}
                placeholder="输入网站名称"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">网站描述</Label>
              <Input
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) =>
                  updateSetting('siteDescription', e.target.value)
                }
                placeholder="输入网站描述"
              />
            </div>
          </div>
        </div>

        {/* Upload Settings */}
        <div className="p-6 space-y-4">
          <h2 className="font-poppins text-lg font-semibold text-[#212121]">
            上传设置
          </h2>
          <div className="grid gap-4 max-w-xl">
            <div className="space-y-2">
              <Label htmlFor="maxUploadSize">
                最大上传大小 (MB)
              </Label>
              <Input
                id="maxUploadSize"
                type="number"
                value={settings.maxUploadSize}
                onChange={(e) =>
                  updateSetting('maxUploadSize', parseInt(e.target.value) || 0)
                }
                min={1}
                max={10240}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>自动发布</Label>
                <p className="text-sm text-[#666666]">
                  上传完成后自动发布视频
                </p>
              </div>
              <Switch
                checked={settings.autoPublish}
                onCheckedChange={(checked) =>
                  updateSetting('autoPublish', checked)
                }
              />
            </div>
          </div>
        </div>

        {/* Feature Settings */}
        <div className="p-6 space-y-4">
          <h2 className="font-poppins text-lg font-semibold text-[#212121]">
            功能设置
          </h2>
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>启用评论</Label>
                <p className="text-sm text-[#666666]">
                  允许用户对视频进行评论
                </p>
              </div>
              <Switch
                checked={settings.enableComments}
                onCheckedChange={(checked) =>
                  updateSetting('enableComments', checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>允许下载</Label>
                <p className="text-sm text-[#666666]">
                  允许用户下载视频
                </p>
              </div>
              <Switch
                checked={settings.enableDownloads}
                onCheckedChange={(checked) =>
                  updateSetting('enableDownloads', checked)
                }
              />
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="p-6 space-y-4">
          <h2 className="font-poppins text-lg font-semibold text-[#212121]">
            数据管理
          </h2>
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-medium text-red-700">清除所有数据</h3>
                  <p className="text-sm text-red-600">
                    删除所有视频、标签和播放记录
                  </p>
                </div>
              </div>
              <Button
                variant="destructive"
                onClick={() => setIsClearDataDialogOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                清除
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Dialog */}
      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认重置</AlertDialogTitle>
            <AlertDialogDescription>
              确定要将所有设置重置为默认值吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsResetDialogOpen(false)}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              className="bg-red-500 hover:bg-red-600"
            >
              重置
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear Data Dialog */}
      <AlertDialog
        open={isClearDataDialogOpen}
        onOpenChange={setIsClearDataDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              确认清除数据
            </AlertDialogTitle>
            <AlertDialogDescription>
              确定要清除所有数据吗？这将删除所有视频、标签和播放记录，此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsClearDataDialogOpen(false)}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearData}
              className="bg-red-500 hover:bg-red-600"
            >
              确认清除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
