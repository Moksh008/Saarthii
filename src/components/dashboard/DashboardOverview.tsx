import { useState, useEffect, useRef } from "react";
import {
  FileText,
  MessageSquareWarning,
  Activity,
  ShieldCheck,
  Loader2,
  ArrowRight,
  Sparkles,
  Bell,
  TrendingUp,
  Clock,
  ChevronRight,
  AlertTriangle,
  X,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

/* ─────── Animated counter for stat cards ─────── */
function AnimatedCounter({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const step = (ts: number) => {
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [value, duration]);

  return <>{display}</>;
}

/* ─────── Status badge with animated dot ─────── */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; dot: string }> = {
    resolved: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
    closed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
    in_progress: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
    assigned: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500" },
    classified: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
    submitted: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    flagged_spam: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  };
  const s = styles[status] || styles.submitted;
  const label = status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ");

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} animate-pulse`} />
      {label}
    </span>
  );
}

/* ─────── Mini progress ring ─────── */
function ProgressRing({ percent, size = 48, stroke = 4 }: { percent: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="url(#ring-grad)" strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-out"
      />
      <defs>
        <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec5b13" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export function DashboardOverview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [grievances, setGrievances] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await apiFetch("/complaints/my");
        const sorted = data.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setGrievances(sorted);
      } catch (err) {
        console.error("Failed to fetch overview stats", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  const total = grievances.length;
  const resolved = grievances.filter(
    (g) => g.status === "resolved" || g.status === "closed"
  ).length;
  const pending = grievances.filter(
    (g) =>
      g.status === "submitted" ||
      g.status === "in_progress" ||
      g.status === "assigned" ||
      g.status === "classified"
  ).length;
  const recentGrievances = grievances.slice(0, 5);
  const resolvedPercent = total > 0 ? Math.round((resolved / total) * 100) : 0;

  /* Greeting based on time */
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  /* ─── Stats card config ─── */
  const stats = [
    {
      label: "Total Grievances",
      value: total,
      icon: FileText,
      gradient: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Resolved",
      value: resolved,
      icon: ShieldCheck,
      gradient: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Pending",
      value: pending,
      icon: MessageSquareWarning,
      gradient: "from-amber-500 to-orange-600",
      bgLight: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Recent Actions",
      value: total > 0 ? total + 2 : 0,
      icon: Activity,
      gradient: "from-purple-500 to-violet-600",
      bgLight: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-8">
      {/* ░░░ HERO WELCOME BANNER ░░░ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-[#ec5b13] via-[#f07830] to-[#f59e0b] animate-gradient-bg shadow-xl shadow-orange-200/40"
      >
        {/* Decorative circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 animate-float" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10 animate-float delay-200" />
        <div className="absolute top-1/2 right-1/3 w-20 h-20 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 p-8 lg:p-10">
          <div className="flex-1">
            <p className="text-white/80 text-sm font-medium tracking-wider uppercase mb-1">
              <Sparkles className="inline-block size-4 mr-1 -mt-0.5" />
              Citizen Portal
            </p>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {greeting}, {user?.name?.split(" ")[0] || "Citizen"}!
            </h1>
            <p className="text-white/80 mt-3 text-base max-w-md leading-relaxed">
              Your civic dashboard — track complaints, get AI assistance, and stay updated with government services.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => navigate("/dashboard/new-grievance")}
                className="bg-white text-[#ec5b13] font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97] flex items-center gap-2"
              >
                File New Grievance <ArrowRight className="size-4" />
              </button>
              <button
                onClick={() => navigate("/dashboard/my-grievances")}
                className="bg-white/15 text-white backdrop-blur-sm font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/25 transition-all border border-white/20"
              >
                View All
              </button>
            </div>
          </div>
          <div className="hidden lg:block w-52 h-52 flex-shrink-0">
            <img
              src="/images/dashboard_hero.png"
              alt="Smart City"
              className="w-full h-full object-contain animate-float drop-shadow-2xl"
            />
          </div>
        </div>
      </motion.div>

      {/* ░░░ ALERT BANNER ░░░ */}
      <AnimatePresence>
        {alertVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 flex items-start gap-3 shadow-sm relative">
              <div className="mt-0.5 p-1.5 rounded-lg bg-amber-100">
                <AlertTriangle className="size-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900">
                  ⚠️ High number of complaints in Sector 12
                </h4>
                <p className="text-sm text-slate-600 mt-0.5">
                  We are tracking a localized spike in water pressure issues. Engineering teams have been deployed.
                </p>
              </div>
              <button
                onClick={() => setAlertVisible(false)}
                className="p-1 rounded-lg hover:bg-amber-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ░░░ STAT CARDS ░░░ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.45 }}
            className="group relative bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default overflow-hidden"
          >
            {/* Hover shimmer overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer pointer-events-none rounded-2xl" />
            {/* Top accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} opacity-80`} />

            <div className="flex items-center gap-4">
              <div className={`relative size-12 rounded-xl ${stat.bgLight} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`size-5 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-0.5 tabular-nums">
                  {isLoading ? (
                    <Loader2 className="size-6 animate-spin mt-1 text-slate-300" />
                  ) : (
                    <AnimatedCounter value={stat.value} />
                  )}
                </h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ░░░ MAIN CONTENT GRID ░░░ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Recent Grievances ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-[#ec5b13] to-[#f59e0b] rounded-xl">
                  <Clock className="size-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Recent Grievances</h2>
                  <p className="text-xs text-slate-500">Your latest complaints</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/dashboard/my-grievances")}
                className="text-sm font-semibold text-[#ec5b13] hover:text-[#d34f0f] transition-colors flex items-center gap-1"
              >
                View All <ChevronRight className="size-4" />
              </button>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-50">
              {isLoading ? (
                <div className="p-12 flex justify-center">
                  <Loader2 className="size-6 animate-spin text-slate-300" />
                </div>
              ) : recentGrievances.length > 0 ? (
                recentGrievances.map((g: any, idx: number) => (
                  <motion.div
                    key={g._id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + idx * 0.06 }}
                    onClick={() => navigate(`/dashboard/grievances/${g._id}`)}
                    className="group/item px-6 py-4 flex items-center justify-between hover:bg-gradient-to-r hover:from-slate-50 hover:to-white transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="size-10 rounded-xl bg-slate-100 group-hover/item:bg-[#ec5b13]/10 flex items-center justify-center transition-colors flex-shrink-0">
                        <FileText className="size-4 text-slate-400 group-hover/item:text-[#ec5b13] transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-slate-900 truncate group-hover/item:text-[#ec5b13] transition-colors">
                          {g.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(g.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={g.status} />
                      <ChevronRight className="size-4 text-slate-300 group-hover/item:text-[#ec5b13] transition-colors" />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="size-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                    <FileText className="size-7 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium">No grievances yet</p>
                  <p className="text-xs text-slate-400 mt-1">File your first complaint to get started</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Sidebar Widgets ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="space-y-6"
        >
          {/* Resolution Progress */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Resolution Rate</h3>
              <TrendingUp className="size-4 text-emerald-500" />
            </div>
            <div className="flex items-center gap-5">
              <ProgressRing percent={resolvedPercent} size={64} stroke={5} />
              <div>
                <p className="text-3xl font-extrabold text-slate-900">{resolvedPercent}%</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {resolved} of {total} resolved
                </p>
              </div>
            </div>
          </div>

          {/* AI Assistant Card */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#ec5b13]/10 via-orange-50 to-amber-50 border border-[#ec5b13]/15 p-6">
            {/* Decorative glow */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#ec5b13]/10 blur-2xl" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 animate-float">
                <img
                  src="/images/ai_assistant.png"
                  alt="Saarthii AI"
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
              <div>
                <h3 className="font-bold text-[#ec5b13] text-base flex items-center gap-1.5">
                  <Sparkles className="size-4" />
                  Saarthii AI
                </h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Get instant help with filing complaints, checking status, or navigating services.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/dashboard/ai-chat")}
              className="mt-4 w-full bg-gradient-to-r from-[#ec5b13] to-[#f07830] text-white font-bold py-3 px-4 rounded-xl hover:from-[#d34f0f] hover:to-[#ec5b13] transition-all animate-pulse-glow text-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <Sparkles className="size-4" />
              Start AI Assistance
            </button>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <Bell className="size-3.5 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Announcements</h3>
            </div>
            <ul className="space-y-4">
              {[
                {
                  color: "bg-amber-500",
                  title: "Government Update: Property Tax",
                  desc: "Last date for property tax submission extended to 15th April.",
                },
                {
                  color: "bg-blue-500",
                  title: "Public Notice: Road Maintenance",
                  desc: "Expect disruptions on Main Street from 10 PM to 6 AM.",
                },
                {
                  color: "bg-emerald-500",
                  title: "Service Alert: E-Governance Portal",
                  desc: "CPENGRAMS portal — scheduled maintenance this Sunday.",
                },
              ].map((item, i) => (
                <li key={i} className="group/ann flex gap-3 p-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.color} mt-2 shrink-0 ring-2 ring-offset-2 ring-${item.color}/30`} />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 group-hover/ann:text-[#ec5b13] transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
