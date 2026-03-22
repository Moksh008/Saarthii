
import { Sparkles, BrainCircuit, Activity } from 'lucide-react';

export function AIInsightPanel({ category, priority, confidence, sla }: { category: string, priority: string, confidence: number, sla: string }) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-5 shadow-sm relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -top-6 -right-6 text-indigo-500/10 pointer-events-none">
        <BrainCircuit size={120} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-primary" />
          <h3 className="font-bold text-slate-900">Saarthii AI Insights</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-indigo-50 hover:shadow-sm transition-shadow">
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Predicted Category</p>
            <p className="text-sm font-semibold text-slate-900">{category || "Detecting..."}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-indigo-50 hover:shadow-sm transition-shadow">
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Estimated SLA</p>
            <p className="text-sm font-semibold text-slate-900">{sla || "Calculating..."}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-indigo-50 hover:shadow-sm transition-shadow">
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Priority Analysis</p>
            <div className="flex items-center gap-1.5">
              <Activity size={14} className={priority === "High" ? "text-red-500" : priority === "Medium" ? "text-orange-500" : "text-green-500"} />
              <p className="text-sm font-semibold text-slate-900">{priority || "Analyzing..."}</p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-indigo-50 hover:shadow-sm transition-shadow">
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">AI Confidence</p>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${confidence}%` }}></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">{confidence}% Match</p>
          </div>
        </div>
      </div>
    </div>
  );
}
