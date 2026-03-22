import React from 'react';
import { CopyPlus, ArrowRight } from 'lucide-react';

export function SimilarComplaintsList() {
  const similarItems = [
    { id: 'GRV-089', title: 'Major leak in main pipe', match: 89, date: '2 days ago' },
    { id: 'GRV-102', title: 'No water supply in block C', match: 74, date: '1 week ago' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <CopyPlus className="text-slate-400 size-5" />
        <h3 className="font-bold text-slate-900">Similar Complaints Found</h3>
      </div>
      <p className="text-xs text-slate-500 mb-4">Our AI detected matching issues in your area. Joining an existing complaint expedites resolution.</p>

      <div className="space-y-3">
        {similarItems.map((item) => (
          <div key={item.id} className="p-3 border border-slate-100 bg-slate-50 rounded-lg flex items-center justify-between group hover:border-primary/30 transition-colors">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-slate-500">{item.id}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded font-bold">{item.match}% Match</span>
              </div>
              <p className="text-sm font-medium text-slate-900 mt-1 line-clamp-1">{item.title}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{item.date}</p>
            </div>
            <button className="text-primary hover:text-white hover:bg-primary border border-primary/20 bg-white px-3 py-1.5 rounded text-xs font-semibold transition-colors flex items-center gap-1 shrink-0">
              Join <ArrowRight size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
