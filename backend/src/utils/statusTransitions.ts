import {
  ReportStatus,
  CollectionRequestStatus,
  ComplaintStatus,
  CollectionTaskStatus,
  RecyclingStatus,
} from '@prisma/client';

const WASTE_REPORT_TRANSITIONS: Record<ReportStatus, ReportStatus[]> = {
  PENDING: ['VERIFIED', 'REJECTED'],
  VERIFIED: ['ASSIGNED', 'REJECTED'],
  ASSIGNED: ['IN_PROGRESS'],
  IN_PROGRESS: ['COLLECTED'],
  COLLECTED: ['COMPLETED'],
  COMPLETED: [],
  REJECTED: [],
};

const COLLECTION_REQUEST_TRANSITIONS: Record<CollectionRequestStatus, CollectionRequestStatus[]> = {
  PENDING: ['APPROVED', 'REJECTED'],
  APPROVED: ['ASSIGNED', 'REJECTED'],
  ASSIGNED: ['IN_PROGRESS'],
  IN_PROGRESS: ['COLLECTED'],
  COLLECTED: ['COMPLETED'],
  COMPLETED: [],
  REJECTED: [],
};

const COLLECTION_TASK_TRANSITIONS: Record<CollectionTaskStatus, CollectionTaskStatus[]> = {
  ASSIGNED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COLLECTED', 'CANCELLED'],
  COLLECTED: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};

const RECYCLING_TRANSITIONS: Record<RecyclingStatus, RecyclingStatus[]> = {
  PENDING: ['ACCEPTED'],
  ACCEPTED: ['PROCESSING'],
  PROCESSING: ['RECYCLED'],
  RECYCLED: [],
};

const COMPLAINT_TRANSITIONS: Record<ComplaintStatus, ComplaintStatus[]> = {
  OPEN: ['IN_REVIEW'],
  IN_REVIEW: ['RESOLVED', 'REJECTED'],
  RESOLVED: [],
  REJECTED: [],
};

export function isValidReportTransition(current: ReportStatus, next: ReportStatus): boolean {
  if (current === next) return true;
  return WASTE_REPORT_TRANSITIONS[current]?.includes(next) ?? false;
}

export function isValidRequestTransition(
  current: CollectionRequestStatus,
  next: CollectionRequestStatus
): boolean {
  if (current === next) return true;
  return COLLECTION_REQUEST_TRANSITIONS[current]?.includes(next) ?? false;
}

export function isValidTaskTransition(
  current: CollectionTaskStatus,
  next: CollectionTaskStatus
): boolean {
  if (current === next) return true;
  return COLLECTION_TASK_TRANSITIONS[current]?.includes(next) ?? false;
}

export function isValidRecyclingTransition(
  current: RecyclingStatus,
  next: RecyclingStatus
): boolean {
  if (current === next) return true;
  return RECYCLING_TRANSITIONS[current]?.includes(next) ?? false;
}

export function isValidComplaintTransition(current: ComplaintStatus, next: ComplaintStatus): boolean {
  if (current === next) return true;
  return COMPLAINT_TRANSITIONS[current]?.includes(next) ?? false;
}
