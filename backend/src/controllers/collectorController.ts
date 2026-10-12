import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as collectorService from '../services/collectorService.js';

export async function getDashboardStats(req: AuthenticatedRequest, res: Response) {
  try {
    const data = await collectorService.getCollectorDashboardStats(req.user!.id);
    return res.json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch collector dashboard stats' });
  }
}

export async function getTasks(req: AuthenticatedRequest, res: Response) {
  try {
    const status = req.query.status ? String(req.query.status) : undefined;
    const tasks = await collectorService.getCollectorTasks(req.user!.id, { status: status as any });
    return res.json({ success: true, data: tasks });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch collector tasks' });
  }
}

export async function getTaskById(req: AuthenticatedRequest, res: Response) {
  try {
    const id = String(req.params.id);
    const task = await collectorService.getCollectorTaskById(id, req.user!.id);
    return res.json({ success: true, data: task });
  } catch (error: any) {
    return res.status(404).json({ success: false, message: error.message || 'Task not found' });
  }
}

export async function startTask(req: AuthenticatedRequest, res: Response) {
  try {
    const id = String(req.params.id);
    const task = await collectorService.startCollectionTask(id, req.user!.id);
    return res.json({ success: true, data: task });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to start task' });
  }
}

export async function markCollected(req: AuthenticatedRequest, res: Response) {
  try {
    const id = String(req.params.id);
    const { proofImageUrl, notes } = req.body;
    const task = await collectorService.markCollectionAsCollected(id, req.user!.id, proofImageUrl, notes);
    return res.json({ success: true, data: task });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to mark as collected' });
  }
}

export async function completeTask(req: AuthenticatedRequest, res: Response) {
  try {
    const id = String(req.params.id);
    const { proofImageUrl, notes, photos } = req.body;
    const finalProof = proofImageUrl || (Array.isArray(photos) && photos.length > 0 ? photos[0] : undefined);
    const task = await collectorService.completeCollectionTask(id, req.user!.id, finalProof, notes);
    return res.json({ success: true, data: task });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to complete task',
      error: error.message || 'Failed to complete task',
    });
  }
}

export async function updateTaskStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const id = String(req.params.id);
    const { status, photos, proofImageUrl, notes } = req.body;
    const finalProof = proofImageUrl || (Array.isArray(photos) && photos.length > 0 ? photos[0] : undefined);

    let updatedTask;
    const targetStatus = String(status || '').toUpperCase();

    if (targetStatus === 'IN_PROGRESS') {
      updatedTask = await collectorService.startCollectionTask(id, req.user!.id);
    } else if (targetStatus === 'COLLECTED') {
      updatedTask = await collectorService.markCollectionAsCollected(id, req.user!.id, finalProof, notes);
    } else if (targetStatus === 'COMPLETED') {
      updatedTask = await collectorService.completeCollectionTask(id, req.user!.id, finalProof, notes);
    } else {
      return res.status(400).json({
        success: false,
        message: `Unsupported status transition: ${status}`,
        error: `Unsupported status transition: ${status}`,
      });
    }

    return res.json({ success: true, data: updatedTask });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update task status',
      error: error.message || 'Failed to update task status',
    });
  }
}

export async function getHistory(req: AuthenticatedRequest, res: Response) {
  try {
    const tasks = await collectorService.getCollectorTaskHistory(req.user!.id);
    return res.json({ success: true, data: tasks });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch task history' });
  }
}

export async function getProfile(req: AuthenticatedRequest, res: Response) {
  try {
    const profile = await collectorService.getCollectorProfile(req.user!.id);
    return res.json({ success: true, data: profile });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch collector profile' });
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response) {
  try {
    const profile = await collectorService.updateCollectorProfile(req.user!.id, req.body);
    return res.json({ success: true, data: profile });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to update collector profile' });
  }
}
