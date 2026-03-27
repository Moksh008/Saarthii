import { BarChart, Activity, Map as MapIcon, TrendingUp, AlertTriangle, Users, Building2 } from "lucide-react";

export function MinistryOverview() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header with quick actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Ministry Governance Dashboard</h1>
          <p className="text-slate-600 mt-1">Real-time monitoring of citizen grievances and departmental performance across the region.</p>
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
          { label: "Total Complaints", value: "45,210", change: "+12.5%", icon: <Activity className="text-blue-600" />, trend: "up" },
          { label: "Resolution Rate", value: "84.2%", change: "+2.1%", icon: <BarChart className="text-emerald-600" />, trend: "up" },
          { label: "Active Officers", value: "1,240", change: "+5", icon: <Users className="text-purple-600" />, trend: "up" },
          { label: "Critical Alerts", value: "12", change: "-4", icon: <AlertTriangle className="text-rose-600" />, trend: "down" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center">
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Department Performance Chart placeholder */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Building2 size={18} className="text-primary" />
              Department Wise Performance
            </h3>
            <select className="text-xs font-bold bg-slate-50 border-none outline-none rounded-md px-2 py-1">
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
            </select>
          </div>

          <div className="space-y-6">
            {[
              { dept: "Public Works (PWD)", resolved: 85, total: 120, color: "bg-blue-500" },
              { dept: "Water Sanitation", resolved: 92, total: 100, color: "bg-emerald-500" },
              { dept: "Electricity Board", resolved: 64, total: 150, color: "bg-amber-500" },
              { dept: "Police Dept", resolved: 110, total: 120, color: "bg-indigo-500" },
              { dept: "Education Board", resolved: 45, total: 50, color: "bg-purple-500" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">{item.dept}</span>
                  <span className="text-[10px] font-bold text-slate-400">{item.resolved}/{item.total} Resolved</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${(item.resolved / item.total) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories / Regional Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-200 h-full">
            <h3 className="font-bold flex items-center gap-2 mb-6 text-primary">
              <MapIcon size={18} />
              Regional Heatmap
            </h3>
            <div className="space-y-5">
              {[
                { region: "North Zone", count: "12,450", trend: "up" },
                { region: "South Zone", count: "8,210", trend: "down" },
                { region: "East Zone", count: "15,600", trend: "up" },
                { region: "West Zone", count: "8,950", trend: "up" },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">{r.region}</p>
                    <p className="text-lg font-bold mt-1">{r.count}</p>
                  </div>
                  <TrendingUp size={20} className={r.trend === 'up' ? "text-rose-400" : "text-emerald-400"} />
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-bold transition-all border border-white/10">
              Open Interactive Map
            </button>
          </div>
        </div>
      </div>

      {/* Crisis Alerts & Recent Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 bg-rose-600 rounded-lg flex items-center justify-center text-white">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 className="font-bold text-rose-950">Crisis Alerts</h4>
              <p className="text-xs text-rose-700">Immediate attention required in these areas</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-white border border-rose-200 rounded-xl flex justify-between items-center">
              <p className="text-sm font-bold text-slate-900">Flood Warning - Sector 9</p>
              <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded text-[10px] font-bold">CRITICAL</span>
            </div>
            <div className="p-4 bg-white border border-rose-200 rounded-xl flex justify-between items-center shadow-sm">
              <p className="text-sm font-bold text-slate-900">Health Outbreak - Slum Cluster 2</p>
              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-[10px] font-bold">WARNING</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-500" />
              Popular Complaint Categories
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Drainage", value: "34%", color: "bg-blue-500" },
              { label: "Electricity", value: "24%", color: "bg-amber-500" },
              { label: "Public Health", value: "18%", color: "bg-rose-500" },
              { label: "Police/Security", value: "14%", color: "bg-indigo-500" },
            ].map((c, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-all flex flex-col justify-between h-24">
                <span className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">{c.label}</span>
                <div className="flex items-end justify-between">
                  <span className="text-xl font-black text-slate-900">{c.value}</span>
                  <div className={`size-3 rounded-full ${c.color} animate-pulse`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
