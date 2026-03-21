


export function FeaturesSection() {
  const features = [
    {
      icon: 'security',
      title: 'Military-Grade Security',
      desc: 'End-to-end encryption and multi-factor authentication for all government records and sensitive citizen data.'
    },
    {
      icon: 'query_stats',
      title: 'Predictive Analytics',
      desc: 'Anticipate public needs and potential crises before they occur using historical trend analysis and live data feeds.'
    },
    {
      icon: 'chat_bubble',
      title: 'Public Engagement',
      desc: 'Integrated multi-channel feedback systems to gather and process citizen sentiment in real-time across social and direct channels.'
    },
    {
      icon: 'translate',
      title: 'Multi-Lingual Support',
      desc: 'Native support for dozens of local languages and dialects ensures no citizen is left behind by technology barriers.'
    },
    {
      icon: 'api',
      title: 'Open API Framework',
      desc: 'Easily connect with existing legacy software or third-party civic-tech tools to expand platform capabilities without friction.'
    },
    {
      icon: 'verified_user',
      title: 'Compliance Engine',
      desc: 'Automatically stay updated with changing regional regulations and legislative changes with our built-in compliance monitor.'
    }
  ];

  return (
    <section className="py-24" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Core Platform Capabilities</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Built for the demands of modern public administration.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-slate-50 border border-transparent transition-all hover:bg-white hover:border-slate-200 hover:shadow-2xl hover:shadow-slate-200/50 group cursor-default">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
