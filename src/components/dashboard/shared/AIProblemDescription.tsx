import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/lib/api';

interface AIProblemDescriptionProps {
  complaintId: string;
}

export function AIProblemDescription({ complaintId }: AIProblemDescriptionProps) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchSummary() {
    setIsLoading(true);
    setError('');
    try {
      const data = await apiFetch(`/complaints/${complaintId}/ai-summary`);
      setSummary(data.summary);
    } catch (err: any) {
      console.error('AI summary error:', err);
      setError(err.message || 'Unable to generate AI summary.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (complaintId) fetchSummary();
  }, [complaintId]);

  return (
    <div className="bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/60 p-6 rounded-xl border border-indigo-100/80 shadow-sm relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-violet-200/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 shadow-md shadow-indigo-200/50">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm leading-tight">AI Problem Analysis</h3>
            <p className="text-[11px] text-slate-400">Powered by GPT-4o</p>
          </div>
        </div>
        {!isLoading && (
          <button
            onClick={fetchSummary}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all duration-200"
            title="Regenerate summary"
          >
            <RefreshCw size={14} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="relative min-h-[48px]">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2.5"
            >
              {/* Skeleton shimmer lines */}
              <div className="h-3.5 w-full rounded-md bg-slate-200/60 animate-pulse" />
              <div className="h-3.5 w-[90%] rounded-md bg-slate-200/60 animate-pulse delay-100" />
              <div className="h-3.5 w-[70%] rounded-md bg-slate-200/60 animate-pulse delay-200" />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2 text-red-500"
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium">{error}</p>
                <button
                  onClick={fetchSummary}
                  className="text-[11px] mt-1 text-indigo-500 hover:underline font-medium"
                >
                  Try again
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.p
              key="summary"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm text-slate-600 leading-relaxed"
            >
              {summary}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
