import React from 'react';
import { Check, Clock, Edit3 } from 'lucide-react';

export function TimelineComponent() {
  const events = [
    { title: 'Grievance Resolved', date: '25 Mar 2026, 14:30', description: 'Technician completed repairs. Issue categorized as fixed.', status: 'upcoming' },
    { title: 'Under Review', date: '22 Mar 2026, 09:15', description: 'Assigned to Municipal Water Department (Zone B).', status: 'current' },
    { title: 'Submitted', date: '20 Mar 2026, 11:42', description: 'Grievance reported and automatically categorized by Saarthii AI.', status: 'completed' },
  ];

  return (
    <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 my-6">
      {events.map((event, idx) => (
        <div key={idx} className="relative pl-6">
          <span className={`absolute -left-[11px] top-1 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-white
            ${event.status === 'completed' ? 'bg-emerald-500 text-white' : 
              event.status === 'current' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
            {event.status === 'completed' ? <Check size={12} /> : 
             event.status === 'current' ? <Edit3 size={12} /> : <Clock size={12} />}
          </span>
          <h3 className={`font-semibold text-sm ${event.status === 'upcoming' ? 'text-slate-500' : 'text-slate-900'}`}>{event.title}</h3>
          <time className="mb-1 text-xs font-normal text-slate-400">{event.date}</time>
          <p className={`text-sm mt-1 ${event.status === 'upcoming' ? 'text-slate-400' : 'text-slate-600'}`}>{event.description}</p>
        </div>
      ))}
    </div>
  );
}
