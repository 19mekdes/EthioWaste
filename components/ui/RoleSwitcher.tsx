'use client';

import React from 'react';
import { Shield, Truck, UserCheck, Recycle, Sparkles } from 'lucide-react';

export type Role = 'CITIZEN' | 'COLLECTOR' | 'RECYCLING_ORGANIZATION' | 'MUNICIPAL_ADMIN';

export interface ActiveUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  ecoPoints: number;
  avatarUrl?: string | null;
}

const DEMO_USERS: Record<Role, ActiveUser> = {
  CITIZEN: {
    id: 'citizen-demo-1',
    name: 'Sarah Jenkins',
    email: 'citizen@ecobin.org',
    role: 'CITIZEN',
    ecoPoints: 450,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  COLLECTOR: {
    id: 'collector-demo-1',
    name: 'Marcus Vance',
    email: 'collector@ecobin.org',
    role: 'COLLECTOR',
    ecoPoints: 120,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  RECYCLING_ORGANIZATION: {
    id: 'recycling-demo-1',
    name: 'Addis Green Re-Process Org',
    email: 'recycling@ecobin.org',
    role: 'RECYCLING_ORGANIZATION',
    ecoPoints: 300,
    avatarUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=150&auto=format&fit=crop&q=80',
  },
  MUNICIPAL_ADMIN: {
    id: 'admin-demo-1',
    name: 'Director Helena Vance',
    email: 'admin@ecobin.org',
    role: 'MUNICIPAL_ADMIN',
    ecoPoints: 1500,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
};

interface RoleSwitcherProps {
  currentRole: Role;
  onRoleChange: (user: ActiveUser) => void;
  dbUsers?: ActiveUser[];
}

export function RoleSwitcher({ currentRole, onRoleChange, dbUsers }: RoleSwitcherProps) {
  const getUserForRole = (role: Role): ActiveUser => {
    if (dbUsers && dbUsers.length > 0) {
      const match = dbUsers.find((u) => u.role === role);
      if (match) return match;
    }
    return DEMO_USERS[role];
  };

  return (
    <div className="bg-slate-950/90 border-b border-slate-800/80 px-4 py-2 text-xs flex flex-wrap items-center justify-end gap-3 sticky top-0 z-50 backdrop-blur-md">
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => onRoleChange(getUserForRole('CITIZEN'))}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
            currentRole === 'CITIZEN'
              ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Citizen</span>
        </button>

        <button
          onClick={() => onRoleChange(getUserForRole('COLLECTOR'))}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
            currentRole === 'COLLECTOR'
              ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Field Collector</span>
        </button>

        <button
          onClick={() => onRoleChange(getUserForRole('RECYCLING_ORGANIZATION'))}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
            currentRole === 'RECYCLING_ORGANIZATION'
              ? 'bg-teal-500 text-white shadow-sm shadow-teal-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Recycle className="w-3.5 h-3.5" />
          <span>Recycling Org</span>
        </button>

        <button
          onClick={() => onRoleChange(getUserForRole('MUNICIPAL_ADMIN'))}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
            currentRole === 'MUNICIPAL_ADMIN'
              ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Municipal Admin</span>
        </button>
      </div>
    </div>
  );
}
