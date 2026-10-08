import { api } from './api';
import { RecyclingCenter } from '../types';

export const centerService = {
  async getPublicCenters() {
    return api.get<RecyclingCenter[]>('/recycling-centers');
  },

  async getAllCenters() {
    return api.get<RecyclingCenter[]>('/recycling-centers');
  },

  async createCenter(data: Partial<RecyclingCenter>) {
    return api.post<RecyclingCenter>('/recycling-centers', data);
  },

  async updateCenter(id: string, data: Partial<RecyclingCenter>) {
    return api.patch<RecyclingCenter>(`/recycling-centers/${id}`, data);
  },

  async deleteCenter(id: string) {
    return api.delete(`/recycling-centers/${id}`);
  },
};
