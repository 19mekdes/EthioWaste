import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { Role } from '@prisma/client';
import * as adminController from '../controllers/adminController.js';

const router = Router();

router.use(requireAuth, requireRole([Role.MUNICIPAL_ADMIN]));

router.get('/analytics', adminController.getAnalytics);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/role', adminController.updateUserRole);
router.get('/collectors', adminController.getCollectors);
router.get('/recycling-organizations', adminController.getRecyclingOrganizations);
router.get('/tasks', adminController.getTasks);

router.post('/requests/:id/approve', adminController.approveRequest);
router.post('/requests/:id/reject', adminController.rejectRequest);
router.post('/requests/:id/assign', adminController.assignCollectorToRequest);

router.post('/reports/:id/verify', adminController.verifyReport);
router.post('/reports/:id/reject', adminController.rejectReport);
router.post('/reports/:id/assign', adminController.assignCollectorToReport);

export default router;
