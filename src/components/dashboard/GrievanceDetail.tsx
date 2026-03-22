import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Share2, Download } from 'lucide-react';
import { StatusBadge } from './shared/StatusBadge';
import { PriorityBadge } from './shared/PriorityBadge';
import { TimelineComponent } from './shared/TimelineComponent';
import { AIInsightPanel } from './shared/AIInsightPanel';

export function GrievanceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

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
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Streetlight completely dark near Central Park</h1>
            <StatusBadge status="Under Review" />
            <PriorityBadge priority="High" />
          </div>
          <p className="text-slate-500 font-mono text-sm">ID: {id}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="p-2 text-slate-500 hover:text-primary bg-white border border-slate-200 rounded-lg hover:border-primary/30 transition-colors shadow-sm">
            <Share2 size={18} />
          </button>
          <button className="p-2 text-slate-500 hover:text-primary bg-white border border-slate-200 rounded-lg hover:border-primary/30 transition-colors shadow-sm">
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details & Timeline */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Description</h2>
            <p className="text-slate-600 leading-relaxed">
              The main streetlight at the intersection of Sector 4 and Central Park has been completely dark for the last 48 hours. This is causing significant visibility issues for pedestrians crossing the road at night. It appears to be a fused bulb or a localized electrical fault, as the surrounding streetlights are functioning normally.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 pt-6 border-t border-slate-100">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Category</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">
                  Electrical
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                <div className="flex items-center gap-1 text-sm font-medium text-slate-900">
                  <MapPin size={14} className="text-slate-400" /> Sector 4
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Submitted</p>
                <div className="flex items-center gap-1 text-sm font-medium text-slate-900">
                  <Calendar size={14} className="text-slate-400" /> 21 Mar 2026
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Predicted SLA</p>
                <div className="flex items-center gap-1 text-sm font-medium text-primary">
                  <Clock size={14} /> 2 Days
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Resolution Timeline</h2>
            <p className="text-sm text-slate-500 mb-6">Track the progress of your grievance via automated updates.</p>
            <TimelineComponent />
          </div>
        </div>

        {/* Right Column - AI Insights */}
        <div className="space-y-6">
          <AIInsightPanel 
            category="Electrical"
            priority="High"
            confidence={94}
            sla="2 Days"
          />
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-900 mb-4">Attachments</h3>
             <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 text-slate-400">
                <p className="text-sm font-medium">No photos attached.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
