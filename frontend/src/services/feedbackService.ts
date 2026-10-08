import { api } from './api';
import { FeedbackItem } from '../types';

export const feedbackService = {
  async getFeedback() {
    return api.get<FeedbackItem[]>('/feedback');
  },

  async getMyFeedback() {
    return api.get<FeedbackItem[]>('/feedback');
  },

  async getAllFeedback() {
    return api.get<FeedbackItem[]>('/feedback');
  },

  async createFeedback(data: { collectionRequestId?: string; rating: number; comment: string }) {
    return api.post<FeedbackItem>('/feedback', data);
  },

  async submitFeedback(data: { collectionRequestId?: string; rating: number; comment: string }) {
    return api.post<FeedbackItem>('/feedback', data);
  },
};
