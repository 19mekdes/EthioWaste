import { db } from '../db.js';
import { Role } from '@prisma/client';
import { UserPayload } from '../types/index.js';

export async function getRewardsLeaderboard() {
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

  return topCitizens;
}

export async function getUserTransactions(user: UserPayload, targetUserId?: string) {
  let userId = user.id;

  if (targetUserId && targetUserId !== user.id) {
    if (user.role !== Role.MUNICIPAL_ADMIN) {
      throw new Error('Unauthorized to view another user transactions');
    }
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

  return { transactions, ecoPoints: dbUser?.ecoPoints ?? 0 };
}

export async function redeemEcoReward(user: UserPayload, rewardCost: number, rewardTitle: string) {
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

  return { newPoints: updatedUser.ecoPoints, transaction };
}
