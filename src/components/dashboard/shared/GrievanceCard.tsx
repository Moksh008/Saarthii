import { StatusBadge } from './StatusBadge';
import type { GrievanceStatus } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import type { PriorityLevel } from './PriorityBadge';
import { MapPin, Calendar, Clock, ShieldAlert } from 'lucide-react';

export interface GrievanceProps {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  status: GrievanceStatus;
  priority: PriorityLevel;
  sla?: string;
  isSpam?: boolean;
}

export function GrievanceCard({ grievance, onClick }: { grievance: GrievanceProps, onClick?: (id: string) => void }) {
  const isSpam = grievance.isSpam;

  return (
    <div 
      className={`rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group border ${
        isSpam 
          ? 'bg-red-50 border-red-300 ring-2 ring-red-100' 
          : 'bg-white border-slate-200'
      }`}
      onClick={() => onClick?.(grievance.id)}
    >
      {/* Spam Banner */}
      {isSpam && (
        <div className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-2 rounded-lg mb-4 border border-red-200 text-xs font-bold">
          <ShieldAlert size={16} />
          Flagged as Spam — This complaint was automatically detected as spam
        </div>
      )}

      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className={`text-base font-bold group-hover:text-primary transition-colors ${
            isSpam ? 'text-red-800' : 'text-slate-900'
          }`}>{grievance.title}</h3>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold mt-2 ${
            isSpam ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'
          }`}>
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
