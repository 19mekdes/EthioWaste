import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as notificationService from '../services/notificationService.js';

export async function getNotifications(req: AuthenticatedRequest, res: Response) {
  try {
    const data = await notificationService.getUserNotifications(req.user!.id);
    return res.json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch notifications' });
  }
}

export async function markAsRead(req: AuthenticatedRequest, res: Response) {
  try {
    const id = String(req.params.id);
    const notification = await notificationService.markNotificationAsRead(id, req.user!.id);
    return res.json({ success: true, data: notification });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to mark notification as read' });
  }
}

export async function markAllAsRead(req: AuthenticatedRequest, res: Response) {
  try {
    const result = await notificationService.markAllNotificationsAsRead(req.user!.id);
    return res.json({ success: true, data: result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to mark all notifications as read' });
  }
}
