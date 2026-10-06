'use client';

import React from 'react';
import { Star, MessageSquare, Award, User, Calendar } from 'lucide-react';

interface AdminFeedbackPortalProps {
  initialFeedback: any[];
  summary: {
    totalReviews: number;
    avgRating: number;
    ratingDistribution: Record<number, number>;
  };
}

export function AdminFeedbackPortal({ initialFeedback, summary }: AdminFeedbackPortalProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400" />
            Citizen Feedback & Service Quality Monitoring
          </h1>
          <p className="text-xs text-slate-400">
            Operational review of citizen ratings, feedback comments, and service delivery performance.
          </p>
        </div>
      </div>

      {/* Summary Scorecard & Rating Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average Rating Banner */}
        <div className="glass-card p-6 border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 flex flex-col items-center justify-center text-center space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Average Service Score</span>
          <div className="text-5xl font-black text-amber-300">{summary.avgRating}</div>
          <div className="flex items-center gap-1 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < Math.round(summary.avgRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
              />
            ))}
          </div>
          <div className="text-xs text-slate-400 font-medium">
            Based on {summary.totalReviews} verified citizen reviews
          </div>
        </div>

        {/* Rating Distribution Bar Chart */}
        <div className="md:col-span-2 glass-card p-6 border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Rating Breakdown</h3>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = summary.ratingDistribution[stars] || 0;
              const pct = summary.totalReviews > 0 ? Math.round((count / summary.totalReviews) * 100) : 0;
              return (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <div className="w-14 flex items-center gap-1 text-amber-400 font-bold shrink-0">
                    <span>{stars}</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                  </div>
                  <div className="flex-1 h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-slate-400 text-[11px] font-mono shrink-0">
                    {count} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feedback Feed List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          Recent Citizen Reviews
        </h3>

        {initialFeedback.length === 0 ? (
          <div className="glass-card p-12 text-center border-slate-800 space-y-2">
            <Star className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No citizen feedback submitted yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initialFeedback.map((item) => (
              <div key={item.id} className="glass-card p-5 border-slate-800 bg-slate-900/60 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-amber-300">{item.rating}/5</span>
                  </div>

                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed italic">&ldquo;{item.comment}&rdquo;</p>

                <div className="pt-2 border-t border-slate-800/40 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Citizen: {item.citizen?.name || 'Anonymous'}</span>
                  {item.collectionRequestId && (
                    <span className="font-mono text-slate-500">Request #{item.collectionRequestId.slice(-8)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
