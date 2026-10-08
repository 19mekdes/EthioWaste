import { db } from '../db.js';
import { CollectionRequestStatus, Role } from '@prisma/client';
import { createNotification } from './notificationService.js';
import { UserPayload } from '../types/index.js';

export async function getFeedback(user: UserPayload) {
  const where: any = {};
  if (user.role === Role.CITIZEN) {
    where.citizenId = user.id;
  }

  const feedbackList = await db.feedback.findMany({
    where,
    include: {
      citizen: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return feedbackList;
}

export async function createFeedback(
  user: UserPayload,
  data: { collectionRequestId?: string; rating: number; comment: string }
) {
  if (!data.rating || data.rating < 1 || data.rating > 5) {
    throw new Error('Rating must be between 1 and 5 stars.');
  }
  if (!data.comment || !data.comment.trim()) {
    throw new Error('Feedback comment is required.');
  }

  if (data.collectionRequestId) {
    const request = await db.collectionRequest.findUnique({
      where: { id: data.collectionRequestId },
    });

    if (!request || request.citizenId !== user.id) {
      throw new Error('Collection request not found or access denied.');
    }

    if (request.status !== CollectionRequestStatus.COMPLETED && request.status !== CollectionRequestStatus.COLLECTED) {
      throw new Error('Feedback can only be submitted for completed or collected requests.');
    }

    const existing = await db.feedback.findFirst({
      where: {
        citizenId: user.id,
        collectionRequestId: data.collectionRequestId,
      },
    });

    if (existing) {
      throw new Error('You have already submitted feedback for this collection request.');
    }
  }

  const feedback = await db.feedback.create({
    data: {
      citizenId: user.id,
      collectionRequestId: data.collectionRequestId || null,
      rating: Math.round(data.rating),
      comment: data.comment.trim(),
    },
  });

  await createNotification(
    user.id,
    'Feedback Received',
    'Thank you for your feedback! Your review helps us continuously improve our waste management services.',
    'SUCCESS'
  );

  return feedback;
}
