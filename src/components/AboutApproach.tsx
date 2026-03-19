export function AboutApproach() {
  const approaches = [
    {
      title: 'Human-Centric',
      desc: 'Designing for accessibility and ease of use for all citizens.',
      icon: 'person_search'
    },
    {
      title: 'Data-Driven',
      desc: 'Using analytics to predict needs and optimize performance.',
      icon: 'insights'
    },
    {
      title: 'Open Architecture',
      desc: 'Building modular systems that scale and integrate seamlessly.',
      icon: 'account_tree'
    },
    {
      title: 'Trust-First',
      desc: 'Ensuring highest standards of security and transparency.',
      icon: 'gpp_good'
    }
  ];

  return (
    <section className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Approach</h2>
            <p className="text-lg text-slate-400 mb-8 max-w-xl">
              We combine technical excellence with social empathy to build tools that matter. Public service delivery often suffers from systemic inefficiencies, and we're here to solve that.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-red-400">
                <span className="material-symbols-outlined">error</span>
                <span>Siloed information across departments</span>
              </div>
              <div className="flex items-center gap-3 text-red-400">
                <span className="material-symbols-outlined">error</span>
                <span>Manual processes prone to human error</span>
              </div>
              <div className="flex items-center gap-3 text-red-400">
                <span className="material-symbols-outlined">error</span>
                <span>Limited citizen feedback mechanisms</span>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 grid grid-cols-2 gap-6">
            {approaches.map((ap, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 transition-colors hover:bg-white/10">
                <span className="material-symbols-outlined text-primary mb-4 text-3xl">{ap.icon}</span>
                <h4 className="font-bold mb-2">{ap.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{ap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
