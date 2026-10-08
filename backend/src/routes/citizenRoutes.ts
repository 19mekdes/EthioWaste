import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { Role } from '@prisma/client';
import * as citizenController from '../controllers/citizenController.js';

const router = Router();

router.use(requireAuth, requireRole([Role.CITIZEN]));
router.get('/dashboard-stats', citizenController.getDashboardStats);

export default router;
