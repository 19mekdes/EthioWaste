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
import { getRecyclingCenters } from '@/actions/centers';
import { getCollectionRequests } from '@/actions/collection-requests';
import { getSystemSeedUsers } from '@/actions/auth-actions';
import { Recycle, Shield, Truck, Award, MapPin, ArrowRight, PlusCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<ActiveUser>({
    id: '',
    name: 'Sarah Jenkins',
    email: 'citizen@ecobin.org',
    role: 'CITIZEN',
    ecoPoints: 450,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  });

  const [dbUsers, setDbUsers] = useState<ActiveUser[]>([]);
  const [activeTab, setActiveTab] = useState<'MAP' | 'REPORT' | 'CENTERS' | 'PICKUP' | 'REWARDS' | 'COLLECTOR' | 'ADMIN'>('MAP');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [recyclingCenters, setRecyclingCenters] = useState<any[]>([]);
  const [collectionRequests, setCollectionRequests] = useState<any[]>([]);
  const [collectors, setCollectors] = useState<any[]>([]);
  const [adminStats, setAdminStats] = useState<any>({
    totalReports: 0,
    resolvedReports: 0,
    pendingReports: 0,
    inProgressReports: 0,
    totalCitizens: 0,
    totalCollectors: 0,
    resolutionRate: 0,
    totalPointsDistributed: 0,
  });
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  const loadData = async () => {
    // 1. Fetch real users from database
    const resUsers = await getSystemSeedUsers();
    if (resUsers.success && resUsers.users.length > 0) {
      setDbUsers(resUsers.users);
      const citizenUser = resUsers.users.find((u: any) => u.role === 'CITIZEN');
      if (citizenUser && !currentUser.id) {
        setCurrentUser(citizenUser);
      }
    }

    // 2. Fetch real waste reports from database
    const resReports = await getWasteReports();
    if (resReports.success) {
      setReports(resReports.reports);
    }

    // 3. Fetch real recycling centers from database
    const resCenters = await getRecyclingCenters();
    if (resCenters.success) {
      setRecyclingCenters(resCenters.centers);
    }

    // 4. Fetch real collection requests from database
    const resReqs = await getCollectionRequests();
    if (resReqs.success) {
      setCollectionRequests(resReqs.requests);
    }

    // 5. Fetch real admin analytics from database
    const resAdmin = await getAdminAnalytics();
    if (resAdmin.success) {
      setAdminStats(resAdmin.stats);
    }

    // 6. Fetch real collectors from database
    const resCol = await getCollectors();
    if (resCol.success) {
      setCollectors(resCol.collectors);
    }

    // 7. Fetch real rewards leaderboard from database
    const resLead = await getRewardsLeaderboard();
    if (resLead.success) {
      setLeaderboard(resLead.leaderboard);
    }

    // 8. Fetch real user transactions from database
    if (currentUser.id) {
      const resTx = await getUserTransactions(currentUser.id);
      if (resTx.success) {
        setTransactions(resTx.transactions);
        if (resTx.points !== undefined) {
          setCurrentUser((prev) => ({ ...prev, ecoPoints: resTx.points }));
        }
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser.id]);

  const handleRoleChange = (user: ActiveUser) => {
    setCurrentUser(user);
    if (user.role === 'COLLECTOR') setActiveTab('COLLECTOR');
    else if (user.role === 'MUNICIPAL_ADMIN') setActiveTab('ADMIN');
    else setActiveTab('MAP');
  };

  // Build Map Markers directly from real database objects
  const mapMarkers: MapMarker[] = [
    // Database Waste Reports
    ...reports.map((r: any) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      category: r.category,
      severity: r.severity,
      status: r.status,
      latitude: r.latitude ?? 9.0107,
      longitude: r.longitude ?? 38.7612,
      imageUrl: r.imageUrl,
      address: r.address || 'Addis Ababa, Ethiopia',
      type: 'REPORT' as const,
    })),
    // Database Collection Requests
    ...collectionRequests.map((req: any) => ({
      id: req.id,
      title: `Bulk Pickup (${req.wasteType || 'Waste'})`,
      description: req.description || `Preferred date: ${new Date(req.preferredDate).toLocaleDateString()}`,
      category: req.wasteType,
      severity: req.priority,
      status: req.status,
      latitude: req.latitude ?? 9.0150,
      longitude: req.longitude ?? 38.7650,
      address: req.address || 'Addis Ababa, Ethiopia',
      type: 'PICKUP' as const,
    })),
    // Database Recycling Centers
    ...recyclingCenters.map((c: any) => ({
      id: c.id,
      title: c.name,
      address: c.address,
      latitude: c.latitude ?? 9.0107,
      longitude: c.longitude ?? 38.7612,
      type: 'CENTER' as const,
      acceptedMaterials: c.acceptedMaterials,
      operatingHours: c.operatingHours || '8:00 AM - 6:00 PM',
    })),
  ];

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col font-sans">
      <RoleSwitcher currentRole={currentUser.role} onRoleChange={handleRoleChange} dbUsers={dbUsers} />
      <Header
        user={currentUser}
        onOpenReportModal={() => setShowReportModal(true)}
        onSelectTab={(tab) => setActiveTab(tab as any)}
      />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-slate-950 to-brand-dark">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Smart Waste Platform — Ethiopia</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent max-w-4xl mx-auto leading-tight">
            Smart Waste Management and Recycling Platform for Ethiopian Cities
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Connect citizens, field collection crews, and municipal administrators through a unified platform for cleaner and more sustainable Ethiopian cities.
          </p>

          {/* Quick Actions Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveTab('MAP')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'MAP'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-300" />
              <span>Smart Waste Map</span>
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
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'CENTERS'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <Recycle className="w-4 h-4 text-emerald-400" />
              <span>Recycling Centers ({recyclingCenters.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('PICKUP')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'PICKUP'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <Truck className="w-4 h-4 text-sky-400" />
              <span>Bulk Pickup</span>
            </button>

            <button
              onClick={() => setActiveTab('REWARDS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'REWARDS'
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Eco-Rewards ({currentUser.ecoPoints} PTS)</span>
            </button>

            <button
              onClick={() => {
                const collectorUser = dbUsers.find((u) => u.role === 'COLLECTOR');
                if (collectorUser) setCurrentUser(collectorUser);
                setActiveTab('COLLECTOR');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'COLLECTOR'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <Truck className="w-4 h-4 text-sky-400" />
              <span>Collector Mode</span>
            </button>

            <button
              onClick={() => {
                const adminUser = dbUsers.find((u) => u.role === 'MUNICIPAL_ADMIN');
                if (adminUser) setCurrentUser(adminUser);
                setActiveTab('ADMIN');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'ADMIN'
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

      {/* Report Waste Modal */}
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

      {/* Main Dynamic Body View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* MAP VIEW */}
        {activeTab === 'MAP' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-5">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  Smart Waste & Recycling Map — Addis Ababa, Ethiopia
                </h2>
                <p className="text-xs text-slate-400">
                  Showing {reports.length} waste reports, {collectionRequests.length} pickup requests, and {recyclingCenters.length} recycling hubs from SQLite database
                </p>
              </div>

              {/* Marker Legend */}
              <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                  🔴 Waste Reports ({reports.length})
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                  🟡 Collection Requests ({collectionRequests.length})
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  🟢 Recycling Centers ({recyclingCenters.length})
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                  🔵 Completed Collections
                </span>
              </div>
            </div>

            <InteractiveMap
              markers={mapMarkers}
              height="550px"
              centerLat={9.0107}
              centerLng={38.7612}
              zoom={12}
            />
          </div>
        )}

        {/* RECYCLING CENTERS VIEW */}
        {activeTab === 'CENTERS' && <RecyclingCenterMap centers={recyclingCenters} userLat={9.0107} userLng={38.7612} />}

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
            tasks={reports.filter(
              (r: any) =>
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

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 bg-slate-950 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Recycle className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-300">EcoBin Platform</span>
            <span>• Smart Waste Infrastructure for Ethiopian Cities</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

