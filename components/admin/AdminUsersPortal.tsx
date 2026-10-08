'use client';

import React, { useState } from 'react';
import { Users, Search, Shield, Award, Phone, Mail, MapPin, Calendar, FileText, Truck } from 'lucide-react';
import { Role } from '@prisma/client';

interface AdminUsersPortalProps {
  initialUsers: any[];
}

export function AdminUsersPortal({ initialUsers }: AdminUsersPortalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredUsers = initialUsers.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name?.toLowerCase().includes(q);
      const matchEmail = u.email?.toLowerCase().includes(q);
      const matchPhone = u.phone?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            Platform User Management
          </h1>
          <p className="text-xs text-slate-400">
            View registered citizens, field collectors, recycling organizations, and municipal administrators.
          </p>
        </div>
      </div>

      {/* Filter controls */}
      <div className="glass-card p-4 border-slate-800 bg-slate-900/40 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input pl-9 text-xs"
            />
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full glass-input text-xs"
            >
              <option value="ALL">All User Roles</option>
              <option value="CITIZEN">CITIZEN</option>
              <option value="COLLECTOR">COLLECTOR</option>
              <option value="RECYCLING_ORGANIZATION">RECYCLING_ORGANIZATION</option>
              <option value="MUNICIPAL_ADMIN">MUNICIPAL_ADMIN</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="glass-card p-5 border-slate-800 bg-slate-900/60 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-700 bg-slate-950 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-white truncate">{user.name}</h3>
                  <div className="text-xs text-slate-400 truncate">{user.email}</div>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${getRoleBadgeStyle(user.role)}`}>
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                {user.role === 'CITIZEN' && (
                  <div className="flex items-center justify-between text-amber-300 font-semibold">
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-400" /> Eco-Points:
                    </span>
                    <span>{user.ecoPoints} PTS</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-center gap-1.5 text-slate-400 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{user.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-600" />
                  <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Activity stats */}
            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Reports: {user._count?.reports || 0}</span>
              <span>Requests: {user._count?.collectionRequests || 0}</span>
              <span>Tasks: {user._count?.assignedTasks || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getRoleBadgeStyle(role: string) {
  switch (role) {
    case 'CITIZEN':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'COLLECTOR':
      return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
    case 'RECYCLING_ORGANIZATION':
      return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    case 'MUNICIPAL_ADMIN':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    default:
      return 'bg-slate-800 text-slate-400';
  }
}
