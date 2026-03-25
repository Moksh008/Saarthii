export function AboutTeam() {
  const team = [
    {
      name: 'Dr. Ananya Sharma',
      role: 'CEO & Co-founder',
      desc: '15+ years experience in public policy and digital transformation.'
    },
    {
      name: 'Vikram Malhotra',
      role: 'CTO',
      desc: 'Ex-BigTech architect specialized in scalable government infra.'
    },
    {
      name: 'Rohan Deshmukh',
      role: 'Head of Operations',
      desc: 'Expert in ground-level implementation and field data collection.'
    },
    {
      name: 'Sana Kothari',
      role: 'UX Research Lead',
      desc: 'Ensuring digital inclusivity for vernacular users across rural regions.'
    }
  ];

  return (
    <section className="py-24 bg-slate-50" id="team">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">The Minds Behind Saarthii</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Passionate experts in technology, policy, and administration.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 transition-all hover:shadow-xl group">
              <div className="w-full aspect-square bg-slate-100 rounded-2xl mb-6 overflow-hidden flex items-center justify-center">
                <span translate="no" className="material-symbols-outlined notranslate text-slate-300 text-6xl group-hover:scale-110 transition-transform">person</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
              <div className="text-primary font-bold text-sm mb-4 uppercase tracking-widest">{member.role}</div>
              <p className="text-slate-600 text-sm leading-relaxed">{member.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
