import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { Role } from '@prisma/client';
import * as rewardController from '../controllers/rewardController.js';

const router = Router();

router.use(requireAuth);

router.get('/leaderboard', rewardController.getLeaderboard);
router.get('/transactions', rewardController.getTransactions);
router.get('/user-points', rewardController.getUserPoints);
router.get('/available', rewardController.getAvailableRewards);
router.get('/my-redemptions', rewardController.getMyRedemptions);
router.post('/redeem', requireRole([Role.CITIZEN]), rewardController.redeemReward);

export default router;
