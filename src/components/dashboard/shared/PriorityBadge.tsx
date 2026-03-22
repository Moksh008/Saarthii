
import { AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export function PriorityBadge({ priority }: { priority: PriorityLevel }) {
  const getConfig = () => {
    switch (priority) {
      case 'High': return { color: 'bg-red-100 text-red-700', icon: <AlertCircle size={12} className="mr-1" /> };
      case 'Medium': return { color: 'bg-orange-100 text-orange-700', icon: <ArrowUpRight size={12} className="mr-1" /> };
      case 'Low': return { color: 'bg-green-100 text-green-700', icon: <ArrowDownRight size={12} className="mr-1" /> };
      default: return { color: 'bg-slate-100 text-slate-700', icon: null };
    }
  };

  const { color, icon } = getConfig();

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {icon}
      {priority}
    </span>
  );
}
