import { ClipboardList, Clock, CheckCircle2, AlertCircle, BarChart3, MessageSquare } from "lucide-react";

export function OfficerOverview() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Officer Dashboard</h1>
          <p className="text-slate-600 mt-2">Manage and resolve assigned grievances efficiently.</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">SLA Status</span>
          <div className="flex gap-2 mt-1">
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">92% On-Time</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="size-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <ClipboardList className="size-5" />
            </div>
            <span className="text-xs font-medium text-slate-400">Assigned</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">24</h3>
          <p className="text-xs text-slate-500 mt-1">+3 since yesterday</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="size-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="size-5" />
            </div>
            <span className="text-xs font-medium text-slate-400">In Progress</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">14</h3>
          <p className="text-xs text-amber-600 mt-1">5 near SLA deadline</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="size-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="size-5" />
            </div>
            <span className="text-xs font-medium text-slate-400">Resolved</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">156</h3>
          <p className="text-xs text-emerald-600 mt-1">8 resolved today</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="size-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertCircle className="size-5" />
            </div>
            <span className="text-xs font-medium text-slate-400">Overdue</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">2</h3>
          <p className="text-xs text-rose-600 mt-1">Requires immediate action</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assignments List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Priority Assignments</h2>
              <button className="text-xs font-bold text-primary hover:underline">View All</button>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { id: "GRV-8821", title: "Drainage Blockage - Ward 5", time: "2h remaining", type: "Urgent", status: "New" },
                { id: "GRV-8815", title: "Illegal Construction Report", time: "1d remaining", type: "Standard", status: "In Progress" },
                { id: "GRV-8792", title: "Sanitation Dept Request", time: "4h remaining", type: "Urgent", status: "In Progress" },
              ].map((item) => (
                <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                  <div className="flex gap-4 items-start">
                    <div className={`mt-1 size-2 rounded-full ${item.type === 'Urgent' ? 'bg-rose-500' : 'bg-slate-300'}`}></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.id}</span>
                        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors">{item.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Clock size={12} /> {item.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors">
                      <MessageSquare size={16} />
                    </button>
                    <button className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-md hover:bg-primary hover:text-white transition-all">
                      Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Performance */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl shadow-slate-200">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <BarChart3 size={18} className="text-primary" />
              Performance Metrics
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Resolution Rate</span>
                  <span className="font-bold">88%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[88%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Avg. Response Time</span>
                  <span className="font-bold">4.2h</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[75%]"></div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest">Efficiency</p>
                <p className="text-lg font-black text-primary">+12%</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest">Feedback</p>
                <p className="text-lg font-black text-primary">4.8/5</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">SLA Deadlines (Today)</h3>
            <div className="space-y-4">
              <div className="flex gap-3 pb-4 border-b border-slate-50">
                <div className="w-1 bg-rose-500 rounded-full"></div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Pipeline Leakage #8821</p>
                  <p className="text-[10px] text-rose-600 font-bold mt-1">Expiring in 45 mins</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-1 bg-amber-500 rounded-full"></div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Garbage Heap #8799</p>
                  <p className="text-[10px] text-amber-600 font-bold mt-1">Expiring in 3h 12m</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
