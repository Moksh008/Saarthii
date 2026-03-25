import { useEffect, useRef, useState } from 'react';

export function DashboardPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 bg-slate-50" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">

          {/* LEFT: Computer screen mockup */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <div className="relative rounded-2xl shadow-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="p-6">
                {/* Window dots */}
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                {/* Dashboard skeleton UI */}
                <div className="space-y-4">
                  <div className="h-4 w-1/2 bg-slate-100 rounded mb-4"></div>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="h-20 bg-primary/5 border border-primary/10 rounded-xl"></div>
                    <div className="h-20 bg-slate-50 rounded-xl"></div>
                    <div className="h-20 bg-slate-50 rounded-xl"></div>
                    <div className="h-20 bg-slate-50 rounded-xl"></div>
                  </div>
                  <div className="h-40 bg-slate-50 rounded-xl p-4">
                    <div className="h-full flex items-end gap-2">
                      <div className="flex-grow h-1/2 bg-primary/20 rounded-t"></div>
                      <div className="flex-grow h-3/4 bg-primary/40 rounded-t"></div>
                      <div className="flex-grow h-full bg-primary rounded-t"></div>
                      <div className="flex-grow h-2/3 bg-primary/60 rounded-t"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background image overlay */}
              <img
                className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
                alt="Government dashboard showing real-time service metrics"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNOLZBmG2M2VLRPcqWlc-0X6vfrSdcM2DSlDNxOqWbsnj7d4bwKvFLH7D9oEJ85f68oc2ppxx1R7kndoFVW-orG-PhhTyalwxAuR_cZK8Sm2ZGAWI-ewwi0biCJ-tG4iwH6J_tz-Gn5wSOsjCUAfiEBqeQZEQFXaDlYuqyYz6-1v8FPqhwwOi0Xj2NygEV4IoUyCde_y2qWvMpB72AEygQqsB-zvoeSwSThny16XyqFF0iQmSUHAyERSLNtH5d3eDeQQ0y_LmCyhA"
              />

              {/* Animated mouse cursor */}
              <div
                className="absolute z-20 pointer-events-none"
                style={{
                  animation: 'cursorMove 8s ease-in-out infinite',
                }}
              >
                {/* Cursor SVG */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 3L19 12L12 13L9 20L5 3Z" fill="#1e293b" stroke="#ffffff" strokeWidth="1.5" />
                </svg>
                {/* Click ripple */}
                <div
                  className="absolute top-0 left-0 w-6 h-6 rounded-full border-2 border-primary/50"
                  style={{
                    animation: 'clickRipple 8s ease-in-out infinite',
                    transform: 'translate(-25%, -25%)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Text content with scroll-reveal */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            {/* Badge */}
            <span
              className="text-primary font-bold tracking-widest uppercase text-sm block mb-4"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
              }}
            >
              Double Visibility
            </span>

            {/* Heading */}
            <h2
              className="text-4xl font-bold mb-6"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(25px)',
                transition: 'opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s',
              }}
            >
              Admin Power, Public Trust
            </h2>

            <div className="flex flex-col gap-8">
              {/* Keypoint 1 */}
              <div
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateX(0)' : 'translateX(40px)',
                  transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.45s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.45s',
                }}
              >
                <h4 className="text-xl font-bold mb-2 flex items-center gap-3">
                  <span translate="no" className="material-symbols-outlined notranslate text-primary">admin_panel_settings</span>
                  Executive Command Center
                </h4>
                <p className="text-slate-600">Administrators get a high-level overview of department performance, budget health, and task completion rates.</p>
              </div>

              {/* Keypoint 2 */}
              <div
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateX(0)' : 'translateX(40px)',
                  transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.65s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.65s',
                }}
              >
                <h4 className="text-xl font-bold mb-2 flex items-center gap-3">
                  <span translate="no" className="material-symbols-outlined notranslate text-primary">public</span>
                  Public Transparency Portal
                </h4>
                <p className="text-slate-600">Citizens can track the progress of community projects, scheme disbursements, and local government spending in real-time.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes cursorMove {
          0%   { top: 35%; left: 15%; }
          10%  { top: 30%; left: 25%; }
          20%  { top: 22%; left: 38%; }
          25%  { top: 22%; left: 38%; transform: scale(0.9); }
          30%  { top: 22%; left: 38%; transform: scale(1); }
          40%  { top: 55%; left: 20%; }
          50%  { top: 60%; left: 35%; }
          55%  { top: 60%; left: 35%; transform: scale(0.9); }
          60%  { top: 60%; left: 35%; transform: scale(1); }
          70%  { top: 45%; left: 55%; }
          80%  { top: 30%; left: 50%; }
          85%  { top: 30%; left: 50%; transform: scale(0.9); }
          90%  { top: 30%; left: 50%; transform: scale(1); }
          100% { top: 35%; left: 15%; }
        }
        @keyframes clickRipple {
          0%, 20%, 40%, 60%, 80% { opacity: 0; transform: translate(-25%, -25%) scale(0); }
          25%  { opacity: 0.6; transform: translate(-25%, -25%) scale(1); }
          30%  { opacity: 0; transform: translate(-25%, -25%) scale(2); }
          55%  { opacity: 0.6; transform: translate(-25%, -25%) scale(1); }
          60%  { opacity: 0; transform: translate(-25%, -25%) scale(2); }
          85%  { opacity: 0.6; transform: translate(-25%, -25%) scale(1); }
          90%  { opacity: 0; transform: translate(-25%, -25%) scale(2); }
          100% { opacity: 0; transform: translate(-25%, -25%) scale(0); }
        }
      `}</style>
    </section>
  );
}
