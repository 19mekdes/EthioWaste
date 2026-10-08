import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as recyclingService from '../services/recyclingService.js';

export async function getDashboardStats(req: AuthenticatedRequest, res: Response) {
  try {
    const data = await recyclingService.getRecyclingDashboardStats(req.user!);
    return res.json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch recycling stats' });
  }
}

export async function getMaterials(req: AuthenticatedRequest, res: Response) {
  try {
    const materials = await recyclingService.getAvailableRecyclableMaterials(req.user!);
    return res.json({ success: true, data: materials });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch available materials' });
  }
}

export async function updateMaterials(req: AuthenticatedRequest, res: Response) {
  try {
    const { acceptedMaterials } = req.body;
    const org = await recyclingService.updateAcceptedMaterials(req.user!, acceptedMaterials);
    return res.json({ success: true, data: org });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to update accepted materials' });
  }
}

export async function getRecords(req: AuthenticatedRequest, res: Response) {
  try {
    const status = req.query.status ? String(req.query.status) : undefined;
    const searchQuery = req.query.searchQuery ? String(req.query.searchQuery) : undefined;
    const records = await recyclingService.getRecyclingRecords(req.user!, {
      status: status as any,
      searchQuery,
    });
    return res.json({ success: true, data: records });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch recycling records' });
  }
}

export async function getRecordById(req: AuthenticatedRequest, res: Response) {
  try {
    const id = String(req.params.id);
    const record = await recyclingService.getRecyclingRecordById(id, req.user!);
    return res.json({ success: true, data: record });
  } catch (error: any) {
    return res.status(404).json({ success: false, message: error.message || 'Record not found' });
  }
}

export async function receiveTaskMaterial(req: AuthenticatedRequest, res: Response) {
  try {
    const { taskId, estimatedQuantity } = req.body;
    const record = await recyclingService.receiveAndCreateRecyclingRecord(req.user!, taskId, estimatedQuantity);
    return res.status(201).json({ success: true, data: record });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to receive material' });
  }
}

export async function acceptRecord(req: AuthenticatedRequest, res: Response) {
  try {
    const id = String(req.params.id);
    const record = await recyclingService.acceptRecyclingRecord(req.user!, id);
    return res.json({ success: true, data: record });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to accept record' });
  }
}

export async function startProcessing(req: AuthenticatedRequest, res: Response) {
  try {
    const id = String(req.params.id);
    const record = await recyclingService.startRecyclingProcess(req.user!, id);
    return res.json({ success: true, data: record });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to start processing' });
  }
}

export async function completeProcessing(req: AuthenticatedRequest, res: Response) {
  try {
    const id = String(req.params.id);
    const { recycledQuantity, notes } = req.body;
    const record = await recyclingService.completeRecycling(req.user!, id, Number(recycledQuantity), notes);
    return res.json({ success: true, data: record });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to complete recycling' });
  }
}

export async function getHistory(req: AuthenticatedRequest, res: Response) {
  try {
    const history = await recyclingService.getRecyclingHistory(req.user!);
    return res.json({ success: true, data: history });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch recycling history' });
  }
}

export async function getProfile(req: AuthenticatedRequest, res: Response) {
  try {
    const profile = await recyclingService.getRecyclingOrgProfileData(req.user!);
    return res.json({ success: true, data: profile });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch recycling profile' });
  }
}
