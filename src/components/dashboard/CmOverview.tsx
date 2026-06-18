import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  TrendingUp,
  AlertTriangle,
  Building2,
  Clock,
  FileText,
  Loader2,
  Shield,
  Search,
  CheckCircle2,
  ChevronRight,
  Star,
  Printer,
  X,
  MapPin
} from "lucide-react";
import apiFetch from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface DashboardData {
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
    location?: { city: string; address?: string };
    created_at: string;
    department?: string;
    ministry?: string;
  }[];
  crisis_alerts: {
    _id: string;
    title: string;
    priority: string;
    category: string;
    location?: { city: string; address?: string };
    created_at: string;
    department?: string;
    ministry?: string;
  }[];
  department_performance: {
    dept: string;
    total: number;
    resolved: number;
  }[];
  department_feedback: {
    department: string;
    average_rating: number;
    total_feedbacks: number;
  }[];
}

const STATUS_BADGE: Record<string, string> = {
  submitted: "bg-slate-100 text-slate-700 border-slate-200",
  classified: "bg-sky-50 text-sky-700 border-sky-200",
  assigned: "bg-indigo-50 text-indigo-700 border-indigo-200",
  in_progress: "bg-amber-50 text-amber-700 border-amber-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const PRIORITY_BADGE: Record<string, string> = {
  low: "bg-slate-100 text-slate-600 border-slate-200",
  medium: "bg-blue-50 text-blue-700 border-blue-200",
  high: "bg-amber-50 text-amber-700 border-amber-200",
  critical: "bg-rose-50 text-rose-700 border-rose-200 animate-pulse",
};

const CATEGORY_COLORS = [
  "bg-indigo-600",
  "bg-violet-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
];

export function CmOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Escalation feedback modal
  const [escalatedMessage, setEscalatedMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const result = await apiFetch("/dashboard/delhi_cm");
        setData(result);
      } catch (err: any) {
        setError(err.message || "Failed to load CM dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleEscalate = (id: string, title: string) => {
    setEscalatedMessage(`Grievance [${id.slice(-6).toUpperCase()}] "${title}" has been escalated directly to the chief engineer. Department notified via SMS & WhatsApp.`);
    setTimeout(() => setEscalatedMessage(null), 5000);
  };

  const handlePrintReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          <p className="text-slate-600 font-semibold text-lg animate-pulse">Loading CM Grievance Portal...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center max-w-md shadow-lg">
          <AlertTriangle className="w-14 h-14 text-rose-500 mx-auto mb-4" />
          <h3 className="font-bold text-rose-950 text-xl mb-2">Access Denied / Error</h3>
          <p className="text-rose-700 text-sm mb-4">{error || "Something went wrong loading dashboard data."}</p>
          <button onClick={() => window.location.reload()} className="px-5 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors">Retry Connection</button>
        </div>
      </div>
    );
  }

  const activeComplaints =
    (data.status_breakdown.assigned || 0) +
    (data.status_breakdown.in_progress || 0) +
    (data.status_breakdown.classified || 0);

  // Filtered Complaints list
  const filteredComplaints = data.recent_complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.department && c.department.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDistrict = filterDistrict === "all" || c.location?.city === filterDistrict;
    const matchesDept = filterDepartment === "all" || c.department === filterDepartment;
    const matchesPriority = filterPriority === "all" || c.priority === filterPriority;
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;

    return matchesSearch && matchesDistrict && matchesDept && matchesPriority && matchesStatus;
  });

  // Extract unique departments and districts for filtering
  const allDepartments = Array.from(new Set(data.recent_complaints.map((c) => c.department).filter(Boolean)));
  const allDistricts = data.by_city.map((d) => d.city);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 print:p-0 print:space-y-4">
      
      {/* Top Banner Alert / Notification */}
      {escalatedMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 shadow-2xl flex gap-4 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl h-fit">
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-rose-400">Direct CM Escalation</h4>
            <p className="text-slate-300 text-xs mt-1 leading-relaxed">{escalatedMessage}</p>
          </div>
          <button onClick={() => setEscalatedMessage(null)} className="text-slate-500 hover:text-slate-300 self-start">
            <X size={18} />
          </button>
        </div>
      )}

      {/* CM Dashboard Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-indigo-900/50 print:bg-white print:text-black print:border-none print:shadow-none print:p-4">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none print:hidden" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-rose-500/5 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none print:hidden" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30 print:hidden">
                <Shield size={24} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-indigo-400 font-mono">Government of Delhi</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-white print:text-black">
              Chief Minister's Grievance Dashboard
            </h1>
            {user && (
              <p className="text-xs text-slate-300 mt-1.5 print:text-slate-600 font-semibold font-mono">
                Office of {user.name} • CM Control Center
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3 print:hidden">
            <button 
              onClick={handlePrintReport}
              className="px-5 py-3 bg-white/10 border border-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-extrabold uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95"
            >
              <Printer size={16} /> Print Report
            </button>
            <div className="px-5 py-3 bg-indigo-600 border border-indigo-500 text-white rounded-2xl text-xs font-extrabold uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-indigo-600/30 hover:bg-indigo-700">
              <Activity size={16} className="animate-pulse" /> Live Monitoring
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-4 print:gap-2">
        {[
          {
            label: "Total Registered Grievances",
            value: data.total_complaints.toLocaleString(),
            change: "+12% this week",
            icon: <Activity className="text-indigo-600 size-6" />,
            bg: "from-indigo-500/10 to-indigo-600/5 border-indigo-100",
          },
          {
            label: "Delhi SLA Compliance",
            value: "89.4%",
            change: "Target: > 85%",
            icon: <CheckCircle2 className="text-emerald-600 size-6" />,
            bg: "from-emerald-500/10 to-emerald-600/5 border-emerald-100",
          },
          {
            label: "Active / Pending Grid",
            value: activeComplaints.toLocaleString(),
            change: `${data.status_breakdown.submitted || 0} unassigned`,
            icon: <Clock className="text-amber-600 size-6" />,
            bg: "from-amber-500/10 to-amber-600/5 border-amber-100",
          },
          {
            label: "Department Resolution Rate",
            value: `${data.resolution_rate}%`,
            change: "Avg: 4.8 days to resolve",
            icon: <TrendingUp className="text-rose-600 size-6" />,
            bg: "from-rose-500/10 to-rose-600/5 border-rose-100",
          }
        ].map((card, i) => (
          <div key={i} className={`relative bg-gradient-to-b ${card.bg} border p-6 rounded-3xl shadow-lg shadow-slate-100/40 overflow-hidden flex flex-col justify-between h-40 hover:shadow-xl transition-all hover:-translate-y-1 print:border-slate-300 print:shadow-none print:bg-white print:h-32`}>
            <div className="flex justify-between items-start">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500">{card.label}</span>
              <div className="p-2 bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-slate-100">{card.icon}</div>
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{card.value}</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{card.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Core Widgets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 print:grid-cols-1 print:gap-4">
        
        {/* District Breakdown & Department Workloads (Col Span 3) */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* District Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between print:bg-white print:text-black print:border-slate-300 print:shadow-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[30px] pointer-events-none print:hidden" />
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4 print:border-slate-300">
                <h3 className="font-extrabold text-white text-md tracking-wide uppercase font-mono flex items-center gap-2 print:text-black">
                  <MapPin className="text-indigo-400 size-5" />
                  District Breakdown
                </h3>
                <span className="text-[10px] font-bold text-slate-400 print:text-slate-600">State of Delhi</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                {data.by_city.map((d, i) => {
                  const percentage = data.total_complaints ? Math.round((d.count / data.total_complaints) * 100) : 0;
                  return (
                    <div key={i} className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors print:bg-slate-50 print:border-slate-200">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-200 print:text-slate-800">
                        <span>{d.city}</span>
                        <span>{d.count} ({percentage}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/15 rounded-full overflow-hidden print:bg-slate-200">
                        <div className="h-full bg-indigo-400 rounded-full print:bg-indigo-600" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Department Workloads */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-100 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Building2 className="text-indigo-600 size-5" />
                Department Resolution Rates
              </h3>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Performance KPI</span>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {data.department_performance.map((item, idx) => {
                const resRate = item.total ? Math.round((item.resolved / item.total) * 100) : 0;
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                      <span className="truncate max-w-[200px]">{item.dept}</span>
                      <span className="text-slate-500">{item.resolved}/{item.total} Resolved ({resRate}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
                      <div 
                        className={`h-full ${CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} rounded-full`}
                        style={{ width: `${resRate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Crisis Alerts Feed (Col Span 3) */}
        <div className="lg:col-span-3 bg-rose-50/70 backdrop-blur-2xl border border-rose-100 rounded-3xl p-6 shadow-xl shadow-slate-100 flex flex-col h-full min-h-[500px] print:border-slate-300 print:bg-white print:h-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-200 animate-pulse print:bg-rose-600">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-rose-950 text-lg">Crisis Alerts Feed</h3>
              <p className="text-xs text-rose-700 font-semibold">Immediate intervention required (Critical Priority)</p>
            </div>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[800px]">
            {data.crisis_alerts.length > 0 ? (
              data.crisis_alerts.map((alert) => (
                <div key={alert._id} className="bg-white border border-rose-100 rounded-2xl p-4 flex justify-between items-center shadow-sm hover:border-rose-300 transition-all print:border-slate-200">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-xs font-black text-rose-600 uppercase tracking-widest">{alert.department}</p>
                    <h4 className="text-sm font-extrabold text-slate-900 truncate mt-1">{alert.title}</h4>
                    <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">{alert.location?.city} • {new Date(alert.created_at).toLocaleDateString()}</p>
                  </div>
                  <button 
                    onClick={() => handleEscalate(alert._id, alert.title)}
                    className="px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-rose-200 flex-shrink-0 print:hidden"
                  >
                    Escalate
                  </button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-56 bg-white border border-rose-100 rounded-3xl p-8 text-center shadow-sm">
                <span className="text-emerald-500 font-black flex items-center gap-2 text-sm uppercase tracking-widest"><CheckCircle2 size={20} /> No critical alerts pending</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Row: Department Ratings Feedback */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <Star className="text-amber-500 fill-amber-400 size-5" />
              Citizen Feedback & Department Ratings
            </h3>
            <p className="text-xs font-semibold text-slate-500">Aggregated citizen review ratings on completed resolutions in Delhi</p>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Citizen Transparency</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-4 print:gap-2">
          {data.department_feedback.map((item, idx) => (
            <div key={idx} className="border border-slate-100 bg-slate-50/50 rounded-2xl p-5 hover:border-amber-200 transition-colors flex items-center justify-between shadow-sm print:bg-white print:border-slate-200">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">{item.department}</span>
                <span className="text-xs font-bold text-slate-500 block mt-1">{item.total_feedbacks} citizen reviews</span>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1">
                  <Star className="text-amber-500 fill-amber-400 size-5" />
                  <span className="text-xl font-black text-slate-900">{item.average_rating}</span>
                </div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Rating / 5.0</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Complaint Intake & Real-time Tracking log */}
      <div className="bg-white/70 backdrop-blur-2xl border border-slate-200 rounded-3xl shadow-xl shadow-slate-100 overflow-hidden">
        
        {/* Table Header & Filters */}
        <div className="p-6 border-b border-slate-200 bg-white/40 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-extrabold text-slate-950 text-lg flex items-center gap-2">
                <FileText className="text-indigo-600 size-5" />
                Grievance Intake & Dispatch Registry
              </h3>
              <p className="text-xs font-semibold text-slate-500">Search and filter reported civic concerns across Delhi districts</p>
            </div>
            <div className="flex gap-2">
              <span className="text-xs font-extrabold text-slate-700 bg-slate-100 border px-4 py-2 rounded-xl">
                Found {filteredComplaints.length} records
              </span>
            </div>
          </div>

          {/* Filtering inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 print:hidden">
            {/* Search Input */}
            <div className="relative col-span-1 sm:col-span-2 md:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search description or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 h-10 w-full bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 shadow-sm"
              />
            </div>

            {/* District Filter */}
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 shadow-sm cursor-pointer text-slate-700"
            >
              <option value="all">All Districts</option>
              {allDistricts.map((d, i) => (
                <option key={i} value={d}>{d}</option>
              ))}
            </select>

            {/* Department Filter */}
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 shadow-sm cursor-pointer text-slate-700"
            >
              <option value="all">All Departments</option>
              {allDepartments.map((dept, i) => (
                <option key={i} value={dept}>{dept}</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 shadow-sm cursor-pointer text-slate-700"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 shadow-sm cursor-pointer text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="classified">Classified</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="overflow-x-auto">
          {filteredComplaints.length === 0 ? (
            <div className="p-16 text-center text-slate-500 font-bold">
              No matching grievances found.
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="text-[10px] uppercase tracking-wider text-slate-500 font-black bg-slate-100/50 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4">Title / District</th>
                  <th className="px-6 py-4">Department / Division</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date Filed</th>
                  <th className="px-6 py-4 text-right print:hidden">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredComplaints.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-slate-900 block truncate max-w-[320px]">{c.title}</span>
                      <span className="text-[10px] font-bold text-slate-500 mt-0.5 block">{c.location?.city || "Delhi"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-slate-700 block">{c.department || "Unassigned"}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">{c.category || "General"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[9px] font-extrabold uppercase tracking-widest ${PRIORITY_BADGE[c.priority] || "bg-slate-100"}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-widest ${STATUS_BADGE[c.status] || "bg-slate-100"}`}>
                        {c.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-bold font-mono">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right print:hidden">
                      <button
                        onClick={() => navigate(`/gov-dashboard/tasks/${c._id}`)}
                        className="px-3 py-1.5 bg-slate-50 border hover:bg-slate-100 rounded-xl text-slate-600 hover:text-slate-900 transition-all font-bold text-[10px] uppercase tracking-wider inline-flex items-center gap-1"
                      >
                        Inspect <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
    </div>
  );
}
