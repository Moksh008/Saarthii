import { Activity, Map as MapIcon, TrendingUp, AlertTriangle, Users, Building2 } from "lucide-react";

export function MlaMPOverview() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Legislative Dashboard (MP/MLA)</h1>
          <p className="text-slate-600 mt-1">Constituency-level grievance monitoring and impact assessment.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
            Constituency Report
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all">
            Public Broadcast
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Constituency Cases", value: "1,840", change: "+8.2%", icon: <Activity className="text-purple-600" />, trend: "up" },
          { label: "Public Approval", value: "76%", change: "+4.1%", icon: <Users className="text-emerald-600" />, trend: "up" },
          { label: "Actioned Items", value: "412", change: "+15", icon: <TrendingUp className="text-purple-600" />, trend: "up" },
          { label: "Urgent Petitions", value: "8", change: "-2", icon: <AlertTriangle className="text-rose-600" />, trend: "down" },
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
        {/* District Performance */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-8">
            <Building2 size={18} className="text-purple-600" />
            District Wise Grievance Status
          </h3>
          <div className="space-y-6">
            {[
              { dist: "Central District", resolved: 145, total: 180, color: "bg-purple-500" },
              { dist: "East District", resolved: 98, total: 110, color: "bg-emerald-500" },
              { dist: "West District", resolved: 65, total: 150, color: "bg-amber-500" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">{item.dist}</span>
                  <span className="text-[10px] font-bold text-slate-400">{item.resolved}/{item.total} Resolved</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${(item.resolved/item.total)*100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 text-white h-full">
            <h3 className="font-bold flex items-center gap-2 mb-6 text-purple-400">
              <MapIcon size={18} />
              Constituency Map
            </h3>
            <div className="space-y-4">
               <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                 <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Primary Focus Areas</p>
                 <ul className="text-xs space-y-2 text-slate-300">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> Infrastructure</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Health Services</li>
                 </ul>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
}
