export function VisionMission() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <div className="p-10 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <span translate="no" className="material-symbols-outlined notranslate text-3xl text-primary">visibility</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Vision</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                To be the most trusted catalyst for digital transformation in government services worldwide, creating a future where governance is invisible, efficient, and accessible to every citizen.
              </p>
            </div>
            <div className="mt-12 pt-8 border-t border-slate-200">
              <div className="text-4xl font-black text-primary mb-1">45%</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Efficiency Loss in Legacy Systems</div>
            </div>
          </div>
          
          <div className="p-10 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <span translate="no" className="material-symbols-outlined notranslate text-3xl text-primary">task_alt</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                To empower citizens and administrators with transparent, efficient, and innovative technology that eliminates bureaucratic friction and fosters institutional accountability.
              </p>
            </div>
            <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 gap-8">
              <div>
                <div className="text-2xl font-black text-slate-900 mb-1">Low</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Digital Literacy Gaps</div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 mb-1">Opaque</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Service Delivery Tracking</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
