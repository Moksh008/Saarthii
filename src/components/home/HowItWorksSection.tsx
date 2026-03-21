


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

  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Seamless Implementation</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Going from legacy to lightning-fast in four simple steps.</p>
        </div>
        
        <div className="relative">
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-slate-800"></div>
          <div className="grid lg:grid-cols-4 gap-12 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center group">
                <div className="w-24 h-24 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all group-hover:border-primary relative z-10">
                  <span className="material-symbols-outlined text-3xl text-primary">{step.icon}</span>
                </div>
                <h4 className="text-xl font-bold mb-3">{step.title}</h4>
                <p className="text-slate-400 text-sm leading-normal">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
