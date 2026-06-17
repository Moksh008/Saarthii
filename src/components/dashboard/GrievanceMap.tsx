import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Map as MapIcon, Filter, Layers, Loader2, Info } from 'lucide-react';
import { apiFetch } from '@/lib/api';

// @ts-ignore
import L from 'leaflet';

// Cast components to any to avoid React 19 props compilation mismatch
const SafeMapContainer = MapContainer as any;
const SafeTileLayer = TileLayer as any;
const SafeCircleMarker = CircleMarker as any;
const SafePopup = Popup as any;

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface ComplaintLocation {
  lat: number;
  lng: number;
  category: string;
  status: string;
  title?: string;
}

export function GrievanceMap() {
  const [locations, setLocations] = useState<ComplaintLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const data = await apiFetch('/complaints/locations');
        const normalized = Array.isArray(data)
          ? data
              .map((item) => ({
                lat: Number(item?.lat),
                lng: Number(item?.lng),
                category: item?.category || 'General Issue',
                status: item?.status || 'submitted',
                title: item?.title,
              }))
              .filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng))
          : [];
        setLocations(normalized);
      } catch (err) {
        console.error("Failed to fetch complaint locations:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLocations();
  }, []);

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-8rem)] w-full flex items-center justify-center">
        <div className="text-center animate-pulse">
          <Loader2 className="size-16 animate-spin text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-slate-800">Initializing Map Engine...</h2>
          <p className="text-slate-500 font-medium mt-2">Loading civic grievance data</p>
        </div>
      </div>
    );
  }

  // Calculate generic center based on actual data
  const centerLat = locations.length ? locations.reduce((sum, l) => sum + l.lat, 0) / locations.length : 28.6139;
  const centerLng = locations.length ? locations.reduce((sum, l) => sum + l.lng, 0) / locations.length : 77.2090;

  return (
    <div className="h-[calc(100vh-8rem)] w-full flex flex-col relative">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-6 shrink-0 z-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <MapIcon className="text-red-500 size-8" />
            City Heat Map
          </h1>
          <p className="text-slate-600 mt-2 font-medium">Real-time geographical overview of reported public grievances.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white/80 backdrop-blur border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 shadow-sm flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            {locations.length} Active Records
          </div>
        </div>
      </div>

      <div className="flex-1 bg-slate-100 rounded-3xl border border-slate-200/60 overflow-hidden relative shadow-2xl flex items-center justify-center isolate">
        <SafeMapContainer 
          center={[centerLat, centerLng] as any} 
          zoom={11} 
          className="h-full w-full z-0"
          zoomControl={false}
        >
          {/* Using a premium dark/light basemap */}
          <SafeTileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {locations.map((loc, idx) => (
            <SafeCircleMarker
              key={idx}
              center={[loc.lat, loc.lng]}
              radius={8}
              pathOptions={{
                color: '#ef4444',     // Red-500 border
                fillColor: '#ef4444', // Red-500 fill
                fillOpacity: 0.6,
                weight: 2
              }}
            >
              <SafePopup className="rounded-xl overflow-hidden shadow-xl border-0">
                <div className="p-1 min-w-[200px]">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-red-500 mb-1">
                    {loc.category || "General Issue"}
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm leading-tight mb-2">
                    {loc.title || "Public Grievance"}
                  </h3>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 capitalize">
                    {loc.status.replace('_', ' ')}
                  </div>
                </div>
              </SafePopup>
            </SafeCircleMarker>
          ))}
        </SafeMapContainer>

        {/* Floating UI Elements over Map */}
        <div className="absolute top-6 right-6 z-[1000] flex flex-col gap-3">
            <button className="bg-white/90 backdrop-blur hover:bg-white text-slate-700 p-3 rounded-2xl shadow-lg border border-slate-200/50 transition-all hover:scale-105 active:scale-95 flex items-center justify-center group">
                <Filter className="size-5 group-hover:text-red-500 transition-colors" />
            </button>
            <button className="bg-white/90 backdrop-blur hover:bg-white text-slate-700 p-3 rounded-2xl shadow-lg border border-slate-200/50 transition-all hover:scale-105 active:scale-95 flex items-center justify-center group">
                <Layers className="size-5 group-hover:text-red-500 transition-colors" />
            </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 z-[1000] bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-slate-200 max-w-[260px] animate-in slide-in-from-bottom-5 fade-in duration-500">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-red-100 p-1.5 rounded-lg text-red-600">
                <Info size={16} strokeWidth={3} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Live Mapping</h3>
          </div>
          
          <div className="space-y-3">
             <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center size-6">
                    <span className="absolute size-full bg-red-400 rounded-full opacity-30 animate-pulse"></span>
                    <span className="relative size-3 bg-red-500 rounded-full border border-white"></span>
                </div>
                <span className="text-xs font-semibold text-slate-700">Reported Grievance</span>
             </div>
          </div>
          
          <p className="text-[10px] text-slate-500 mt-4 leading-relaxed font-medium">
            Click on any data point on the map to view the specific complaint category and current resolution status.
          </p>
        </div>
      </div>
    </div>
  );
}
