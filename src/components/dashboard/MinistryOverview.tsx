import { useState, useEffect } from "react";
import { BarChart, Activity, Map as MapIcon, TrendingUp, AlertTriangle, Building2, Clock, FileText, Loader2, PieChart } from "lucide-react";
import apiFetch from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface DashboardData {
  ministry_name: string;
  total_complaints: number;
  resolution_rate: number;
  status_breakdown: {
    submitted: number;
    classified: number;
    assigned: number;
    in_progress: number;
    resolved: number;
  };
  priority_breakdown: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  top_categories: { category: string; count: number }[];
  by_city: { city: string; count: number }[];
  recent_complaints: {
    _id: string;
    title: string;
    status: string;
    priority: string;
    category: string;
    location?: { city: string };
    created_at: string;
  }[];
  crisis_alerts: {
    _id: string;
    title: string;
    priority: string;
    category: string;
    location?: { city: string };
    created_at: string;
  }[];
  department_performance: {
    dept: string;
    total: number;
    resolved: number;
  }[];
}

const STATUS_COLORS: Record<string, string> = {
  submitted: "bg-slate-400",
  classified: "bg-blue-400",
  assigned: "bg-indigo-500",
  in_progress: "bg-amber-500",
  resolved: "bg-emerald-500",
};

const STATUS_BADGE: Record<string, string> = {
  submitted: "bg-slate-100 text-slate-700",
  classified: "bg-blue-50 text-blue-700",
  assigned: "bg-indigo-50 text-indigo-700",
  in_progress: "bg-amber-50 text-amber-700",
  resolved: "bg-emerald-50 text-emerald-700",
  closed: "bg-emerald-50 text-emerald-700",
};



const CATEGORY_COLORS = [
  "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500",
  "bg-indigo-500", "bg-purple-500",
];

import React from "react";

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-rose-50 text-rose-800 rounded-xl m-8 border border-rose-200 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Dashboard Rendering Error</h2>
          <pre className="whitespace-pre-wrap text-sm font-mono overflow-auto">{this.state.error?.toString()}</pre>
          <pre className="whitespace-pre-wrap text-xs font-mono overflow-auto mt-4 text-rose-600/80">{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export function MinistryOverview() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiFetch("/dashboard/ministry");
        setData(result);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-slate-500 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h3 className="font-bold text-rose-900 text-lg mb-2">Error Loading Dashboard</h3>
          <p className="text-rose-700 text-sm">{error || "Something went wrong"}</p>
        </div>
      </div>
    );
  }

  const activeComplaints = data.status_breakdown.assigned + data.status_breakdown.in_progress;

  return (
    <ErrorBoundary>
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Ministry Governance Dashboard</h1>
          <p className="text-slate-600 mt-1 flex items-center gap-2">
            <Building2 size={16} className="text-primary" />
            {data.ministry_name}
          </p>
          {user && <p className="text-sm text-slate-400 mt-0.5">Logged in as <span className="font-semibold text-slate-600">{user.name}</span></p>}
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2">
            <TrendingUp size={16} /> Generate Report
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
            Live Preview
          </button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Complaints",
            value: data.total_complaints.toLocaleString(),
            icon: <Activity className="text-blue-600" />,
            bg: "bg-blue-50",
          },
          {
            label: "Resolution Rate",
            value: `${data.resolution_rate}%`,
            icon: <BarChart className="text-emerald-600" />,
            bg: "bg-emerald-50",
          },
          {
            label: "Active (In-Progress)",
            value: activeComplaints.toLocaleString(),
            icon: <Clock className="text-amber-600" />,
            bg: "bg-amber-50",
          },
          {
            label: "Critical Alerts",
            value: data.priority_breakdown.critical.toLocaleString(),
            icon: <AlertTriangle className="text-rose-600" />,
            bg: "bg-rose-50",
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`size-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Middle Grid: Dept Performance & Regional */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Department Performance */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Building2 size={18} className="text-primary" />
              Department Wise Performance
            </h3>
          </div>
          <div className="space-y-6">
            {data.department_performance.length > 0 ? data.department_performance.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">{item.dept}</span>
                  <span className="text-[10px] font-bold text-slate-400">{item.resolved}/{item.total} Resolved</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]} transition-all duration-700`}
                    style={{ width: item.total ? `${(item.resolved / item.total) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            )) : (
              <div className="text-center text-sm text-slate-500 py-4">No department data available.</div>
            )}
          </div>
        </div>

        {/* Regional Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-200 h-full">
            <h3 className="font-bold flex items-center gap-2 mb-6 text-primary">
              <MapIcon size={18} />
              Regional Breakdown
            </h3>
            <div className="space-y-4">
              {data.by_city.map((r, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">{r.city}</p>
                    <p className="text-lg font-bold mt-1">{r.count}</p>
                  </div>
                  <div className="text-xs font-bold text-white/50">
                    {data.total_complaints ? Math.round((r.count / data.total_complaints) * 100) : 0}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Crisis Alerts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crisis Alerts */}
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 bg-rose-600 rounded-lg flex items-center justify-center text-white">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 className="font-bold text-rose-950">Crisis Alerts</h4>
              <p className="text-xs text-rose-700">Immediate attention required across regions</p>
            </div>
          </div>
          <div className="space-y-3">
            {data.crisis_alerts.length > 0 ? data.crisis_alerts.map((alert) => (
              <div key={alert._id} className="p-4 bg-white border border-rose-200 rounded-xl flex justify-between items-center shadow-sm">
                <div className="flex-1 pr-4">
                  <p className="text-sm font-bold text-slate-900 line-clamp-1">{alert.title}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapIcon size={12} /> {alert.location?.city || "Unknown Location"}
                  </p>
                </div>
                <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded text-[10px] font-bold tracking-wider">CRITICAL</span>
              </div>
            )) : (
              <div className="p-6 bg-white border border-rose-200 rounded-xl text-center shadow-sm">
                <p className="text-sm text-emerald-600 font-bold flex items-center justify-center gap-2">
                  <Activity size={16} /> No active crisis alerts
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Breakdown Combined */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-6">
            <PieChart size={18} className="text-indigo-500" />
            Platform Diagnostics
          </h4>
          
          <div className="space-y-6">
             {/* Priority Small Blocks */}
             <div>
               <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">By Priority</p>
               <div className="grid grid-cols-4 gap-2">
                  {Object.entries(data.priority_breakdown).map(([priority, count], i) => (
                    <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                      <div className="text-lg font-black text-slate-800">{count}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase mt-1">{priority}</div>
                    </div>
                  ))}
               </div>
             </div>

             {/* Status Progress Bar */}
             <div>
               <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Workflow Funnel</p>
               <div className="flex w-full h-3 rounded-full overflow-hidden mb-2">
                 {Object.entries(data.status_breakdown).map(([status, count]) => {
                   if (count === 0) return null;
                   return (
                     <div 
                       key={status} 
                       className={`${STATUS_COLORS[status] || "bg-slate-400"} h-full`} 
                       style={{ width: `${(count / data.total_complaints) * 100}%` }}
                       title={`${status}: ${count}`}
                     />
                   );
                 })}
               </div>
               <div className="flex flex-wrap gap-3">
                 {Object.entries(data.status_breakdown).filter(([_, c]) => c > 0).map(([status, count]) => (
                   <div key={status} className="flex items-center gap-1.5">
                     <div className={`size-2.5 rounded-sm ${STATUS_COLORS[status] || "bg-slate-400"}`} />
                     <span className="text-[10px] font-bold text-slate-600 uppercase">{status.replace("_", "")} ({count})</span>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Top Categories & Recent Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Top Categories */}
         <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-emerald-500" />
            Top Complaint Categories
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.top_categories.map((c, i) => {
              const pct = data.total_complaints ? Math.round((c.count / data.total_complaints) * 100) : 0;
              return (
                <div key={i} className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-all flex flex-col justify-between h-24">
                  <span className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">{c.category}</span>
                  <div className="flex items-end justify-between">
                    <span className="text-xl font-black text-slate-900">{pct}%</span>
                    <div className={`size-3 rounded-full ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]} animate-pulse`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              Recent Complaints
            </h4>
          </div>
          <div className="space-y-3">
            {data.recent_complaints.map((c) => (
              <div key={c._id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{c.title}</p>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                    {c.location?.city || "Unknown"} • {c.category || "Uncategorized"}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${STATUS_BADGE[c.status] || "bg-slate-100 text-slate-600"}`}>
                    {c.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
