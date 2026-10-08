import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'smart-waste-management-secret-key-addis-ababa-2026';

export async function registerUser(data: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}) {
  const email = data.email.trim().toLowerCase();
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('An account with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await db.user.create({
    data: {
      name: data.name.trim(),
      email,
      phone: data.phone?.trim() || null,
      password: hashedPassword,
      role: Role.CITIZEN,
      ecoPoints: 0,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      ecoPoints: true,
      avatarUrl: true,
    },
  });

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role, ecoPoints: user.ecoPoints },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { user, token };
}

export async function loginUser(credentials: { email: string; password: string }) {
  const email = credentials.email.trim().toLowerCase();
  const user = await db.user.findUnique({ where: { email } });

  if (!user || !user.password) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    ecoPoints: user.ecoPoints,
    avatarUrl: user.avatarUrl,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

  return {
    user: payload,
    token,
  };
}

export async function getSeedUsers() {
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      ecoPoints: true,
      avatarUrl: true,
    },
    orderBy: { createdAt: 'asc' },
  });
  return users;
}
