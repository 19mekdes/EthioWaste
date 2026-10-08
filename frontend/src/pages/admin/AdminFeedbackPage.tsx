import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { feedbackService } from '../../services/feedbackService';
import { Feedback } from '../../types';
import { Star, MessageSquare, AlertCircle } from 'lucide-react';

export const AdminFeedbackPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await feedbackService.getAllFeedback();
        setFeedbacks(data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load citizen feedback logs.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
    : '0.0';

  return (
    <AdminLayout title="Citizen Service Feedback & Ratings">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Citizen Satisfaction Analytics</h2>
            <p className="text-sm text-slate-400">Review rating feedback and service reviews across Addis Ababa sub-cities.</p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-lg">
            <Star className="w-7 h-7 text-amber-400 fill-amber-400" />
            <div>
              <span className="text-2xl font-black text-white">{avgRating} / 5</span>
              <span className="text-xs text-slate-400 block">Average Rating ({feedbacks.length} Reviews)</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-12 text-center text-slate-400">
            No citizen feedback registered yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.map((f) => (
              <div
                key={f.id}
                className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < f.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(f.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm text-slate-200 bg-slate-900/60 p-3 rounded-xl border border-slate-700/40">
                  "{f.comment}"
                </p>

                {f.user && (
                  <div className="text-xs text-slate-400 pt-2 border-t border-slate-700/50">
                    By: <span className="text-white font-semibold">{f.user.name}</span> ({f.user.email})
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
