import { api } from './api';
import { CollectionRequest, CollectionRequestStatus, WasteCategory, ReportSeverity } from '../types';

export const collectionRequestService = {
  async getRequests(status?: CollectionRequestStatus) {
    const query = status ? `?status=${status}` : '';
    return api.get<CollectionRequest[]>(`/collection-requests${query}`);
  },

  async getMyRequests() {
    return api.get<CollectionRequest[]>('/collection-requests/my-requests');
  },

  async getRequestById(id: string) {
    return api.get<CollectionRequest>(`/collection-requests/${id}`);
  },

  async createRequest(data: {
    wasteType: string;
    estimatedQuantity?: string;
    description?: string;
    notes?: string;
    photos?: string[];
    address: string;
    latitude: number;
    longitude: number;
    preferredDate: string;
    preferredTimeSlot?: string;
    preferredTime?: string;
    priority?: ReportSeverity;
  }) {
    return api.post<CollectionRequest>('/collection-requests', data);
  },

  async cancelRequest(id: string) {
    return api.patch<CollectionRequest>(`/collection-requests/${id}/cancel`);
  },
};
