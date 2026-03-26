import { Check, Clock, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

/* ──────────────────────────── Types ──────────────────────────── */

export type ComplaintStatus =
  | 'submitted'
  | 'classified'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'flagged_spam';

interface Note {
  text: string;
  created_at: string;
  user_id?: string;
}

interface TimelineProps {
  /** Current backend complaint status */
  status: ComplaintStatus;
  /** ISO timestamp of complaint creation */
  createdAt: string;
  /** Notes array from the complaint document */
  notes?: Note[];
}

/* ──────────────── Stage definitions ──────────────── */

interface Stage {
  key: string;
  title: string;
  /** Which backend statuses mean this stage is reached */
  matchStatuses: ComplaintStatus[];
}

const STAGES: Stage[] = [
  {
    key: 'submitted',
    title: 'Submitted',
    matchStatuses: ['submitted', 'classified', 'assigned', 'in_progress', 'resolved', 'closed', 'flagged_spam'],
  },
  {
    key: 'under_review',
    title: 'Under Review',
    matchStatuses: ['classified', 'assigned', 'in_progress', 'resolved', 'closed'],
  },
  {
    key: 'resolved',
    title: 'Grievance Resolved',
    matchStatuses: ['resolved', 'closed'],
  },
];

/* ────────────────── Helpers ────────────────── */

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ', ' +
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
}

/** Return a description for a stage, pulling from notes when possible */
function getStageDescription(stageKey: string, _status: ComplaintStatus, notes: Note[]): string {
  // Try to find the most recent note whose text loosely matches the stage
  const matchingNote = notes.find((n) => {
    const t = n.text.toLowerCase();
    if (stageKey === 'submitted') return t.includes('submit') || t.includes('categori') || t.includes('filed') || t.includes('reported');
    if (stageKey === 'under_review') return t.includes('assign') || t.includes('review') || t.includes('department');
    if (stageKey === 'resolved') return t.includes('resolv') || t.includes('repair') || t.includes('fixed') || t.includes('completed');
    return false;
  });
  if (matchingNote) return matchingNote.text;

  // Fallback descriptions
  const defaults: Record<string, string> = {
    submitted: 'Grievance reported and automatically categorized by Saarthii AI.',
    under_review: 'Your complaint is being reviewed by the assigned department.',
    resolved: 'The issue has been addressed and resolved.',
  };
  return defaults[stageKey] ?? '';
}

/** Return the timestamp for a stage */
function getStageTimestamp(stageKey: string, createdAt: string, notes: Note[]): string | null {
  if (stageKey === 'submitted') return formatTimestamp(createdAt);

  const matchingNote = notes.find((n) => {
    const t = n.text.toLowerCase();
    if (stageKey === 'under_review') return t.includes('assign') || t.includes('review') || t.includes('department');
    if (stageKey === 'resolved') return t.includes('resolv') || t.includes('repair') || t.includes('fixed') || t.includes('completed');
    return false;
  });
  return matchingNote ? formatTimestamp(matchingNote.created_at) : null;
}

/* ─────────────── Determine stage state ─────────────── */

type StageState = 'completed' | 'current' | 'pending';

function getStageState(_stage: Stage, _currentStatus: ComplaintStatus, stageIndex: number, activeIndex: number): StageState {
  if (stageIndex < activeIndex) return 'completed';
  if (stageIndex === activeIndex) return 'current';
  return 'pending';
}

/* ─────────────── Progress percentage ─────────────── */

function getActiveIndex(status: ComplaintStatus): number {
  // Walk stages top-down and find the highest reached
  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (STAGES[i].matchStatuses.includes(status)) return i;
  }
  return 0;
}

function getProgressPercent(activeIndex: number): number {
  // 0 → ~15%, 1 → ~55%, 2 → 100%
  const percents = [15, 55, 100];
  return percents[activeIndex] ?? 15;
}

/* ═══════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════ */

export function TimelineComponent({ status, createdAt, notes = [] }: TimelineProps) {
  const activeIndex = useMemo(() => getActiveIndex(status), [status]);
  const progressPercent = useMemo(() => getProgressPercent(activeIndex), [activeIndex]);

  // Render stages top-to-bottom (Resolved first, Submitted last — like the screenshot)
  const stagesReversed = useMemo(() => [...STAGES].reverse(), []);

  return (
    <div className="relative ml-3 my-6">
      {/* ── Background track (grey) ── */}
      <div className="absolute left-[9px] top-0 bottom-0 w-[3px] rounded-full bg-slate-200" />

      {/* ── Filled progress line (accent, grows from bottom) ── */}
      <motion.div
        className="absolute left-[9px] bottom-0 w-[3px] rounded-full"
        style={{
          background: 'linear-gradient(to top, #10b981, #3b82f6, #f59e0b)',
        }}
        initial={{ height: '0%' }}
        animate={{ height: `${progressPercent}%` }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      />

      {/* ── Stage entries ── */}
      <div className="relative space-y-10">
        {stagesReversed.map((stage, visualIdx) => {
          const realIndex = STAGES.length - 1 - visualIdx;
          const state = getStageState(stage, status, realIndex, activeIndex);
          const description = getStageDescription(stage.key, status, notes);
          const timestamp = getStageTimestamp(stage.key, createdAt, notes);

          return (
            <motion.div
              key={stage.key}
              className="relative pl-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.15 * (visualIdx + 1),
              }}
            >
              {/* Icon circle */}
              <span
                className={`
                  absolute left-0 top-0.5 flex h-5 w-5 items-center justify-center rounded-full
                  ring-[3px] ring-white transition-all duration-500
                  ${state === 'completed'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                    : state === 'current'
                      ? 'bg-blue-500 text-white shadow-md shadow-blue-200'
                      : 'bg-slate-200 text-slate-400'
                  }
                `}
              >
                {state === 'completed' ? (
                  <Check size={11} strokeWidth={3} />
                ) : state === 'current' ? (
                  <Edit3 size={10} strokeWidth={2.5} />
                ) : (
                  <Clock size={10} strokeWidth={2} />
                )}

                {/* Pulse ring on current stage */}
                {state === 'current' && (
                  <span className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-30" />
                )}
              </span>

              {/* Text content */}
              <h3
                className={`font-semibold text-sm leading-tight ${
                  state === 'pending' ? 'text-slate-400' : 'text-slate-900'
                }`}
              >
                {stage.title}
              </h3>

              {timestamp && (
                <time className="block mt-0.5 text-xs font-medium text-blue-400 tracking-wide">
                  {timestamp}
                </time>
              )}

              <p
                className={`text-sm mt-1 leading-relaxed ${
                  state === 'pending' ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {state !== 'pending' ? description : 'Awaiting update…'}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
