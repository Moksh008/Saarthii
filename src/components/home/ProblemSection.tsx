


export function ProblemSection() {
  const problems = [
    {
      icon: 'database',
      title: 'Data Silos',
      desc: 'Fragmented information across departments hinders holistic decision making and response times.',
      bg: '/home_data/data1.avif',
    },
    {
      icon: 'history_edu',
      title: 'Manual Processing',
      desc: 'Legacy paperwork and manual workflows delay essential public services and increase error rates.',
      bg: '/home_data/data2.avif',
    },
    {
      icon: 'visibility_off',
      title: 'Lack of Transparency',
      desc: 'Difficulty in tracking real-time progress of government schemes creates public distrust.',
      bg: '/home_data/data3.avif',
    },
    {
      icon: 'account_balance_wallet',
      title: 'Resource Constraints',
      desc: 'Inefficient allocation of limited budgets prevents maximum community impact and growth.',
      bg: '/home_data/data4.avif',
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden" id="problem" style={{background:'linear-gradient(135deg, #f8f4f0 0%, #eef2f7 50%, #f0ece8 100%)'}}>
      {/* Animated background elements */}
      <style>{`
        @keyframes float1 { 0%,100%{transform:translate(0,0) rotate(0deg)} 50%{transform:translate(30px,-40px) rotate(180deg)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0) rotate(0deg)} 50%{transform:translate(-40px,30px) rotate(-120deg)} }
        @keyframes float3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,40px) scale(1.2)} }
        @keyframes pulse-ring { 0%,100%{transform:scale(1);opacity:0.5} 50%{transform:scale(1.3);opacity:0.2} }
      `}</style>
      {/* Corner blobs — one in each corner */}
      <div className="absolute -top-28 -left-28 w-[22rem] h-[22rem] bg-primary/60 rounded-full blur-2xl" style={{animation:'float1 12s ease-in-out infinite'}} />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-orange-500/50 rounded-full blur-2xl" style={{animation:'float2 10s ease-in-out infinite'}} />
      <div className="absolute -bottom-28 -right-28 w-[24rem] h-[24rem] bg-primary/55 rounded-full blur-2xl" style={{animation:'float2 14s ease-in-out infinite'}} />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-amber-400/50 rounded-full blur-2xl" style={{animation:'float1 11s ease-in-out infinite'}} />
      {/* Center accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-blue-400/20 rounded-full blur-2xl" style={{animation:'float3 16s ease-in-out infinite'}} />
      {/* Floating shapes */}
      <div className="absolute top-1/4 right-1/4 w-20 h-20 border-[3px] border-primary/50 rounded-full" style={{animation:'pulse-ring 6s ease-in-out infinite'}} />
      <div className="absolute bottom-1/3 left-[15%] w-10 h-10 border-[3px] border-orange-400/50 rotate-45" style={{animation:'float3 10s ease-in-out infinite'}} />
      <div className="absolute top-[60%] right-[10%] w-6 h-6 bg-primary/40 rounded-full" style={{animation:'float1 8s ease-in-out infinite'}} />
      <div className="absolute top-12 right-[30%] w-28 h-28 border-[3px] border-dashed border-slate-400/50 rounded-full" style={{animation:'pulse-ring 8s ease-in-out infinite'}} />
      <div className="absolute bottom-20 left-[40%] w-8 h-8 border-[3px] border-primary/45 rotate-12" style={{animation:'float2 9s ease-in-out infinite'}} />
      <div className="absolute top-16 left-[20%] w-5 h-5 bg-orange-400/40 rounded-full" style={{animation:'float3 7s ease-in-out infinite'}} />
      <div className="absolute bottom-[15%] right-[20%] w-12 h-12 border-[3px] border-primary/45 rounded-full" style={{animation:'pulse-ring 5s ease-in-out infinite'}} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">The Challenges in Modern Governance</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Traditional administrative systems face mounting pressure in an increasingly digital world.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((prob, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl shadow-sm border border-slate-100 transition-all hover:border-primary/50 hover:shadow-lg group min-h-[280px]"
            >
              {/* Background image */}
              <img
                src={prob.bg}
                alt={prob.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay — mostly opaque so text is readable, lightens on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/40 to-slate-900/20 group-hover:from-slate-900/80 group-hover:via-slate-900/50 transition-all duration-300" />
              {/* Content */}
              <div className="relative z-10 p-8">
                <span className="material-symbols-outlined text-white text-4xl mb-4 group-hover:scale-110 transition-transform inline-block drop-shadow-lg">{prob.icon}</span>
                <h3 className="text-xl font-bold mb-3 text-white drop-shadow-md">{prob.title}</h3>
                <p className="text-white/90 text-sm leading-relaxed drop-shadow-sm">{prob.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
