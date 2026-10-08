import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { Role } from '@prisma/client';
import * as collectionRequestController from '../controllers/collectionRequestController.js';

const router = Router();

router.use(requireAuth);

router.get('/', collectionRequestController.getRequests);
router.get('/:id', collectionRequestController.getRequestById);
router.post('/', requireRole([Role.CITIZEN]), collectionRequestController.createRequest);

export default router;
