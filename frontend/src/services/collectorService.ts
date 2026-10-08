import { api } from './api';
import { CollectionTask, CollectionTaskStatus, CollectionRequest, User } from '../types';

export const collectorService = {
  async getDashboardStats() {
    return api.get<{
      stats: {
        totalTasks: number;
        pendingTasks: number;
        activeTasks: number;
        collectedTasks: number;
        completedTasks: number;
        cancelledTasks: number;
        completionRate: number;
      };
      todayTasks: CollectionTask[];
    }>('/collectors/dashboard-stats');
  },

  async getTasks(status?: CollectionTaskStatus) {
    const query = status ? `?status=${status}` : '';
    return api.get<CollectionTask[]>(`/collectors/tasks${query}`);
  },

  async getAssignedTasks() {
    return api.get<any[]>('/collectors/tasks');
  },

  async getTaskById(id: string) {
    return api.get<CollectionTask>(`/collectors/tasks/${id}`);
  },

  async updateTaskStatus(id: string, status: string, photos?: string[]) {
    return api.patch<CollectionTask>(`/collectors/tasks/${id}/status`, { status, photos });
  },

  async startTask(id: string) {
    return api.post<CollectionTask>(`/collectors/tasks/${id}/start`);
  },

  async markCollected(id: string, proofImageUrl?: string, notes?: string) {
    return api.post<CollectionTask>(`/collectors/tasks/${id}/collect`, { proofImageUrl, notes });
  },

  async completeTask(id: string, proofImageUrl?: string, notes?: string) {
    return api.post<CollectionTask>(`/collectors/tasks/${id}/complete`, { proofImageUrl, notes });
  },

  async getHistory() {
    return api.get<CollectionTask[]>('/collectors/history');
  },

  async getProfile() {
    return api.get<User>('/collectors/profile');
  },

  async updateProfile(data: { name?: string; phone?: string; address?: string }) {
    return api.patch<User>('/collectors/profile', data);
  },
};
