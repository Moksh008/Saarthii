import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export function AlertBanner({ title, message, type = 'warning' }: { title: string, message: string, type?: 'warning' | 'error' | 'info' }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const bgClasses = type === 'warning' ? 'bg-amber-50 border-amber-200' : type === 'error' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200';
  const iconClasses = type === 'warning' ? 'text-amber-500' : type === 'error' ? 'text-red-500' : 'text-blue-500';

  return (
    <div className={`w-full border rounded-lg p-4 mb-6 relative flex items-start shadow-sm transition-all ${bgClasses}`}>
      <AlertTriangle className={`size-5 shrink-0 mr-3 mt-0.5 ${iconClasses}`} />
      <div>
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        <p className="text-sm text-slate-600 mt-1">{message}</p>
      </div>
      <button onClick={() => setVisible(false)} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600">
        <X size={16} />
      </button>
    </div>
  );
}
