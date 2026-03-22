import { StatusBadge } from './StatusBadge';
import type { GrievanceStatus } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import type { PriorityLevel } from './PriorityBadge';
import { MapPin, Calendar, Clock } from 'lucide-react';

export interface GrievanceProps {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  status: GrievanceStatus;
  priority: PriorityLevel;
  sla?: string;
}

export function GrievanceCard({ grievance, onClick }: { grievance: GrievanceProps, onClick?: (id: string) => void }) {
  return (
    <div 
      className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
      onClick={() => onClick?.(grievance.id)}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors">{grievance.title}</h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary mt-2">
            {grievance.category}
          </span>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={grievance.status} />
          <PriorityBadge priority={grievance.priority} />
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-5">
        <div className="flex items-center gap-1">
          <MapPin size={14} />
          <span>{grievance.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>{grievance.date}</span>
        </div>
        {grievance.sla && grievance.status !== 'Resolved' && (
          <div className="flex items-center gap-1 text-primary">
            <Clock size={14} />
            <span className="font-medium">SLA: {grievance.sla}</span>
          </div>
        )}
      </div>
    </div>
  );
}
