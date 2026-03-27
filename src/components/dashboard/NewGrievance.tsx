import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, AlertCircle, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIAssistantChat } from './shared/AIAssistantChat';
import { apiFetch } from '@/lib/api';
import Hyperspeed from '../ui/Hyperspeed';

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
  const [aiStep, setAiStep] = useState<'closed' | 'intro' | 'chat'>('closed');

  // Launch AI with voice and animations
  const openAI = () => {
    setAiStep('intro');
    
    // Attempt Text-to-Speech
    try {
      const msg = new SpeechSynthesisUtterance("Hi, I am Saarthii. How can I help you?");
      msg.lang = 'en-IN';
      msg.pitch = 1.0;
      msg.rate = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const bestVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural')) || voices.find(v => v.lang.startsWith('en'));
        if (bestVoice) msg.voice = bestVoice;
      }
      
      // Auto-transition to chat when speech finishes
      msg.onend = () => setAiStep('chat');
      
      window.speechSynthesis.cancel(); // Clear any existing speech
      setTimeout(() => {
        window.speechSynthesis.speak(msg);
      }, 1200);
    } catch (e) {
      console.warn("Speech synthesis not supported or blocked");
    }

    // Fallback timer to ensure we transition even if speech fails
    setTimeout(() => {
      setAiStep(prev => prev === 'intro' ? 'chat' : prev);
    }, 6500);
  };

  const closeAI = () => {
    window.speechSynthesis.cancel();
    setAiStep('closed');
  };

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
    closeAI(); // Close AI modal smoothly after fill

    // Scroll to form top after fill
    setTimeout(() => {
      document.getElementById('complaint-form-card')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 400);
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">New Grievance</h1>
        <p className="text-slate-600 mt-2">Describe your issue. Our AI will automatically categorize and prioritize it for faster resolution.</p>
      </div>

      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="space-y-6">
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

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span className="text-xs">False reporting may lead to account penalties.</span>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-primary text-white font-semibold py-3 px-8 rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Grievance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ░░░ FLOATING AI BUTTON ░░░ */}
      <AnimatePresence>
        {aiStep === 'closed' && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openAI}
            className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-40 w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-2xl flex items-center justify-center overflow-hidden group focus:outline-none focus:ring-4 focus:ring-purple-500/30"
            title="Open Saarthii AI Assistant"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <img src="/images/saarthii_ai_logo.png" alt="AI Icon" className="w-[120%] h-[120%] object-cover scale-[1.1]" />
            {/* Ping indicator */}
            <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-purple-600">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ░░░ IMMERSIVE AI OVERLAY ░░░ */}
      <AnimatePresence>
        {aiStep !== 'closed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f1c]/80 backdrop-blur-xl p-4 lg:p-8"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeAI();
            }}
          >
            <AnimatePresence mode="wait">
              {aiStep === 'intro' && (
                <motion.div
                  key="intro"
                  initial={{ scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
                  animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ scale: 1.2, opacity: 0, filter: 'blur(10px)' }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center text-center absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
                >
                  {/* WebGL Hyperspeed Tunnel */}
                  <div className="absolute inset-0 opacity-90 mix-blend-screen pointer-events-none -z-10">
                    <Hyperspeed
                      effectOptions={{
                        "distortion": "turbulentDistortion",
                        "length": 400,
                        "roadWidth": 10,
                        "islandWidth": 2,
                        "lanesPerRoad": 3,
                        "fov": 90,
                        "fovSpeedUp": 150,
                        "speedUp": 2,
                        "carLightsFade": 0.4,
                        "totalSideLightSticks": 20,
                        "lightPairsPerRoadWay": 40,
                        "shoulderLinesWidthPercentage": 0.05,
                        "brokenLinesWidthPercentage": 0.1,
                        "brokenLinesLengthPercentage": 0.5,
                        "lightStickWidth": [0.12, 0.5],
                        "lightStickHeight": [1.3, 1.7],
                        "movingAwaySpeed": [60, 80],
                        "movingCloserSpeed": [-120, -160],
                        "carLightsLength": [12, 80],
                        "carLightsRadius": [0.05, 0.14],
                        "carWidthPercentage": [0.3, 0.5],
                        "carShiftX": [-0.8, 0.8],
                        "carFloorSeparation": [0, 5],
                        "colors": {
                          "roadColor": 526344,
                          "islandColor": 657930,
                          "background": 0,
                          "shoulderLines": 1250072,
                          "brokenLines": 1250072,
                          "leftCars": [14177983, 6770850, 12732332],
                          "rightCars": [242627, 941733, 3294549],
                          "sticks": 242627
                        }
                      }}
                    />
                  </div>
                  {/* Dynamic pulse rings for audio effect */}
                  <motion.div
                    animate={{ scale: [1, 2.5, 3.5], opacity: [0.6, 0.2, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    className="absolute w-40 h-40 rounded-full border-[2px] border-purple-500/60"
                  />
                  <motion.div
                    animate={{ scale: [1, 2.5, 3.5], opacity: [0.6, 0.2, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.6, ease: "easeOut" }}
                    className="absolute w-40 h-40 rounded-full border-[2px] border-indigo-400/60"
                  />
                  <motion.div
                    animate={{ scale: [1, 2.5, 3.5], opacity: [0.6, 0.2, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1.2, ease: "easeOut" }}
                    className="absolute w-40 h-40 rounded-full border-[2px] border-amber-400/40"
                  />
                  
                  {/* Outer glow and Logo */}
                  <div className="relative w-48 h-48 rounded-full shadow-[0_0_120px_rgba(139,92,246,0.5)] bg-slate-900 border-4 border-white/10 flex items-center justify-center overflow-hidden z-10">
                    <img src="/images/saarthii_ai_logo.png" className="w-[120%] h-[120%] object-cover scale-[1.15]" alt="Saarthii Intro" />
                  </div>

                  {/* Greeting Text */}
                  <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mt-10 text-5xl font-black text-white tracking-tighter"
                  >
                    Hi, I am <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400">Saarthii</span>
                  </motion.h2>
                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="text-lg text-white/60 mt-4 font-medium"
                  >
                    Preparing secure connection...
                  </motion.p>
                </motion.div>
              )}

              {aiStep === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ scale: 0.9, y: 40, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.9, y: 40, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="w-full max-w-5xl h-[85vh] lg:h-[80vh] bg-transparent rounded-2xl shadow-2xl overflow-hidden relative"
                >
                  <AIAssistantChat onFormFill={handleFormFill} onClose={closeAI} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
