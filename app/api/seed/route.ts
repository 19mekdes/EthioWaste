import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Ensure seed data exists
    let citizen = await db.user.findUnique({ where: { email: 'citizen@ecobin.org' } });
    if (!citizen) {
      citizen = await db.user.create({
        data: {
          name: 'Sarah Jenkins',
          email: 'citizen@ecobin.org',
          password: hashedPassword,
          role: 'CITIZEN',
          ecoPoints: 450,
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        },
      });
    }

    let collector = await db.user.findUnique({ where: { email: 'collector@ecobin.org' } });
    if (!collector) {
      collector = await db.user.create({
        data: {
          name: 'Marcus Vance',
          email: 'collector@ecobin.org',
          password: hashedPassword,
          role: 'COLLECTOR',
          ecoPoints: 120,
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        },
      });
    }

    let admin = await db.user.findUnique({ where: { email: 'admin@ecobin.org' } });
    if (!admin) {
      admin = await db.user.create({
        data: {
          name: 'Director Helena Vance',
          email: 'admin@ecobin.org',
          password: hashedPassword,
          role: 'MUNICIPAL_ADMIN',
          ecoPoints: 1500,
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      users: { citizen: citizen.email, collector: collector.email, admin: admin.email },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
