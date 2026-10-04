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


export async function getUserTransactions(targetUserId?: string) {
  let userId = targetUserId;
  let defaultPoints = 0;

  if (!userId) {
    try {
      const user = await requireRole([Role.CITIZEN]);
      userId = user.id;
      defaultPoints = user.ecoPoints;
    } catch {
      const dbCitizen = await db.user.findFirst({ where: { role: Role.CITIZEN } });
      userId = dbCitizen?.id || 'citizen-demo-1';
    }
  }

  try {
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

    return { success: true, transactions, points: dbUser?.ecoPoints ?? defaultPoints };
  } catch (error: any) {
    return { success: false, error: error.message, transactions: [], points: defaultPoints };
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
    return { success: false, error: error.message };
  }
}
