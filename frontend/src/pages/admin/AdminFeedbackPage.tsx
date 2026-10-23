
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { feedbackService } from '../../services/feedbackService';
import { Feedback } from '../../types';
import { Star, AlertCircle, MessageSquare } from 'lucide-react';

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
        setError(
          err.response?.data?.error ||
            'Failed to load citizen feedback logs.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const avgRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce((acc, f) => acc + f.rating, 0) /
          feedbacks.length
        ).toFixed(1)
      : '0.0';

  return (
    <AdminLayout title="Citizen Service Feedback & Ratings">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page heading and average rating */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Citizen Satisfaction Analytics
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review rating feedback and service reviews across Addis Ababa
              sub-cities.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-5 py-3 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
              <Star className="h-7 w-7 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-800">
                {avgRating} / 5
              </span>
              <span className="block text-xs text-slate-500">
                Average Rating ({feedbacks.length} Reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading, empty state, and feedback cards */}
        {loading ? (
          <div className="flex justify-center rounded-2xl border border-slate-100 bg-white py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600" />
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <MessageSquare className="h-7 w-7 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-800">
              No feedback yet
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              No citizen feedback registered yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {feedbacks.map((f) => (
              <div
                key={f.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <div
                    className="flex items-center gap-1"
                    aria-label={`${f.rating} out of 5 stars`}
                  >
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < f.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(f.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex-1 rounded-xl border border-slate-100 bg-[#F8FAF8] p-4">
                  <MessageSquare className="mb-2 h-4 w-4 text-emerald-600" />
                  <p className="break-words text-sm leading-relaxed text-slate-700">
                    "{f.comment}"
                  </p>
                </div>

                {f.user && (
                  <div className="border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <span className="text-slate-500">By: </span>
                    <span className="font-semibold text-slate-800">
                      {f.user.name}
                    </span>
                    <p className="mt-1 break-all text-slate-500">
                      {f.user.email}
                    </p>
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

