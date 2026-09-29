'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, PlusCircle, Recycle, Truck, Award, AlertOctagon } from 'lucide-react';
import InteractiveMap, { MapMarker } from '@/components/map/InteractiveMap';
import { ReportWasteForm } from '@/components/citizen/ReportWasteForm';
import { RecyclingCenterMap } from '@/components/citizen/RecyclingCenterMap';
import { PickupScheduleForm } from '@/components/citizen/PickupScheduleForm';
import { RewardsCatalog } from '@/components/citizen/RewardsCatalog';
import { ActiveUser } from '@/components/ui/RoleSwitcher';

export interface CitizenHubData {
  reports: any[];
  centers: any[];
  leaderboard: any[];
  transactions: any[];
  points: number;
}

interface CitizenHubProps {
  user: ActiveUser;
  initialData: CitizenHubData;
}

type Tab = 'MAP' | 'REPORT' | 'CENTERS' | 'PICKUP' | 'REWARDS';

export function CitizenHub({ user, initialData }: CitizenHubProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('MAP');
  const [showReportModal, setShowReportModal] = useState(false);
  const [data, setData] = useState(initialData);

  // Re-sync client state whenever the server re-renders with fresh props
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  const mapMarkers: MapMarker[] = [
    ...data.reports.map((r: any) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      category: r.category,
      severity: r.severity,
      status: r.status,
      latitude: r.latitude,
      longitude: r.longitude,
      imageUrl: r.imageUrl,
      address: r.address || undefined,
      type: 'REPORT' as const,
    })),
    ...data.centers.map((c: any) => ({
      id: c.id,
      title: c.name,
      address: c.address,
      latitude: c.latitude,
      longitude: c.longitude,
      type: 'CENTER' as const,
      acceptedMaterials: c.acceptedMaterials,
      operatingHours: c.operatingHours,
    })),
  ];

  const tabs: { id: Tab; label: string; icon: any; activeClass: string; badge?: number }[] = [
    { id: 'MAP', label: 'Live City Map', icon: MapPin, activeClass: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' },
    { id: 'CENTERS', label: 'Recycling Centers', icon: Recycle, activeClass: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' },
    { id: 'PICKUP', label: 'Bulk Pickup', icon: Truck, activeClass: 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' },
    {
      id: 'REWARDS',
      label: 'Eco-Rewards',
      icon: Award,
      activeClass: 'bg-amber-500 text-white shadow-lg shadow-amber-500/20',
      badge: data.points, // fresh DB balance, not the possibly-stale session value
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-500/10">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-0.5">
              Citizen Dashboard
            </div>
            <h2 className="text-2xl font-extrabold text-slate-100">
              Welcome back, {user.name.split(' ')[0]} 👋
            </h2>
            <p className="text-xs text-slate-400">
              Report waste, find drop hubs, book pickups, and redeem your Eco-Points.
            </p>
          </div>
        </div>
        <button onClick={() => setShowReportModal(true)} className="glass-button-primary text-xs">
          <AlertOctagon className="w-4 h-4" />
          Report Waste Issue
        </button>
      </div>

      {/* Report modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full my-auto">
            <ReportWasteForm
              onSuccess={() => {
                setShowReportModal(false);
                refresh();
              }}
              onClose={() => setShowReportModal(false)}
            />
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? tab.activeClass
                : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'MAP' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                Live Smart Waste & Recycling Map
              </h2>
              <p className="text-xs text-slate-400">Interactive city map showing active waste reports and recycling hubs</p>
            </div>
            <button onClick={() => setShowReportModal(true)} className="glass-button-primary text-xs">
              <PlusCircle className="w-4 h-4" />
              Report Waste Here
            </button>
          </div>
          <InteractiveMap markers={mapMarkers} height="550px" centerLat={40.7580} centerLng={-73.9855} zoom={13} />
        </div>
      )}

      {activeTab === 'CENTERS' && (
        <RecyclingCenterMap centers={data.centers} userLat={40.7580} userLng={-73.9855} />
      )}

      {activeTab === 'PICKUP' && (
        <PickupScheduleForm
          onSuccess={() => {
            refresh();
          }}
        />
      )}

      {activeTab === 'REWARDS' && (
        <RewardsCatalog
          user={{ ...user, ecoPoints: data.points }}
          leaderboard={data.leaderboard}
          transactions={data.transactions}
          onPointsUpdate={(pts) => {
            setData((d) => ({ ...d, points: pts }));
            refresh();
          }}
        />
      )}
    </div>
  );
}

export function CitizenHubSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="glass-card p-6 h-28 bg-slate-900/50" />
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-32 bg-slate-800/70 rounded-xl" />
        ))}
      </div>
      <div className="h-[500px] bg-slate-900/50 rounded-2xl border border-slate-800" />
    </div>
  );
}


