import { useEffect, useRef, useState } from 'react';

export function HowItWorksSection() {
  const steps = [
    {
      icon: 'analytics',
      title: 'Audit',
      desc: 'We analyze your current data structures and pain points.'
    },
    {
      icon: 'cloud_sync',
      title: 'Integrate',
      desc: 'Our API layer connects all existing departmental databases.'
    },
    {
      icon: 'psychology',
      title: 'Train',
      desc: 'Custom AI models are trained on your specific regional data.'
    },
    {
      icon: 'rocket_launch',
      title: 'Deploy',
      desc: 'Full system rollout with role-based dashboard access.'
    }
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      // Animation starts when the section first enters the viewport
      // (i.e. the top of the section reaches the bottom of the window)
      const sectionOffsetTop = rect.top + scrollTop;
      const startScroll = sectionOffsetTop - windowH;

      // Animation completes when the user reaches the bottom of the page
      const endScroll = docHeight - windowH;

      if (scrollTop <= startScroll) {
        setProgress(0);
      } else if (scrollTop >= endScroll) {
        setProgress(1);
      } else {
        const traveled = scrollTop - startScroll;
        const total = endScroll - startScroll;
        setProgress(Math.min(1, Math.max(0, traveled / total)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Which steps are "reached" by the progress line
  const activeStep = (idx: number) => {
    // 4 steps → thresholds at 0%, 33%, 66%, 100%
    const threshold = idx / (steps.length - 1);
    return progress >= threshold;
  };

  return (
    <section ref={sectionRef} className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl lg:text-5xl font-black text-white mb-4 tracking-tight">
            7 Days Solution Guarantee{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fdba74 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              SLA
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Going from legacy to lightning-fast in four simple steps.
          </p>
        </div>

        {/* Desktop: horizontal timeline */}
        <div className="relative hidden lg:block">
          {/* Background track line (gray) */}
          <div
            className="absolute left-[12.5%] right-[12.5%] h-[3px] bg-slate-700/50 rounded-full"
            style={{ top: '48px' }}
          />
          {/* Animated orange progress line */}
          <div
            className="absolute left-[12.5%] h-[3px] rounded-full"
            style={{
              top: '48px',
              width: `${progress * 75}%`,  /* 75% = right-left span */
              background: 'linear-gradient(90deg, #f97316, #fb923c, #fdba74)',
              boxShadow: progress > 0 ? '0 0 16px rgba(249,115,22,0.5), 0 0 40px rgba(249,115,22,0.2)' : 'none',
              transition: 'width 0.05s linear',
            }}
          />

          <div className="grid grid-cols-4 gap-8 relative">
            {steps.map((step, idx) => {
              const reached = activeStep(idx);
              return (
                <div key={idx} className="text-center group">
                  {/* Checkpoint dot on the line */}
                  <div
                    className="absolute w-4 h-4 rounded-full border-2 z-20 transition-all duration-500"
                    style={{
                      left: `${12.5 + (idx / (steps.length - 1)) * 75}%`,
                      top: '42px',
                      transform: 'translateX(-50%)',
                      backgroundColor: reached ? '#f97316' : '#334155',
                      borderColor: reached ? '#fb923c' : '#475569',
                      boxShadow: reached ? '0 0 12px rgba(249,115,22,0.6)' : 'none',
                    }}
                  />

                  {/* Icon card */}
                  <div
                    className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500 relative z-10"
                    style={{
                      backgroundColor: reached ? 'rgba(249,115,22,0.12)' : 'rgb(30,41,59)',
                      border: reached ? '1.5px solid rgba(249,115,22,0.5)' : '1.5px solid rgb(51,65,85)',
                      boxShadow: reached ? '0 0 30px rgba(249,115,22,0.15)' : 'none',
                      transform: reached ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-3xl transition-colors duration-500"
                      style={{ color: reached ? '#f97316' : '#64748b' }}
                    >
                      {step.icon}
                    </span>
                  </div>

                  {/* Step number badge */}
                  <div
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black mb-3 transition-all duration-500"
                    style={{
                      backgroundColor: reached ? '#f97316' : '#1e293b',
                      color: reached ? '#fff' : '#64748b',
                      border: reached ? 'none' : '1px solid #334155',
                    }}
                  >
                    {idx + 1}
                  </div>

                  <h4
                    className="text-xl font-bold mb-3 transition-colors duration-500"
                    style={{ color: reached ? '#fff' : '#94a3b8' }}
                  >
                    {step.title}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="lg:hidden relative pl-10">
          {/* Background track line (gray) */}
          <div
            className="absolute left-4 top-0 bottom-0 w-[3px] bg-slate-700/50 rounded-full"
          />
          {/* Animated orange progress line */}
          <div
            className="absolute left-4 top-0 w-[3px] rounded-full"
            style={{
              height: `${progress * 100}%`,
              background: 'linear-gradient(180deg, #f97316, #fb923c, #fdba74)',
              boxShadow: progress > 0 ? '0 0 16px rgba(249,115,22,0.5)' : 'none',
              transition: 'height 0.05s linear',
            }}
          />

          {steps.map((step, idx) => {
            const reached = activeStep(idx);
            return (
              <div key={idx} className="relative pb-14 last:pb-0">
                {/* Checkpoint dot */}
                <div
                  className="absolute -left-6 w-4 h-4 rounded-full border-2 z-20 transition-all duration-500"
                  style={{
                    top: '30px',
                    backgroundColor: reached ? '#f97316' : '#334155',
                    borderColor: reached ? '#fb923c' : '#475569',
                    boxShadow: reached ? '0 0 12px rgba(249,115,22,0.6)' : 'none',
                  }}
                />

                <div className="flex items-start gap-5">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500"
                    style={{
                      backgroundColor: reached ? 'rgba(249,115,22,0.12)' : 'rgb(30,41,59)',
                      border: reached ? '1.5px solid rgba(249,115,22,0.5)' : '1.5px solid rgb(51,65,85)',
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-2xl transition-colors duration-500"
                      style={{ color: reached ? '#f97316' : '#64748b' }}
                    >
                      {step.icon}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black transition-all duration-500"
                        style={{
                          backgroundColor: reached ? '#f97316' : '#1e293b',
                          color: reached ? '#fff' : '#64748b',
                          border: reached ? 'none' : '1px solid #334155',
                        }}
                      >
                        {idx + 1}
                      </span>
                      <h4
                        className="text-lg font-bold transition-colors duration-500"
                        style={{ color: reached ? '#fff' : '#94a3b8' }}
                      >
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
