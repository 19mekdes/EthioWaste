'use server';

import { db } from '@/lib/db';

export async function getRecyclingCenters() {
  try {
    const centers = await db.recyclingCenter.findMany({
      orderBy: { name: 'asc' },
    });
    return { success: true, centers };
  } catch (error: any) {
    console.error('Failed to fetch recycling centers:', error);
    return { success: false, error: error.message, centers: [] };
  }
}
