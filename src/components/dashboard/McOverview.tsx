import { BarChart, Activity, Map as MapIcon, AlertTriangle, Users, Building2 } from "lucide-react";

export function McOverview() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Municipal Corporation Dashboard</h1>
          <p className="text-slate-600 mt-1">Local governance monitoring and city-wide grievance management.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
            City Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
            Local Alert
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "City Grievances", value: "3,120", change: "+5.4%", icon: <Activity className="text-blue-600" />, trend: "up" },
          { label: "Sanitation Score", value: "92%", change: "+0.5%", icon: <BarChart className="text-emerald-600" />, trend: "up" },
          { label: "Ward Officers", value: "48", change: "Stable", icon: <Users className="text-blue-600" />, trend: "up" },
          { label: "Pending Repairs", value: "154", change: "-12", icon: <AlertTriangle className="text-orange-600" />, trend: "down" },
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
        {/* Ward Performance */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-8">
            <Building2 size={18} className="text-blue-600" />
            Ward Performance Breakdown
          </h3>
          <div className="space-y-6">
            {[
              { ward: "Ward 12 (Central)", resolved: 45, total: 50, color: "bg-blue-500" },
              { ward: "Ward 5 (North)", resolved: 38, total: 40, color: "bg-emerald-500" },
              { ward: "Ward 8 (West)", resolved: 22, total: 45, color: "bg-amber-500" },
              { ward: "Ward 3 (East)", resolved: 30, total: 35, color: "bg-indigo-500" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">{item.ward}</span>
                  <span className="text-[10px] font-bold text-slate-400">{item.resolved}/{item.total} Resolved</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${(item.resolved/item.total)*100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Local Map */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 text-white h-full">
            <h3 className="font-bold flex items-center gap-2 mb-6 text-blue-400">
              <MapIcon size={18} />
              City Hotspots
            </h3>
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 italic text-xs text-slate-400 text-center py-12">
                City map view is loading...
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
