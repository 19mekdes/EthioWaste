'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Truck,
  Search,
  CheckCircle2,
  XCircle,
  UserCheck,
  Calendar,
  MapPin,
  Tag,
  Clock,
  AlertOctagon,
  Loader2,
  Send,
} from 'lucide-react';
import InteractiveMap, { MapMarker } from '@/components/map/InteractiveMap';
import { approveCollectionRequest, rejectCollectionRequest, assignCollectorToRequest } from '@/actions/admin';
import { CollectionRequestStatus, ReportSeverity, WasteCategory } from '@prisma/client';

interface AdminCollectionRequestsPortalProps {
  initialRequests: any[];
  collectors: any[];
}

export function AdminCollectionRequestsPortal({ initialRequests, collectors }: AdminCollectionRequestsPortalProps) {
  const router = useRouter();

  const [requests, setRequests] = useState(initialRequests);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [wasteTypeFilter, setWasteTypeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  const [assigningCollectorId, setAssigningCollectorId] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [requestToAssign, setRequestToAssign] = useState<any | null>(null);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [requestToReject, setRequestToReject] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
      if (priorityFilter !== 'ALL' && r.priority !== priorityFilter) return false;
      if (wasteTypeFilter !== 'ALL' && r.wasteType !== wasteTypeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchAddress = r.address?.toLowerCase().includes(q);
        const matchCitizen = r.citizen?.name?.toLowerCase().includes(q);
        const matchWaste = r.wasteType?.toLowerCase().includes(q);
        const matchId = r.id?.toLowerCase().includes(q);
        if (!matchAddress && !matchCitizen && !matchWaste && !matchId) return false;
      }
      return true;
    });
  }, [requests, statusFilter, priorityFilter, wasteTypeFilter, searchQuery]);

  const handleApprove = async (requestId: string) => {
    setActionLoading(true);
    const res = await approveCollectionRequest(requestId);
    setActionLoading(false);

    if (res.success && res.request) {
      setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, ...res.request } : r)));
      if (selectedRequest?.id === requestId) {
        setSelectedRequest((prev: any) => ({ ...prev, ...res.request }));
      }
      router.refresh();
    } else {
      alert(res.error || 'Failed to approve request.');
    }
  };

  const handleRejectConfirm = async () => {
    if (!requestToReject) return;
    setActionLoading(true);
    const res = await rejectCollectionRequest(requestToReject.id, rejectReason);
    setActionLoading(false);

    if (res.success && res.request) {
      setRequests((prev) => prev.map((r) => (r.id === requestToReject.id ? { ...r, status: 'REJECTED' } : r)));
      if (selectedRequest?.id === requestToReject.id) {
        setSelectedRequest((prev: any) => ({ ...prev, status: 'REJECTED' }));
      }
      setShowRejectModal(false);
      setRequestToReject(null);
      setRejectReason('');
      router.refresh();
    } else {
      alert(res.error || 'Failed to reject request.');
    }
  };

  const handleAssignSubmit = async () => {
    if (!requestToAssign || !assigningCollectorId) {
      alert('Please select a valid collector.');
      return;
    }

    setActionLoading(true);
    const res = await assignCollectorToRequest(requestToAssign.id, assigningCollectorId);
    setActionLoading(false);

    if (res.success && res.request) {
      const assignedCollectorObj = collectors.find((c) => c.id === assigningCollectorId);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestToAssign.id
            ? { ...r, status: 'ASSIGNED', assignedCollector: assignedCollectorObj }
            : r
        )
      );
      if (selectedRequest?.id === requestToAssign.id) {
        setSelectedRequest((prev: any) => ({
          ...prev,
          status: 'ASSIGNED',
          assignedCollector: assignedCollectorObj,
        }));
      }
      setShowAssignModal(false);
      setRequestToAssign(null);
      setAssigningCollectorId('');
      router.refresh();
    } else {
      alert(res.error || 'Failed to assign collector.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-sky-400" />
            Collection Requests & Dispatch Work Queue
          </h1>
          <p className="text-xs text-slate-400">
            Approve door-to-door bulk waste requests and assign licensed municipal field collectors.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 border-slate-800 bg-slate-900/40 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by address, citizen name, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input pl-9 text-xs"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full glass-input text-xs"
            >
              <option value="ALL">All Request Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COLLECTED">COLLECTED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full glass-input text-xs"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          <div>
            <select
              value={wasteTypeFilter}
              onChange={(e) => setWasteTypeFilter(e.target.value)}
              className="w-full glass-input text-xs"
            >
              <option value="ALL">All Waste Types</option>
              <option value="MIXED">MIXED</option>
              <option value="PLASTIC">PLASTIC</option>
              <option value="PAPER">PAPER</option>
              <option value="CARDBOARD">CARDBOARD</option>
              <option value="GLASS">GLASS</option>
              <option value="METAL">METAL</option>
              <option value="ELECTRONIC">ELECTRONIC</option>
              <option value="ORGANIC">ORGANIC</option>
              <option value="HAZARDOUS">HAZARDOUS</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Request List & Inspection Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filteredRequests.length === 0 ? (
            <div className="glass-card p-12 text-center border-slate-800 space-y-2">
              <Truck className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">No collection requests found for selected filters.</p>
            </div>
          ) : (
            filteredRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className={`glass-card p-4 border transition-all cursor-pointer ${
                  selectedRequest?.id === req.id
                    ? 'border-sky-500 bg-sky-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-white">{req.wasteType} Collection</h3>
                      <span className="text-[10px] text-slate-400 font-mono">#{req.id.slice(-8)}</span>
                    </div>

                    <div className="text-[11px] text-slate-300">
                      Citizen: <span className="font-semibold">{req.citizen?.name}</span> ({req.citizen?.phone || req.citizen?.email})
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-sky-400" /> {req.address}
                      </span>
                      <span>•</span>
                      <span>Pref Date: {new Date(req.preferredDate).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] pt-1">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        Qty: {req.estimatedQuantity || 'N/A'}
                      </span>
                      <span className={`px-2 py-0.5 rounded font-bold ${getPriorityBadgeStyle(req.priority)}`}>
                        {req.priority} Priority
                      </span>
                      <span className="text-purple-300 font-medium">
                        Collector: {req.assignedCollector ? req.assignedCollector.name : 'Unassigned'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadgeStyle(req.status)}`}>
                      {req.status}
                    </span>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {req.status === 'PENDING' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(req.id);
                            }}
                            disabled={actionLoading}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-[10px] flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Approve
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setRequestToReject(req);
                              setShowRejectModal(true);
                            }}
                            disabled={actionLoading}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-[10px]"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {(req.status === 'APPROVED' || req.status === 'ASSIGNED') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRequestToAssign(req);
                            setShowAssignModal(true);
                          }}
                          disabled={actionLoading}
                          className="px-2.5 py-1 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-bold text-[10px] flex items-center gap-1"
                        >
                          <UserCheck className="w-3 h-3" /> {req.assignedCollector ? 'Reassign' : 'Assign Collector'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Request Detail Pane */}
        <div>
          {selectedRequest ? (
            <div className="glass-card p-5 border-slate-800 bg-slate-900/80 sticky top-20 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-400" />
                  Request Details
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadgeStyle(selectedRequest.status)}`}>
                  {selectedRequest.status}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-100">{selectedRequest.wasteType} Collection Request</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">{selectedRequest.description || 'No notes provided by citizen.'}</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Citizen:</span>
                    <span className="font-bold text-slate-200">{selectedRequest.citizen?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contact Email:</span>
                    <span className="font-medium text-slate-200">{selectedRequest.citizen?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Preferred Date:</span>
                    <span className="font-bold text-emerald-400">{new Date(selectedRequest.preferredDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time Slot:</span>
                    <span className="font-medium text-slate-200">{selectedRequest.preferredTimeSlot || 'Standard'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Collector:</span>
                    <span className="font-bold text-purple-300">
                      {selectedRequest.assignedCollector ? selectedRequest.assignedCollector.name : 'None (Unassigned)'}
                    </span>
                  </div>
                </div>

                {/* Map preview */}
                <div className="pt-2">
                  <span className="text-[11px] text-slate-400 block mb-1">Pickup GPS Location:</span>
                  <InteractiveMap
                    markers={[
                      {
                        id: selectedRequest.id,
                        title: selectedRequest.wasteType,
                        latitude: selectedRequest.latitude,
                        longitude: selectedRequest.longitude,
                        type: 'PICKUP',
                      },
                    ]}
                    height="140px"
                    centerLat={selectedRequest.latitude}
                    centerLng={selectedRequest.longitude}
                    zoom={14}
                  />
                </div>

                {/* Quick CTA */}
                <div className="pt-2 flex flex-col gap-2">
                  {selectedRequest.status === 'PENDING' && (
                    <button
                      onClick={() => handleApprove(selectedRequest.id)}
                      disabled={actionLoading}
                      className="glass-button-primary text-xs w-full py-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve Collection Request
                    </button>
                  )}
                  {(selectedRequest.status === 'APPROVED' || selectedRequest.status === 'ASSIGNED') && (
                    <button
                      onClick={() => {
                        setRequestToAssign(selectedRequest);
                        setShowAssignModal(true);
                      }}
                      disabled={actionLoading}
                      className="glass-button-secondary text-xs w-full py-2 text-purple-300 border-purple-500/30"
                    >
                      <UserCheck className="w-4 h-4" /> {selectedRequest.assignedCollector ? 'Reassign Collector' : 'Assign Collector to Task'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 text-center border-slate-800 text-xs text-slate-500">
              Select a collection request to inspect details, map location, and dispatch field collectors.
            </div>
          )}
        </div>
      </div>

      {/* Assign Collector Modal */}
      {showAssignModal && requestToAssign && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card p-6 max-w-md w-full border-purple-500/30 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-400" />
              Assign Collector to Request
            </h3>
            <p className="text-xs text-slate-300">
              Assign a licensed field collector for {requestToAssign.wasteType} pickup at {requestToAssign.address}.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Collector</label>
              {collectors.length === 0 ? (
                <div className="p-3 rounded-xl bg-slate-800 text-amber-300 text-xs">
                  No registered collectors found in system. Register a collector account first.
                </div>
              ) : (
                <select
                  value={assigningCollectorId}
                  onChange={(e) => setAssigningCollectorId(e.target.value)}
                  className="w-full glass-input text-xs"
                >
                  <option value="">-- Choose Field Collector --</option>
                  {collectors.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.activeTasks || 0} Active Tasks / {c.totalAssigned || 0} Total)
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="glass-button-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignSubmit}
                disabled={actionLoading || !assigningCollectorId}
                className="glass-button-primary text-xs bg-purple-600 text-white font-bold"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Collector Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && requestToReject && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card p-6 max-w-md w-full border-rose-500/30 space-y-4">
            <h3 className="text-base font-bold text-white">Reject Collection Request</h3>
            <p className="text-xs text-slate-400">
              Provide rejection reason. The citizen will be notified automatically.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Hazardous unhandled material, invalid address, or outside municipal service area..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full glass-input text-xs"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowRejectModal(false)} className="glass-button-secondary text-xs">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                disabled={actionLoading}
                className="glass-button-primary text-xs bg-rose-500 text-white font-bold"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusBadgeStyle(status: string) {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    case 'APPROVED':
      return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    case 'ASSIGNED':
      return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
    case 'IN_PROGRESS':
      return 'bg-sky-500/10 text-sky-400 border border-sky-500/20 animate-pulse';
    case 'COLLECTED':
    case 'COMPLETED':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'REJECTED':
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    default:
      return 'bg-slate-800 text-slate-400';
  }
}

function getPriorityBadgeStyle(priority: string) {
  switch (priority) {
    case 'LOW':
      return 'bg-slate-800 text-slate-300';
    case 'MEDIUM':
      return 'bg-amber-500/10 text-amber-300';
    case 'HIGH':
      return 'bg-orange-500/10 text-orange-300';
    case 'CRITICAL':
      return 'bg-rose-500/20 text-rose-300';
    default:
      return 'bg-slate-800 text-slate-300';
  }
}
