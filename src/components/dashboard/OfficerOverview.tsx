import { ClipboardList, Clock, CheckCircle2, AlertCircle, BarChart3, MessageSquare, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import apiFetch from "@/lib/api";
import { Link } from "react-router-dom";

interface Complaint {
  _id: string;
  title: string;
  status: string;
  created_at: string;
  priority?: string;
  department: string;
}

export function OfficerOverview() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await apiFetch("/complaints/assigned");
        setComplaints(data);
      } catch (err) {
        console.error("Failed to fetch assigned complaints:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const assignedCount = complaints.length;
  const inProgressCount = complaints.filter(c => c.status === "in_progress").length;
  const resolvedCount = complaints.filter(c => c.status === "resolved").length;
  // Overdue placeholder, assume any complaint > 7 days is overdue if not resolved
  const overdueCount = complaints.filter(c => {
    if (c.status === "resolved") return false;
    const days = (new Date().getTime() - new Date(c.created_at).getTime()) / (1000 * 3600 * 24);
    return days > 7;
  }).length;

  const priorityAssignments = complaints.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto drop-shadow-sm font-inter">
      <div className="mb-6 flex justify-between items-end bg-white/40 p-6 rounded-3xl backdrop-blur-md border border-white/60">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Officer Dashboard</h1>
          <p className="text-slate-600 mt-2 font-medium">Manage and resolve assigned grievances efficiently.</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/50 px-3 py-1 rounded-full border border-white/60">SLA Status</span>
          <div className="flex gap-2 mt-2 justify-end">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-black tracking-wide border border-emerald-200">89% On-Time</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-bold animate-pulse">Loading real-time operational data...</div>
      ) : (
      <>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-white/80 hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="size-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <ClipboardList className="size-6" />
              </div>
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest bg-white/50 px-2 py-1 rounded-lg">Assigned</span>
            </div>
            <h3 className="text-4xl font-black text-slate-900">{assignedCount}</h3>
            <p className="text-xs font-bold text-slate-500 mt-2">Total active assignments</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-white/80 hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="size-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-200">
                <Clock className="size-6" />
              </div>
              <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">In Progress</span>
            </div>
            <h3 className="text-4xl font-black text-slate-900">{inProgressCount}</h3>
            <p className="text-xs font-bold text-slate-500 mt-2">Currently being handled</p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-white/80 hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="size-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-200">
                <CheckCircle2 className="size-6" />
              </div>
              <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">Resolved</span>
            </div>
            <h3 className="text-4xl font-black text-slate-900">{resolvedCount}</h3>
            <p className="text-xs font-bold text-slate-500 mt-2">Total resolved by you</p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-white/80 hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="size-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-200">
                <AlertCircle className="size-6" />
              </div>
              <span className="text-[10px] font-black uppercase text-rose-600 tracking-widest bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">Overdue</span>
            </div>
            <h3 className="text-4xl font-black text-slate-900">{overdueCount}</h3>
            <p className="text-xs font-bold text-rose-600 mt-2">Requires immediate action</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assignments List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-xl shadow-slate-200/50 border border-white overflow-hidden">
              <div className="p-6 border-b border-white/60 bg-white/40 flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><ClipboardList size={20}/></div>
                  Recent Assignments
                </h2>
                <Link to="/gov-dashboard/sla" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100 flex items-center gap-1 transition-all">View All <ChevronRight size={14}/></Link>
              </div>
              <div className="divide-y divide-white/60">
                {priorityAssignments.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 font-bold">No active assignments right now.</div>
                ) : priorityAssignments.map((item) => (
                  <div key={item._id} className="p-6 flex items-center justify-between hover:bg-white/60 transition-colors group">
                    <div className="flex gap-4 items-start">
                      <div className={`mt-1 size-2 rounded-full shadow-sm ${item.status === 'resolved' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
                      <div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item._id.slice(-6)} • {item.department}</span>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors max-w-sm truncate">{item.title}</h4>
                        </div>
                        <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-1">
                          <Clock size={12} /> {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ${
                        item.status === 'resolved' ? 'bg-emerald-100 text-emerald-800 border fill-emerald-200' : 
                        item.status === 'in_progress' ? 'bg-amber-100 text-amber-800 border fill-amber-200' : 
                        'bg-blue-100 text-blue-800 border fill-blue-200'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                      <Link to={`/gov-dashboard/tasks/${item._id}`} className="px-3 py-1.5 bg-white text-slate-700 border border-slate-200 shadow-sm text-xs font-bold rounded-xl hover:bg-indigo-600 hover:text-white transition-all hover:border-indigo-600">
                        Manage
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Performance */}
          <div className="space-y-6">
            <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 text-white shadow-2xl">
              <h3 className="font-black flex items-center gap-3 mb-6 text-lg">
                <div className="p-2 bg-white/10 rounded-xl"><BarChart3 size={20} className="text-indigo-400" /></div>
                Weekly Metrics
              </h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">Resolution Rate</span>
                    <span className="font-black text-indigo-400">88%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-indigo-500 w-[88%] shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">Avg. Response Time</span>
                    <span className="font-black text-emerald-400">4.2h</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-emerald-500 w-[75%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Efficiency</p>
                  <p className="text-2xl font-black text-indigo-400">+12%</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Feedback</p>
                  <p className="text-2xl font-black text-emerald-400">4.8/5</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
      )}
    </div>
  );
}
