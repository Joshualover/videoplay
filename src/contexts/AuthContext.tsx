import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 默认管理员账号
const DEFAULT_ADMIN = {
  id: '1',
  name: '管理员',
  email: 'admin@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
  isAdmin: true,
};

// 默认密码（实际项目中应该使用加密存储）
const DEFAULT_PASSWORD = 'admin123';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化时检查本地存储的登录状态
  useEffect(() => {
    const storedUser = localStorage.getItem('video_studio_current_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem('video_studio_current_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 验证邮箱和密码
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_PASSWORD) {
      setUser(DEFAULT_ADMIN);
      localStorage.setItem('video_studio_current_user', JSON.stringify(DEFAULT_ADMIN));
      return { success: true, message: '登录成功' };
    }

    return { success: false, message: '邮箱或密码错误' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('video_studio_current_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
