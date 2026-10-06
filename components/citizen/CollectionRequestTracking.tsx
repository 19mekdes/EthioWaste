'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  CheckCircle2,
  Clock,
  UserCheck,
  Calendar,
  MapPin,
  Tag,
  AlertOctagon,
  ArrowLeft,
  Star,
  MessageSquare,
  ShieldCheck,
  XCircle,
  Loader2,
} from 'lucide-react';
import InteractiveMap, { MapMarker } from '@/components/map/InteractiveMap';
import { createFeedback } from '@/actions/feedback';

interface CollectionRequestTrackingProps {
  request: any;
  feedbackGiven?: any;
}

export function CollectionRequestTracking({ request, feedbackGiven }: CollectionRequestTrackingProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');
  const [currentFeedback, setCurrentFeedback] = useState(feedbackGiven);

  const status = request.status;

  // Build real stages timeline based on actual status & fields
  const stages = [
    {
      key: 'SUBMITTED',
      label: 'Request Submitted',
      description: `Submitted on ${new Date(request.createdAt).toLocaleDateString()} at ${new Date(request.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      happened: true,
      timestamp: request.createdAt,
    },
    {
      key: 'APPROVED',
      label: 'Approved by Municipal Admin',
      description: ['APPROVED', 'ASSIGNED', 'IN_PROGRESS', 'COLLECTED', 'COMPLETED'].includes(status)
        ? 'Verified and approved for collector dispatch'
        : 'Awaiting admin review',
      happened: ['APPROVED', 'ASSIGNED', 'IN_PROGRESS', 'COLLECTED', 'COMPLETED'].includes(status),
    },
    {
      key: 'ASSIGNED',
      label: 'Collector Assigned',
      description: request.assignedCollector
        ? `Assigned to ${request.assignedCollector.name} (${request.assignedCollector.phone || 'Licensed Collector'})`
        : 'Collector assignment pending',
      happened: !!request.assignedCollector || ['ASSIGNED', 'IN_PROGRESS', 'COLLECTED', 'COMPLETED'].includes(status),
    },
    {
      key: 'IN_PROGRESS',
      label: 'Collection In Progress',
      description: ['IN_PROGRESS', 'COLLECTED', 'COMPLETED'].includes(status)
        ? 'Collector is en route or at pickup site'
        : 'Pickup pending arrival',
      happened: ['IN_PROGRESS', 'COLLECTED', 'COMPLETED'].includes(status),
    },
    {
      key: 'COLLECTED',
      label: 'Waste Collected',
      description: ['COLLECTED', 'COMPLETED'].includes(status)
        ? 'Waste loaded and removed from location'
        : 'Collection in progress',
      happened: ['COLLECTED', 'COMPLETED'].includes(status),
    },
    {
      key: 'COMPLETED',
      label: 'Completed & Closed',
      description: status === 'COMPLETED'
        ? 'Job marked completed. Eco-Points credited.'
        : 'Awaiting final completion log',
      happened: status === 'COMPLETED',
    },
  ];

  const mapMarkers: MapMarker[] = [
    {
      id: request.id,
      title: `${request.wasteType} Collection Site`,
      latitude: request.latitude,
      longitude: request.longitude,
      address: request.address,
      type: 'PICKUP',
    },
  ];

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setFeedbackError('Please write a brief comment.');
      return;
    }

    setFeedbackLoading(true);
    setFeedbackError('');

    const res = await createFeedback({
      collectionRequestId: request.id,
      rating,
      comment,
    });

    setFeedbackLoading(false);

    if (res.success) {
      setFeedbackSuccess(true);
      setCurrentFeedback(res.feedback);
    } else {
      setFeedbackError(res.error || 'Failed to submit feedback.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Link */}
      <div>
        <Link
          href="/dashboard/citizen/requests"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Requests
        </Link>
      </div>

      {/* Header Banner */}
      <div className="glass-card p-6 bg-slate-900/80 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-sky-400 font-bold uppercase tracking-wider">
              Request Tracking
            </span>
            <span className="text-xs text-slate-500 font-mono">#{request.id}</span>
          </div>
          <h1 className="text-2xl font-black text-white">
            {request.wasteType} Collection Request
          </h1>
          <p className="text-xs text-slate-400">
            Preferred Date: {new Date(request.preferredDate).toLocaleDateString()} ({request.preferredTimeSlot || 'Standard Slot'})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${getStatusBadgeStyle(request.status)}`}>
            {request.status}
          </span>
        </div>
      </div>

      {/* Real Timeline Component */}
      <div className="glass-card p-6 border-slate-800 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-400" />
            Live Status Timeline
          </h2>
          <p className="text-xs text-slate-400">
            Real-time stage tracking showing verified milestones completed by municipal operations.
          </p>
        </div>

        {status === 'REJECTED' ? (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-3">
            <XCircle className="w-6 h-6 shrink-0" />
            <div>
              <h4 className="text-sm font-bold">Request Rejected</h4>
              <p className="text-xs opacity-90">
                This request was reviewed and rejected by municipal administration. Please review notes or submit a new request if necessary.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
            {stages.map((stage, idx) => (
              <div key={stage.key} className="relative flex items-start gap-4">
                {/* Stage Bullet */}
                <div
                  className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                    stage.happened
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 ring-4 ring-emerald-500/20'
                      : 'bg-slate-900 text-slate-600 border-slate-800'
                  }`}
                >
                  {stage.happened ? '✓' : idx + 1}
                </div>

                {/* Stage Details */}
                <div className={`space-y-0.5 ${stage.happened ? 'text-slate-100' : 'text-slate-500 opacity-60'}`}>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold">{stage.label}</h3>
                    {stage.happened && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                        Verified Stage
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{stage.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Grid: Address, Collector, Notes, Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Collection Information Card */}
        <div className="glass-card p-5 border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Tag className="w-4 h-4 text-sky-400" />
            Request Details
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Waste Type</span>
              <span className="font-bold text-slate-200">{request.wasteType}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Estimated Quantity</span>
              <span className="font-medium text-slate-200">{request.estimatedQuantity || 'Not specified'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Priority Level</span>
              <span className="font-medium text-amber-300">{request.priority}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Time Slot</span>
              <span className="font-medium text-slate-200">{request.preferredTimeSlot || 'Standard'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Address</span>
              <span className="font-medium text-slate-200 text-right max-w-[200px] truncate">{request.address}</span>
            </div>
            {request.description && (
              <div className="pt-1">
                <span className="text-slate-400 block mb-1">Citizen Notes:</span>
                <p className="text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-[11px] leading-relaxed">
                  {request.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Assigned Collector Details & Map */}
        <div className="space-y-4">
          {/* Assigned Collector Box */}
          <div className="glass-card p-5 border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-purple-400" />
              Assigned Waste Collector
            </h3>

            {request.assignedCollector ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={request.assignedCollector.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                  alt={request.assignedCollector.name}
                  className="w-10 h-10 rounded-full object-cover border border-purple-500/40"
                />
                <div>
                  <div className="text-xs font-bold text-purple-200">{request.assignedCollector.name}</div>
                  <div className="text-[11px] text-purple-300/80">Licensed Municipal Collector</div>
                  {request.assignedCollector.phone && (
                    <div className="text-[10px] font-mono text-purple-400 mt-0.5">
                      Phone: {request.assignedCollector.phone}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-2">
                No collector assigned yet. Dispatch will assign a team once approved.
              </p>
            )}
          </div>

          {/* Location Map */}
          <div className="glass-card p-3 border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 px-1">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>Pickup GPS Coordinates</span>
            </div>
            <InteractiveMap
              markers={mapMarkers}
              centerLat={request.latitude}
              centerLng={request.longitude}
              height="180px"
              zoom={14}
            />
          </div>
        </div>
      </div>

      {/* Citizen Feedback Section (If status is COMPLETED or COLLECTED) */}
      {(status === 'COMPLETED' || status === 'COLLECTED') && (
        <div className="glass-card p-6 border-amber-500/30 bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Rate & Provide Feedback</h3>
              <p className="text-xs text-slate-400">Share your experience to help improve collector quality and municipal service</p>
            </div>
          </div>

          {currentFeedback ? (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">Your Submitted Feedback:</span>
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < currentFeedback.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-200 italic">&ldquo;{currentFeedback.comment}&rdquo;</p>
              <div className="text-[10px] text-slate-400 pt-1">
                Submitted on {new Date(currentFeedback.createdAt).toLocaleDateString()}
              </div>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              {feedbackError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {feedbackError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Service Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-600 hover:text-slate-400'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-300 ml-2">{rating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Feedback Comment</label>
                <textarea
                  rows={3}
                  placeholder="How was the collection service? Was the team prompt and respectful?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full glass-input text-xs"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={feedbackLoading}
                className="glass-button-primary text-xs py-2 px-5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold"
              >
                {feedbackLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
                <span>Submit Service Feedback</span>
              </button>
            </form>
          )}
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
