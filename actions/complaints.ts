'use server';

import { db } from '@/lib/db';
import { ComplaintStatus, Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { requireRole, requireUser } from '@/lib/session';
import { createUserNotification } from '@/actions/notifications';

export async function getComplaints() {
  try {
    const user = await requireUser();

    const where: any = {};
    if (user.role === Role.CITIZEN) {
      where.citizenId = user.id; // Strictly scope to authenticated citizen
    }

    const complaints = await db.complaint.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, complaints };
  } catch (error: any) {
    console.error('Failed to fetch complaints:', error);
    return { success: false, error: error.message || 'Unauthorized', complaints: [] };
  }
}

export async function createComplaint(data: {
  category: string;
  description: string;
  relatedRequestId?: string;
}) {
  const user = await requireRole([Role.CITIZEN]);

  try {
    if (!data.category || !data.category.trim()) {
      return { success: false, error: 'Complaint category is required.' };
    }
    if (!data.description || !data.description.trim()) {
      return { success: false, error: 'Complaint description is required.' };
    }

    // Optional: verify related request ownership if provided
    if (data.relatedRequestId) {
      const relReq = await db.collectionRequest.findUnique({
        where: { id: data.relatedRequestId },
        select: { citizenId: true },
      });
      if (relReq && relReq.citizenId !== user.id) {
        return { success: false, error: 'Invalid related request ID.' };
      }
    }

    const complaint = await db.complaint.create({
      data: {
        citizenId: user.id, // Strictly derived from server session
        category: data.category.trim(),
        description: data.description.trim(),
        relatedRequestId: data.relatedRequestId || null,
        status: ComplaintStatus.OPEN,
      },
    });

    // Send notification to citizen
    await createUserNotification(
      user.id,
      'Complaint Submitted',
      `Your complaint regarding "${data.category}" has been filed under ID #${complaint.id.slice(-6)}. Status: OPEN`,
      'INFO'
    );

    revalidatePath('/dashboard/citizen');
    revalidatePath('/dashboard/citizen/complaints');

    return { success: true, complaint };
  } catch (error: any) {
    console.error('Failed to create complaint:', error);
    return { success: false, error: error.message || 'Failed to submit complaint' };
  }
}
