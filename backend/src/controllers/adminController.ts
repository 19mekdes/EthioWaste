import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as adminService from '../services/adminService.js';

export async function getAnalytics(req: AuthenticatedRequest, res: Response) {
  try {
    const stats = await adminService.getAdminAnalytics();
    return res.json({ success: true, data: stats });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch admin analytics' });
  }
}

export async function getUsers(req: AuthenticatedRequest, res: Response) {
  try {
    const role = req.query.role ? String(req.query.role) : undefined;
    const users = await adminService.getAllUsers(role as any);
    return res.json({ success: true, data: users });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch users' });
  }
}

export async function updateUserRole(req: AuthenticatedRequest, res: Response) {
  try {
    const id = String(req.params.id);
    const { role } = req.body;
    const user = await adminService.updateUserRole(id, role);
    return res.json({ success: true, data: user });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to update user role' });
  }
}

export async function getCollectors(req: AuthenticatedRequest, res: Response) {
  try {
    const collectors = await adminService.getCollectors();
    return res.json({ success: true, data: collectors });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch collectors' });
  }
}

export async function getRecyclingOrganizations(req: AuthenticatedRequest, res: Response) {
  try {
    const orgs = await adminService.getRecyclingOrganizations();
    return res.json({ success: true, data: orgs });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch recycling organizations' });
  }
}

export async function getTasks(req: AuthenticatedRequest, res: Response) {
  try {
    const tasks = await adminService.getAdminTasks();
    return res.json({ success: true, data: tasks });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch admin tasks' });
  }
}

export async function approveRequest(req: AuthenticatedRequest, res: Response) {
  try {
    const id = String(req.params.id);
    const request = await adminService.approveCollectionRequest(id);
    return res.json({ success: true, data: request });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to approve request' });
  }
}

export async function rejectRequest(req: AuthenticatedRequest, res: Response) {
  try {
    const id = String(req.params.id);
    const { reason } = req.body;
    const request = await adminService.rejectCollectionRequest(id, reason);
    return res.json({ success: true, data: request });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to reject request' });
  }
}

export async function assignCollectorToRequest(req: AuthenticatedRequest, res: Response) {
  try {
    const id = String(req.params.id);
    const { collectorId } = req.body;
    const result = await adminService.assignCollectorToRequest(id, collectorId);
    return res.json({ success: true, data: result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to assign collector to request' });
  }
}

export async function verifyReport(req: AuthenticatedRequest, res: Response) {
  try {
    const id = String(req.params.id);
    const { pointsAwarded } = req.body;
    const result = await adminService.validateAndApproveReport(id, pointsAwarded);
    return res.json({ success: true, data: result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to verify report' });
  }
}

export async function rejectReport(req: AuthenticatedRequest, res: Response) {
  try {
    const id = String(req.params.id);
    const { reason } = req.body;
    const report = await adminService.rejectReport(id, reason);
    return res.json({ success: true, data: report });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to reject report' });
  }
}

export async function assignCollectorToReport(req: AuthenticatedRequest, res: Response) {
  try {
    const id = String(req.params.id);
    const { collectorId } = req.body;
    const report = await adminService.assignCollectorToReport(id, collectorId);
    return res.json({ success: true, data: report });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to assign collector to report' });
  }
}
