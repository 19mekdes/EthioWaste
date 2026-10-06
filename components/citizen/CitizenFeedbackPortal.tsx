'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, MessageSquare, Plus, CheckCircle2, Loader2, Calendar, Truck, Award } from 'lucide-react';
import { createFeedback } from '@/actions/feedback';

interface CitizenFeedbackPortalProps {
  initialFeedback: any[];
  completedRequests: any[];
}

export function CitizenFeedbackPortal({ initialFeedback, completedRequests }: CitizenFeedbackPortalProps) {
  const router = useRouter();

  const [selectedRequestId, setSelectedRequestId] = useState(
    completedRequests.length > 0 ? completedRequests[0].id : ''
  );
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please provide feedback comments.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await createFeedback({
      collectionRequestId: selectedRequestId || undefined,
      rating,
      comment,
    });

    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setComment('');
      setTimeout(() => {
        setShowForm(false);
        setSuccess(false);
        router.refresh();
      }, 1500);
    } else {
      setError(res.error || 'Failed to submit feedback.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400" />
            Citizen Feedback & Reviews
          </h1>
          <p className="text-xs text-slate-400">
            Provide feedback for completed collections to rate waste collectors and municipal performance.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="glass-button-primary text-xs py-2 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Cancel' : 'Submit Feedback'}</span>
        </button>
      </div>

      {/* Submit Form Card */}
      {showForm && (
        <div className="glass-card p-6 border-amber-500/30 bg-slate-900/90 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Rate Completed Collection</h2>
              <p className="text-xs text-slate-400">Only completed requests belonging to your account can be rated</p>
            </div>
          </div>

          {success ? (
            <div className="py-6 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-white">Thank You for Your Feedback!</h3>
              <p className="text-xs text-slate-300">Your rating has been registered successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Completed Collection Request</label>
                {completedRequests.length === 0 ? (
                  <div className="p-3 rounded-xl bg-slate-800 text-amber-300 text-xs border border-amber-500/20">
                    You have no completed collection requests available for feedback yet.
                  </div>
                ) : (
                  <select
                    value={selectedRequestId}
                    onChange={(e) => setSelectedRequestId(e.target.value)}
                    className="w-full glass-input text-xs"
                  >
                    {completedRequests.map((req) => (
                      <option key={req.id} value={req.id}>
                        {req.wasteType} Collection - {req.address} ({new Date(req.createdAt).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Rating (1 to 5 Stars)</label>
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Review Comment</label>
                <textarea
                  rows={3}
                  placeholder="Share details on timeliness, professionalism, and thoroughness of cleanup..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full glass-input text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="glass-button-secondary text-xs">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || completedRequests.length === 0}
                  className="glass-button-primary text-xs bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
                  <span>Submit Review</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Feedback History */}
      {initialFeedback.length === 0 ? (
        <div className="glass-card p-12 text-center border-slate-800 space-y-3">
          <Star className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No Feedback Submitted Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Rate your completed collections to provide quality scores for municipal service delivery.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {initialFeedback.map((item) => (
            <div key={item.id} className="glass-card p-5 border-slate-800 bg-slate-900/60 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-300">{item.rating}/5 Rating</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed italic">&ldquo;{item.comment}&rdquo;</p>
              {item.collectionRequestId && (
                <div className="text-[10px] font-mono text-slate-500">
                  Linked Collection Request: #{item.collectionRequestId.slice(-8)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
