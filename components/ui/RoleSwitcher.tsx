'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Truck, UserCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export type Role = 'CITIZEN' | 'COLLECTOR' | 'MUNICIPAL_ADMIN';

export interface ActiveUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  ecoPoints: number;
  avatarUrl?: string;
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
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  return (
    <div className="bg-slate-950/90 border-b border-slate-800/80 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 backdrop-blur-md">
      <div className="flex items-center gap-2 text-slate-400 font-medium">
        <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
        <span className="text-slate-300 font-semibold">Demo Role Mode:</span>
        <span className="hidden sm:inline text-slate-400">Switch role to test platform capabilities</span>
      </div>

      <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => onRoleChange(DEMO_USERS.CITIZEN)}
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
          onClick={() => onRoleChange(DEMO_USERS.COLLECTOR)}
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
          onClick={() => onRoleChange(DEMO_USERS.MUNICIPAL_ADMIN)}
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
