import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { Role } from '@prisma/client';
import * as centerController from '../controllers/centerController.js';

const router = Router();

router.get('/', centerController.getCenters);

router.post('/', requireAuth, requireRole([Role.MUNICIPAL_ADMIN]), centerController.createCenter);
router.patch('/:id', requireAuth, requireRole([Role.MUNICIPAL_ADMIN]), centerController.updateCenter);
router.delete('/:id', requireAuth, requireRole([Role.MUNICIPAL_ADMIN]), centerController.deleteCenter);

export default router;
