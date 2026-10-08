import { api } from './api';
import { NotificationItem } from '../types';

export const notificationService = {
  async getNotifications() {
    return api.get<{ notifications: NotificationItem[]; unreadCount: number }>('/notifications');
  },

  async getMyNotifications(): Promise<NotificationItem[]> {
    const res = await api.get<{ notifications: NotificationItem[]; unreadCount: number }>('/notifications');
    return Array.isArray(res) ? res : (res.notifications || []);
  },

  async markAsRead(id: string) {
    return api.patch<NotificationItem>(`/notifications/${id}/read`);
  },

  async markAllAsRead() {
    return api.patch<{ success: boolean }>('/notifications/read-all');
  },
};
