import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  register: (data: { name: string; email: string; phone?: string; password: string; confirmPassword?: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res: any = await authService.getCurrentUser();
      const currentUser = res?.user || res?.data?.user || res;
      if (currentUser && currentUser.id) {
        setUser(currentUser);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (e) {
      console.error('Failed to fetch user session:', e);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res: any = await authService.login(credentials);
      const currentUser = res?.user || res?.data?.user;
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
        return { success: true };
      }
      setLoading(false);
      return { success: false, message: 'Invalid response from server' };
    } catch (error: any) {
      setLoading(false);
      return { success: false, message: error.response?.data?.error || error.message || 'Login failed' };
    }
  };

  const register = async (data: { name: string; email: string; phone?: string; password: string; confirmPassword?: string }) => {
    try {
      const res: any = await authService.register(data);
      const currentUser = res?.user || res?.data?.user;
      if (currentUser) {
        setUser(currentUser);
        return { success: true };
      }
      return { success: false, message: 'Registration failed' };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.error || error.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
