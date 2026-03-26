import { useState } from 'react';
import { Star, Send, CheckCircle2, MessageSquareHeart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/lib/api';

interface FeedbackCardProps {
  complaintId: string;
  /** If the user already submitted feedback, show it read-only */
  existingFeedback?: { rating: number; comment?: string | null } | null;
}

const LABELS = ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent'];

export function FeedbackCard({ complaintId, existingFeedback }: FeedbackCardProps) {
  const [rating, setRating] = useState(existingFeedback?.rating ?? 0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState(existingFeedback?.comment ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(!!existingFeedback);
  const [error, setError] = useState('');

  const displayRating = hoveredStar || rating;
  const isReadOnly = submitted;

  async function handleSubmit() {
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await apiFetch(`/complaints/${complaintId}/feedback`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment: comment.trim() || null }),
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header gradient strip */}
      <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-primary" />

      <div className="p-6">
        {/* Title */}
        <div className="flex items-center gap-2.5 mb-1">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50">
            <MessageSquareHeart size={18} className="text-amber-500" />
          </div>
          <h3 className="font-bold text-slate-900">Your Feedback</h3>
        </div>
        <p className="text-xs text-slate-400 ml-[42px] mb-5">
          How satisfied are you with the current resolution?
        </p>

        <AnimatePresence mode="wait">
          {submitted ? (
            /* ── Success state ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center py-4"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                <CheckCircle2 size={28} className="text-emerald-500" />
              </div>
              <p className="font-semibold text-slate-800 text-sm">Thank you for your feedback!</p>
              <p className="text-xs text-slate-400 mt-1">Your response has been recorded.</p>

              {/* Show submitted stars */}
              <div className="flex gap-1 mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className={star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                  />
                ))}
              </div>
              {comment && (
                <p className="text-xs text-slate-500 mt-2 italic max-w-[200px] line-clamp-2">"{comment}"</p>
              )}
            </motion.div>
          ) : (
            /* ── Input state ── */
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Star Rating */}
              <div className="flex flex-col items-center mb-5">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => !isReadOnly && setHoveredStar(star)}
                      onMouseLeave={() => !isReadOnly && setHoveredStar(0)}
                      onClick={() => !isReadOnly && setRating(star)}
                      className="focus:outline-none transition-colors"
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      <Star
                        size={28}
                        className={`transition-colors duration-150 ${
                          star <= displayRating
                            ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                            : 'text-slate-200 hover:text-slate-300'
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>

                {/* Rating label */}
                <AnimatePresence mode="wait">
                  {displayRating > 0 && (
                    <motion.span
                      key={displayRating}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="mt-2 text-xs font-semibold tracking-wide text-amber-500"
                    >
                      {LABELS[displayRating - 1]}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Comment textarea */}
              <div className="relative mb-4">
                <textarea
                  id="feedback-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience (optional)…"
                  rows={3}
                  maxLength={500}
                  className="w-full text-sm rounded-lg border border-slate-200 bg-slate-50/50 
                    px-4 py-3 text-slate-700 placeholder:text-slate-300
                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40
                    resize-none transition-all duration-200"
                />
                <span className="absolute bottom-2.5 right-3 text-[10px] text-slate-300">
                  {comment.length}/500
                </span>
              </div>

              {/* Error */}
              {error && (
                <p className="text-xs text-red-500 mb-3 font-medium">{error}</p>
              )}

              {/* Submit button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isSubmitting || rating === 0}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 
                  rounded-lg text-sm font-semibold transition-all duration-200
                  ${rating > 0
                    ? 'bg-gradient-to-r from-primary to-orange-500 text-white shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }
                  disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Submitting…
                  </span>
                ) : (
                  <>
                    <Send size={14} />
                    Submit Feedback
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
