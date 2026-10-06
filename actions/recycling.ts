'use server';

import { db } from '@/lib/db';
import { RecyclingStatus, Role, WasteCategory, CollectionTaskStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/session';
import { createUserNotification } from '@/actions/notifications';
import { isValidRecyclingTransition } from '@/lib/status-transitions';

// ==========================================
// HELPER: GET AUTHENTICATED ORG
// ==========================================

export async function getRecyclingOrgSession() {
  const user = await requireRole([Role.RECYCLING_ORGANIZATION]);

  let org = await db.recyclingOrganization.findUnique({
    where: { userId: user.id },
  });

  // Auto-provision an organization profile for the user if not existing
  if (!org) {
    const uAny = user as any;
    org = await db.recyclingOrganization.create({
      data: {
        userId: user.id,
        name: user.name ? `${user.name} Recycling Facility` : 'EcoRecycle Facility',
        address: uAny.address || 'Industrial Zone, Addis Ababa',
        acceptedMaterials: 'PLASTIC, PAPER, METAL, GLASS, CARDBOARD, ORGANIC, ELECTRONIC',
        contactEmail: user.email || '',
        contactPhone: uAny.phone || '+251 911 000 000',
        latitude: 9.01,
        longitude: 38.76,
      },
    });
  }

  return { user, org };
}

// ==========================================
// 1. DASHBOARD STATS
// ==========================================

export async function getRecyclingDashboardStats() {
  try {
    const { org } = await getRecyclingOrgSession();

    const [
      pendingCount,
      acceptedCount,
      processingCount,
      recycledCount,
      totalQuantityAgg,
      recentRecords,
      availableTasksCount,
    ] = await Promise.all([
      db.recyclingRecord.count({ where: { organizationId: org.id, status: RecyclingStatus.PENDING } }),
      db.recyclingRecord.count({ where: { organizationId: org.id, status: RecyclingStatus.ACCEPTED } }),
      db.recyclingRecord.count({ where: { organizationId: org.id, status: RecyclingStatus.PROCESSING } }),
      db.recyclingRecord.count({ where: { organizationId: org.id, status: RecyclingStatus.RECYCLED } }),
      db.recyclingRecord.aggregate({
        where: { organizationId: org.id, status: RecyclingStatus.RECYCLED },
        _sum: { quantity: true },
      }),
      db.recyclingRecord.findMany({
        where: { organizationId: org.id },
        include: {
          collectionTask: {
            include: {
              request: { select: { citizen: { select: { name: true } } } },
              report: { select: { reporter: { select: { name: true } } } },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 5,
      }),
      db.collectionTask.count({
        where: {
          status: { in: [CollectionTaskStatus.COLLECTED, CollectionTaskStatus.COMPLETED] },
          recyclingRecordId: null,
        },
      }),
    ]);

    const totalRecycledQuantity = totalQuantityAgg._sum.quantity || 0;
    const totalHandled = pendingCount + acceptedCount + processingCount + recycledCount;
    const recyclingSuccessRate = totalHandled > 0 ? Math.round((recycledCount / totalHandled) * 100) : 0;

    return {
      success: true,
      stats: {
        pendingCount,
        acceptedCount,
        processingCount,
        recycledCount,
        totalRecycledQuantity,
        recyclingSuccessRate,
        availableTasksCount,
      },
      recentRecords,
      org,
    };
  } catch (error: any) {
    console.error('Failed to load recycling dashboard stats:', error);
    return {
      success: false,
      error: error.message || 'Failed to load dashboard stats',
      stats: {
        pendingCount: 0,
        acceptedCount: 0,
        processingCount: 0,
        recycledCount: 0,
        totalRecycledQuantity: 0,
        recyclingSuccessRate: 0,
        availableTasksCount: 0,
      },
      recentRecords: [],
      org: null,
    };
  }
}

// ==========================================
// 2. AVAILABLE MATERIALS & RECORD LISTING
// ==========================================

export async function getAvailableRecyclableMaterials() {
  try {
    const { org } = await getRecyclingOrgSession();

    const acceptedList = org.acceptedMaterials
      .split(',')
      .map((s) => s.trim().toUpperCase());

    // Fetch completed/collected tasks that do not yet have a recycling record
    const allTasks = await db.collectionTask.findMany({
      where: {
        status: { in: [CollectionTaskStatus.COLLECTED, CollectionTaskStatus.COMPLETED] },
        recyclingRecordId: null,
      },
      include: {
        request: {
          include: {
            citizen: { select: { name: true, phone: true, email: true } },
          },
        },
        report: {
          include: {
            reporter: { select: { name: true, phone: true, email: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // BUSINESS AUTHORIZATION RULE: Filter tasks to match facility's authorized materials
    const availableTasks = allTasks.filter((t) => {
      const cat = (t.request?.wasteType || t.report?.category || WasteCategory.MIXED).toUpperCase();
      return acceptedList.includes(cat);
    });

    return { success: true, tasks: availableTasks };
  } catch (error: any) {
    console.error('Failed to fetch available recyclable materials:', error);
    return { success: false, error: error.message || 'Unauthorized', tasks: [] };
  }
}

export async function getRecyclingRecords(options?: {
  status?: RecyclingStatus;
  searchQuery?: string;
}) {
  try {
    const { org } = await getRecyclingOrgSession();

    const where: any = { organizationId: org.id };
    if (options?.status) where.status = options.status;

    if (options?.searchQuery?.trim()) {
      const q = options.searchQuery.trim().toLowerCase();
      where.OR = [
        { notes: { contains: q } },
        { id: { contains: q } },
        { unit: { contains: q } },
      ];
    }

    const records = await db.recyclingRecord.findMany({
      where,
      include: {
        collectionTask: {
          include: {
            request: {
              include: { citizen: { select: { id: true, name: true, phone: true, email: true } } },
            },
            report: {
              include: { reporter: { select: { id: true, name: true, phone: true, email: true } } },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return { success: true, records };
  } catch (error: any) {
    console.error('Failed to fetch recycling records:', error);
    return { success: false, error: error.message || 'Unauthorized', records: [] };
  }
}

export async function getRecyclingRecordById(id: string) {
  try {
    const { org } = await getRecyclingOrgSession();

    const record = await db.recyclingRecord.findUnique({
      where: { id },
      include: {
        organization: true,
        collectionTask: {
          include: {
            request: {
              include: { citizen: { select: { id: true, name: true, phone: true, email: true } } },
            },
            report: {
              include: { reporter: { select: { id: true, name: true, phone: true, email: true } } },
            },
          },
        },
      },
    });

    if (!record) return { success: false, error: 'Record not found', record: null };

    // MANDATORY Security check: Record must belong to authenticated organization
    if (record.organizationId !== org.id) {
      return { success: false, error: 'Record not found', record: null }; // Secure 404
    }

    return { success: true, record };
  } catch (error: any) {
    console.error('Failed to fetch recycling record detail:', error);
    return { success: false, error: error.message || 'Error fetching record detail', record: null };
  }
}

// ==========================================
// 3. RECYCLING WORKFLOW ACTIONS
// ==========================================

export async function receiveAndCreateRecyclingRecord(taskId: string, estimatedQuantity?: number) {
  try {
    const { org } = await getRecyclingOrgSession();

    const task = await db.collectionTask.findUnique({
      where: { id: taskId },
      include: {
        request: true,
        report: true,
      },
    });

    if (!task) return { success: false, error: 'Collection task not found.' };

    if (task.recyclingRecordId) {
      return { success: false, error: 'Task has already been received into a recycling record.' };
    }

    const wasteCategory = task.request?.wasteType || task.report?.category || WasteCategory.MIXED;
    const acceptedList = org.acceptedMaterials
      .split(',')
      .map((s) => s.trim().toUpperCase());

    // SERVER AUTHORIZATION CHECK: Verify facility is authorized for this material category
    if (!acceptedList.includes(wasteCategory.toUpperCase())) {
      return {
        success: false,
        error: `Facility ${org.name} is not authorized to accept ${wasteCategory} waste. Authorized materials: ${org.acceptedMaterials}`,
      };
    }

    const initialQty = estimatedQuantity && estimatedQuantity > 0 ? estimatedQuantity : 25.0;

    const newRecord = await db.$transaction(async (tx) => {
      const record = await tx.recyclingRecord.create({
        data: {
          organizationId: org.id,
          material: wasteCategory,
          quantity: initialQty,
          unit: 'kg',
          status: RecyclingStatus.PENDING,
          notes: `Material received from collection task #${task.id.slice(-8)} at ${task.address}`,
        },
      });

      await tx.collectionTask.update({
        where: { id: taskId },
        data: { recyclingRecordId: record.id },
      });

      // Notify citizen
      const citizenId = task.request?.citizenId || task.report?.reporterId;
      if (citizenId) {
        await tx.notification.create({
          data: {
            userId: citizenId,
            title: 'Material Sent to Recycling',
            message: `Your collected ${wasteCategory} waste has arrived at ${org.name} for recycling processing.`,
            type: 'INFO',
          },
        });
      }

      return record;
    });

    revalidatePath('/dashboard/recycling');
    revalidatePath('/dashboard/recycling/materials');
    revalidatePath('/dashboard/recycling/records');

    return { success: true, record: newRecord };
  } catch (error: any) {
    console.error('Failed to receive and create recycling record:', error);
    return { success: false, error: error.message || 'Failed to process material receipt.' };
  }
}

export async function acceptRecyclingRecord(recordId: string) {
  try {
    const { org } = await getRecyclingOrgSession();

    const record = await db.recyclingRecord.findUnique({
      where: { id: recordId },
      include: {
        collectionTask: {
          include: { request: true, report: true },
        },
      },
    });

    if (!record || record.organizationId !== org.id) {
      return { success: false, error: 'Record not found or unauthorized.' };
    }

    if (!isValidRecyclingTransition(record.status, RecyclingStatus.ACCEPTED) || record.status !== RecyclingStatus.PENDING) {
      return {
        success: false,
        error: `Cannot accept material from status ${record.status}. Current status must be PENDING.`,
      };
    }

    const updatedRecord = await db.$transaction(async (tx) => {
      const updated = await tx.recyclingRecord.update({
        where: { id: recordId },
        data: {
          status: RecyclingStatus.ACCEPTED,
        },
      });

      const citizenId = record.collectionTask?.request?.citizenId || record.collectionTask?.report?.reporterId;
      if (citizenId) {
        await tx.notification.create({
          data: {
            userId: citizenId,
            title: 'Recycling Material Accepted',
            message: `Your waste material (${record.material}) has been formally ACCEPTED into inventory at ${org.name}.`,
            type: 'SUCCESS',
          },
        });
      }

      return updated;
    });

    revalidatePath('/dashboard/recycling');
    revalidatePath('/dashboard/recycling/records');
    revalidatePath(`/dashboard/recycling/records/${recordId}`);
    revalidatePath('/dashboard/admin');

    return { success: true, record: updatedRecord };
  } catch (error: any) {
    console.error('Failed to accept recycling record:', error);
    return { success: false, error: error.message || 'Failed to accept record.' };
  }
}

export async function startRecyclingProcess(recordId: string) {
  try {
    const { org } = await getRecyclingOrgSession();

    const record = await db.recyclingRecord.findUnique({
      where: { id: recordId },
      include: {
        collectionTask: {
          include: { request: true, report: true },
        },
      },
    });

    if (!record || record.organizationId !== org.id) {
      return { success: false, error: 'Record not found or unauthorized.' };
    }

    if (!isValidRecyclingTransition(record.status, RecyclingStatus.PROCESSING) || record.status !== RecyclingStatus.ACCEPTED) {
      return {
        success: false,
        error: `Cannot start processing from status ${record.status}. Current status must be ACCEPTED.`,
      };
    }

    const updatedRecord = await db.$transaction(async (tx) => {
      const updated = await tx.recyclingRecord.update({
        where: { id: recordId },
        data: {
          status: RecyclingStatus.PROCESSING,
          processedAt: new Date(),
        },
      });

      const citizenId = record.collectionTask?.request?.citizenId || record.collectionTask?.report?.reporterId;
      if (citizenId) {
        await tx.notification.create({
          data: {
            userId: citizenId,
            title: 'Recycling Processing Started',
            message: `Processing of your ${record.material} waste material has officially started in the recycling plant.`,
            type: 'INFO',
          },
        });
      }

      return updated;
    });

    revalidatePath('/dashboard/recycling');
    revalidatePath('/dashboard/recycling/records');
    revalidatePath(`/dashboard/recycling/records/${recordId}`);
    revalidatePath('/dashboard/admin');

    return { success: true, record: updatedRecord };
  } catch (error: any) {
    console.error('Failed to start recycling process:', error);
    return { success: false, error: error.message || 'Failed to start processing.' };
  }
}

export async function completeRecycling(
  recordId: string,
  recycledQuantity: number,
  notes?: string
) {
  try {
    const { org } = await getRecyclingOrgSession();

    const record = await db.recyclingRecord.findUnique({
      where: { id: recordId },
      include: {
        collectionTask: {
          include: { request: true, report: true },
        },
      },
    });

    if (!record || record.organizationId !== org.id) {
      return { success: false, error: 'Record not found or unauthorized.' };
    }

    if (!isValidRecyclingTransition(record.status, RecyclingStatus.RECYCLED) || record.status !== RecyclingStatus.PROCESSING) {
      return {
        success: false,
        error: `Cannot complete recycling from status ${record.status}. Current status must be PROCESSING.`,
      };
    }

    if (!recycledQuantity || recycledQuantity <= 0) {
      return { success: false, error: 'Recycled quantity must be greater than 0.' };
    }

    if (recycledQuantity > record.quantity) {
      return {
        success: false,
        error: `Recycled quantity (${recycledQuantity} ${record.unit}) cannot exceed received batch quantity (${record.quantity} ${record.unit}).`,
      };
    }

    const updatedRecord = await db.$transaction(async (tx) => {
      const updated = await tx.recyclingRecord.update({
        where: { id: recordId },
        data: {
          status: RecyclingStatus.RECYCLED,
          quantity: recycledQuantity,
          notes: notes?.trim() ? notes.trim() : record.notes,
        },
      });

      const citizenId = record.collectionTask?.request?.citizenId || record.collectionTask?.report?.reporterId;
      if (citizenId) {
        await tx.notification.create({
          data: {
            userId: citizenId,
            title: 'Recycling Completed! ♻️',
            message: `Great news! Your ${record.material} waste material (${recycledQuantity} ${record.unit}) has been successfully RECYCLED into reusable raw resources!`,
            type: 'SUCCESS',
          },
        });
      }

      return updated;
    });

    revalidatePath('/dashboard/recycling');
    revalidatePath('/dashboard/recycling/records');
    revalidatePath('/dashboard/recycling/history');
    revalidatePath(`/dashboard/recycling/records/${recordId}`);
    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard/citizen');

    return { success: true, record: updatedRecord };
  } catch (error: any) {
    console.error('Failed to complete recycling:', error);
    return { success: false, error: error.message || 'Failed to complete recycling.' };
  }
}

// ==========================================
// 4. HISTORY & PROFILE
// ==========================================

export async function getRecyclingHistory() {
  try {
    const { org } = await getRecyclingOrgSession();

    const records = await db.recyclingRecord.findMany({
      where: {
        organizationId: org.id,
        status: RecyclingStatus.RECYCLED,
      },
      include: {
        collectionTask: {
          include: {
            request: { include: { citizen: { select: { name: true, email: true } } } },
            report: { include: { reporter: { select: { name: true, email: true } } } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return { success: true, records };
  } catch (error: any) {
    console.error('Failed to fetch recycling history:', error);
    return { success: false, error: error.message || 'Unauthorized', records: [] };
  }
}

export async function getRecyclingOrgProfileData() {
  try {
    const { user, org } = await getRecyclingOrgSession();

    const [totalRecycledAgg, activeCount, completedCount] = await Promise.all([
      db.recyclingRecord.aggregate({
        where: { organizationId: org.id, status: RecyclingStatus.RECYCLED },
        _sum: { quantity: true },
      }),
      db.recyclingRecord.count({
        where: {
          organizationId: org.id,
          status: { in: [RecyclingStatus.PENDING, RecyclingStatus.ACCEPTED, RecyclingStatus.PROCESSING] },
        },
      }),
      db.recyclingRecord.count({
        where: { organizationId: org.id, status: RecyclingStatus.RECYCLED },
      }),
    ]);

    return {
      success: true,
      profile: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: (user as any).phone || null,
          role: user.role,
        },
        org,
        stats: {
          activeRecords: activeCount,
          completedRecords: completedCount,
          totalRecycledWeight: totalRecycledAgg._sum.quantity || 0,
        },
      },
    };
  } catch (error: any) {
    console.error('Failed to fetch recycling profile:', error);
    return { success: false, error: error.message || 'Unauthorized', profile: null };
  }
}
