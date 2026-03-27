import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, MicOff, Bot, User, Loader2 } from 'lucide-react';
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

interface AIAssistantChatProps {
  onFormFill: (data: FormData) => void;
  onClose?: () => void;
}

/* ─── Speech Recognition type shim ───────────────────── */

interface SpeechRecognitionEvent {
  results: { [key: number]: { [key: number]: { transcript: string } } };
  resultIndex: number;
}

/* ─── Component ───────────────────────────────────────── */

export function AIAssistantChat({ onFormFill, onClose }: AIAssistantChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm Saarthii AI. Tell me about the problem you're facing — I'll help you file a complaint. You can type or use the mic button to speak.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [formFilled, setFormFilled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cancel any ongoing speech when the chat modal closes/unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  /* ─── Speech Synthesis Utility ──────────────────────── */
  const speakText = useCallback((text: string) => {
    try {
      window.speechSynthesis.cancel();
      
      // Clean text of markdown characters that cause unnatural TTS pauses
      const cleanText = text.replace(/[*_~\[\]]/g, '').replace(/#/g, '').replace(/\n+/g, ' . ').trim();
      const msg = new SpeechSynthesisUtterance(cleanText);
      
      // Basic language detection: if Devanagari script is present, use Hindi
      const hasDevanagari = /[\u0900-\u097F]/.test(text);
      const targetLang = hasDevanagari ? 'hi-IN' : 'en-IN';
      msg.lang = targetLang;
      // Use 1.0 rate. Slower rates force modern TTS to chop word-by-word.
      msg.rate = 1.0;
      msg.pitch = 1.0;
      
      // Intelligently select the most premium/human-sounding voice available
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const langPrefix = targetLang.split('-')[0];
        const matchVoices = voices.filter(v => v.lang.startsWith(langPrefix));
        
        // Prioritize cloud-based, "Google", "Natural", or "Premium" voices
        const bestVoice = matchVoices.sort((a, b) => {
          let aScore = 0; let bScore = 0;
          if (a.name.includes('Google') || a.name.includes('Natural') || a.name.includes('Premium')) aScore += 10;
          if (b.name.includes('Google') || b.name.includes('Natural') || b.name.includes('Premium')) bScore += 10;
          if (!a.localService) aScore += 5; // Cloud voices usually sound vastly better
          if (!b.localService) bScore += 5;
          return bScore - aScore;
        })[0];

        if (bestVoice) {
          msg.voice = bestVoice;
        }
      }
      
      window.speechSynthesis.speak(msg);
    } catch (e) {
      console.warn('Speech synthesis failed/unsupported', e);
    }
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

    // Skip the initial hardcoded greeting (index 0) — only send actual conversation
    const apiMessages = updatedMessages.slice(1);

    const MAX_RETRIES = 2;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const data = await apiFetch('/complaints/assistant/chat', {
          method: 'POST',
          body: JSON.stringify({ messages: apiMessages }),
        });

        const aiMsg: ChatMessage = { role: 'assistant', content: data.reply };
        setMessages((prev) => [...prev, aiMsg]);
        speakText(data.reply);

        // If AI returned form data, trigger auto-fill
        if (data.form_data && !formFilled) {
          setFormFilled(true);
          setTimeout(() => onFormFill(data.form_data), 600);
        }
        setIsLoading(false);
        return; // Success — exit retry loop
      } catch (err: any) {
        if (attempt < MAX_RETRIES - 1) {
          // Wait briefly before retrying
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }
        // Final attempt failed
        const errorMsg = 'I had a brief connection issue. Please send your message again — I\'m ready!';
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: errorMsg,
          },
        ]);
        speakText(errorMsg);
      }
    }
    setIsLoading(false);
  }, [input, messages, isLoading, formFilled, onFormFill]);

  /* ─── Voice input via Web Speech API ────────────────── */

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? prev + ' ' + transcript : transcript));
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening]);

  /* ─── Keyboard handler ─────────────────────────────── */

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden shadow-sm border border-white/20">
            <img src="/images/saarthii_ai_logo.png" alt="Saarthii AI" className="w-full h-full object-cover scale-[1.15]" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm md:text-base leading-tight">Saarthii AI Assistant</h3>
            <p className="text-[11px] md:text-sm text-white/70">Describe your problem • I'll fill the form</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isListening && (
            <span className="flex items-center gap-1.5 text-[11px] text-white font-medium bg-red-500/80 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Listening…
            </span>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Close Assistant"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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

        {/* Typing indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2.5"
          >
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
        {formFilled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center"
          >
            <p className="text-sm font-semibold text-emerald-700">✅ Form auto-filled!</p>
            <p className="text-xs text-emerald-600 mt-0.5">Review the details and submit when ready.</p>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-slate-200 bg-white px-3 py-3 flex items-center gap-2 shrink-0">
        {/* Mic button */}
        <button
          type="button"
          onClick={toggleListening}
          className={`p-2.5 rounded-xl transition-all duration-200 ${
            isListening
              ? 'bg-red-500 text-white shadow-md shadow-red-200 animate-pulse'
              : 'bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
          }`}
          title={isListening ? 'Stop recording' : 'Start voice input'}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Listening… speak now' : 'Describe your problem…'}
          disabled={isLoading}
          className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50
            outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100
            placeholder:text-slate-300 text-slate-800 transition-all duration-200
            disabled:opacity-50"
        />

        {/* Send button */}
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
