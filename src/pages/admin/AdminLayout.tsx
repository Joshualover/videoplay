import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Upload,
  Film,
  Tag,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const sidebarItems = [
  {
    label: '上传视频',
    href: '/admin/upload',
    icon: Upload,
  },
  {
    label: '视频管理',
    href: '/admin/videos',
    icon: Film,
  },
  {
    label: '标签管理',
    href: '/admin/tags',
    icon: Tag,
  },
  {
    label: '系统设置',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f8f8fe]">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-[#e0e0e0]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#d4acfe] rounded-lg flex items-center justify-center">
              <Upload className="w-4 h-4 text-white" />
            </div>
            <span className="font-poppins font-semibold text-[#212121]">
              管理控制台
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-[#e0e0e0] transition-transform duration-300',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-[#e0e0e0]">
              <Link to="/admin" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#d4acfe] rounded-xl flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-poppins font-semibold text-[#212121]">
                    管理控制台
                  </h1>
                  <p className="text-xs text-[#9e9e9e]">视频创作工作室</p>
                </div>
              </Link>
            </div>

            {/* User Info */}
            <div className="px-4 py-4 border-b border-[#e0e0e0]">
              <div className="flex items-center gap-3 p-3 bg-[#f8f8fe] rounded-xl">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#212121] text-sm truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-[#9e9e9e] truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                    location.pathname === item.href
                      ? 'bg-[#d4acfe] text-white'
                      : 'text-[#666666] hover:bg-[#f5f5f5]'
                  )}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {location.pathname === item.href && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-[#e0e0e0] space-y-2">
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#666666] hover:bg-[#f5f5f5] transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">返回前台</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">退出登录</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen pt-16 lg:pt-0">
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
