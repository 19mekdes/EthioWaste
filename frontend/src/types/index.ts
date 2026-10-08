export type Role = 'CITIZEN' | 'COLLECTOR' | 'RECYCLING_ORGANIZATION' | 'MUNICIPAL_ADMIN';

export type WasteCategory =
  | 'ORGANIC'
  | 'PLASTIC'
  | 'PAPER'
  | 'CARDBOARD'
  | 'GLASS'
  | 'METAL'
  | 'ELECTRONIC'
  | 'HAZARDOUS'
  | 'MIXED'
  | 'OTHER';

export type ReportStatus =
  | 'PENDING'
  | 'REPORTED'
  | 'VERIFIED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COLLECTED'
  | 'RESOLVED'
  | 'COMPLETED'
  | 'REJECTED';

export type ReportSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type CollectionRequestStatus =
  | 'PENDING'
  | 'SCHEDULED'
  | 'APPROVED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COLLECTED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED';

export type CollectionTaskStatus =
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COLLECTED'
  | 'COMPLETED'
  | 'CANCELLED';

export type RecyclingStatus = 'PENDING' | 'ACCEPTED' | 'PROCESSING' | 'RECYCLED';

export type ComplaintStatus = 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED';

export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'TASK' | 'SYSTEM';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  ecoPoints: number;
  avatarUrl?: string | null;
  phone?: string | null;
  address?: string | null;
  subCity?: string | null;
  vehicleNumber?: string | null;
  createdAt?: string;
}

export interface WasteReport {
  id: string;
  title?: string;
  description: string;
  category?: WasteCategory;
  wasteType?: string;
  severity?: ReportSeverity;
  imageUrl?: string;
  photos?: string[];
  cleanupImageUrl?: string | null;
  status: ReportStatus;
  latitude: number;
  longitude: number;
  address?: string;
  isIllegalDumping?: boolean;
  reporterId?: string;
  reporter?: Partial<User>;
  assignedCollectorId?: string | null;
  assignedToId?: string | null;
  assignedTo?: Partial<User> | null;
  pointsAwarded?: number;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CollectionRequest {
  id: string;
  citizenId?: string;
  citizen?: Partial<User>;
  wasteType: string;
  estimatedQuantity?: string;
  description?: string | null;
  notes?: string | null;
  photos?: string[];
  address: string;
  latitude: number;
  longitude: number;
  preferredDate: string;
  preferredTimeSlot?: string | null;
  preferredTime?: string | null;
  priority?: ReportSeverity;
  status: CollectionRequestStatus;
  assignedCollectorId?: string | null;
  assignedCollector?: Partial<User> | null;
  collectionTaskId?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CollectionTask {
  id: string;
  requestId?: string | null;
  request?: CollectionRequest | null;
  reportId?: string | null;
  report?: WasteReport | null;
  collectorId: string;
  collector?: Partial<User>;
  address: string;
  latitude: number;
  longitude: number;
  scheduledDate: string;
  status: CollectionTaskStatus;
  startedAt?: string | null;
  completedAt?: string | null;
  proofImageUrl?: string | null;
  notes?: string | null;
  recyclingRecordId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RecyclingOrganization {
  id: string;
  userId: string;
  user?: Partial<User>;
  name: string;
  description?: string | null;
  address: string;
  city?: string | null;
  latitude: number;
  longitude: number;
  contactPhone?: string | null;
  contactEmail?: string | null;
  acceptedMaterials: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecyclingRecord {
  id: string;
  organizationId?: string;
  organization?: RecyclingOrganization;
  collectionTask?: CollectionTask | null;
  material?: string;
  materialType?: string;
  quantity?: number;
  quantityKg?: number;
  unit?: string;
  source?: string;
  status?: RecyclingStatus;
  notes?: string | null;
  processedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface RecyclingCenter {
  id: string;
  name: string;
  description?: string | null;
  address: string;
  city?: string | null;
  latitude: number;
  longitude: number;
  acceptedMaterials?: string;
  acceptedTypes?: string;
  contactPhone?: string | null;
  phone?: string | null;
  operatingHours?: string | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export type AppNotification = NotificationItem;

export interface FeedbackItem {
  id: string;
  citizenId?: string;
  user?: Partial<User>;
  citizen?: Partial<User>;
  collectionRequestId?: string | null;
  rating: number;
  comment: string;
  createdAt: string;
}

export type Feedback = FeedbackItem;

export interface ComplaintItem {
  id: string;
  citizenId?: string;
  citizen?: Partial<User>;
  subject?: string;
  category: string;
  description: string;
  relatedRequestId?: string | null;
  status: ComplaintStatus;
  adminResponse?: string | null;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export type Complaint = ComplaintItem;

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  category?: string;
  createdAt?: string;
}

export interface UserReward {
  id: string;
  userId: string;
  rewardId: string;
  reward?: Reward;
  redemptionCode: string;
  createdAt: string;
}

export interface RewardTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'EARNED' | 'REDEEMED';
  description: string;
  createdAt: string;
}
