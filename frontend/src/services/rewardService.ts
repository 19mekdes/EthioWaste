import { api } from './api';
import { RewardTransaction, User, Reward, UserReward } from '../types';

export const rewardService = {
  async getLeaderboard() {
    return api.get<Partial<User>[]>('/rewards/leaderboard');
  },

  async getUserPoints() {
    return api.get<{ points: number }>('/rewards/user-points');
  },

  async getAvailableRewards() {
    return api.get<Reward[]>('/rewards/available');
  },

  async getMyRedemptions() {
    return api.get<UserReward[]>('/rewards/my-redemptions');
  },

  async getTransactions(targetUserId?: string) {
    const query = targetUserId ? `?targetUserId=${targetUserId}` : '';
    return api.get<{ transactions: RewardTransaction[]; ecoPoints: number }>(`/rewards/transactions${query}`);
  },

  async redeemReward(rewardId: string, cost?: number, rewardTitle?: string) {
    return api.post<{ redemptionCode: string; newPoints: number; transaction: RewardTransaction }>('/rewards/redeem', {
      rewardId,
      rewardCost: cost,
      rewardTitle,
    });
  },
};
