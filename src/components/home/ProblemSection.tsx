


export function ProblemSection() {
  const problems = [
    {
      icon: 'database',
      title: 'Data Silos',
      desc: 'Fragmented information across departments hinders holistic decision making and response times.'
    },
    {
      icon: 'history_edu',
      title: 'Manual Processing',
      desc: 'Legacy paperwork and manual workflows delay essential public services and increase error rates.'
    },
    {
      icon: 'visibility_off',
      title: 'Lack of Transparency',
      desc: 'Difficulty in tracking real-time progress of government schemes creates public distrust.'
    },
    {
      icon: 'account_balance_wallet',
      title: 'Resource Constraints',
      desc: 'Inefficient allocation of limited budgets prevents maximum community impact and growth.'
    }
  ];

  return (
    <section className="py-24 bg-slate-50" id="problem">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">The Challenges in Modern Governance</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Traditional administrative systems face mounting pressure in an increasingly digital world.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((prob, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:border-primary/50 group">
              <span className="material-symbols-outlined text-primary text-4xl mb-4 group-hover:scale-110 transition-transform">{prob.icon}</span>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{prob.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{prob.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
