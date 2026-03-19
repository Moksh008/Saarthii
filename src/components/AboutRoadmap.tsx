export function AboutRoadmap() {
  const milestones = [
    {
      period: 'Q4 2024',
      title: 'Blockchain integration',
      desc: 'Blockchain-integrated land records management module.'
    },
    {
      period: 'Q2 2025',
      title: 'Citizen App 2.0',
      desc: 'Launch of Saarthii Citizen App 2.0 with vernacular voice assist.'
    },
    {
      period: '2026',
      title: 'National Expansion',
      desc: 'Pan-national expansion for primary healthcare digitization.'
    }
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Future Roadmap</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">We are not just building tools for today, but an ecosystem for the next generation of digital democracy.</p>
        </div>
        
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 h-full w-px bg-slate-200 hidden lg:block"></div>
          <div className="space-y-12">
            {milestones.map((ms, idx) => (
              <div key={idx} className={`flex flex-col lg:flex-row items-center gap-8 ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                <div className={`w-full lg:w-1/2 flex ${idx % 2 === 0 ? 'lg:justify-end' : 'lg:justify-start'}`}>
                  <div className={`p-8 rounded-3xl border border-slate-100 shadow-sm w-full max-w-md ${idx % 2 === 0 ? 'bg-white lg:text-right' : 'bg-slate-900 text-white'}`}>
                    <div className="text-primary font-black text-xl mb-2">{ms.period}</div>
                    <h4 className={`text-xl font-bold mb-3 ${idx % 2 === 0 ? 'text-slate-900' : 'text-white'}`}>{ms.title}</h4>
                    <p className={`${idx % 2 === 0 ? 'text-slate-600' : 'text-slate-400'} text-sm leading-relaxed`}>{ms.desc}</p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-white bg-primary shadow-lg shadow-primary/30 z-10 hidden lg:block"></div>
                <div className="w-full lg:w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
