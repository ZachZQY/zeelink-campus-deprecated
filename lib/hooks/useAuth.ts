import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  getToken,
  getUserFromStorage,
  clearAuthData,
  saveAuthData,
  updateUserData,
  getAuthHeaders
} from '@/lib/utils/authUtils';

// 用户信息类型定义
export interface User {
  id: string | number;
  mobile: string;
  nickname: string;
  avatar_url?: string;
  [key: string]: any;
}

// 登录参数接口
export interface LoginParams {
  mobile: string;
  password?: string;
  code?: string;
  loginType?: 'password' | 'code';
}

// 验证码参数接口
export interface VerificationCodeParams {
  mobile: string;
  type: 'login' | 'register' | 'resetPassword';
}

// 重置密码参数接口
export interface ResetPasswordParams {
  mobile: string;
  newPassword: string;
  code: string;
}

/**
 * 认证相关的自定义钩子
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  // 在组件加载时获取用户信息
  useEffect(() => {
    const storedUser = getUserFromStorage();
    const token = getToken();

    if (storedUser && token) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  /**
   * 登录方法
   * @param params 登录参数
   */
  const login = useCallback(async (params: LoginParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (data.success) {
        const { token, user } = data.data;
        saveAuthData(token, user);
        setUser(user);
        setIsAuthenticated(true);
        return { success: true, data: data.data };
      } else {
        setError(data.message || '登录失败');
        return { success: false, error: data.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '登录过程中出现错误';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 发送验证码
   * @param params 验证码参数
   */
  const sendVerificationCode = useCallback(async (params: VerificationCodeParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/auth/sendVerificationCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, data: data.data };
      } else {
        setError(data.message || '发送验证码失败');
        return { success: false, error: data.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '发送验证码过程中出现错误';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 重置密码
   * @param params 重置密码参数
   */
  const resetPassword = useCallback(async (params: ResetPasswordParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/auth/resetPassword', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, data: data.data };
      } else {
        setError(data.message || '重置密码失败');
        return { success: false, error: data.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '重置密码过程中出现错误';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 登出方法
   */
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 调用登出接口
      const response = await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      
      // 无论 API 成功与否，都清除本地状态
      clearAuthData();
      setUser(null);
      setIsAuthenticated(false);

      // 重定向到登录页面
      router.push('/client/login');
      
      return { success: true };
    } catch (err) {
      console.error('登出过程中出现错误:', err);
      
      // 即使 API 失败，也清除本地状态
      clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
      
      // 重定向到登录页面
      router.push('/client/login');
      
      return { success: false, error: '登出过程中出现错误' };
    } finally {
      setLoading(false);
    }
  }, [router]);

  /**
   * 更新用户信息
   * @param updatedUserData 更新的用户数据
   */
  const updateUserInfo = useCallback((updatedUserData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = updateUserData(updatedUserData);
    if (updatedUser) {
      setUser(updatedUser);
    }
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    sendVerificationCode,
    resetPassword,
    updateUserInfo
  };
}

export default useAuth; 