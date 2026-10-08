import { db } from '../db.js';
import { RecyclingStatus, WasteCategory, CollectionTaskStatus } from '@prisma/client';
import { isValidRecyclingTransition } from '../utils/statusTransitions.js';
import { UserPayload } from '../types/index.js';

export async function getOrCreateRecyclingOrg(userId: string, userName?: string, userEmail?: string) {
  let org = await db.recyclingOrganization.findUnique({
    where: { userId },
  });

  if (!org) {
    org = await db.recyclingOrganization.create({
      data: {
        userId,
        name: userName ? `${userName} Recycling Facility` : 'EcoRecycle Facility',
        address: 'Industrial Zone, Addis Ababa',
        acceptedMaterials: 'PLASTIC, PAPER, METAL, GLASS, CARDBOARD, ORGANIC, ELECTRONIC',
        contactEmail: userEmail || '',
        contactPhone: '+251 911 000 000',
        latitude: 8.9806,
        longitude: 38.7578,
      },
    });
  }

  return org;
}

export async function getRecyclingDashboardStats(user: UserPayload) {
  const org = await getOrCreateRecyclingOrg(user.id, user.name, user.email);

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
}

export async function getAvailableRecyclableMaterials(user: UserPayload) {
  const org = await getOrCreateRecyclingOrg(user.id, user.name, user.email);

  const acceptedList = org.acceptedMaterials
    .split(',')
    .map((s: string) => s.trim().toUpperCase());

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

  const availableTasks = allTasks.filter((t: any) => {
    const cat = (t.request?.wasteType || t.report?.category || WasteCategory.MIXED).toUpperCase();
    return acceptedList.includes(cat);
  });

  return availableTasks;
}

export async function getRecyclingRecords(user: UserPayload, options?: { status?: RecyclingStatus; searchQuery?: string }) {
  const org = await getOrCreateRecyclingOrg(user.id, user.name, user.email);

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

  return records;
}

export async function getRecyclingRecordById(id: string, user: UserPayload) {
  const org = await getOrCreateRecyclingOrg(user.id, user.name, user.email);

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

  if (!record || record.organizationId !== org.id) {
    throw new Error('Record not found');
  }

  return record;
}

export async function receiveAndCreateRecyclingRecord(user: UserPayload, taskId: string, estimatedQuantity?: number) {
  const org = await getOrCreateRecyclingOrg(user.id, user.name, user.email);

  const task = await db.collectionTask.findUnique({
    where: { id: taskId },
    include: {
      request: true,
      report: true,
    },
  });

  if (!task) throw new Error('Collection task not found.');

  if (task.recyclingRecordId) {
    throw new Error('Task has already been received into a recycling record.');
  }

  const wasteCategory = task.request?.wasteType || task.report?.category || WasteCategory.MIXED;
  const acceptedList = org.acceptedMaterials
    .split(',')
    .map((s: string) => s.trim().toUpperCase());

  if (!acceptedList.includes(wasteCategory.toUpperCase())) {
    throw new Error(`Facility ${org.name} is not authorized to accept ${wasteCategory} waste. Authorized materials: ${org.acceptedMaterials}`);
  }

  const initialQty = estimatedQuantity && estimatedQuantity > 0 ? estimatedQuantity : 25.0;

  const newRecord = await db.$transaction(async (tx: any) => {
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

  return newRecord;
}

export async function acceptRecyclingRecord(user: UserPayload, recordId: string) {
  const org = await getOrCreateRecyclingOrg(user.id, user.name, user.email);

  const record = await db.recyclingRecord.findUnique({
    where: { id: recordId },
    include: {
      collectionTask: {
        include: { request: true, report: true },
      },
    },
  });

  if (!record || record.organizationId !== org.id) {
    throw new Error('Record not found or unauthorized.');
  }

  if (!isValidRecyclingTransition(record.status, RecyclingStatus.ACCEPTED) || record.status !== RecyclingStatus.PENDING) {
    throw new Error(`Cannot accept material from status ${record.status}. Current status must be PENDING.`);
  }

  const updatedRecord = await db.$transaction(async (tx: any) => {
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

  return updatedRecord;
}

export async function startRecyclingProcess(user: UserPayload, recordId: string) {
  const org = await getOrCreateRecyclingOrg(user.id, user.name, user.email);

  const record = await db.recyclingRecord.findUnique({
    where: { id: recordId },
    include: {
      collectionTask: {
        include: { request: true, report: true },
      },
    },
  });

  if (!record || record.organizationId !== org.id) {
    throw new Error('Record not found or unauthorized.');
  }

  if (!isValidRecyclingTransition(record.status, RecyclingStatus.PROCESSING) || record.status !== RecyclingStatus.ACCEPTED) {
    throw new Error(`Cannot start processing from status ${record.status}. Current status must be ACCEPTED.`);
  }

  const updatedRecord = await db.$transaction(async (tx: any) => {
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

  return updatedRecord;
}

export async function completeRecycling(
  user: UserPayload,
  recordId: string,
  recycledQuantity: number,
  notes?: string
) {
  const org = await getOrCreateRecyclingOrg(user.id, user.name, user.email);

  const record = await db.recyclingRecord.findUnique({
    where: { id: recordId },
    include: {
      collectionTask: {
        include: { request: true, report: true },
      },
    },
  });

  if (!record || record.organizationId !== org.id) {
    throw new Error('Record not found or unauthorized.');
  }

  if (!isValidRecyclingTransition(record.status, RecyclingStatus.RECYCLED) || record.status !== RecyclingStatus.PROCESSING) {
    throw new Error(`Cannot complete recycling from status ${record.status}. Current status must be PROCESSING.`);
  }

  if (!recycledQuantity || recycledQuantity <= 0) {
    throw new Error('Recycled quantity must be greater than 0.');
  }

  if (recycledQuantity > record.quantity) {
    throw new Error(`Recycled quantity (${recycledQuantity} ${record.unit}) cannot exceed received batch quantity (${record.quantity} ${record.unit}).`);
  }

  const updatedRecord = await db.$transaction(async (tx: any) => {
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

  return updatedRecord;
}

export async function getRecyclingHistory(user: UserPayload) {
  const org = await getOrCreateRecyclingOrg(user.id, user.name, user.email);

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

  return records;
}

export async function getRecyclingOrgProfileData(user: UserPayload) {
  const org = await getOrCreateRecyclingOrg(user.id, user.name, user.email);

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
    user,
    org,
    stats: {
      activeRecords: activeCount,
      completedRecords: completedCount,
      totalRecycledWeight: totalRecycledAgg._sum.quantity || 0,
    },
  };
}

export async function updateAcceptedMaterials(user: UserPayload, acceptedMaterials: string) {
  const org = await getOrCreateRecyclingOrg(user.id, user.name, user.email);

  const updated = await db.recyclingOrganization.update({
    where: { id: org.id },
    data: { acceptedMaterials: acceptedMaterials.trim() },
  });

  return updated;
}
