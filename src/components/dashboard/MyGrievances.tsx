import { useState, useEffect } from 'react';
import { GrievanceCard } from './shared/GrievanceCard.tsx';
import type { GrievanceProps } from './shared/GrievanceCard.tsx';
import { Filter, Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/lib/api';

export function MyGrievances() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [grievances, setGrievances] = useState<GrievanceProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadComplaints() {
      try {
        const data = await apiFetch('/complaints/my');
        // Map backend schema to frontend expectation
        const formatted = data.map((item: any) => ({
          id: item._id,
          title: item.title,
          category: item.category || 'General',
          location: item.location?.address || 'Not specified',
          date: new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('_', ' '),
          priority: item.priority.charAt(0).toUpperCase() + item.priority.slice(1),
          // mock sla for now as backend sla_deadline might be None or needs format
          sla: item.sla_deadline ? new Date(item.sla_deadline).toLocaleDateString() : 'N/A',
        }));
        // Sort by newest first
        formatted.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setGrievances(formatted);
      } catch (err) {
        console.error("Failed to load complaints:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadComplaints();
  }, []);

  const filtered = grievances.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchTerm.toLowerCase()) || g.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || g.status.toLowerCase().replace('_', ' ') === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Grievances</h1>
          <p className="text-slate-600 mt-2">View and track all your submitted complaints and their AI-predicted SLAs.</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/new-grievance')}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          + New Grievance
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-4 mb-6 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
          <input 
            type="text" 
            placeholder="Search grievances by ID or keyword..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-slate-400 size-5" />
          <select 
            className="border border-slate-200 rounded-lg outline-none px-3 py-2 bg-slate-50 text-slate-700 focus:border-primary focus:ring-1 focus:ring-primary"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-slate-500 font-medium animate-pulse">Loading your grievances...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.length > 0 ? (
            filtered.map(grievance => (
              <div key={grievance.id} className="h-full">
                <GrievanceCard 
                  grievance={grievance} 
                  onClick={(id) => navigate(`/dashboard/grievances/${id}`)}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-white border border-slate-200 rounded-xl">
              <p className="text-slate-500 font-medium">No grievances found matching your filters.</p>
              <button 
                className="mt-4 text-primary font-semibold hover:underline"
                onClick={() => { setSearchTerm(''); setFilterStatus('All'); }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
