import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { Role } from '@prisma/client';
import * as rewardController from '../controllers/rewardController.js';

const router = Router();

router.use(requireAuth);

router.get('/leaderboard', rewardController.getLeaderboard);
router.get('/transactions', rewardController.getTransactions);
router.post('/redeem', requireRole([Role.CITIZEN]), rewardController.redeemReward);

export default router;
