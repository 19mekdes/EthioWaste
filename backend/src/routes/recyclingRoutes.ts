import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { Role } from '@prisma/client';
import * as recyclingController from '../controllers/recyclingController.js';

const router = Router();

router.use(requireAuth, requireRole([Role.RECYCLING_ORGANIZATION]));

router.get('/dashboard-stats', recyclingController.getDashboardStats);
router.get('/materials', recyclingController.getMaterials);
router.patch('/materials', recyclingController.updateMaterials);
router.get('/records', recyclingController.getRecords);
router.post('/records', recyclingController.receiveTaskMaterial);
router.get('/records/:id', recyclingController.getRecordById);
router.post('/records/:id/accept', recyclingController.acceptRecord);
router.post('/records/:id/process', recyclingController.startProcessing);
router.post('/records/:id/complete', recyclingController.completeProcessing);
router.get('/history', recyclingController.getHistory);
router.get('/profile', recyclingController.getProfile);

export default router;
