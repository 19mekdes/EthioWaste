'use client';

import React, { useState } from 'react';
import { Factory, Search, Phone, Mail, MapPin, Tag, Calendar } from 'lucide-react';

interface AdminRecyclingOrgsPortalProps {
  initialOrgs: any[];
}

export function AdminRecyclingOrgsPortal({ initialOrgs }: AdminRecyclingOrgsPortalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrgs = initialOrgs.filter((org) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = org.name?.toLowerCase().includes(q);
      const matchAddress = org.address?.toLowerCase().includes(q);
      const matchMaterials = org.acceptedMaterials?.toLowerCase().includes(q);
      if (!matchName && !matchAddress && !matchMaterials) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Factory className="w-6 h-6 text-blue-400" />
            Recycling Organizations Directory
          </h1>
          <p className="text-xs text-slate-400">
            Registered industrial recycling firms, material recovery facilities, and waste processing partners.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="glass-card p-4 border-slate-800 bg-slate-900/40">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by organization name, location, or materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input pl-9 text-xs"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredOrgs.length === 0 ? (
        <div className="glass-card p-12 text-center border-slate-800 space-y-2">
          <Factory className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400">No recycling organizations found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrgs.map((org) => (
            <div key={org.id} className="glass-card p-5 border-slate-800 bg-slate-900/60 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">{org.name}</h3>
                  <div className="text-xs text-slate-400">{org.city || 'Addis Ababa'}</div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {org.status || 'ACTIVE'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{org.address}</span>
                </div>
                {org.contactPhone && (
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>Phone: {org.contactPhone}</span>
                  </div>
                )}
                {org.contactEmail && (
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>Email: {org.contactEmail}</span>
                  </div>
                )}

                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-blue-400" /> Accepted Materials:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {org.acceptedMaterials.split(',').map((mat: string) => (
                      <span key={mat} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-200">
                        {mat.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
