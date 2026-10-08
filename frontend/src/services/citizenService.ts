import { api } from './api';

export const citizenService = {
  async getDashboardStats() {
    return api.get<{
      stats: {
        totalReports: number;
        pendingReports: number;
        activeCollectionRequests: number;
        completedCollections: number;
        unreadNotificationsCount: number;
      };
      recentNotifications: any[];
      recentReports: any[];
      recentRequests: any[];
    }>('/citizen/dashboard-stats');
  },
};
