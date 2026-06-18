import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

/* ───── Types ───── */
interface TrackingData {
  complaint_id: string;
  title: string;
  status: string;
  priority: string;
  ministry: string | null;
  department: string | null;
  created_at: string;
}

/* ───── Status pipeline in order ───── */
const STAGES = [
  {
    key: 'submitted',
    label: 'Submitted',
    description: 'Grievance reported and automatically categorized by Saarthii AI.',
    icon: '📝',
    match: ['submitted'],
  },
  {
    key: 'assigned',
    label: 'Assigned to Officer',
    description: 'Your complaint has been assigned to a concerned government officer.',
    icon: '👤',
    match: ['assigned', 'classified'],
  },
  {
    key: 'in_progress',
    label: 'Under Review',
    description: 'The concerned department is actively working on your grievance.',
    icon: '🔍',
    match: ['in_progress'],
  },
  {
    key: 'resolved',
    label: 'Grievance Resolved',
    description: 'Your grievance has been addressed and resolved.',
    icon: '✅',
    match: ['resolved', 'closed'],
  },
];

function getActiveIndex(status: string): number {
  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (STAGES[i].match.includes(status)) return i;
  }
  return 0;
}

function priorityColor(p: string) {
  switch (p) {
    case 'critical': return { bg: '#fde8e8', text: '#e74c3c', border: '#e74c3c' };
    case 'high':     return { bg: '#fff4e5', text: '#f39c12', border: '#f39c12' };
    case 'medium':   return { bg: '#e8f4fd', text: '#3498db', border: '#3498db' };
    default:         return { bg: '#f0f0f0', text: '#95a5a6', border: '#95a5a6' };
  }
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ', ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

/* ───── Component ───── */
export function TrackGrievance() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const base = (import.meta.env.VITE_API_BASE as string) || '';
    fetch(`${base}/complaints/${id}/track`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Complaint not found');
        return res.json();
      })
      .then((d) => setData(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const activeIndex = data ? getActiveIndex(data.status) : 0;
  const pc = data ? priorityColor(data.priority) : priorityColor('low');

  /* ───── Loading state ───── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm tracking-wide">Loading tracking information…</p>
        </div>
      </div>
    );
  }

  /* ───── Error state ───── */
  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-red-50 to-slate-100">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Complaint Not Found</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            The complaint ID you are looking for does not exist or has been removed.
            Please check the link or QR code and try again.
          </p>
        </div>
      </div>
    );
  }

  /* ───── Main UI ───── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 font-sans">
      {/* ── Top Brand Bar ── */}
      <header className="bg-gradient-to-r from-[#1e3a5f] to-[#2d6a9f] text-white">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
          <img src="/saarthii_logo.png" alt="Saarthii" className="h-9 w-auto" />
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-none">Saarthii</h1>
            <p className="text-[11px] text-blue-200 tracking-wider uppercase">Public Grievance Tracker</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* ── Complaint Summary Card ── */}
        <section
          className="bg-white rounded-2xl shadow-lg overflow-hidden animate-slide-up"
          style={{ animationDelay: '0.05s' }}
        >
          <div className="px-6 pt-6 pb-2 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-400 font-medium tracking-wider uppercase mb-1">
                Complaint ID
              </p>
              <p className="text-sm font-mono text-slate-600 truncate">{data.complaint_id}</p>
            </div>
            <span
              className="self-start inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide"
              style={{ backgroundColor: pc.bg, color: pc.text, border: `1px solid ${pc.border}22` }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pc.text }} />
              {data.priority}
            </span>
          </div>

          <div className="px-6 pb-5">
            <h2 className="text-xl font-bold text-slate-800 leading-snug mt-2 mb-1">{data.title}</h2>

            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500 mt-3">
              {data.ministry && (
                <span className="flex items-center gap-1">
                  <span className="text-base">🏛️</span> {data.ministry}
                </span>
              )}
              {data.department && (
                <span className="flex items-center gap-1">
                  <span className="text-base">📂</span> {data.department}
                </span>
              )}
              <span className="flex items-center gap-1">
                <span className="text-base">📅</span> {formatDate(data.created_at)}
              </span>
            </div>
          </div>
        </section>

        {/* ── Resolution Timeline Card ── */}
        <section
          className="bg-white rounded-2xl shadow-lg overflow-hidden animate-slide-up"
          style={{ animationDelay: '0.15s' }}
        >
          <div className="px-6 pt-6 pb-2">
            <h3 className="text-lg font-bold text-slate-800">Resolution Timeline</h3>
            <p className="text-sm text-slate-400 mt-0.5">Track the progress of your grievance via automated updates.</p>
          </div>

          <div className="px-6 pb-8 pt-4">
            <ol className="relative ml-4">
              {STAGES.slice().reverse().map((stage, visualIdx) => {
                const realIdx = STAGES.length - 1 - visualIdx;
                const isCompleted = realIdx <= activeIndex;
                const isCurrent = realIdx === activeIndex;

                return (
                  <li key={stage.key} className="relative pb-10 last:pb-0 pl-10">
                    {/* Vertical connector line */}
                    {visualIdx < STAGES.length - 1 && (
                      <span
                        className="absolute left-[15px] top-[36px] w-[3px] rounded-full"
                        style={{
                          height: 'calc(100% - 24px)',
                          background: isCompleted && realIdx > 0
                            ? 'linear-gradient(to bottom, #2d6a9f, #60a5fa)'
                            : '#e2e8f0',
                        }}
                      />
                    )}

                    {/* Circle node */}
                    <span
                      className="absolute left-0 top-0 w-[32px] h-[32px] rounded-full flex items-center justify-center text-sm transition-all duration-500"
                      style={{
                        background: isCurrent
                          ? 'linear-gradient(135deg, #1e3a5f, #2d6a9f)'
                          : isCompleted
                            ? '#2d6a9f'
                            : '#e8ecf1',
                        color: isCompleted ? '#fff' : '#94a3b8',
                        boxShadow: isCurrent ? '0 0 0 4px rgba(45,106,159,0.2), 0 4px 12px rgba(45,106,159,0.3)' : 'none',
                      }}
                    >
                      {isCompleted ? stage.icon : '⏳'}
                    </span>

                    {/* Text */}
                    <div>
                      <p
                        className="text-sm font-semibold leading-none"
                        style={{ color: isCompleted ? '#1e3a5f' : '#94a3b8' }}
                      >
                        {stage.label}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-blue-500 mt-1 font-medium">
                          {formatDate(data.created_at)}
                        </p>
                      )}
                      <p
                        className="text-xs mt-1 leading-relaxed"
                        style={{ color: isCompleted ? '#64748b' : '#cbd5e1' }}
                      >
                        {isCompleted ? stage.description : 'Awaiting update…'}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ── Current Status Chip ── */}
        <section
          className="animate-slide-up"
          style={{ animationDelay: '0.25s' }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: 'linear-gradient(135deg, #1e3a5f, #2d6a9f)' }}
            >
              {STAGES[activeIndex].icon}
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Current Status</p>
              <p className="text-lg font-bold text-slate-800 mt-0.5">
                {STAGES[activeIndex].label}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{STAGES[activeIndex].description}</p>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200/60 mt-6">
        <div className="max-w-3xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span>Powered by <strong className="text-slate-600">Saarthii PS-CRM</strong></span>
          <span>Public Grievance Tracking Portal • {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}

export default TrackGrievance;
