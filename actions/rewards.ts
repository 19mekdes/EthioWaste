'use server';

import { db } from '@/lib/db';
import { Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/session';
import { auth } from '@/lib/auth';

export async function getRewardsLeaderboard() {
  try {
    const topCitizens = await db.user.findMany({
      where: { role: 'CITIZEN' },
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
    return { success: false, error: error.message, leaderboard: [] };
  }
}

/** Returns the current user's own points balance + transaction history. */
export async function getUserTransactions() {
  const user = await requireRole([Role.CITIZEN]);

  try {
    // Read the fresh balance from the DB — the JWT can be stale after
    // admin validation or cleanup resolution credits points server-side.
    const [transactions, dbUser] = await Promise.all([
      db.rewardTransaction.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      }),
      db.user.findUnique({
        where: { id: user.id },
        select: { ecoPoints: true },
      }),
    ]);

    return { success: true, transactions, points: dbUser?.ecoPoints ?? user.ecoPoints };
  } catch (error: any) {
    return { success: false, error: error.message, transactions: [], points: user.ecoPoints };
  }
}

export async function redeemEcoReward(rewardCost: number, rewardTitle: string) {
  // Identity from the session — cannot redeem for another user
  const user = await requireRole([Role.CITIZEN]);

  try {
    const dbUser = await db.user.findUnique({ where: { id: user.id } });
    if (!dbUser) throw new Error('User not found');
    if (dbUser.ecoPoints < rewardCost) {
      throw new Error(`Insufficient Eco-Points. Required: ${rewardCost}, Available: ${dbUser.ecoPoints}`);
    }

    // Atomic transaction: deduct points & record redemption
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

    // Refresh the session JWT so the header counter shows the fresh balance.
    // auth().update() exists at runtime in beta.25 but isn't on the exported type.
    try {
      await (auth as any)().update({ ecoPoints: updatedUser.ecoPoints });
    } catch (e) {
      console.error('Session points refresh failed:', e);
      // Non-critical — the dashboard re-reads points from the DB anyway
    }

    return { success: true, newPoints: updatedUser.ecoPoints, transaction };
  } catch (error: any) {
    console.error('Failed to redeem reward:', error);
    return { success: false, error: error.message };
  }
}
