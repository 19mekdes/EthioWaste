'use server';

import { db } from '@/lib/db';
import { WasteCategory, Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/session';

export async function getPickupSchedules(citizenId?: string) {
  try {
    const where = citizenId ? { citizenId } : {};
    const schedules = await db.pickupSchedule.findMany({
      where,
      include: {
        citizen: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { scheduledDate: 'asc' },
    });

    return { success: true, schedules };
  } catch (error: any) {
    console.error('Failed to fetch pickups:', error);
    return { success: false, error: error.message, schedules: [] };
  }
}

export async function createPickupSchedule(data: {
  wasteType: WasteCategory;
  address: string;
  latitude: number;
  longitude: number;
  scheduledDate: string;
  preferredTimeSlot: string;
  notes?: string;
}) {
  // Identity from session — citizens can only book for themselves
  const user = await requireRole([Role.CITIZEN]);

  try {
    const schedule = await db.pickupSchedule.create({
      data: {
        citizenId: user.id,
        wasteType: data.wasteType,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        scheduledDate: new Date(data.scheduledDate),
        preferredTimeSlot: data.preferredTimeSlot,
        notes: data.notes || '',
        status: 'SCHEDULED',
      },
    });

    revalidatePath('/citizen');
    revalidatePath('/citizen/pickup');

    return { success: true, schedule };
  } catch (error: any) {
    console.error('Failed to create pickup schedule:', error);
    return { success: false, error: error.message };
  }
}

export async function cancelPickupSchedule(id: string) {
  const user = await requireRole([Role.CITIZEN]);

  try {
    const existing = await db.pickupSchedule.findUnique({ where: { id } });
    if (!existing) throw new Error('Schedule not found');
    if (existing.citizenId !== user.id) throw new Error('You can only cancel your own pickups');

    const updated = await db.pickupSchedule.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    revalidatePath('/citizen');

    return { success: true, schedule: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
