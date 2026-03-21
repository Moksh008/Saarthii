


export function SolutionSection() {
  return (
    <section className="py-24" id="solution">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight text-left">The Saarthii Solution Pipeline</h2>
            <p className="text-lg text-slate-600 mb-10">
              We transform administrative chaos into streamlined digital intelligence through our unique 2-phase approach.
            </p>
            
            <div className="flex flex-col gap-8">
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/30">1</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Phase I: Consolidation</h4>
                  <p className="text-slate-600">Aggregating disparate data sources into a unified, secure cloud infrastructure with real-time syncing across all ministries.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/30">2</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Phase II: Intelligence Activation</h4>
                  <p className="text-slate-600">Deploying proprietary AI models to predict resource needs, automate citizen requests, and provide executive decision support.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <div className="relative bg-slate-900 rounded-3xl p-8 aspect-square flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle,rgba(236,91,19,0.2)_0%,transparent_70%)]"></div>
              <div className="relative z-10 grid grid-cols-2 gap-4 w-full h-full">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col justify-end">
                  <span className="material-symbols-outlined text-primary mb-2 text-3xl">hub</span>
                  <div className="text-[10px] uppercase tracking-widest text-slate-400">Connected</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col justify-end">
                  <span className="material-symbols-outlined text-primary mb-2 text-3xl">auto_awesome</span>
                  <div className="text-[10px] uppercase tracking-widest text-slate-400">Automated</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col justify-end">
                  <span className="material-symbols-outlined text-primary mb-2 text-3xl">monitoring</span>
                  <div className="text-[10px] uppercase tracking-widest text-slate-400">Insights</div>
                </div>
                <div className="bg-white/10 border-primary/30 backdrop-blur-sm border rounded-2xl p-6 flex flex-col justify-end">
                  <span className="material-symbols-outlined text-white mb-2 text-3xl">verified</span>
                  <div className="text-[10px] uppercase tracking-widest text-white font-bold">Verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
