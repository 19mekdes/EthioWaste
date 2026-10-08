import { Request, Response } from 'express';
import * as centerService from '../services/centerService.js';

export async function getCenters(req: Request, res: Response) {
  try {
    const centers = await centerService.getRecyclingCenters();
    return res.json({ success: true, data: centers });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch recycling centers' });
  }
}

export async function createCenter(req: Request, res: Response) {
  try {
    const center = await centerService.createRecyclingCenter(req.body);
    return res.status(201).json({ success: true, data: center });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to create recycling center' });
  }
}

export async function updateCenter(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const center = await centerService.updateRecyclingCenter(id, req.body);
    return res.json({ success: true, data: center });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to update recycling center' });
  }
}

export async function deleteCenter(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const result = await centerService.deleteRecyclingCenter(id);
    return res.json({ success: true, data: result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to delete recycling center' });
  }
}
