'use server';

import { db } from '@/lib/db';
import { CollectionRequestStatus, ReportSeverity, WasteCategory, Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { requireRole, requireUser } from '@/lib/session';
import { createUserNotification } from '@/actions/notifications';

export async function getCollectionRequests(options?: { status?: CollectionRequestStatus }) {
  try {
    const user = await requireUser();
    
    // Scoped strictly to authenticated user's requests if CITIZEN
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

    return { success: true, requests };
  } catch (error: any) {
    console.error('Failed to fetch collection requests:', error);
    return { success: false, error: error.message || 'Unauthorized', requests: [] };
  }
}

export async function getCollectionRequestById(id: string) {
  try {
    const user = await requireUser();

    const request = await db.collectionRequest.findUnique({
      where: { id },
      include: {
        assignedCollector: {
          select: { id: true, name: true, email: true, phone: true, avatarUrl: true },
        },
      },
    });

    if (!request) {
      return { success: false, error: 'Request not found', request: null };
    }

    // Security check: Citizen can ONLY access their own request
    if (user.role === Role.CITIZEN && request.citizenId !== user.id) {
      return { success: false, error: 'Request not found', request: null };
    }

    return { success: true, request };
  } catch (error: any) {
    console.error('Failed to fetch collection request detail:', error);
    return { success: false, error: error.message || 'Error loading request details', request: null };
  }
}

export async function createCollectionRequest(data: {
  wasteType: WasteCategory;
  estimatedQuantity?: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  preferredDate: string;
  preferredTimeSlot?: string;
  priority?: ReportSeverity;
}) {
  const user = await requireRole([Role.CITIZEN]);

  try {
    if (!data.address || !data.address.trim()) {
      return { success: false, error: 'Collection address is required.' };
    }
    if (!data.preferredDate) {
      return { success: false, error: 'Preferred collection date is required.' };
    }

    const preferredDateObj = new Date(data.preferredDate);
    if (isNaN(preferredDateObj.getTime())) {
      return { success: false, error: 'Invalid preferred date format.' };
    }

    const request = await db.collectionRequest.create({
      data: {
        citizenId: user.id, // Strictly derived from session
        wasteType: data.wasteType || WasteCategory.MIXED,
        estimatedQuantity: data.estimatedQuantity?.trim() || null,
        description: data.description?.trim() || null,
        address: data.address.trim(),
        latitude: data.latitude ?? 9.0300,
        longitude: data.longitude ?? 38.7400,
        preferredDate: preferredDateObj,
        preferredTimeSlot: data.preferredTimeSlot?.trim() || 'Morning (8:00 AM - 12:00 PM)',
        priority: data.priority || ReportSeverity.MEDIUM,
        status: CollectionRequestStatus.PENDING,
      },
    });

    // Create Notification confirming submission
    await createUserNotification(
      user.id,
      'Collection Request Submitted',
      `Your collection request for ${data.wasteType} at ${data.address} has been submitted successfully. Status: PENDING`,
      'SUCCESS'
    );

    revalidatePath('/dashboard/citizen');
    revalidatePath('/dashboard/citizen/requests');
    revalidatePath('/dashboard/citizen/collection-request');

    return { success: true, request };
  } catch (error: any) {
    console.error('Failed to create collection request:', error);
    return { success: false, error: error.message || 'Failed to submit collection request' };
  }
}
