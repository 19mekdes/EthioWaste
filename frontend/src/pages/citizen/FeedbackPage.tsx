import React, { useEffect, useState } from 'react';
import { CitizenLayout } from '../../layouts/CitizenLayout';
import { feedbackService } from '../../services/feedbackService';
import { Feedback } from '../../types';
import { Star, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const FeedbackPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const data = await feedbackService.getMyFeedback();
      setFeedbacks(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load feedback history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return;

    try {
      setSubmitting(true);
      setError(null);
      await feedbackService.submitFeedback({ rating, comment });
      setSuccess(true);
      setComment('');
      setRating(5);
      fetchFeedback();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CitizenLayout title="Service Feedback">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rate & Review Form */}
          <div className="lg:col-span-1 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl h-fit">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Share Your Review
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Help us improve Addis Ababa municipal waste collection services by rating your experience.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Thank you for your feedback!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 transition transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-amber-400 ml-2">{rating} / 5</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Comments & Suggestions *
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="Share details about timeliness, collector behavior, or platform usability..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 text-sm"
              >
                <Send className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Post Feedback'}
              </button>
            </form>
          </div>

          {/* Feedback History */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" /> Past Feedback History
            </h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-8 text-center text-slate-400 text-sm">
                No feedback submitted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {feedbacks.map((f) => (
                  <div
                    key={f.id}
                    className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-md space-y-2"
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
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </CitizenLayout>
  );
};
