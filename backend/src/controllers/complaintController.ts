import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as complaintService from '../services/complaintService.js';

export async function getComplaints(req: AuthenticatedRequest, res: Response) {
  try {
    const complaints = await complaintService.getComplaints(req.user!);
    return res.json({ success: true, data: complaints });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch complaints' });
  }
}

export async function createComplaint(req: AuthenticatedRequest, res: Response) {
  try {
    const complaint = await complaintService.createComplaint(req.user!, req.body);
    return res.status(201).json({ success: true, data: complaint });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to create complaint' });
  }
}

export async function updateComplaintStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const id = String(req.params.id);
    const { status, adminResponse } = req.body;
    const complaint = await complaintService.updateComplaintStatus(id, status, adminResponse);
    return res.json({ success: true, data: complaint });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to update complaint status' });
  }
}
