import { api } from './api';
import { User } from '../types';

export const authService = {
  async register(data: { name: string; email: string; phone?: string; password: string; confirmPassword?: string }) {
    const res = await api.post<{ user: User; token: string }>('/auth/register', data);
    if (res && (res as any).token) {
      localStorage.setItem('token', (res as any).token);
    }
    return res;
  },

  async login(credentials: { email: string; password: string }) {
    const res = await api.post<{ user: User; token: string }>('/auth/login', credentials);
    if (res && (res as any).token) {
      localStorage.setItem('token', (res as any).token);
    }
    return res;
  },

  async getCurrentUser() {
    return api.get<{ user: User }>('/auth/me');
  },

  async logout() {
    localStorage.removeItem('token');
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn(err);
    }
  },

  async getSeedUsers() {
    return api.get<User[]>('/auth/seed-users');
  }
};
