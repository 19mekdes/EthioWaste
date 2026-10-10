import { Request } from 'express';
import { Role } from '@prisma/client';

export interface UserPayload {
  id: string;
  name: string;
  email: string;
  role: Role;
  ecoPoints: number;
  avatarUrl?: string | null;
}
export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}
