import { useEffect, useState } from "react";
import { Clock, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import apiFetch from "@/lib/api";

interface Complaint {
  id: string;
  complaint_id?: string;
  title?: string;
  description?: string;
  status: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

const statusIcon: Record<string, React.ReactNode> = {
  submitted:   <FileText   className="h-4 w-4 text-slate-400" />,
  in_progress: <Loader2   className="h-4 w-4 text-amber-500 animate-spin" />,
  resolved:    <CheckCircle className="h-4 w-4 text-emerald-500" />,
  closed:      <CheckCircle className="h-4 w-4 text-emerald-600" />,
  rejected:    <AlertCircle className="h-4 w-4 text-red-500" />,
};

const statusLabel: Record<string, string> = {
  submitted:   "Submitted",
  classified:  "Under Review",
  assigned:    "Assigned",
  in_progress: "In Progress",
  resolved:    "Resolved",
  closed:      "Closed",
  rejected:    "Rejected",
};

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function ActivityLogs() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch("/complaints/my")
      .then(data => setComplaints(Array.isArray(data) ? data : data?.complaints ?? []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Activity Logs</h1>
        <p className="text-slate-500 mt-1 text-sm">A history of all your grievance submissions and updates.</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>
      )}

      {!loading && !error && complaints.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
          <Clock className="h-10 w-10 mx-auto mb-3 text-slate-300" />
          <p className="font-medium">No activity yet</p>
          <p className="text-sm mt-1">Your grievance history will appear here once you file a complaint.</p>
        </div>
      )}

      {!loading && complaints.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {complaints.map(c => (
              <li key={c.id} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="mt-0.5">{statusIcon[c.status] ?? <Clock className="h-4 w-4 text-slate-400" />}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 text-sm truncate">
                    {c.title || c.description?.slice(0, 60) || c.complaint_id || c.id}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {c.category && <span className="mr-2">{c.category}</span>}
                    {timeAgo(c.updated_at || c.created_at)}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0
                  ${c.status === "resolved" || c.status === "closed" ? "bg-emerald-50 text-emerald-700" :
                    c.status === "in_progress" || c.status === "assigned" ? "bg-amber-50 text-amber-700" :
                    c.status === "rejected" ? "bg-red-50 text-red-700" :
                    "bg-slate-100 text-slate-600"}`}>
                  {statusLabel[c.status] ?? c.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
