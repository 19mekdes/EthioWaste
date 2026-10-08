import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as collectionRequestService from '../services/collectionRequestService.js';

export async function getRequests(req: AuthenticatedRequest, res: Response) {
  try {
    const status = req.query.status ? String(req.query.status) : undefined;
    const requests = await collectionRequestService.getCollectionRequests(req.user!, {
      status: status as any,
    });
    return res.json({ success: true, data: requests });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch collection requests' });
  }
}

export async function getRequestById(req: AuthenticatedRequest, res: Response) {
  try {
    const id = String(req.params.id);
    const request = await collectionRequestService.getCollectionRequestById(id, req.user!);
    return res.json({ success: true, data: request });
  } catch (error: any) {
    return res.status(404).json({ success: false, message: error.message || 'Request not found' });
  }
}

export async function createRequest(req: AuthenticatedRequest, res: Response) {
  try {
    const request = await collectionRequestService.createCollectionRequest(req.user!, req.body);
    return res.status(201).json({ success: true, data: request });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to create collection request' });
  }
}

export async function cancelRequest(req: AuthenticatedRequest, res: Response) {
  try {
    const id = String(req.params.id);
    const request = await collectionRequestService.cancelCollectionRequest(id, req.user!);
    return res.json({ success: true, data: request });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to cancel collection request' });
  }
}

