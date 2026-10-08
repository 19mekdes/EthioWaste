import { Router } from 'express';
import authRoutes from './authRoutes.js';
import citizenRoutes from './citizenRoutes.js';
import reportRoutes from './reportRoutes.js';
import collectionRequestRoutes from './collectionRequestRoutes.js';
import collectorRoutes from './collectorRoutes.js';
import recyclingRoutes from './recyclingRoutes.js';
import adminRoutes from './adminRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import complaintRoutes from './complaintRoutes.js';
import feedbackRoutes from './feedbackRoutes.js';
import centerRoutes from './centerRoutes.js';
import rewardRoutes from './rewardRoutes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/citizen', citizenRoutes);
apiRouter.use('/waste-reports', reportRoutes);
apiRouter.use('/collection-requests', collectionRequestRoutes);
apiRouter.use('/collectors', collectorRoutes);
apiRouter.use('/recycling', recyclingRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/notifications', notificationRoutes);
apiRouter.use('/complaints', complaintRoutes);
apiRouter.use('/feedback', feedbackRoutes);
apiRouter.use('/recycling-centers', centerRoutes);
apiRouter.use('/rewards', rewardRoutes);

export default apiRouter;
