import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { Role } from '@prisma/client';
import * as reportController from '../controllers/reportController.js';

const router = Router();

router.use(requireAuth);

router.get('/', reportController.getReports);
router.get('/:id', reportController.getReportById);
router.post('/', requireRole([Role.CITIZEN]), reportController.createReport);
router.patch('/:id/status', requireRole([Role.COLLECTOR, Role.MUNICIPAL_ADMIN]), reportController.updateReportStatus);

export default router;
