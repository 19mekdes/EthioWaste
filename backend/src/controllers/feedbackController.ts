import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as feedbackService from '../services/feedbackService.js';

export async function getFeedback(req: AuthenticatedRequest, res: Response) {
  try {
    const feedbackList = await feedbackService.getFeedback(req.user!);
    return res.json({ success: true, data: feedbackList });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch feedback' });
  }
}

export async function createFeedback(req: AuthenticatedRequest, res: Response) {
  try {
    const feedback = await feedbackService.createFeedback(req.user!, req.body);
    return res.status(201).json({ success: true, data: feedback });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to create feedback' });
  }
}
