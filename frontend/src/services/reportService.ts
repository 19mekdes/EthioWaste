import { api } from './api';
import { WasteReport, ReportStatus, WasteCategory, ReportSeverity } from '../types';

export const reportService = {
  async getReports(filters?: { status?: ReportStatus; category?: WasteCategory }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    const query = params.toString() ? `?${params.toString()}` : '';
    return api.get<WasteReport[]>(`/waste-reports${query}`);
  },

  async getAllReports() {
    return api.get<WasteReport[]>('/waste-reports');
  },

  async getMyReports() {
    return api.get<WasteReport[]>('/waste-reports/my-reports');
  },

  async getReportById(id: string) {
    return api.get<WasteReport>(`/waste-reports/${id}`);
  },

  async createReport(data: {
    title?: string;
    description: string;
    category?: WasteCategory;
    wasteType?: string;
    severity?: ReportSeverity;
    imageUrl?: string;
    photos?: string[];
    latitude: number;
    longitude: number;
    address?: string;
    isIllegalDumping?: boolean;
  }) {
    return api.post<WasteReport>('/waste-reports', data);
  },

  async updateReportStatus(id: string, status: ReportStatus, cleanupImageUrl?: string, pointsAwarded?: number) {
    return api.patch<WasteReport>(`/waste-reports/${id}/status`, { status, cleanupImageUrl, pointsAwarded });
  },
};
