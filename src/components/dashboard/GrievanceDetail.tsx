import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Share2, Download, Loader2, AlertCircle, Trash2, X, Trash } from 'lucide-react';
import { StatusBadge } from './shared/StatusBadge';
import { PriorityBadge } from './shared/PriorityBadge';
import { TimelineComponent } from './shared/TimelineComponent';
import { AIInsightPanel } from './shared/AIInsightPanel';
import { FeedbackCard } from './shared/FeedbackCard';
import { AIProblemDescription } from './shared/AIProblemDescription';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export function GrievanceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    async function loadComplaint() {
      try {
        const data = await apiFetch(`/complaints/${id}`);
        setComplaint(data);
      } catch (err: any) {
        console.error("Failed to load complaint:", err);
        setError(err.message || 'Error loading grievance details');
      } finally {
        setIsLoading(false);
      }
    }
    if (id) loadComplaint();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto pb-12 py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-slate-500 font-medium animate-pulse">Loading grievance details...</p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-6xl mx-auto pb-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-primary mb-6 transition-colors font-medium text-sm">
          <ArrowLeft size={16} /> Back to Grievances
        </button>
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 flex items-center gap-3">
          <AlertCircle className="size-6" />
          <div>
            <h3 className="font-bold">Error Loading Grievance</h3>
            <p className="text-sm">{error || 'Grievance not found.'}</p>
          </div>
        </div>
      </div>
    );
  }

  const statusMap: Record<string, string> = {
    'submitted': 'Pending',
    'classified': 'Under Review',
    'assigned': 'Assigned',
    'in_progress': 'In Progress',
    'resolved': 'Resolved',
    'closed': 'Closed',
    'flagged_spam': 'Spam'
  };

  const displayStatus = statusMap[complaint.status] || 'Pending';
  const displayPriority = complaint.priority?.charAt(0).toUpperCase() + complaint.priority?.slice(1) || 'Medium';

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apiFetch(`/complaints/${id}`, { method: 'DELETE' });
      navigate('/dashboard/my-grievances');
    } catch (err: any) {
      console.error("Failed to delete complaint:", err);
      alert(err.message || 'Failed to delete complaint.');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus && !resolutionNote.trim()) {
      alert("Please select a status or enter a resolution note.");
      return;
    }
    
    setIsUpdating(true);
    try {
      // 1. Add Note if provided
      if (resolutionNote.trim()) {
        await apiFetch(`/complaints/${id}/notes`, {
          method: 'POST',
          body: JSON.stringify({ text: resolutionNote }),
        });
      }
      
      // 2. Update Status if provided
      if (newStatus) {
        await apiFetch(`/complaints/${id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: newStatus }),
        });
      }
      
      // Reload the complaint
      const refreshed = await apiFetch(`/complaints/${id}`);
      setComplaint(refreshed);
      setResolutionNote('');
      setNewStatus('');
      
    } catch (err: any) {
      console.error("Failed to update task:", err);
      alert(err.message || "Failed to update grievance.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-primary mb-6 transition-colors font-medium text-sm"
      >
        <ArrowLeft size={16} /> Back to Grievances
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{complaint.title}</h1>
            <StatusBadge status={displayStatus as React.ComponentProps<typeof StatusBadge>['status']} />
            <PriorityBadge priority={displayPriority as React.ComponentProps<typeof PriorityBadge>['priority']} />
          </div>
          <p className="text-slate-500 font-mono text-sm">ID: {complaint._id}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="p-2 text-slate-500 hover:text-primary bg-white border border-slate-200 rounded-lg hover:border-primary/30 transition-colors shadow-sm" title="Share">
            <Share2 size={18} />
          </button>
          <button className="p-2 text-slate-500 hover:text-primary bg-white border border-slate-200 rounded-lg hover:border-primary/30 transition-colors shadow-sm" title="Download">
            <Download size={18} />
          </button>
          {user?.role === 'citizen' && (
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="p-2 text-rose-500 hover:text-white bg-white hover:bg-rose-500 border border-slate-200 hover:border-rose-500 rounded-lg transition-colors shadow-sm"
              title="Delete Complaint"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details & Timeline */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Description section */}
            <div className="bg-white p-8 pb-5">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Description</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>

            {/* Map + Overlaid details */}
            <div className="relative h-[280px]">
              {/* Map iframe background */}
              <iframe
                title="Complaint Location Map"
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  [complaint.location?.address, complaint.location?.city, complaint.location?.state, complaint.location?.pincode]
                    .filter(Boolean).join(', ')
                )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              />

              {/* Gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent pointer-events-none" />

              {/* Detail cards overlaid at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="backdrop-blur-md bg-white/15 rounded-lg p-3 border border-white/20">
                    <p className="text-[10px] font-semibold text-white/60 uppercase tracking-wider mb-1">Category</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white">
                      {complaint.ministry || complaint.category || 'Unclassified'}
                    </span>
                  </div>
                  <div className="backdrop-blur-md bg-white/15 rounded-lg p-3 border border-white/20">
                    <p className="text-[10px] font-semibold text-white/60 uppercase tracking-wider mb-1">Location</p>
                    <div className="flex items-center gap-1 text-xs font-medium text-white line-clamp-2" title={complaint.location?.address}>
                      <MapPin size={12} className="text-white/70 shrink-0" />
                      <span className="truncate">{complaint.location?.address || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="backdrop-blur-md bg-white/15 rounded-lg p-3 border border-white/20">
                    <p className="text-[10px] font-semibold text-white/60 uppercase tracking-wider mb-1">Submitted</p>
                    <div className="flex items-center gap-1 text-xs font-medium text-white">
                      <Calendar size={12} className="text-white/70" /> {new Date(complaint.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="backdrop-blur-md bg-white/15 rounded-lg p-3 border border-white/20">
                    <p className="text-[10px] font-semibold text-white/60 uppercase tracking-wider mb-1">Predicted SLA</p>
                    <div className="flex items-center gap-1 text-xs font-medium text-amber-300">
                      <Clock size={12} /> {complaint.sla_deadline ? new Date(complaint.sla_deadline).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <AIProblemDescription complaintId={complaint._id} />

          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Resolution Timeline</h2>
            <p className="text-sm text-slate-500 mb-6">Track the progress of your grievance via automated updates.</p>
            <TimelineComponent
              status={complaint.status}
              createdAt={complaint.created_at}
              notes={complaint.notes}
            />
          </div>

          {/* Officer Action Panel */}
          {(user?.role === 'officer' || user?.role === 'ministry') && (
            <div className="bg-indigo-50/50 p-8 rounded-xl border border-indigo-100 shadow-sm mt-8">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Official Actions</h2>
              <p className="text-sm text-slate-500 mb-6">Update the status or provide a resolution note for this grievance.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Update Status</label>
                  <select 
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full sm:w-1/2 rounded-xl border-slate-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2 px-3"
                  >
                    <option value="">-- No Status Change --</option>
                    <option value="in_progress">Mark as In Progress</option>
                    <option value="resolved">Mark as Resolved</option>
                    <option value="closed">Mark as Closed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Resolution / Official Note</label>
                  <textarea 
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    rows={4}
                    placeholder="Describe the actions taken or the final resolution..."
                    className="w-full rounded-xl border-slate-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2 px-3 resize-none"
                  ></textarea>
                </div>
                
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleUpdateStatus}
                    disabled={isUpdating || (!newStatus && !resolutionNote.trim())}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isUpdating ? <Loader2 size={16} className="animate-spin" /> : null}
                    Submit Update
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - AI Insights */}
        <div className="space-y-6">
          <AIInsightPanel 
            category={complaint.ministry || complaint.category || 'Unclassified'}
            priority={displayPriority}
            confidence={complaint.sentiment_score ? Math.round(complaint.sentiment_score * 100) : 85}
            sla={complaint.sla_deadline ? new Date(complaint.sla_deadline).toLocaleDateString() : 'N/A'}
          />
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-900 mb-4">Attachments</h3>
             {complaint.images && complaint.images.length > 0 ? (
               <div className="grid grid-cols-2 gap-3">
                 {complaint.images.map((img: string, idx: number) => (
                   <a key={idx} href={img} target="_blank" rel="noopener noreferrer">
                     <img src={img} alt={`Attachment ${idx+1}`} className="w-full h-24 object-cover rounded-lg border border-slate-200 hover:border-primary transition-colors" />
                   </a>
                 ))}
               </div>
             ) : (
               <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 text-slate-400">
                  <p className="text-sm font-medium">No photos attached.</p>
               </div>
             )}
          </div>
           <FeedbackCard
             complaintId={complaint._id}
             existingFeedback={complaint.feedback}
           />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                  <Trash className="size-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Delete Grievance</h3>
                  <p className="text-sm text-slate-500">This action cannot be undone.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                disabled={isDeleting}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 bg-slate-50 text-slate-600 text-sm leading-relaxed">
              Are you sure you want to permanently delete this grievance? All associated data, including AI insights and status history, will be removed.
            </div>

            <div className="p-5 border-t border-slate-100 bg-white flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Yes, Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
