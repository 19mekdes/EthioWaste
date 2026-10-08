import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as citizenService from '../services/citizenService.js';

export async function getDashboardStats(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const data = await citizenService.getCitizenDashboardStats(userId);
    return res.json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch dashboard stats' });
  }
}
