import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { Role } from '@prisma/client';
import * as feedbackController from '../controllers/feedbackController.js';

const router = Router();

router.use(requireAuth);

router.get('/', feedbackController.getFeedback);
router.post('/', requireRole([Role.CITIZEN]), feedbackController.createFeedback);

export default router;
