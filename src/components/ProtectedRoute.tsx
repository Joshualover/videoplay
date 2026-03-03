import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8fe]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#d4acfe] animate-spin" />
          <p className="text-[#666666]">加载中...</p>
        </div>
      </div>
    );
  }

  // 未登录，重定向到登录页面
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 已登录，显示受保护的内容
  return <>{children}</>;
}
