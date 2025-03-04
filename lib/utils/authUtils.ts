import { User } from '@/lib/hooks/useAuth';

/**
 * 从 localStorage 获取 token
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

/**
 * 从 localStorage 获取用户信息
 */
export function getUserFromStorage(): User | null {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (err) {
    console.error('Failed to parse user data:', err);
    return null;
  }
}

/**
 * 检查用户是否已登录
 */
export function isAuthenticated(): boolean {
  return !!getToken() && !!getUserFromStorage();
}

/**
 * 清除用户认证数据
 */
export function clearAuthData(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/**
 * 保存用户认证数据
 */
export function saveAuthData(token: string, user: User): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

/**
 * 更新用户信息
 */
export function updateUserData(userData: Partial<User>): User | null {
  const currentUser = getUserFromStorage();
  if (!currentUser) return null;
  
  const updatedUser = { ...currentUser, ...userData };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  return updatedUser;
}

/**
 * 获取请求头部，包含认证信息
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * 重定向到登录页面
 */
export function redirectToLogin(): void {
  if (typeof window === 'undefined') return;
  
  window.location.href = '/client/login';
} 