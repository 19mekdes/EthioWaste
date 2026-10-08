import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as reportService from '../services/reportService.js';

export async function getReports(req: AuthenticatedRequest, res: Response) {
  try {
    const status = req.query.status ? String(req.query.status) : undefined;
    const category = req.query.category ? String(req.query.category) : undefined;
    const assignedToId = req.query.assignedToId ? String(req.query.assignedToId) : undefined;
    const reporterId = req.query.reporterId ? String(req.query.reporterId) : undefined;

    const reports = await reportService.getWasteReports(req.user!, {
      status: status as any,
      category: category as any,
      assignedToId,
      reporterId,
    });
    return res.json({ success: true, data: reports });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch waste reports' });
  }
}

export async function getReportById(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const report = await reportService.getWasteReportById(String(id), req.user!);
    return res.json({ success: true, data: report });
  } catch (error: any) {
    return res.status(404).json({ success: false, message: error.message || 'Report not found' });
  }
}

export async function createReport(req: AuthenticatedRequest, res: Response) {
  try {
    const report = await reportService.createWasteReport(req.user!, req.body);
    return res.status(201).json({ success: true, data: report });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to create report' });
  }
}

export async function updateReportStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status, cleanupImageUrl, pointsAwarded } = req.body;
    const report = await reportService.updateReportStatus(
      String(id),
      req.user!,
      status,
      cleanupImageUrl,
      pointsAwarded
    );
    return res.json({ success: true, data: report });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to update report status' });
  }
}
