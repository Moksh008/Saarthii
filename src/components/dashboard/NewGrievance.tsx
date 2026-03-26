import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, AlertCircle, Bot } from 'lucide-react';
import { AIAssistantChat } from './shared/AIAssistantChat';
import { apiFetch } from '@/lib/api';

export function NewGrievance() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorParam, setErrorParam] = useState('');
  const [formAutoFilled, setFormAutoFilled] = useState(false);

  async function getCurrentCoordinates(): Promise<{ lat: number; lng: number } | null> {
    if (!navigator.geolocation) return null;

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => resolve(null),
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 300000,
        }
      );
    });
  }

  // AI typing indicator when user manually types
  useEffect(() => {
    if (title.length > 5 || description.length > 10) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 800);
      return () => clearTimeout(timer);
    }
  }, [title, description]);

  // Handler for AI auto-fill
  function handleFormFill(data: {
    title: string;
    description: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  }) {
    setTitle(data.title || '');
    setDescription(data.description || '');
    setLocation(data.address || '');
    setCity(data.city || '');
    setState(data.state || '');
    setPincode(data.pincode || '');
    setFormAutoFilled(true);

    // Scroll to form top after fill
    setTimeout(() => {
      document.getElementById('complaint-form-card')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 300);
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">New Grievance</h1>
        <p className="text-slate-600 mt-2">Describe your issue. Our AI will automatically categorize and prioritize it for faster resolution.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div
            id="complaint-form-card"
            className={`bg-white p-8 rounded-xl border shadow-sm relative overflow-hidden transition-all duration-500 ${
              formAutoFilled
                ? 'border-emerald-300 ring-2 ring-emerald-100'
                : 'border-slate-200'
            }`}
          >
            {/* AI Banner indicator */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-primary to-purple-500 opacity-50"></div>

            {formAutoFilled && (
              <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg mb-6 border border-emerald-200 flex items-center gap-2 text-sm font-medium animate-slide-up">
                <span className="text-lg">✨</span>
                Form auto-filled by Saarthii AI — review the details and submit!
              </div>
            )}
            
            {errorParam && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
                {errorParam}
              </div>
            )}

            <form className="space-y-6" onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                setErrorParam('');
                try {
                  const coords = await getCurrentCoordinates();

                  // Upload files first
                  const uploadedUrls: string[] = []
                  for (const f of files) {
                    const fd = new FormData()
                    fd.append('file', f)
                    const res = await fetch((import.meta.env.VITE_API_BASE || '') + '/uploads/', { method: 'POST', body: fd, credentials: 'include' })
                    const data = await res.json()
                    if (res.ok && data.url) uploadedUrls.push(data.url)
                  }

                  // Submit actual complaint
                  await apiFetch('/complaints/', {
                    method: 'POST',
                    body: JSON.stringify({
                      title,
                      description,
                      address: location || 'Not Specified',
                      city: city || 'Delhi',
                      state: state || 'Delhi',
                      pincode: pincode || '110001',
                      lat: coords?.lat ?? null,
                      lng: coords?.lng ?? null,
                      images: uploadedUrls
                    })
                  });

                  navigate('/dashboard/my-grievances');
                } catch (err: any) {
                  console.error('Failed to submit grievance', err);
                  setErrorParam(err.message || 'Failed to submit grievance. Please try again.');
                } finally {
                  setIsSubmitting(false);
                }
              }}>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Location / Address</label>
                  <div className="relative flex items-center">
                    <MapPin className="absolute left-3 text-slate-400 size-5" />
                    <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Street address..."
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">City</label>
                  <input 
                    type="text" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City name..."
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">State</label>
                  <input 
                    type="text" 
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State name..."
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Pincode</label>
                  <input 
                    type="text" 
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="6-digit pincode..."
                    maxLength={6}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Attach images (optional)</label>
                <input type="file" accept="image/*" multiple onChange={(e) => {
                  const list = e.target.files
                  if (!list) return
                  const arr = Array.from(list)
                  setFiles(arr)
                  setPreviews(arr.map(f => URL.createObjectURL(f)))
                }} />

                <div className="mt-3 flex gap-3">
                  {previews.map((p, idx) => (
                    <img key={idx} src={p} className="w-24 h-24 object-cover rounded-lg border" />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <AlertCircle size={16} />
                  <span className="text-xs">False reporting may lead to account penalties.</span>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-white font-semibold py-3 px-8 rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Grievance'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* AI Assistant Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <AIAssistantChat onFormFill={handleFormFill} />
          </div>
        </div>
      </div>
    </div>
  );
}
