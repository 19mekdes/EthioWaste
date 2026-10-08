import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as rewardService from '../services/rewardService.js';

export async function getLeaderboard(req: AuthenticatedRequest, res: Response) {
  try {
    const leaderboard = await rewardService.getRewardsLeaderboard();
    return res.json({ success: true, data: leaderboard });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch leaderboard' });
  }
}

export async function getTransactions(req: AuthenticatedRequest, res: Response) {
  try {
    const targetUserId = req.query.targetUserId ? String(req.query.targetUserId) : undefined;
    const data = await rewardService.getUserTransactions(req.user!, targetUserId);
    return res.json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch transactions' });
  }
}

export async function redeemReward(req: AuthenticatedRequest, res: Response) {
  try {
    const { rewardCost, rewardTitle } = req.body;
    const result = await rewardService.redeemEcoReward(req.user!, Number(rewardCost), rewardTitle);
    return res.json({ success: true, data: result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to redeem reward' });
  }
}
