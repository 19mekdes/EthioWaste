import { api } from './api';
import { RecyclingRecord, RecyclingStatus, CollectionTask, RecyclingOrganization } from '../types';

export const recyclingService = {
  async getDashboardStats() {
    return api.get<{
      stats: {
        pendingCount: number;
        acceptedCount: number;
        processingCount: number;
        recycledCount: number;
        totalRecycledQuantity: number;
        recyclingSuccessRate: number;
        availableTasksCount: number;
      };
      recentRecords: RecyclingRecord[];
      org: RecyclingOrganization;
    }>('/recycling/dashboard-stats');
  },

  async getAvailableMaterials() {
    return api.get<CollectionTask[]>('/recycling/materials');
  },

  async updateAcceptedMaterials(acceptedMaterials: string) {
    return api.patch<RecyclingOrganization>('/recycling/materials', { acceptedMaterials });
  },

  async getRecords(filters?: { status?: RecyclingStatus; searchQuery?: string }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.searchQuery) params.append('searchQuery', filters.searchQuery);
    const query = params.toString() ? `?${params.toString()}` : '';
    return api.get<RecyclingRecord[]>(`/recycling/records${query}`);
  },

  async getMyRecords() {
    return api.get<RecyclingRecord[]>('/recycling/records');
  },

  async getRecordById(id: string) {
    return api.get<RecyclingRecord>(`/recycling/records/${id}`);
  },

  async createRecord(data: { materialType: string; quantityKg: number; source?: string; notes?: string }) {
    return api.post<RecyclingRecord>('/recycling/records', data);
  },

  async receiveMaterial(taskId: string, estimatedQuantity?: number) {
    return api.post<RecyclingRecord>('/recycling/records', { taskId, estimatedQuantity });
  },

  async acceptRecord(id: string) {
    return api.post<RecyclingRecord>(`/recycling/records/${id}/accept`);
  },

  async startProcessing(id: string) {
    return api.post<RecyclingRecord>(`/recycling/records/${id}/process`);
  },

  async completeProcessing(id: string, recycledQuantity: number, notes?: string) {
    return api.post<RecyclingRecord>(`/recycling/records/${id}/complete`, { recycledQuantity, notes });
  },

  async getHistory() {
    return api.get<RecyclingRecord[]>('/recycling/history');
  },

  async getProfile() {
    return api.get<{
      user: any;
      org: RecyclingOrganization;
      stats: {
        activeRecords: number;
        completedRecords: number;
        totalRecycledWeight: number;
      };
    }>('/recycling/profile');
  },
};
