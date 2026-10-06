'use server';

import { db } from '@/lib/db';
import { CollectionTaskStatus, CollectionRequestStatus, ReportStatus, Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { requireRole, requireUser } from '@/lib/session';
import { createUserNotification } from '@/actions/notifications';
import { isValidTaskTransition } from '@/lib/status-transitions';

// ==========================================
// 1. COLLECTOR DASHBOARD STATS
// ==========================================

export async function getCollectorDashboardStats() {
  const user = await requireRole([Role.COLLECTOR]);
  const collectorId = user.id;

  try {
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
      success: true,
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
  } catch (error: any) {
    console.error('Failed to load collector dashboard stats:', error);
    return {
      success: false,
      error: error.message || 'Failed to load stats',
      stats: {
        totalTasks: 0,
        pendingTasks: 0,
        activeTasks: 0,
        collectedTasks: 0,
        completedTasks: 0,
        cancelledTasks: 0,
        completionRate: 0,
      },
      todayTasks: [],
    };
  }
}

// ==========================================
// 2. MY TASKS LIST & DETAIL
// ==========================================

export async function getCollectorTasks(options?: {
  status?: CollectionTaskStatus;
  searchQuery?: string;
}) {
  const user = await requireRole([Role.COLLECTOR]);

  try {
    const where: any = { collectorId: user.id }; // Strictly scope to session collector
    if (options?.status) where.status = options.status;

    if (options?.searchQuery?.trim()) {
      const q = options.searchQuery.trim().toLowerCase();
      where.OR = [
        { address: { contains: q } },
        { id: { contains: q } },
        { notes: { contains: q } },
      ];
    }

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

    return { success: true, tasks };
  } catch (error: any) {
    console.error('Failed to fetch collector tasks:', error);
    return { success: false, error: error.message || 'Unauthorized', tasks: [] };
  }
}

export async function getCollectorTaskById(id: string) {
  const user = await requireRole([Role.COLLECTOR]);

  try {
    const task = await db.collectionTask.findUnique({
      where: { id },
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

    if (!task) return { success: false, error: 'Task not found', task: null };

    // MANDATORY Security Check: Task MUST belong to current authenticated collector
    if (task.collectorId !== user.id) {
      return { success: false, error: 'Task not found', task: null }; // Secure 404 response
    }

    return { success: true, task };
  } catch (error: any) {
    console.error('Failed to fetch collector task details:', error);
    return { success: false, error: error.message || 'Error fetching task detail', task: null };
  }
}

// ==========================================
// 3. TASK EXECUTION WORKFLOW ACTIONS
// ==========================================

export async function startCollectionTask(taskId: string) {
  const user = await requireRole([Role.COLLECTOR]);

  try {
    const task = await db.collectionTask.findUnique({
      where: { id: taskId },
      include: {
        request: { select: { id: true, citizenId: true } },
        report: { select: { id: true, reporterId: true } },
      },
    });

    if (!task || task.collectorId !== user.id) {
      return { success: false, error: 'Task not found or unauthorized.' };
    }

    if (!isValidTaskTransition(task.status, CollectionTaskStatus.IN_PROGRESS) || task.status !== CollectionTaskStatus.ASSIGNED) {
      return {
        success: false,
        error: `Cannot start task from status ${task.status}. Task must be in ASSIGNED status.`,
      };
    }

    const updatedTask = await db.$transaction(async (tx) => {
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

    revalidatePath('/dashboard/collector');
    revalidatePath('/dashboard/collector/tasks');
    revalidatePath(`/dashboard/collector/tasks/${taskId}`);
    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard/citizen');

    return { success: true, task: updatedTask };
  } catch (error: any) {
    console.error('Failed to start collection task:', error);
    return { success: false, error: error.message || 'Failed to start collection.' };
  }
}

export async function markCollectionAsCollected(
  taskId: string,
  proofImageUrl?: string,
  notes?: string
) {
  const user = await requireRole([Role.COLLECTOR]);

  try {
    const task = await db.collectionTask.findUnique({
      where: { id: taskId },
      include: {
        request: { select: { id: true, citizenId: true } },
        report: { select: { id: true, reporterId: true } },
      },
    });

    if (!task || task.collectorId !== user.id) {
      return { success: false, error: 'Task not found or unauthorized.' };
    }

    if (!isValidTaskTransition(task.status, CollectionTaskStatus.COLLECTED) || task.status !== CollectionTaskStatus.IN_PROGRESS) {
      return {
        success: false,
        error: `Cannot mark as collected from status ${task.status}. Task must be IN_PROGRESS.`,
      };
    }

    const finalProofUrl = proofImageUrl || task.proofImageUrl;
    if (!finalProofUrl) {
      return {
        success: false,
        error: 'Collection proof photo is required to mark waste as collected.',
      };
    }

    const updatedTask = await db.$transaction(async (tx) => {
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

    revalidatePath('/dashboard/collector');
    revalidatePath('/dashboard/collector/tasks');
    revalidatePath(`/dashboard/collector/tasks/${taskId}`);
    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard/citizen');

    return { success: true, task: updatedTask };
  } catch (error: any) {
    console.error('Failed to mark collection as collected:', error);
    return { success: false, error: error.message || 'Failed to update task.' };
  }
}

export async function completeCollectionTask(
  taskId: string,
  proofImageUrl?: string,
  notes?: string
) {
  const user = await requireRole([Role.COLLECTOR]);

  try {
    const task = await db.collectionTask.findUnique({
      where: { id: taskId },
      include: {
        request: { select: { id: true, citizenId: true, wasteType: true } },
        report: { select: { id: true, reporterId: true, title: true } },
      },
    });

    if (!task || task.collectorId !== user.id) {
      return { success: false, error: 'Task not found or unauthorized.' };
    }

    if (!isValidTaskTransition(task.status, CollectionTaskStatus.COMPLETED) || task.status !== CollectionTaskStatus.COLLECTED) {
      return {
        success: false,
        error: `Cannot complete task from status ${task.status}. Task must be in COLLECTED status.`,
      };
    }

    const finalProofUrl = proofImageUrl || task.proofImageUrl;
    if (!finalProofUrl) {
      return {
        success: false,
        error: 'Collection proof photo is required to complete the task.',
      };
    }

    const updatedTask = await db.$transaction(async (tx) => {
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

    revalidatePath('/dashboard/collector');
    revalidatePath('/dashboard/collector/tasks');
    revalidatePath('/dashboard/collector/history');
    revalidatePath(`/dashboard/collector/tasks/${taskId}`);
    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard/citizen');

    return { success: true, task: updatedTask };
  } catch (error: any) {
    console.error('Failed to complete collection task:', error);
    return { success: false, error: error.message || 'Failed to complete task.' };
  }
}

// ==========================================
// 4. TASK HISTORY & PROFILE
// ==========================================

export async function getCollectorTaskHistory() {
  const user = await requireRole([Role.COLLECTOR]);

  try {
    const tasks = await db.collectionTask.findMany({
      where: {
        collectorId: user.id, // Strictly scoped to session collector
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

    return { success: true, tasks };
  } catch (error: any) {
    console.error('Failed to fetch collector task history:', error);
    return { success: false, error: error.message || 'Unauthorized', tasks: [] };
  }
}

export async function getCollectorProfileData() {
  const user = await requireRole([Role.COLLECTOR]);

  try {
    const collector = await db.user.findUnique({
      where: { id: user.id },
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

    const [activeCount, completedCount] = await Promise.all([
      db.collectionTask.count({
        where: { collectorId: user.id, status: { in: ['ASSIGNED', 'IN_PROGRESS', 'COLLECTED'] } },
      }),
      db.collectionTask.count({
        where: { collectorId: user.id, status: 'COMPLETED' },
      }),
    ]);

    return {
      success: true,
      collector: {
        ...collector,
        activeTasks: activeCount,
        completedTasks: completedCount,
        totalAssigned: collector?._count.assignedTasks || 0,
      },
    };
  } catch (error: any) {
    console.error('Failed to fetch collector profile:', error);
    return { success: false, error: error.message || 'Unauthorized', collector: null };
  }
}
