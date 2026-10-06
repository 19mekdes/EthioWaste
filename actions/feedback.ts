'use server';

import { db } from '@/lib/db';
import { CollectionRequestStatus, Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { requireRole, requireUser } from '@/lib/session';
import { createUserNotification } from '@/actions/notifications';

export async function getFeedback() {
  try {
    const user = await requireUser();

    const where: any = {};
    if (user.role === Role.CITIZEN) {
      where.citizenId = user.id; // Strictly scope to authenticated citizen
    }

    const feedbackList = await db.feedback.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, feedback: feedbackList };
  } catch (error: any) {
    console.error('Failed to fetch feedback:', error);
    return { success: false, error: error.message || 'Unauthorized', feedback: [] };
  }
}

export async function createFeedback(data: {
  collectionRequestId?: string;
  rating: number;
  comment: string;
}) {
  const user = await requireRole([Role.CITIZEN]);

  try {
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      return { success: false, error: 'Rating must be between 1 and 5 stars.' };
    }
    if (!data.comment || !data.comment.trim()) {
      return { success: false, error: 'Feedback comment is required.' };
    }

    if (data.collectionRequestId) {
      // 1. Verify request exists & belongs to citizen
      const request = await db.collectionRequest.findUnique({
        where: { id: data.collectionRequestId },
      });

      if (!request || request.citizenId !== user.id) {
        return { success: false, error: 'Collection request not found or access denied.' };
      }

      // 2. Verify request is completed
      if (request.status !== CollectionRequestStatus.COMPLETED && request.status !== CollectionRequestStatus.COLLECTED) {
        return { success: false, error: 'Feedback can only be submitted for completed or collected requests.' };
      }

      // 3. Check for duplicate feedback
      const existing = await db.feedback.findFirst({
        where: {
          citizenId: user.id,
          collectionRequestId: data.collectionRequestId,
        },
      });

      if (existing) {
        return { success: false, error: 'You have already submitted feedback for this collection request.' };
      }
    }

    const feedback = await db.feedback.create({
      data: {
        citizenId: user.id, // Strictly derived from session
        collectionRequestId: data.collectionRequestId || null,
        rating: Math.round(data.rating),
        comment: data.comment.trim(),
      },
    });

    // Create Notification confirming feedback submission
    await createUserNotification(
      user.id,
      'Feedback Received',
      'Thank you for your feedback! Your review helps us continuously improve our waste management services.',
      'SUCCESS'
    );

    revalidatePath('/dashboard/citizen');
    revalidatePath('/dashboard/citizen/feedback');
    revalidatePath(`/dashboard/citizen/requests/${data.collectionRequestId}`);

    return { success: true, feedback };
  } catch (error: any) {
    console.error('Failed to create feedback:', error);
    return { success: false, error: error.message || 'Failed to submit feedback' };
  }
}
