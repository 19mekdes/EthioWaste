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

export const AVAILABLE_REWARDS = [
  {
    id: 'reward-1',
    title: 'City Bus / Light Rail 5-Trip Transit Pass',
    description: 'Free public transportation pass for 5 rides in Addis Ababa.',
    pointsRequired: 100,
    category: 'TRANSIT',
  },
  {
    id: 'reward-2',
    title: 'Local Supermarket 100 ETB Eco Voucher',
    description: 'Discount coupon redeemable at participating supermarkets across Bole and Kazanchis.',
    pointsRequired: 150,
    category: 'GROCERY',
  },
  {
    id: 'reward-3',
    title: 'Home Waste Segregation Bin Set',
    description: 'Durable dual-compartment indoor bin for plastic and organic waste separation.',
    pointsRequired: 200,
    category: 'MERCHANDISE',
  },
  {
    id: 'reward-4',
    title: 'Ethio Telecom 2GB Green Internet Bundle',
    description: 'Complimentary 2GB data recharge voucher for active community stewards.',
    pointsRequired: 250,
    category: 'TELECOM',
  },
  {
    id: 'reward-5',
    title: 'Organic Fertilizer Compost Pack (10kg)',
    description: 'Locally processed organic compost from Addis Ababa recycling center for urban gardens.',
    pointsRequired: 300,
    category: 'GARDEN',
  },
];

export async function getUserPoints(user: UserPayload) {
  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    select: { ecoPoints: true },
  });
  return { points: dbUser?.ecoPoints ?? 0 };
}

export async function getAvailableRewards() {
  return AVAILABLE_REWARDS;
}

export async function getMyRedemptions(user: UserPayload) {
  const transactions = await db.rewardTransaction.findMany({
    where: {
      userId: user.id,
      type: 'REDEEMED',
    },
    orderBy: { createdAt: 'desc' },
  });

  return transactions.map((tx: any) => {
    const match = AVAILABLE_REWARDS.find((r) => tx.description.includes(r.title));
    return {
      id: tx.id,
      userId: tx.userId,
      rewardId: match?.id || 'reward-custom',
      reward: match || {
        id: 'reward-custom',
        title: tx.description.replace('Redeemed: ', ''),
        description: 'Eco-points redemption voucher',
        pointsRequired: Math.abs(tx.amount),
      },
      redemptionCode: `ECO-${tx.id.slice(-6).toUpperCase()}`,
      createdAt: tx.createdAt.toISOString(),
    };
  });
}

export async function redeemEcoReward(
  user: UserPayload,
  rewardCost?: number,
  rewardTitle?: string,
  rewardId?: string
) {
  const matched = AVAILABLE_REWARDS.find((r) => r.id === rewardId);
  const cost = Number(rewardCost || matched?.pointsRequired || 50);
  const title = rewardTitle || matched?.title || 'Eco Reward Voucher';

  const dbUser = await db.user.findUnique({ where: { id: user.id } });
  if (!dbUser) throw new Error('User not found');
  if (dbUser.ecoPoints < cost) {
    throw new Error(`Insufficient Eco-Points. Required: ${cost}, Available: ${dbUser.ecoPoints}`);
  }

  const [updatedUser, transaction] = await db.$transaction([
    db.user.update({
      where: { id: user.id },
      data: { ecoPoints: { decrement: cost } },
    }),
    db.rewardTransaction.create({
      data: {
        userId: user.id,
        amount: -cost,
        type: 'REDEEMED',
        description: `Redeemed: ${title}`,
      },
    }),
  ]);

  return {
    newPoints: updatedUser.ecoPoints,
    transaction,
    redemptionCode: `ECO-${transaction.id.slice(-6).toUpperCase()}`,
  };
}
