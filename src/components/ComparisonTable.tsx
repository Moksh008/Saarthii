


export function ComparisonTable() {
  const comparisons = [
    { feature: 'Deployment Speed', traditional: '12 - 18 Months', saarthii: '3 - 6 Months' },
    { feature: 'Data Integration', traditional: 'Manual Entry / Siloed', saarthii: 'Automated AI Mapping' },
    { feature: 'User Interface', traditional: 'Legacy / Complex', saarthii: 'Modern / Intuitive' },
    { feature: 'Decision Support', traditional: 'Reactive Reports', saarthii: 'Proactive AI Insights' },
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Why Leading Districts Choose Saarthii</h2>
        </div>
        
        <div className="overflow-x-auto rounded-2xl shadow-sm border border-slate-200">
          <table className="w-full text-left border-collapse bg-white">
            <thead>
              <tr>
                <th className="px-6 py-6 text-sm uppercase tracking-wider border-b border-slate-200 text-slate-500 font-semibold">Feature</th>
                <th className="px-6 py-6 text-sm uppercase tracking-wider border-b border-slate-200 text-slate-900 font-bold">Traditional GovTech</th>
                <th className="px-6 py-6 text-sm uppercase tracking-wider border-b border-slate-200 text-primary font-black bg-primary/5 border-x border-primary/20">Saarthii Platform</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-100 last:border-0">
                  <td className="px-6 py-6 font-medium text-slate-900">{item.feature}</td>
                  <td className="px-6 py-6 text-slate-50">{item.traditional}</td>
                  <td className="px-6 py-6 text-slate-900 font-bold bg-primary/[0.03] border-x border-primary/20">{item.saarthii}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
