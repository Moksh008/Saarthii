import { useState, useEffect } from "react";
import apiFetch from "@/lib/api";
import { Link } from "react-router-dom";
import { ClipboardList, Clock, Search } from "lucide-react";

interface Complaint {
  _id: string;
  title: string;
  status: string;
  created_at: string;
  priority?: string;
  department: string;
}

export function OfficerTasks() {
  const [tasks, setTasks] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await apiFetch("/complaints/assigned");
        setTasks(data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  return (
    <div className="max-w-6xl mx-auto font-inter drop-shadow-sm">
      <div className="mb-6 bg-white/80 p-6 rounded-3xl backdrop-blur-md border border-white/60">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <div className="p-3 bg-indigo-500 text-white rounded-2xl shadow-lg shadow-indigo-200">
            <ClipboardList size={24} />
          </div>
          All Assigned Tasks
        </h1>
        <p className="text-slate-600 mt-2 font-medium">View and manage all grievances assigned to you for resolution.</p>
      </div>

      <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-xl shadow-slate-200/50 border border-white overflow-hidden text-sm">
        <div className="p-6 border-b border-white/60 bg-white/80 flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Search ID, Title, or Department..."
              className="pl-10 w-full h-12 bg-white/80 border-slate-200/50 focus:ring-indigo-500 rounded-2xl shadow-sm backdrop-blur-sm"
            />
          </div>
          <div className="text-sm font-bold text-slate-600 bg-white/80 px-4 py-2 rounded-xl backdrop-blur-sm shadow-sm border border-white/50">
            Total {tasks.length} active assignments
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center text-slate-500 font-bold animate-pulse">Loading assigned tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="p-20 text-center">
              <ClipboardList size={48} className="mx-auto text-slate-300 mb-4" />
              <div className="text-slate-500 font-bold">No tasks currently assigned to you.</div>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="text-[10px] uppercase tracking-wider text-slate-500 font-black bg-white/80 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4">Grievance ID & Title</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date Assigned</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/60">
                {tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-white/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 max-w-xs">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{task._id.slice(-8)}</span>
                        <div className="font-bold text-slate-900 truncate">{task.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-slate-600">{task.department}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm border ${
                        task.status === 'resolved' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 
                        task.status === 'in_progress' ? 'bg-amber-100 text-amber-800 border-amber-200' : 
                        'bg-blue-100 text-blue-800 border-blue-200'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-slate-400" />
                        {new Date(task.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/gov-dashboard/tasks/${task._id}`}
                        className="px-4 py-2 bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white border border-slate-200 shadow-sm text-xs font-bold rounded-xl transition-all"
                      >
                        Action
                      </Link>
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
