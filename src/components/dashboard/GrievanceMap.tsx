
import { Map as MapIcon, Layers, Filter } from 'lucide-react';

export function GrievanceMap() {
  return (
    <div className="h-[calc(100vh-8rem)] w-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Grievance Hotspots</h1>
          <p className="text-slate-600 mt-2">Interactive AI-clustered map of civic issues across the municipality.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:border-primary/30 hover:text-primary transition-all shadow-sm">
            <Filter size={16} /> Filters
          </button>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:border-primary/30 hover:text-primary transition-all shadow-sm">
            <Layers size={16} /> Map Style
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative shadow-inner flex items-center justify-center">
        {/* Decorative architectural background simulating map structures */}
        <div 
          className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-400 via-slate-200 to-transparent pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(slate-300 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        ></div>
        
        <div className="z-10 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white max-w-md text-center m-4">
          <div className="size-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <MapIcon size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Mapbox Integration Paused</h2>
          <p className="text-slate-600 text-sm mb-6">
            The frontend geographic UI shell is complete. To render live interactive canvas map layers, simply provide a valid Mapbox Access Token via the environment variables.
          </p>
          <button className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors w-full shadow-md hover:shadow-lg">
            Acknowledge
          </button>
        </div>
        
        {/* Fake decorative markers to simulate a map look */}
        <div className="absolute top-1/4 left-1/3 size-16 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
           <div className="size-4 bg-red-500 rounded-full border-2 border-white shadow-md flex items-center justify-center"></div>
        </div>
        <div className="absolute bottom-1/3 right-1/4 size-10 bg-amber-500/20 rounded-full flex items-center justify-center animate-pulse" style={{ animationDelay: '1s' }}>
           <div className="size-3 bg-amber-500 rounded-full border-2 border-white shadow-md"></div>
        </div>
        <div className="absolute top-2/3 left-1/4 size-8 bg-emerald-500/20 rounded-full flex items-center justify-center animate-pulse" style={{ animationDelay: '2s' }}>
           <div className="size-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-md"></div>
        </div>
      </div>
    </div>
  );
}
