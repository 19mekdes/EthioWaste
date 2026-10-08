import { api } from './api';
import { ComplaintItem, ComplaintStatus } from '../types';

export const complaintService = {
  async getComplaints() {
    return api.get<ComplaintItem[]>('/complaints');
  },

  async getMyComplaints() {
    return api.get<ComplaintItem[]>('/complaints');
  },

  async getAllComplaints() {
    return api.get<ComplaintItem[]>('/complaints');
  },

  async createComplaint(data: { category: string; subject?: string; description: string; relatedRequestId?: string }) {
    return api.post<ComplaintItem>('/complaints', data);
  },

  async submitComplaint(data: { category: string; subject?: string; description: string; relatedRequestId?: string }) {
    return api.post<ComplaintItem>('/complaints', data);
  },

  async updateComplaintStatus(id: string, status: ComplaintStatus, adminResponse?: string) {
    return api.patch<ComplaintItem>(`/complaints/${id}/status`, { status, adminResponse });
  },

  async resolveComplaint(id: string, status: ComplaintStatus, adminNotes?: string) {
    return api.patch<ComplaintItem>(`/complaints/${id}/status`, { status, adminResponse: adminNotes, adminNotes });
  },
};
