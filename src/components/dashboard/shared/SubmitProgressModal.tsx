import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldCheck, FileSearch, Send, CloudLightning } from 'lucide-react';

interface SubmitProgressModalProps {
  isOpen: boolean;
  status: 'processing' | 'success';
  onClose: () => void;
}

const STEPS = [
  { text: "Checking your complaint", icon: <FileSearch size={24} /> },
  { text: "Making sure it's not spam", icon: <ShieldCheck size={24} /> },
  { text: "Grouping it correctly", icon: <CloudLightning size={24} /> },
  { text: "Sending it to the right department", icon: <Send size={24} /> }
];

export function SubmitProgressModal({ isOpen, status, onClose }: SubmitProgressModalProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }

    if (status === 'success') {
      setProgress(100);
      return;
    }

    // Simulate progress smoothly but slower to accommodate backend processing
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 95; // Cap at 95% until API completely finishes
        
        // Asymptotic slowdown mimicking real complex async operations
        let increment = 1;
        if (prev < 40) increment = Math.floor(Math.random() * 4) + 2; // Fast start (2-5%)
        else if (prev < 75) increment = Math.floor(Math.random() * 3) + 1; // Medium pace (1-3%)
        else if (prev < 90) increment = 1; // Slow down (1%)
        else increment = Math.random() > 0.3 ? 1 : 0; // Very slow creeping at the very end
        
        return prev + increment; 
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isOpen, status]);

  // Determine current step index based on progress percentage
  let currentStepIndex = 0;
  if (progress >= 100) currentStepIndex = 4; // Done
  else if (progress >= 75) currentStepIndex = 3;
  else if (progress >= 50) currentStepIndex = 2;
  else if (progress >= 25) currentStepIndex = 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-[2rem] shadow-2xl overflow-hidden w-full max-w-md border border-slate-100"
          >
            {status === 'success' ? (
              <div className="p-10 text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="mx-auto size-28 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-emerald-200/50"
                >
                  <CheckCircle2 size={56} />
                </motion.div>
                <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Success!</h2>
                <p className="text-slate-600 font-medium mb-10 text-lg leading-relaxed">
                  Your complaint has been submitted successfully.
                </p>
                <button
                  onClick={onClose}
                  className="w-full bg-slate-900 text-white font-black text-lg py-4 px-6 rounded-2xl hover:bg-slate-800 transition-all shadow-xl hover:-translate-y-1 hover:shadow-2xl"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <div className="p-8">
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight text-center flex flex-col items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-600 p-3 rounded-full mb-2">
                    <CloudLightning size={28} />
                  </span>
                  Processing Grievance...
                </h2>
                
                {/* Progress Bar Container */}
                <div className="relative mb-10 mt-4">
                  <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                    <span>Progress</span>
                    <span className="text-indigo-600">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "linear" }}
                    />
                  </div>
                </div>
                
                {/* AI Step Indicator List */}
                <div className="space-y-4">
                  {STEPS.map((step, idx) => {
                    const isActive = currentStepIndex === idx;
                    const isPast = currentStepIndex > idx;
                    
                    return (
                      <div 
                        key={idx} 
                        className={`flex items-center gap-5 p-4 rounded-2xl transition-all duration-300 ${
                          isActive ? 'bg-indigo-50 border border-indigo-100 shadow-sm transform scale-[1.02]' : 
                          isPast ? 'opacity-70' : 'opacity-40'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl transition-colors ${
                          isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 
                          isPast ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' : 
                          'bg-slate-200 text-slate-500'
                        }`}>
                          {isPast ? <CheckCircle2 size={24} /> : step.icon}
                        </div>
                        <span className={`font-black font-inter tracking-tight transition-all ${
                          isActive ? 'text-indigo-950 text-base' : 
                          isPast ? 'text-slate-700 text-sm' : 'text-slate-500 text-sm'
                        }`}>
                          {step.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
