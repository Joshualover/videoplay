import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Film, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 如果已登录，重定向到管理后台
  if (isAuthenticated) {
    const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin';
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      } else {
        setError(result.message);
      }
    } catch {
      setError('登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f8fe] to-white flex items-center justify-center p-4">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#d4acfe]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#d4acfe]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to Home */}
        <Link
          to="/"
          className="absolute -top-16 left-0 flex items-center gap-2 text-[#666666] hover:text-[#d4acfe] transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span className="text-sm">返回首页</span>
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-[#d4acfe]/10 p-8 border border-[#e0e0e0]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#d4acfe] to-[#b388eb] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#d4acfe]/30">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-poppins text-2xl font-bold text-[#212121] mb-2">
              管理员登录
            </h1>
            <p className="text-[#666666]">
              请输入您的管理员账号信息
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-500 text-xs">!</span>
              </div>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#212121]">
                邮箱地址
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9e9e9e]" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className={cn(
                    'pl-11 h-12 rounded-xl border-[#e0e0e0] focus:border-[#d4acfe] focus:ring-[#d4acfe]',
                    error && 'border-red-300'
                  )}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#212121]">
                密码
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9e9e9e]" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className={cn(
                    'pl-11 pr-11 h-12 rounded-xl border-[#e0e0e0] focus:border-[#d4acfe] focus:ring-[#d4acfe]',
                    error && 'border-red-300'
                  )}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e9e9e] hover:text-[#666666] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-[#666666] cursor-pointer"
                >
                  记住我
                </Label>
              </div>
              <button
                type="button"
                className="text-sm text-[#d4acfe] hover:text-[#b388eb] transition-colors"
                onClick={() => alert('默认账号: admin@example.com\n默认密码: admin123')}
              >
                忘记密码?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-[#d4acfe] to-[#b388eb] hover:from-[#c99cf5] hover:to-[#a87ce0] text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-[#d4acfe]/30"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  登录中...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  登录
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-[#f8f8fe] rounded-xl">
            <p className="text-xs text-[#9e9e9e] text-center">
              演示账号: <span className="text-[#666666]">admin@example.com</span>
            </p>
            <p className="text-xs text-[#9e9e9e] text-center mt-1">
              演示密码: <span className="text-[#666666]">admin123</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-[#9e9e9e]">
            <Film className="w-4 h-4" />
            <span className="text-sm">视频创作工作室</span>
          </div>
          <p className="text-xs text-[#9e9e9e] mt-2">
            © 2024 视频创作工作室. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
