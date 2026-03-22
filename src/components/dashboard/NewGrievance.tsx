import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, AlertCircle, Bot } from 'lucide-react';
import { AIInsightPanel } from './shared/AIInsightPanel';
import { SimilarComplaintsList } from './shared/SimilarComplaintsList';

export function NewGrievance() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  
  const [isTyping, setIsTyping] = useState(false);
  const [showAI, setShowAI] = useState(false);

  // Simulated AI analysis based on typing
  useEffect(() => {
    if (title.length > 5 || description.length > 10) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
        setShowAI(true);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setShowAI(false);
    }
  }, [title, description]);

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">New Grievance</h1>
        <p className="text-slate-600 mt-2">Describe your issue. Our AI will automatically categorize and prioritize it for faster resolution.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            {/* AI Banner indicator */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-primary to-purple-500 opacity-50"></div>
            
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Form submitted via Mocked API."); navigate('/dashboard/my-grievances'); }}>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Complaint Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g., No water supply in Block B"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-semibold text-slate-900">Detailed Description</label>
                  {isTyping && (
                    <span className="flex items-center gap-1.5 text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full animate-pulse">
                      <Bot size={12} /> AI processing...
                    </span>
                  )}
                </div>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide all relevant details, times, and exact locations..."
                  className="w-full min-h-[160px] px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900 resize-y"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Location (Optional)</label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3 text-slate-400 size-5" />
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Search for an exact map location..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <AlertCircle size={16} />
                  <span className="text-xs">False reporting may lead to account penalties.</span>
                </div>
                <button 
                  type="submit"
                  className="bg-primary text-white font-semibold py-3 px-8 rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Submit Grievance
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* AI Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className={`transition-all duration-500 ${showAI ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none blur-[2px]'}`}>
            <AIInsightPanel 
              category={title.toLowerCase().includes('water') ? 'Water Supply' : title.toLowerCase().includes('light') ? 'Electrical' : 'General Maintenance'}
              priority={description.length > 50 ? 'High' : 'Medium'}
              confidence={87}
              sla={title.toLowerCase().includes('water') ? '24 Hours' : '3 Days'}
            />
          </div>

          <div className={`transition-all duration-500 delay-150 ${showAI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <SimilarComplaintsList />
          </div>

          {!showAI && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center shadow-sm">
              <div className="mx-auto size-12 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                <Bot className="size-6 text-slate-400" />
              </div>
              <h3 className="font-semibold text-slate-900">Waiting for input</h3>
              <p className="text-xs text-slate-500 mt-2">Start typing a title and description for Saarthii AI to automatically generate insights and locate similarities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
