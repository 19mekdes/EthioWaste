import { db } from '../db.js';
import { ComplaintStatus, Role } from '@prisma/client';
import { createNotification } from './notificationService.js';
import { UserPayload } from '../types/index.js';
import { isValidComplaintTransition } from '../utils/statusTransitions.js';

export async function getComplaints(user: UserPayload) {
  const where: any = {};
  if (user.role === Role.CITIZEN) {
    where.citizenId = user.id;
  }

  const complaints = await db.complaint.findMany({
    where,
    include: {
      citizen: { select: { id: true, name: true, email: true, phone: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return complaints;
}

export async function createComplaint(
  user: UserPayload,
  data: { category: string; description: string; relatedRequestId?: string }
) {
  if (!data.category || !data.category.trim()) {
    throw new Error('Complaint category is required.');
  }
  if (!data.description || !data.description.trim()) {
    throw new Error('Complaint description is required.');
  }

  if (data.relatedRequestId) {
    const relReq = await db.collectionRequest.findUnique({
      where: { id: data.relatedRequestId },
      select: { citizenId: true },
    });
    if (relReq && relReq.citizenId !== user.id) {
      throw new Error('Invalid related request ID.');
    }
  }

  const complaint = await db.complaint.create({
    data: {
      citizenId: user.id,
      category: data.category.trim(),
      description: data.description.trim(),
      relatedRequestId: data.relatedRequestId || null,
      status: ComplaintStatus.OPEN,
    },
  });

  await createNotification(
    user.id,
    'Complaint Submitted',
    `Your complaint regarding "${data.category}" has been filed under ID #${complaint.id.slice(-6)}. Status: OPEN`,
    'INFO'
  );

  return complaint;
}

export async function updateComplaintStatus(
  id: string,
  status: ComplaintStatus,
  adminResponse?: string
) {
  const complaint = await db.complaint.findUnique({ where: { id } });
  if (!complaint) throw new Error('Complaint not found');

  if (!isValidComplaintTransition(complaint.status, status)) {
    throw new Error(`Cannot transition complaint status from ${complaint.status} to ${status}.`);
  }

  const updated = await db.complaint.update({
    where: { id },
    data: {
      status,
      adminResponse: adminResponse?.trim() || complaint.adminResponse,
    },
  });

  await createNotification(
    complaint.citizenId,
    'Complaint Update',
    `Your complaint regarding "${complaint.category}" has been updated to ${status}.${adminResponse ? ` Admin Response: ${adminResponse}` : ''}`,
    status === ComplaintStatus.RESOLVED ? 'SUCCESS' : 'INFO'
  );

  return updated;
}
