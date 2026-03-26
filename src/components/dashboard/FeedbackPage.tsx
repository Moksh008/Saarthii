import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MessageSquare, Pencil, Send, X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusBadge } from './shared/StatusBadge';
import { apiFetch } from '@/lib/api';

interface Complaint {
  _id: string;
  title: string;
  status: string;
  priority: string;
  category: string | null;
  created_at: string;
  feedback: { rating: number; comment?: string | null; created_at?: string } | null;
}

const LABELS = ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent'];

export function FeedbackPage() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  async function fetchComplaints() {
    try {
      const data = await apiFetch('/complaints/my');
      setComplaints(data);
    } catch (err) {
      console.error('Failed to fetch complaints', err);
    } finally {
      setLoading(false);
    }
  }

  function startEditing(c: Complaint) {
    setEditingId(c._id);
    setEditRating(c.feedback?.rating || 0);
    setEditComment(c.feedback?.comment || '');
    setHoveredStar(0);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditRating(0);
    setEditComment('');
    setHoveredStar(0);
  }

  async function submitFeedback(complaintId: string) {
    if (editRating === 0) return;
    setSubmitting(true);
    try {
      await apiFetch(`/complaints/${complaintId}/feedback`, {
        method: 'POST',
        body: JSON.stringify({ rating: editRating, comment: editComment.trim() || null }),
      });
      // Update local state
      setComplaints((prev) =>
        prev.map((c) =>
          c._id === complaintId
            ? { ...c, feedback: { rating: editRating, comment: editComment.trim() || null } }
            : c
        )
      );
      setSuccessId(complaintId);
      setTimeout(() => setSuccessId(null), 2000);
      cancelEditing();
    } catch (err) {
      console.error('Failed to submit feedback', err);
    } finally {
      setSubmitting(false);
    }
  }

  const displayRating = hoveredStar || editRating;

  const withFeedback = complaints.filter((c) => c.feedback);
  const withoutFeedback = complaints.filter((c) => !c.feedback);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Feedback</h1>
          <p className="text-slate-500 mt-2">View and manage feedback for your submitted complaints.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="backdrop-blur-md bg-white/70 rounded-xl border border-white/40 p-5 shadow-lg shadow-indigo-100/30">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Complaints</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{complaints.length}</p>
          </div>
          <div className="backdrop-blur-md bg-white/70 rounded-xl border border-white/40 p-5 shadow-lg shadow-emerald-100/30">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Feedback Given</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{withFeedback.length}</p>
          </div>
          <div className="backdrop-blur-md bg-white/70 rounded-xl border border-white/40 p-5 shadow-lg shadow-amber-100/30">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Feedback</p>
            <p className="text-2xl font-bold text-amber-500 mt-1">{withoutFeedback.length}</p>
          </div>
        </div>

      {/* Complaints with feedback */}
      {withFeedback.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-emerald-500" />
            Feedback Submitted
          </h2>
          <div className="space-y-4">
            {withFeedback.map((c) => (
              <motion.div
                key={c._id}
                layout
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-5 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        onClick={() => navigate(`/dashboard/grievances/${c._id}`)}
                        className="font-semibold text-slate-900 hover:text-primary transition-colors truncate text-left"
                      >
                        {c.title}
                      </button>
                      <StatusBadge status={c.status as any} />
                    </div>
                    <p className="text-xs text-slate-400">
                      {c.category || 'General'} • Filed {new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>

                    {/* Feedback display */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={16}
                            className={
                              s <= (c.feedback?.rating || 0)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200'
                            }
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-amber-500">
                        {LABELS[(c.feedback?.rating || 1) - 1]}
                      </span>
                      {c.feedback?.comment && (
                        <span className="text-xs text-slate-400 italic truncate max-w-[200px]">
                          "{c.feedback.comment}"
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Edit / Success indicator */}
                  <AnimatePresence mode="wait">
                    {successId === c._id ? (
                      <motion.div
                        key="success"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1 text-emerald-500 text-xs font-semibold"
                      >
                        <CheckCircle2 size={16} /> Updated!
                      </motion.div>
                    ) : (
                      <button
                        onClick={() => startEditing(c)}
                        className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50"
                      >
                        <Pencil size={14} /> Modify
                      </button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Inline edit panel */}
                <AnimatePresence>
                  {editingId === c._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50">
                        {/* Stars */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onMouseEnter={() => setHoveredStar(s)}
                                onMouseLeave={() => setHoveredStar(0)}
                                onClick={() => setEditRating(s)}
                                className="focus:outline-none transition-transform hover:scale-110"
                              >
                                <Star
                                  size={22}
                                  className={`transition-colors ${
                                    s <= displayRating
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-slate-200'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                          {displayRating > 0 && (
                            <span className="text-xs font-semibold text-amber-500">
                              {LABELS[displayRating - 1]}
                            </span>
                          )}
                        </div>

                        {/* Comment */}
                        <textarea
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          placeholder="Update your feedback comment..."
                          rows={2}
                          maxLength={500}
                          className="w-full text-sm rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 resize-none"
                        />

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 mt-3">
                          <button
                            onClick={cancelEditing}
                            className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <X size={14} /> Cancel
                          </button>
                          <button
                            onClick={() => submitFeedback(c._id)}
                            disabled={editRating === 0 || submitting}
                            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            {submitting ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Send size={14} />
                            )}
                            Update Feedback
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Complaints without feedback */}
      {withoutFeedback.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MessageSquare size={20} className="text-amber-500" />
            Awaiting Your Feedback
          </h2>
          <div className="space-y-4">
            {withoutFeedback.map((c) => (
              <motion.div
                key={c._id}
                layout
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-5 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        onClick={() => navigate(`/dashboard/grievances/${c._id}`)}
                        className="font-semibold text-slate-900 hover:text-primary transition-colors truncate text-left"
                      >
                        {c.title}
                      </button>
                      <StatusBadge status={c.status as any} />
                    </div>
                    <p className="text-xs text-slate-400">
                      {c.category || 'General'} • Filed {new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <button
                    onClick={() => startEditing(c)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg shadow-sm transition-all"
                  >
                    <Star size={14} /> Rate Now
                  </button>
                </div>

                {/* Inline feedback form */}
                <AnimatePresence>
                  {editingId === c._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onMouseEnter={() => setHoveredStar(s)}
                                onMouseLeave={() => setHoveredStar(0)}
                                onClick={() => setEditRating(s)}
                                className="focus:outline-none transition-transform hover:scale-110"
                              >
                                <Star
                                  size={22}
                                  className={`transition-colors ${
                                    s <= displayRating
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-slate-200'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                          {displayRating > 0 && (
                            <span className="text-xs font-semibold text-amber-500">
                              {LABELS[displayRating - 1]}
                            </span>
                          )}
                        </div>
                        <textarea
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          placeholder="Share your experience (optional)..."
                          rows={2}
                          maxLength={500}
                          className="w-full text-sm rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 resize-none"
                        />
                        <div className="flex items-center justify-end gap-2 mt-3">
                          <button
                            onClick={cancelEditing}
                            className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <X size={14} /> Cancel
                          </button>
                          <button
                            onClick={() => submitFeedback(c._id)}
                            disabled={editRating === 0 || submitting}
                            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            {submitting ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Send size={14} />
                            )}
                            Submit Feedback
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {complaints.length === 0 && (
        <div className="backdrop-blur-md bg-white/70 rounded-xl border border-white/40 p-12 text-center shadow-lg">
          <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">No complaints yet</h3>
          <p className="text-sm text-slate-500">Once you file a complaint, you can leave feedback here.</p>
        </div>
      )}
    </div>
  );
}
