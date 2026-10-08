import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { Role } from '@prisma/client';
import * as complaintController from '../controllers/complaintController.js';

const router = Router();

router.use(requireAuth);

router.get('/', complaintController.getComplaints);
router.post('/', requireRole([Role.CITIZEN]), complaintController.createComplaint);
router.patch('/:id/status', requireRole([Role.MUNICIPAL_ADMIN]), complaintController.updateComplaintStatus);

export default router;
