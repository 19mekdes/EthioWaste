import { db } from '../db.js';
import { CollectionTaskStatus, CollectionRequestStatus, ReportStatus } from '@prisma/client';
import { isValidTaskTransition } from '../utils/statusTransitions.js';

export async function getCollectorDashboardStats(collectorId: string) {
  const [
    totalTasks,
    pendingTasks,
    activeTasks,
    collectedTasks,
    completedTasks,
    cancelledTasks,
    todayTasks,
  ] = await Promise.all([
    db.collectionTask.count({ where: { collectorId } }),
    db.collectionTask.count({ where: { collectorId, status: CollectionTaskStatus.ASSIGNED } }),
    db.collectionTask.count({ where: { collectorId, status: CollectionTaskStatus.IN_PROGRESS } }),
    db.collectionTask.count({ where: { collectorId, status: CollectionTaskStatus.COLLECTED } }),
    db.collectionTask.count({ where: { collectorId, status: CollectionTaskStatus.COMPLETED } }),
    db.collectionTask.count({ where: { collectorId, status: CollectionTaskStatus.CANCELLED } }),
    db.collectionTask.findMany({
      where: { collectorId },
      include: {
        request: {
          include: {
            citizen: { select: { id: true, name: true, phone: true, email: true } },
          },
        },
        report: {
          include: {
            reporter: { select: { id: true, name: true, phone: true, email: true } },
          },
        },
      },
      orderBy: { scheduledDate: 'asc' },
      take: 5,
    }),
  ]);

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    stats: {
      totalTasks,
      pendingTasks,
      activeTasks,
      collectedTasks,
      completedTasks,
      cancelledTasks,
      completionRate,
    },
    todayTasks,
  };
}

export async function getCollectorTasks(collectorId: string, options?: { status?: CollectionTaskStatus }) {
  const where: any = { collectorId };
  if (options?.status) where.status = options.status;

  const tasks = await db.collectionTask.findMany({
    where,
    include: {
      request: {
        include: {
          citizen: { select: { id: true, name: true, phone: true, email: true } },
        },
      },
      report: {
        include: {
          reporter: { select: { id: true, name: true, phone: true, email: true } },
        },
      },
    },
    orderBy: { scheduledDate: 'asc' },
  });

  return tasks;
}

export async function getCollectorTaskById(taskId: string, collectorId: string) {
  const task = await db.collectionTask.findUnique({
    where: { id: taskId },
    include: {
      request: {
        include: {
          citizen: { select: { id: true, name: true, phone: true, email: true } },
        },
      },
      report: {
        include: {
          reporter: { select: { id: true, name: true, phone: true, email: true } },
        },
      },
    },
  });

  if (!task || task.collectorId !== collectorId) {
    throw new Error('Task not found');
  }

  return task;
}

export async function startCollectionTask(taskId: string, collectorId: string) {
  const task = await db.collectionTask.findUnique({
    where: { id: taskId },
    include: {
      request: { select: { id: true, citizenId: true } },
      report: { select: { id: true, reporterId: true } },
    },
  });

  if (!task || task.collectorId !== collectorId) {
    throw new Error('Task not found or unauthorized.');
  }

  if (!isValidTaskTransition(task.status, CollectionTaskStatus.IN_PROGRESS) || task.status !== CollectionTaskStatus.ASSIGNED) {
    throw new Error(`Cannot start task from status ${task.status}. Task must be in ASSIGNED status.`);
  }

  const updatedTask = await db.$transaction(async (tx: any) => {
    const updated = await tx.collectionTask.update({
      where: { id: taskId },
      data: {
        status: CollectionTaskStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
    });

    if (task.requestId) {
      await tx.collectionRequest.update({
        where: { id: task.requestId },
        data: { status: CollectionRequestStatus.IN_PROGRESS },
      });

      if (task.request?.citizenId) {
        await tx.notification.create({
          data: {
            userId: task.request.citizenId,
            title: 'Collection Started',
            message: `Your waste collection team has started work on your pickup request at ${task.address}.`,
            type: 'INFO',
          },
        });
      }
    }

    if (task.reportId) {
      await tx.wasteReport.update({
        where: { id: task.reportId },
        data: { status: ReportStatus.IN_PROGRESS },
      });

      if (task.report?.reporterId) {
        await tx.notification.create({
          data: {
            userId: task.report.reporterId,
            title: 'Cleanup Started',
            message: `Field collectors have arrived and started cleanup for your waste report at ${task.address}.`,
            type: 'INFO',
          },
        });
      }
    }

    return updated;
  });

  return updatedTask;
}

export async function markCollectionAsCollected(
  taskId: string,
  collectorId: string,
  proofImageUrl?: string,
  notes?: string
) {
  const task = await db.collectionTask.findUnique({
    where: { id: taskId },
    include: {
      request: { select: { id: true, citizenId: true } },
      report: { select: { id: true, reporterId: true } },
    },
  });

  if (!task || task.collectorId !== collectorId) {
    throw new Error('Task not found or unauthorized.');
  }

  if (!isValidTaskTransition(task.status, CollectionTaskStatus.COLLECTED) || task.status !== CollectionTaskStatus.IN_PROGRESS) {
    throw new Error(`Cannot mark as collected from status ${task.status}. Task must be IN_PROGRESS.`);
  }

  const finalProofUrl = proofImageUrl || task.proofImageUrl;
  if (!finalProofUrl) {
    throw new Error('Collection proof photo is required to mark waste as collected.');
  }

  const updatedTask = await db.$transaction(async (tx: any) => {
    const updated = await tx.collectionTask.update({
      where: { id: taskId },
      data: {
        status: CollectionTaskStatus.COLLECTED,
        proofImageUrl: finalProofUrl,
        ...(notes?.trim() ? { notes: notes.trim() } : {}),
      },
    });

    if (task.requestId) {
      await tx.collectionRequest.update({
        where: { id: task.requestId },
        data: { status: CollectionRequestStatus.COLLECTED },
      });

      if (task.request?.citizenId) {
        await tx.notification.create({
          data: {
            userId: task.request.citizenId,
            title: 'Waste Collected',
            message: `Your waste has been physically collected from ${task.address}.`,
            type: 'SUCCESS',
          },
        });
      }
    }

    if (task.reportId) {
      await tx.wasteReport.update({
        where: { id: task.reportId },
        data: { status: ReportStatus.COLLECTED },
      });
    }

    return updated;
  });

  return updatedTask;
}

export async function completeCollectionTask(
  taskId: string,
  collectorId: string,
  proofImageUrl?: string,
  notes?: string
) {
  const task = await db.collectionTask.findUnique({
    where: { id: taskId },
    include: {
      request: { select: { id: true, citizenId: true, wasteType: true } },
      report: { select: { id: true, reporterId: true, title: true } },
    },
  });

  if (!task || task.collectorId !== collectorId) {
    throw new Error('Task not found or unauthorized.');
  }

  if (!isValidTaskTransition(task.status, CollectionTaskStatus.COMPLETED) || task.status !== CollectionTaskStatus.COLLECTED) {
    throw new Error(`Cannot complete task from status ${task.status}. Task must be in COLLECTED status.`);
  }

  const finalProofUrl = proofImageUrl || task.proofImageUrl;
  if (!finalProofUrl) {
    throw new Error('Collection proof photo is required to complete the task.');
  }

  const updatedTask = await db.$transaction(async (tx: any) => {
    const updated = await tx.collectionTask.update({
      where: { id: taskId },
      data: {
        status: CollectionTaskStatus.COMPLETED,
        completedAt: new Date(),
        proofImageUrl: finalProofUrl,
        ...(notes?.trim() ? { notes: notes.trim() } : {}),
      },
    });

    if (task.requestId) {
      await tx.collectionRequest.update({
        where: { id: task.requestId },
        data: { status: CollectionRequestStatus.COMPLETED },
      });

      if (task.request?.citizenId) {
        await tx.notification.create({
          data: {
            userId: task.request.citizenId,
            title: 'Collection Completed!',
            message: `Your waste collection request for ${task.request.wasteType} at ${task.address} has been completed. You may now leave feedback!`,
            type: 'SUCCESS',
          },
        });
      }
    }

    if (task.reportId) {
      await tx.wasteReport.update({
        where: { id: task.reportId },
        data: {
          status: ReportStatus.COMPLETED,
          resolvedAt: new Date(),
          cleanupImageUrl: finalProofUrl,
        },
      });

      if (task.report?.reporterId) {
        await tx.notification.create({
          data: {
            userId: task.report.reporterId,
            title: 'Waste Issue Resolved!',
            message: `Your report "${task.report.title}" has been cleaned up and completed.`,
            type: 'SUCCESS',
          },
        });
      }
    }

    return updated;
  });

  return updatedTask;
}

export async function getCollectorTaskHistory(collectorId: string) {
  const tasks = await db.collectionTask.findMany({
    where: {
      collectorId,
      status: CollectionTaskStatus.COMPLETED,
    },
    include: {
      request: {
        include: {
          citizen: { select: { id: true, name: true, email: true } },
        },
      },
      report: {
        include: {
          reporter: { select: { id: true, name: true, email: true } },
        },
      },
    },
    orderBy: { completedAt: 'desc' },
  });

  return tasks;
}

export async function getCollectorProfile(collectorId: string) {
  const collector = await db.user.findUnique({
    where: { id: collectorId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      avatarUrl: true,
      address: true,
      createdAt: true,
      _count: {
        select: {
          assignedTasks: true,
        },
      },
    },
  });

  return collector;
}

export async function updateCollectorProfile(collectorId: string, data: { name?: string; phone?: string; address?: string }) {
  const updated = await db.user.update({
    where: { id: collectorId },
    data: {
      ...(data.name ? { name: data.name.trim() } : {}),
      ...(data.phone ? { phone: data.phone.trim() } : {}),
      ...(data.address ? { address: data.address.trim() } : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      avatarUrl: true,
      address: true,
    },
  });

  return updated;
}
