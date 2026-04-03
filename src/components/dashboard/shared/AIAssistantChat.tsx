import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, MicOff, Bot, User, Loader2, FileText, Search, ArrowLeft, Clock, MapPin, Building2, AlertTriangle, CheckCircle2, CircleDot, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/lib/api';

/* ─── Types ───────────────────────────────────────────── */

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface FormData {
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface ComplaintSummary {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string | null;
  department: string | null;
  ministry: string | null;
  assigned_to: string | null;
  sla_deadline: string | null;
  created_at: string;
  notes: { text: string; created_at: string; user_id?: string }[];
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

type AssistantMode = 'select' | 'file' | 'track' | 'track-chat';

interface AIAssistantChatProps {
  onFormFill?: (data: FormData) => void;
  onClose?: () => void;
}

/* ─── Speech Recognition type shim ───────────────────── */

interface SpeechRecognitionEvent {
  results: { [key: number]: { [key: number]: { transcript: string } } };
  resultIndex: number;
}

/* ─── Config & Helpers ───────────────────────────────── */

const LANGUAGES = [
  { code: 'en-IN', name: 'English' },
  { code: 'hi-IN', name: 'हिंदी' },
  { code: 'pa-IN', name: 'ਪੰਜਾਬੀ' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  submitted:    { label: 'Submitted',    color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200',       icon: Clock },
  classified:   { label: 'Classified',   color: 'text-indigo-700',  bg: 'bg-indigo-50 border-indigo-200',   icon: CircleDot },
  assigned:     { label: 'Assigned',     color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',     icon: Building2 },
  in_progress:  { label: 'In Progress',  color: 'text-orange-700',  bg: 'bg-orange-50 border-orange-200',   icon: Loader2 },
  resolved:     { label: 'Resolved',     color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
  closed:       { label: 'Closed',       color: 'text-slate-600',   bg: 'bg-slate-100 border-slate-300',    icon: CheckCircle2 },
  flagged_spam: { label: 'Under Review', color: 'text-red-600',     bg: 'bg-red-50 border-red-200',         icon: AlertTriangle },
};

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status] || { label: status, color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200', icon: Clock };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* ─── Component ───────────────────────────────────────── */

export function AIAssistantChat({ onFormFill, onClose }: AIAssistantChatProps) {
  const [mode, setMode] = useState<AssistantMode>('select');
  const [language, setLanguage] = useState<string>('en-IN');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [formFilled, setFormFilled] = useState(false);
  const [userComplaints, setUserComplaints] = useState<ComplaintSummary[]>([]);
  const [complaintsLoading, setComplaintsLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintSummary | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  /* ─── Speech Synthesis Utility ──────────────────────── */
  const speakText = useCallback((text: string) => {
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_~\[\]]/g, '').replace(/#/g, '').replace(/\n+/g, ' . ').trim();
      const msg = new SpeechSynthesisUtterance(cleanText);

      // MacOS / Windows often strictly lack pa-IN TTS voices.
      // We instruct the backend to generate Punjabi words using Devanagari (Hindi) script,
      // and we force the TTS engine to use a Hindi (hi-IN) voice.
      // This ensures the words are read with perfect native Indian phonetics!
      const ttsLang = language === 'pa-IN' ? 'hi-IN' : language;
      
      msg.lang = ttsLang;
      msg.rate = 1.0;
      msg.pitch = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const langPrefix = ttsLang.split('-')[0];
        let matchVoices = voices.filter(v => v.lang.startsWith(langPrefix));

        const bestVoice = matchVoices.sort((a, b) => {
          let aScore = 0; let bScore = 0;
          if (a.name.includes('Google') || a.name.includes('Natural') || a.name.includes('Premium')) aScore += 10;
          if (b.name.includes('Google') || b.name.includes('Natural') || b.name.includes('Premium')) bScore += 10;
          if (!a.localService) aScore += 5;
          if (!b.localService) bScore += 5;
          return bScore - aScore;
        })[0];
        if (bestVoice) msg.voice = bestVoice;
      }
      window.speechSynthesis.speak(msg);
    } catch (e) {
      console.warn('Speech synthesis failed/unsupported', e);
    }
  }, [language]);

  /* ─── Mode Selection Handlers ──────────────────────── */

  const selectFileMode = useCallback(() => {
    setMode('file');
    let greeting = "Hi! I'm Saarthii AI. Tell me about the problem you're facing. I'll help you file a complaint.";
    if (language === 'hi-IN') greeting = "नमस्ते! मैं सारथी हूँ। अपनी समस्या के बारे में बताएँ, मैं शिकायत दर्ज करने में मदद करूँगा।";
    if (language === 'pa-IN') greeting = "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਸਾਰਥੀ ਹਾਂ। ਆਪਣੀ ਸਮੱਸਿਆ ਬਾਰੇ ਦੱਸੋ, ਮੈਂ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਾਂਗਾ।";
    
    setMessages([{ role: 'assistant', content: greeting }]);
    speakText(greeting);
  }, [language, speakText]);

  const selectTrackMode = useCallback(async () => {
    setMode('track');
    setComplaintsLoading(true);
    try {
      const data = await apiFetch('/complaints/my');
      setUserComplaints(data);
    } catch {
      setUserComplaints([]);
    } finally {
      setComplaintsLoading(false);
    }
  }, []);

  const selectComplaint = useCallback((complaint: ComplaintSummary) => {
    setSelectedComplaint(complaint);
    setMode('track-chat');

    const sc = getStatusConfig(complaint.status);
    let greeting = `You selected "${complaint.title}". Its current status is: ${sc.label}. Ask me anything about this complaint.`;
    if (language === 'hi-IN') greeting = `आपने चुना: "${complaint.title}". वर्तमान स्थिति है: ${sc.label}. आप इसके बारे में कुछ भी पूछ सकते हैं।`;
    if (language === 'pa-IN') greeting = `ਤੁਸੀਂ ਚੁਣਿਆ ਹੈ: "${complaint.title}". ਮੌਜੂਦਾ ਸਥਿਤੀ ਹੈ: ${sc.label}. ਤੁਸੀਂ ਇਸ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛ ਸਕਦੇ ਹੋ।`;

    setMessages([{ role: 'assistant', content: greeting }]);
    speakText(greeting);
  }, [language, speakText]);

  const goBackToSelect = useCallback(() => {
    window.speechSynthesis.cancel();
    setMode('select');
    setMessages([]);
    setInput('');
    setFormFilled(false);
    setUserComplaints([]);
    setSelectedComplaint(null);
  }, []);

  const goBackToTrack = useCallback(() => {
    window.speechSynthesis.cancel();
    setMode('track');
    setMessages([]);
    setInput('');
    setSelectedComplaint(null);
  }, []);

  /* ─── Send message ──────────────────────────────────── */

  const sendMessage = useCallback(async (text?: string) => {
    const userText = (text || input).trim();
    if (!userText || isLoading) return;

    const newUserMsg: ChatMessage = { role: 'user', content: userText };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    const apiMessages = updatedMessages.slice(1);
    const isTrackingChat = mode === 'track-chat';

    const MAX_RETRIES = 2;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const body: any = {
          messages: apiMessages,
          mode: isTrackingChat ? 'track' : 'file',
          language: language,
        };

        if (isTrackingChat && selectedComplaint) {
          body.user_complaints = [{
            id: selectedComplaint._id,
            title: selectedComplaint.title,
            description: selectedComplaint.description,
            status: selectedComplaint.status,
            priority: selectedComplaint.priority,
            category: selectedComplaint.category,
            department: selectedComplaint.department,
            ministry: selectedComplaint.ministry,
            assigned_to: selectedComplaint.assigned_to,
            sla_deadline: selectedComplaint.sla_deadline,
            created_at: selectedComplaint.created_at,
            location: selectedComplaint.location,
            notes: selectedComplaint.notes?.map(n => ({ text: n.text, date: n.created_at })) || [],
          }];
        }

        const data = await apiFetch('/complaints/assistant/chat', {
          method: 'POST',
          body: JSON.stringify(body),
        });

        const aiMsg: ChatMessage = { role: 'assistant', content: data.reply };
        setMessages((prev) => [...prev, aiMsg]);
        speakText(data.reply);

        if (data.form_data && !formFilled && onFormFill) {
          setFormFilled(true);
          setTimeout(() => onFormFill(data.form_data), 600);
        }
        setIsLoading(false);
        return;
      } catch (err: any) {
        if (attempt < MAX_RETRIES - 1) {
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }
        let errorMsg = 'I had a brief connection issue. Please try again.';
        if (language === 'hi-IN') errorMsg = 'मुझे कनेक्ट करने में समस्या हुई। कृपया पुनः प्रयास करें।';
        if (language === 'pa-IN') errorMsg = 'ਮੈਨੂੰ ਕਨੈਕਟ ਕਰਨ ਵਿੱਚ ਸਮੱਸਿਆ ਆਈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।';

        setMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }]);
        speakText(errorMsg);
      }
    }
    setIsLoading(false);
  }, [input, messages, isLoading, formFilled, onFormFill, mode, selectedComplaint, language, speakText]);

  /* ─── Voice input via Web Speech API ────────────────── */

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? prev + ' ' + transcript : transcript));
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, language]);

  /* ─── Keyboard handler ─────────────────────────────── */

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ═════════════════════════════════════════════════════════
     RENDER: Mode Selection Screen
     ═════════════════════════════════════════════════════════ */

  if (mode === 'select') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden shadow-sm border border-white/20">
              <img src="/images/saarthii_ai_logo.png" alt="Saarthii AI" className="w-full h-full object-cover scale-[1.15]" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm md:text-base leading-tight">Saarthii AI</h3>
              <p className="text-[11px] md:text-sm text-white/70">How can I help you?</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/10 rounded-lg px-2 py-1 text-sm text-white border border-white/20">
              <Globe size={14} className="mr-1.5" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent outline-none cursor-pointer appearance-none pr-4 text-xs font-semibold"
                style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code} className="text-slate-900">{l.name}</option>
                ))}
              </select>
            </div>
            {onClose && (
              <button onClick={onClose} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            )}
          </div>
        </div>

        {/* Mode selection */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-slate-50/50 gap-6">
          <div className="text-center mb-2">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto mb-4">
              <Bot size={32} className="text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {language === 'hi-IN' ? 'नमस्ते! 🙏' : language === 'pa-IN' ? 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! 🙏' : 'Namaste! 🙏'}
            </h2>
            <p className="text-sm text-slate-500 mt-1.5 max-w-sm">
              {language === 'hi-IN' 
                ? 'मैं सारथी हूँ। मैं आज आपकी कैसे मदद कर सकता हूँ?' 
                : language === 'pa-IN' 
                  ? 'ਮੈਂ ਸਾਰਥੀ ਹਾਂ। ਮੈਂ ਅੱਜ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?' 
                  : 'I\'m Saarthii AI. How can I help you today? Choose an option below:'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <button
              onClick={selectFileMode}
              className="flex-1 group relative bg-white border-2 border-slate-200 hover:border-indigo-400 rounded-2xl p-5 text-left transition-all duration-300 hover:shadow-lg hover:shadow-indigo-100 hover:-translate-y-0.5"
            >
              <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
                <FileText size={22} className="text-orange-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                {language === 'hi-IN' ? 'शिकायत दर्ज करें' : language === 'pa-IN' ? 'ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ' : 'File a Complaint'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {language === 'hi-IN' ? 'अपनी समस्या समझाएँ और मैं आपकी शिकायत दर्ज करूँगा' : language === 'pa-IN' ? 'ਆਪਣੀ ਸਮੱਸਿਆ ਦੱਸੋ ਅਤੇ ਮੈਂ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰਾਂਗਾ' : 'Describe your problem and I\'ll help you register it'}
              </p>
            </button>

            <button
              onClick={selectTrackMode}
              className="flex-1 group relative bg-white border-2 border-slate-200 hover:border-emerald-400 rounded-2xl p-5 text-left transition-all duration-300 hover:shadow-lg hover:shadow-emerald-100 hover:-translate-y-0.5"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center mb-3 group-hover:bg-emerald-200 transition-colors">
                <Search size={22} className="text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                {language === 'hi-IN' ? 'शिकायत की स्थिति देखें' : language === 'pa-IN' ? 'ਸ਼ਿਕਾਇਤ ਟਰੈਕ ਕਰੋ' : 'Track Complaints'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {language === 'hi-IN' ? 'अपनी पुरानी शिकायतों की प्रगति और विवरण देखें' : language === 'pa-IN' ? 'ਆਪਣੀਆਂ ਪੁਰਾਣੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਦੀ ਸਥਿਤੀ ਅਤੇ ਵੇਰਵੇ ਦੇਖੋ' : 'Check status, and details of your existing complaints'}
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ═════════════════════════════════════════════════════════
     RENDER: Track Mode — Complaint Cards List
     ═════════════════════════════════════════════════════════ */

  if (mode === 'track') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={goBackToSelect} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
              <ArrowLeft size={18} />
            </button>
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden shadow-sm border border-white/20">
              <img src="/images/saarthii_ai_logo.png" alt="Saarthii AI" className="w-full h-full object-cover scale-[1.15]" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm md:text-base leading-tight">
                {language === 'hi-IN' ? 'शिकायत की स्थिति' : language === 'pa-IN' ? 'ਸ਼ਿਕਾਇਤ ਟਰੈਕ' : 'Track Complaints'}
              </h3>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-200">
            🔍 Tracking
          </span>
        </div>

        {/* Complaint cards */}
        <div className="flex-1 overflow-y-auto px-4 py-5 bg-slate-50/50">
          {complaintsLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Loader2 size={28} className="text-indigo-500 animate-spin" />
            </div>
          ) : userComplaints.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Search size={28} className="text-slate-400" />
              </div>
              <h3 className="font-bold text-slate-700 text-base">No complaints found</h3>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                {userComplaints.length} complaint{userComplaints.length > 1 ? 's' : ''} found
              </p>
              {userComplaints.map((complaint, idx) => {
                const sc = getStatusConfig(complaint.status);
                const StatusIcon = sc.icon;
                return (
                  <motion.button
                    key={complaint._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => selectComplaint(complaint)}
                    className="w-full text-left bg-white rounded-xl border border-slate-200 p-4 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-50 transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 text-sm leading-snug truncate group-hover:text-indigo-700 transition-colors">
                          {complaint.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${sc.bg} ${sc.color}`}>
                            <StatusIcon size={11} />
                            {sc.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {formatDate(complaint.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={11} />
                            {complaint.location?.city || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="text-slate-300 group-hover:text-indigo-400 transition-colors mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ═════════════════════════════════════════════════════════
     RENDER: Chat Screen (File mode or Track-Chat mode)
     ═════════════════════════════════════════════════════════ */

  const isTrackChat = mode === 'track-chat';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={isTrackChat ? goBackToTrack : goBackToSelect}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden shadow-sm border border-white/20">
            <img src="/images/saarthii_ai_logo.png" alt="Saarthii AI" className="w-full h-full object-cover scale-[1.15]" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm md:text-base leading-tight">Saarthii AI</h3>
            <p className="text-[11px] md:text-sm text-white/70 truncate max-w-[150px]">
              {isTrackChat ? 'Complaint details' : 'File a Complaint'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full hidden sm:inline-block ${
            isTrackChat
              ? 'bg-emerald-500/20 text-emerald-200'
              : 'bg-orange-500/20 text-orange-200'
          }`}>
            {isTrackChat ? '🔍 Tracking' : '📝 Filing'}
          </span>

          {isListening && (
            <span className="flex items-center gap-1.5 text-[11px] text-white font-medium bg-red-500/80 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              {language === 'hi-IN' ? 'सुन रहा हूँ...' : language === 'pa-IN' ? 'ਸੁਣ ਰਿਹਾ ਹਾਂ...' : 'Listening…'}
            </span>
          )}
          {onClose && (
            <button onClick={onClose} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50/50">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot size={14} className="text-indigo-600" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-md'
                    : 'bg-white text-slate-700 border border-slate-200 rounded-bl-md shadow-sm'
                }`}
                style={{ direction: 'ltr' }}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  <User size={14} className="text-slate-600" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <Bot size={14} className="text-indigo-600" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Form filled success */}
        {formFilled && mode === 'file' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
            <p className="text-sm font-semibold text-emerald-700">✅ Form auto-filled!</p>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-slate-200 bg-white px-3 py-3 flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={toggleListening}
          className={`p-2.5 rounded-xl transition-all duration-200 ${
            isListening
              ? 'bg-red-500 text-white shadow-md shadow-red-200 animate-pulse'
              : 'bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
          }`}
          title="Voice input"
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isListening
              ? (language === 'hi-IN' ? 'सुन रहा हूँ...' : language === 'pa-IN' ? 'ਸੁਣ ਰਿਹਾ ਹਾਂ...' : 'Listening… speak now')
              : isTrackChat
                ? (language === 'hi-IN' ? 'इस शिकायत के बारे में पूछें...' : language === 'pa-IN' ? 'ਇਸ ਬਾਰੇ ਪੁੱਛੋ...' : 'Ask about this complaint…')
                : (language === 'hi-IN' ? 'अपनी समस्या समझाएँ...' : language === 'pa-IN' ? 'ਆਪਣੀ ਸਮੱਸਿਆ ਦੱਸੋ...' : 'Describe your problem…')
          }
          disabled={isLoading}
          className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50
            outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100
            placeholder:text-slate-300 text-slate-800 transition-all duration-200"
        />

        <button
          type="button"
          onClick={() => sendMessage()}
          disabled={!input.trim() || isLoading}
          className={`p-2.5 rounded-xl transition-all duration-200 ${
            input.trim() && !isLoading
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700'
              : 'bg-slate-100 text-slate-300 cursor-not-allowed'
          }`}
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>
    </div>
  );
}
