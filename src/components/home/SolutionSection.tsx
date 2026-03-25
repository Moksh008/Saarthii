import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export function SolutionSection() {
  const heading = useInView(0.3);
  const phase1 = useInView(0.3);
  const phase2 = useInView(0.3);
  const graphic = useInView(0.2);

  return (
    <section className="py-24" id="solution">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            {/* Heading — fade up */}
            <div
              ref={heading.ref}
              className="transition-all duration-700 ease-out"
              style={{
                opacity: heading.visible ? 1 : 0,
                transform: heading.visible ? 'translateY(0)' : 'translateY(40px)',
              }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight text-left">The Saarthii Solution Pipeline</h2>
              <p className="text-lg text-slate-600 mb-10">
                We transform administrative chaos into streamlined digital intelligence through our unique 2-phase approach.
              </p>
            </div>
            
            <div className="flex flex-col gap-8">
              {/* Phase 1 — slide in from left */}
              <div
                ref={phase1.ref}
                className="flex gap-6 transition-all duration-700 ease-out"
                style={{
                  opacity: phase1.visible ? 1 : 0,
                  transform: phase1.visible ? 'translateX(0)' : 'translateX(-60px)',
                  transitionDelay: '200ms',
                }}
              >
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/30">1</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Phase I: Consolidation</h4>
                  <p className="text-slate-600">Aggregating disparate data sources into a unified, secure cloud infrastructure with real-time syncing across all ministries.</p>
                </div>
              </div>

              {/* Phase 2 — slide in from left with more delay */}
              <div
                ref={phase2.ref}
                className="flex gap-6 transition-all duration-700 ease-out"
                style={{
                  opacity: phase2.visible ? 1 : 0,
                  transform: phase2.visible ? 'translateX(0)' : 'translateX(-60px)',
                  transitionDelay: '400ms',
                }}
              >
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/30">2</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Phase II: Intelligence Activation</h4>
                  <p className="text-slate-600">Deploying proprietary AI models to predict resource needs, automate citizen requests, and provide executive decision support.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right graphic — scale + fade in */}
          <div
            ref={graphic.ref}
            className="w-full lg:w-1/2 transition-all duration-1000 ease-out"
            style={{
              opacity: graphic.visible ? 1 : 0,
              transform: graphic.visible ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(30px)',
              transitionDelay: '300ms',
            }}
          >
            <div className="relative bg-slate-900 rounded-3xl p-8 aspect-square flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle,rgba(236,91,19,0.2)_0%,transparent_70%)]"></div>
              <div className="relative z-10 grid grid-cols-2 gap-4 w-full h-full">
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col justify-end overflow-hidden">
                  <img src="/auto/a1.avif" alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
                  <div className="absolute inset-0 bg-slate-900/30" />
                  <span className="relative z-10 material-symbols-outlined text-primary mb-2 text-4xl drop-shadow-lg">hub</span>
                  <div className="relative z-10 text-xs uppercase tracking-widest text-white font-bold drop-shadow-md">Connected</div>
                </div>
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col justify-end overflow-hidden">
                  <img src="/auto/a2.avif" alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
                  <div className="absolute inset-0 bg-slate-900/30" />
                  <span className="relative z-10 material-symbols-outlined text-primary mb-2 text-4xl drop-shadow-lg">auto_awesome</span>
                  <div className="relative z-10 text-xs uppercase tracking-widest text-white font-bold drop-shadow-md">Automated</div>
                </div>
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col justify-end overflow-hidden">
                  <img src="/auto/a3.avif" alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
                  <div className="absolute inset-0 bg-slate-900/30" />
                  <span className="relative z-10 material-symbols-outlined text-primary mb-2 text-4xl drop-shadow-lg">monitoring</span>
                  <div className="relative z-10 text-xs uppercase tracking-widest text-white font-bold drop-shadow-md">Insights</div>
                </div>
                <div className="relative bg-white/10 border-primary/30 backdrop-blur-sm border rounded-2xl p-6 flex flex-col justify-end overflow-hidden">
                  <img src="/auto/a4.avif" alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
                  <div className="absolute inset-0 bg-slate-900/25" />
                  <span className="relative z-10 material-symbols-outlined text-white mb-2 text-4xl drop-shadow-lg">verified</span>
                  <div className="relative z-10 text-xs uppercase tracking-widest text-white font-bold drop-shadow-md">Verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
