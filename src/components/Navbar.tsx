import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, LogIn, Film, Shield, LogOut as LogOutIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    } else if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { label: '首页', href: '/' },
    { label: '视频', href: '/?view=all' },
    { label: '关于', href: '/about' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'glass shadow-sm py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group perspective-container"
          >
            <div className="w-10 h-10 bg-[#d4acfe] rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="font-poppins font-semibold text-xl text-[#212121] hidden sm:block">
              视频创作工作室
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'text-sm font-medium transition-all duration-300 hover:text-[#d4acfe] relative group',
                  location.pathname === link.href || location.search.includes('view=all')
                    ? 'text-[#d4acfe]'
                    : 'text-[#666666]'
                )}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#d4acfe] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-4">
            {/* Search Bar - Desktop */}
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex items-center relative"
            >
              <Input
                type="text"
                placeholder="搜索视频..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-[#f5f5f5] border-none rounded-full text-sm focus:ring-2 focus:ring-[#d4acfe] transition-all duration-300"
              />
              <Search className="w-4 h-4 text-[#9e9e9e] absolute left-3.5" />
            </form>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-[#f5f5f5] transition-colors"
                  >
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2 border-b border-[#e0e0e0]">
                    <p className="font-medium text-sm">{user?.name}</p>
                    <p className="text-xs text-[#9e9e9e]">{user?.email}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <Shield className="w-4 h-4 mr-2" />
                    管理后台
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    <LogOutIcon className="w-4 h-4 mr-2" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                className="gap-2 rounded-full border-[#d4acfe] text-[#d4acfe] hover:bg-[#d4acfe] hover:text-white"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">管理员登录</span>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full hover:bg-[#f5f5f5]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-[#e0e0e0] animate-slide-up">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mt-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="搜索视频..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#f5f5f5] border-none rounded-full text-sm"
                />
                <Search className="w-4 h-4 text-[#9e9e9e] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </form>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-2 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    location.pathname === link.href
                      ? 'bg-[#d4acfe]/10 text-[#d4acfe]'
                      : 'text-[#666666] hover:bg-[#f5f5f5]'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-[#d4acfe] hover:bg-[#d4acfe]/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  管理员登录
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
