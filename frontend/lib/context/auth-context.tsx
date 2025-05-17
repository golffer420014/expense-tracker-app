'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { showToast } from '@/lib/toast';
import axios from 'axios';

type User = {
  id: string;
  username: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  register: (object: { username: string, name: string, password: string, confirmPassword: string, provider_type: string, provider_user_id: string, avatar_url: string }) => Promise<boolean>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  getToken: () => string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        showToast.error('session expired please login again.');
        router.push('/');
        return;
      }
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setUser(response.data);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check auth on initial load and route changes
    checkAuth();
  }, [pathname]);

  const register = async (object: { username: string, name: string, password: string, confirmPassword: string, provider_type: string, provider_user_id: string, avatar_url: string }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/register`, object);
      console.log(response);
      if (response.status == 200) {
        showToast.success('สมัครสมาชิกสำเร็จ');
        return true;
      }
      return false;
    } catch (error) {
      showToast.error('สมัครสมาชิกไม่สำเร็จ');
      console.error('Register failed:', error);
      return false;
    }
  }

  const login = async (username: string, password: string) => {
    try {
      // const response = await api.post('/auth/login', { username, password });
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { username, password });

      if (response.status !== 200) {
        throw new Error('Login failed');
      }

      const data = response.data;
      localStorage.setItem('token', data.token);
      setUser(data.user);
      showToast.success('เข้าสู่ระบบสำเร็จ');
      router.push('/dashboard');
    } catch (error) {
      showToast.error('เข้าสู่ระบบไม่สำเร็จ', {
        description: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    showToast.success('ออกจากระบบสำเร็จ');
    router.push('/login');
  };

  const getToken = () => {
    return localStorage.getItem('token');
  }

  const value = {
    user,
    isLoading,
    register,
    login,
    logout,
    getToken,
    isAuthenticated: !!user,

  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 