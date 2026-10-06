'use server';

import { db } from '@/lib/db';
import { Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { requireRole, requireUser } from '@/lib/session';
import { auth } from '@/lib/auth';

export async function getRewardsLeaderboard() {
  try {
    await requireUser();

    const topCitizens = await db.user.findMany({
      where: { role: Role.CITIZEN },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        ecoPoints: true,
        _count: {
          select: { reports: true },
        },
      },
      orderBy: { ecoPoints: 'desc' },
      take: 10,
    });

    return { success: true, leaderboard: topCitizens };
  } catch (error: any) {
    return { success: false, error: error.message || 'Unauthorized', leaderboard: [] };
  }
}

export async function getUserTransactions(targetUserId?: string) {
  try {
    const user = await requireUser();
    let userId = user.id;

    // Only Admin can inspect another user's transactions
    if (targetUserId && targetUserId !== user.id) {
      await requireRole([Role.MUNICIPAL_ADMIN]);
      userId = targetUserId;
    }

    const [transactions, dbUser] = await Promise.all([
      db.rewardTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
      db.user.findUnique({
        where: { id: userId },
        select: { ecoPoints: true },
      }),
    ]);

    return { success: true, transactions, points: dbUser?.ecoPoints ?? 0 };
  } catch (error: any) {
    return { success: false, error: error.message || 'Unauthorized', transactions: [], points: 0 };
  }
}

export async function redeemEcoReward(rewardCost: number, rewardTitle: string) {
  const user = await requireRole([Role.CITIZEN]);

  try {
    const dbUser = await db.user.findUnique({ where: { id: user.id } });
    if (!dbUser) throw new Error('User not found');
    if (dbUser.ecoPoints < rewardCost) {
      throw new Error(`Insufficient Eco-Points. Required: ${rewardCost}, Available: ${dbUser.ecoPoints}`);
    }

    const [updatedUser, transaction] = await db.$transaction([
      db.user.update({
        where: { id: user.id },
        data: { ecoPoints: { decrement: rewardCost } },
      }),
      db.rewardTransaction.create({
        data: {
          userId: user.id,
          amount: -rewardCost,
          type: 'REDEEMED',
          description: `Redeemed: ${rewardTitle}`,
        },
      }),
    ]);

    revalidatePath('/citizen');

    try {
      await (auth as any)().update({ ecoPoints: updatedUser.ecoPoints });
    } catch (e) {
      console.error('Session points refresh failed:', e);
    }

    return { success: true, newPoints: updatedUser.ecoPoints, transaction };
  } catch (error: any) {
    console.error('Failed to redeem reward:', error);
    return { success: false, error: error.message || 'Failed to redeem reward' };
  }
}
