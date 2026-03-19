


export function DashboardPreview() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <div className="relative rounded-2xl shadow-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
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
              <img 
                className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" 
                alt="Government dashboard showing real-time service metrics" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNOLZBmG2M2VLRPcqWlc-0X6vfrSdcM2DSlDNxOqWbsnj7d4bwKvFLH7D9oEJ85f68oc2ppxx1R7kndoFVW-orG-PhhTyalwxAuR_cZK8Sm2ZGAWI-ewwi0biCJ-tG4iwH6J_tz-Gn5wSOsjCUAfiEBqeQZEQFXaDlYuqyYz6-1v8FPqhwwOi0Xj2NygEV4IoUyCde_y2qWvMpB72AEygQqsB-zvoeSwSThny16XyqFF0iQmSUHAyERSLNtH5d3eDeQQ0y_LmCyhA"
              />
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <span className="text-primary font-bold tracking-widest uppercase text-sm block mb-4">Double Visibility</span>
            <h2 className="text-4xl font-bold mb-6">Admin Power, Public Trust</h2>
            
            <div className="flex flex-col gap-8">
              <div className="dp-keypoint">
                <h4 className="text-xl font-bold mb-2 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                  Executive Command Center
                </h4>
                <p className="text-slate-600">Administrators get a high-level overview of department performance, budget health, and task completion rates.</p>
              </div>
              
              <div className="dp-keypoint">
                <h4 className="text-xl font-bold mb-2 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">public</span>
                  Public Transparency Portal
                </h4>
                <p className="text-slate-600">Citizens can track the progress of community projects, scheme disbursements, and local government spending in real-time.</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
