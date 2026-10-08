import { db } from '../db.js';
import { CollectionRequestStatus, ReportSeverity, WasteCategory, Role } from '@prisma/client';
import { createNotification } from './notificationService.js';
import { UserPayload } from '../types/index.js';

export async function getCollectionRequests(
  user: UserPayload,
  options?: { status?: CollectionRequestStatus }
) {
  const where: any = {};
  if (user.role === Role.CITIZEN) {
    where.citizenId = user.id;
  }
  if (options?.status) {
    where.status = options.status;
  }

  const requests = await db.collectionRequest.findMany({
    where,
    include: {
      assignedCollector: {
        select: { id: true, name: true, email: true, phone: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return requests;
}

export async function getCollectionRequestById(id: string, user: UserPayload) {
  const request = await db.collectionRequest.findUnique({
    where: { id },
    include: {
      assignedCollector: {
        select: { id: true, name: true, email: true, phone: true, avatarUrl: true },
      },
    },
  });

  if (!request) {
    throw new Error('Request not found');
  }

  if (user.role === Role.CITIZEN && request.citizenId !== user.id) {
    throw new Error('Request not found');
  }

  return request;
}

export async function createCollectionRequest(
  user: UserPayload,
  data: {
    wasteType: WasteCategory;
    estimatedQuantity?: string;
    description?: string;
    address: string;
    latitude: number;
    longitude: number;
    preferredDate: string;
    preferredTimeSlot?: string;
    priority?: ReportSeverity;
  }
) {
  if (!data.address || !data.address.trim()) {
    throw new Error('Collection address is required.');
  }
  if (!data.preferredDate) {
    throw new Error('Preferred collection date is required.');
  }

  const preferredDateObj = new Date(data.preferredDate);
  if (isNaN(preferredDateObj.getTime())) {
    throw new Error('Invalid preferred date format.');
  }

  const request = await db.collectionRequest.create({
    data: {
      citizenId: user.id,
      wasteType: data.wasteType || WasteCategory.MIXED,
      estimatedQuantity: data.estimatedQuantity?.trim() || null,
      description: data.description?.trim() || null,
      address: data.address.trim(),
      latitude: data.latitude ?? 8.9806,
      longitude: data.longitude ?? 38.7578,
      preferredDate: preferredDateObj,
      preferredTimeSlot: data.preferredTimeSlot?.trim() || 'Morning (8:00 AM - 12:00 PM)',
      priority: data.priority || ReportSeverity.MEDIUM,
      status: CollectionRequestStatus.PENDING,
    },
  });

  await createNotification(
    user.id,
    'Collection Request Submitted',
    `Your collection request for ${data.wasteType} at ${data.address} has been submitted successfully. Status: PENDING`,
    'SUCCESS'
  );

  return request;
}

export async function cancelCollectionRequest(id: string, user: UserPayload) {
  const request = await db.collectionRequest.findUnique({ where: { id } });
  if (!request) throw new Error('Request not found');

  if (user.role === Role.CITIZEN && request.citizenId !== user.id) {
    throw new Error('Unauthorized');
  }

  if (request.status !== CollectionRequestStatus.PENDING) {
    throw new Error(`Cannot cancel collection request in status ${request.status}. Only PENDING requests can be cancelled.`);
  }

  const updated = await db.collectionRequest.update({
    where: { id },
    data: { status: CollectionRequestStatus.REJECTED },
  });

  return updated;
}
