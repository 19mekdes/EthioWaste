import { api } from './api';
import { User, CollectionTask, CollectionRequest, WasteReport, Role } from '../types';

export const adminService = {
  async getAnalytics() {
    return api.get<any>('/admin/analytics');
  },

  async getAnalyticsOverview() {
    return api.get<any>('/admin/analytics');
  },

  async getUsers(role?: Role) {
    const query = role ? `?role=${role}` : '';
    return api.get<User[]>(`/admin/users${query}`);
  },

  async getAllUsers() {
    return api.get<User[]>('/admin/users');
  },

  async updateUserRole(userId: string, role: string) {
    return api.patch<User>(`/admin/users/${userId}/role`, { role });
  },

  async getCollectors() {
    return api.get<User[]>('/admin/collectors');
  },

  async getRecyclingOrganizations() {
    return api.get<any[]>('/admin/recycling-organizations');
  },

  async getRecyclingOrgs() {
    return api.get<any[]>('/admin/recycling-organizations');
  },

  async getTasks() {
    return api.get<CollectionTask[]>('/admin/tasks');
  },

  async getAllRequests() {
    return api.get<CollectionRequest[]>('/collection-requests');
  },

  async approveRequest(requestId: string) {
    return api.post<CollectionRequest>(`/admin/requests/${requestId}/approve`);
  },

  async rejectRequest(requestId: string, reason?: string) {
    return api.post<CollectionRequest>(`/admin/requests/${requestId}/reject`, { reason });
  },

  async assignCollectorToRequest(requestId: string, collectorId: string) {
    return api.post<{ request: CollectionRequest; task: CollectionTask }>(`/admin/requests/${requestId}/assign`, { collectorId });
  },

  async verifyReport(reportId: string, pointsAwarded?: number) {
    return api.post<{ report: WasteReport; awarded: boolean; updatedPoints: number }>(`/admin/reports/${reportId}/verify`, { pointsAwarded });
  },

  async rejectReport(reportId: string, reason?: string) {
    return api.post<WasteReport>(`/admin/reports/${reportId}/reject`, { reason });
  },

  async assignCollectorToReport(reportId: string, collectorId: string) {
    return api.post<WasteReport>(`/admin/reports/${reportId}/assign`, { collectorId });
  },

  async updateReportStatus(reportId: string, status: string, collectorId?: string) {
    return api.patch<WasteReport>(`/waste-reports/${reportId}/status`, { status, assignedCollectorId: collectorId });
  },
};
