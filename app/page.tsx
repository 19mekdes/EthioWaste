'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { RoleSwitcher, ActiveUser, Role } from '@/components/ui/RoleSwitcher';
import { Header } from '@/components/ui/Header';
import InteractiveMap, { MapMarker } from '@/components/map/InteractiveMap';
import { ReportWasteForm } from '@/components/citizen/ReportWasteForm';
import { RecyclingCenterMap } from '@/components/citizen/RecyclingCenterMap';
import { PickupScheduleForm } from '@/components/citizen/PickupScheduleForm';
import { RewardsCatalog } from '@/components/citizen/RewardsCatalog';
import { TaskRouteMap } from '@/components/collector/TaskRouteMap';
import { AnalyticsOverview } from '@/components/admin/AnalyticsOverview';
import { ReportValidationQueue } from '@/components/admin/ReportValidationQueue';
import { getWasteReports } from '@/actions/reports';
import { getAdminAnalytics, getCollectors } from '@/actions/admin';
import { getRewardsLeaderboard, getUserTransactions } from '@/actions/rewards';
import { Recycle, Shield, Truck, Award, MapPin, ArrowRight, PlusCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<ActiveUser>({
    id: 'citizen-demo-1',
    name: 'Sarah Jenkins',
    email: 'citizen@ecobin.org',
    role: 'CITIZEN',
    ecoPoints: 450,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  });

  const [activeTab, setActiveTab] = useState<'MAP' | 'REPORT' | 'CENTERS' | 'PICKUP' | 'REWARDS' | 'COLLECTOR' | 'ADMIN'>('MAP');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [collectors, setCollectors] = useState<any[]>([]);
  const [adminStats, setAdminStats] = useState<any>({
    totalReports: 4,
    resolvedReports: 1,
    pendingReports: 2,
    inProgressReports: 1,
    totalCitizens: 3,
    totalCollectors: 2,
    resolutionRate: 25,
    totalPointsDistributed: 1480,
  });
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  const loadData = async () => {
    const resReports = await getWasteReports();
    if (resReports.success) setReports(resReports.reports);

    const resAdmin = await getAdminAnalytics();
    if (resAdmin.success) setAdminStats(resAdmin.stats);

    const resCol = await getCollectors();
    if (resCol.success) setCollectors(resCol.collectors);

    const resLead = await getRewardsLeaderboard();
    if (resLead.success) setLeaderboard(resLead.leaderboard);

    const resTx = await getUserTransactions(currentUser.id);
    if (resTx.success) setTransactions(resTx.transactions);
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);
  const handleRoleChange = (user: ActiveUser) => {
    setCurrentUser(user);
    if (user.role === 'COLLECTOR') setActiveTab('COLLECTOR');
    else if (user.role === 'MUNICIPAL_ADMIN') setActiveTab('ADMIN');
    else setActiveTab('MAP');
  };

  const sampleCenters = [
    {
      id: 'center-1',
      name: 'Metro Eco-Hub & E-Waste Facility',
      address: '520 W 28th St, New York, NY 10001',
      latitude: 40.7516,
      longitude: -74.0012,
      acceptedMaterials: 'E-Waste, Plastics, Batteries, Metals',
      contactPhone: '+1 (212) 555-0192',
      operatingHours: 'Mon-Sat: 7:00 AM - 7:00 PM',
    },
    {
      id: 'center-2',
      name: 'GreenLife Community Compost & Organics Center',
      address: '142 Columbia St, Brooklyn, NY 11231',
      latitude: 40.6865,
      longitude: -74.0018,
      acceptedMaterials: 'Organic, Food Waste, Yard Trimmings, Cardboard',
      contactPhone: '+1 (718) 555-0431',
      operatingHours: 'Mon-Sun: 8:00 AM - 5:00 PM',
    },
    {
      id: 'center-3',
      name: 'Harbor Clean Glass & Bottle Redemption Depot',
      address: '350 Avenue C, New York, NY 10009',
      latitude: 40.7322,
      longitude: -73.9745,
      acceptedMaterials: 'Glass, Plastics, Aluminum Cans',
      contactPhone: '+1 (212) 555-0814',
      operatingHours: 'Tue-Sat: 9:00 AM - 6:00 PM',
    },
  ];

  const mapMarkers: MapMarker[] = [
    ...reports.map((r: any) => ({
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
    ...sampleCenters.map((c) => ({
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

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">

      <RoleSwitcher currentRole={currentUser.role} onRoleChange={handleRoleChange} />
      <Header
        user={currentUser}
        onOpenReportModal={() => setShowReportModal(true)}
        onSelectTab={(tab) => setActiveTab(tab as any)}
      />

      {/* 3. Hero Header Section */}
      <section className="relative overflow-hidden pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-slate-950 to-brand-dark">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />

          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent max-w-4xl mx-auto leading-tight">
            AI-Powered Smart Waste Management & Urban Recycling
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Connect citizens, field collection crews, and municipal administrators in real-time. Report overflowing bins, optimize collection routes, locate drop-off hubs, and earn Eco-Points.
          </p>

          {/* Quick Role Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveTab('MAP')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'MAP'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
            >
              <MapPin className="w-4 h-4 text-emerald-300" />
              <span>Live City Map</span>
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Report Waste (+50 PTS)</span>
            </button>

            <button
              onClick={() => setActiveTab('CENTERS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'CENTERS'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
            >
              <Recycle className="w-4 h-4 text-emerald-400" />
              <span>Recycling Centers</span>
            </button>

            <button
              onClick={() => setActiveTab('PICKUP')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'PICKUP'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
            >
              <Truck className="w-4 h-4 text-sky-400" />
              <span>Bulk Pickup</span>
            </button>

            <button
              onClick={() => setActiveTab('REWARDS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'REWARDS'
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Eco-Rewards ({currentUser.ecoPoints} PTS)</span>
            </button>

            <button
              onClick={() => {
                setCurrentUser({
                  id: 'collector-demo-1',
                  name: 'Marcus Vance',
                  email: 'collector@ecobin.org',
                  role: 'COLLECTOR',
                  ecoPoints: 120,
                  avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                });
                setActiveTab('COLLECTOR');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'COLLECTOR'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
            >
              <Truck className="w-4 h-4 text-sky-400" />
              <span>Collector Mode</span>
            </button>

            <button
              onClick={() => {
                setCurrentUser({
                  id: 'admin-demo-1',
                  name: 'Director Helena Vance',
                  email: 'admin@ecobin.org',
                  role: 'MUNICIPAL_ADMIN',
                  ecoPoints: 1500,
                  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                });
                setActiveTab('ADMIN');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'ADMIN'
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Municipal Admin</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Report Waste Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full my-auto">
            <ReportWasteForm
              userId={currentUser.id}
              onSuccess={() => {
                setShowReportModal(false);
                loadData();
              }}
              onClose={() => setShowReportModal(false)}
            />
          </div>
        </div>
      )}

      {/* 5. Main Dynamic Body View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* MAP VIEW */}
        {activeTab === 'MAP' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  Live Smart Waste & Recycling Map
                </h2>
                <p className="text-xs text-slate-400">Interactive city map showing active waste reports and recycling hubs</p>
              </div>

              <button
                onClick={() => setShowReportModal(true)}
                className="glass-button-primary text-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report Waste Here</span>
              </button>
            </div>

            <InteractiveMap
              markers={mapMarkers}
              height="550px"
              centerLat={40.7580}
              centerLng={-73.9855}
              zoom={13}
            />
          </div>
        )}

        {/* RECYCLING CENTERS VIEW */}
        {activeTab === 'CENTERS' && <RecyclingCenterMap centers={sampleCenters} />}

        {/* PICKUP SCHEDULER VIEW */}
        {activeTab === 'PICKUP' && (
          <div className="py-4">
            <PickupScheduleForm
              citizenId={currentUser.id}
              onSuccess={() => {
                setActiveTab('MAP');
                loadData();
              }}
            />
          </div>
        )}

        {/* REWARDS VIEW */}
        {activeTab === 'REWARDS' && (
          <RewardsCatalog
            user={currentUser}
            leaderboard={leaderboard}
            transactions={transactions}
            onPointsUpdate={(pts) => setCurrentUser({ ...currentUser, ecoPoints: pts })}
          />
        )}

        {/* COLLECTOR DASHBOARD VIEW */}
        {activeTab === 'COLLECTOR' && (
          <TaskRouteMap
            tasks={reports.filter((r: any) =>
              !r.assignedToId ||
              r.assignedToId === currentUser.id ||
              (collectors.length > 0 && r.assignedToId === collectors[0]?.id)
            )}
            collectorName={currentUser.name}
            onTaskUpdated={loadData}
          />
        )}

        {/* MUNICIPAL ADMIN DASHBOARD VIEW */}
        {activeTab === 'ADMIN' && (
          <div className="space-y-8">
            <AnalyticsOverview stats={adminStats} reports={reports} />
            <ReportValidationQueue reports={reports} collectors={collectors} onRefresh={loadData} />
          </div>
        )}
      </main>

      {/* 6. Footer */}
      <footer className="border-t border-slate-800/80 py-6 bg-slate-950 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Recycle className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-300">EcoBin Platform</span>
            <span>Smart Waste Infrastructure</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Auth.js v5 RBAC</span>
            <span>•</span>
            <span>Prisma ORM & PostgreSQL</span>
            <span>•</span>
            <span>Leaflet Maps</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
