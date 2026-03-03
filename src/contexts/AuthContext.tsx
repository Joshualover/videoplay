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
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 管理员账号
const ADMIN_USER = {
  id: 'admin',
  name: '管理员',
  email: 'admin@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
  isAdmin: true,
};

const ADMIN_PASSWORD = 'lkb900918';

const STORAGE_KEYS = {
  USERS: 'video_studio_users',
  CURRENT_USER: 'video_studio_current_user',
};

// 生成随机ID
function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// 获取用户列表
function getUsers(): User[] {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
}

// 保存用户列表
function saveUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

// 初始化管理员账号
function initializeAdmin(): void {
  const users = getUsers();
  const adminExists = users.some(u => u.isAdmin);
  if (!adminExists) {
    // 不保存管理员到用户列表，只在登录时验证
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化时检查本地存储的登录状态
  useEffect(() => {
    initializeAdmin();
    
    const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 验证管理员账号
    if (username === 'admin' && password === ADMIN_PASSWORD) {
      setUser(ADMIN_USER);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(ADMIN_USER));
      return { success: true, message: '登录成功' };
    }

    // 验证注册用户
    const users = getUsers();
    const foundUser = users.find(u => u.name === username && u.email === username);
    
    if (foundUser) {
      // 注册用户需要密码匹配（这里简化处理，实际应该加密存储）
      const userWithPassword = users.find(u => u.name === username && (u as any).password === password);
      if (userWithPassword) {
        const { password: _, ...userWithoutPassword } = userWithPassword as any;
        setUser(userWithoutPassword);
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
        return { success: true, message: '登录成功' };
      }
    }

    return { success: false, message: '用户名或密码错误' };
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 检查用户名是否已存在
    const users = getUsers();
    if (users.some(u => u.name === name)) {
      return { success: false, message: '用户名已存在' };
    }

    if (users.some(u => u.email === email)) {
      return { success: false, message: '邮箱已被注册' };
    }

    // 创建新用户
    const newUser: User & { password: string } = {
      id: generateId(),
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      isAdmin: false,
      password,
    };

    users.push(newUser);
    saveUsers(users);

    // 自动登录
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));

    return { success: true, message: '注册成功' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
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
