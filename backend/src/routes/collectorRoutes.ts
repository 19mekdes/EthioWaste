import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { Role } from '@prisma/client';
import * as collectorController from '../controllers/collectorController.js';

const router = Router();

router.use(requireAuth, requireRole([Role.COLLECTOR]));

router.get('/dashboard-stats', collectorController.getDashboardStats);
router.get('/tasks', collectorController.getTasks);
router.get('/tasks/:id', collectorController.getTaskById);
router.post('/tasks/:id/start', collectorController.startTask);
router.post('/tasks/:id/collect', collectorController.markCollected);
router.post('/tasks/:id/complete', collectorController.completeTask);
router.get('/history', collectorController.getHistory);
router.get('/profile', collectorController.getProfile);
router.patch('/profile', collectorController.updateProfile);

export default router;
