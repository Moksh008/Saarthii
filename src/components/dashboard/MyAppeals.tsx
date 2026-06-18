import { FileText, Clock } from "lucide-react";

export function MyAppeals() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Appeals</h1>
        <p className="text-slate-500 mt-1 text-sm">
          If a grievance was not resolved satisfactorily, you can file an appeal.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center gap-3">
        <FileText className="h-12 w-12 text-slate-200" />
        <p className="font-semibold text-slate-700">No appeals filed yet</p>
        <p className="text-sm max-w-xs">
          If you are unsatisfied with the resolution of a grievance, you can appeal directly from the grievance detail page.
        </p>
        <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
          <Clock className="h-3.5 w-3.5" />
          <span>Appeals are reviewed within 7 working days</span>
        </div>
      </div>
    </div>
  );
}
