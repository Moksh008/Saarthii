


export function ImpactStats() {
  const stats = [
    { value: '40%', label: 'Process Efficiency' },
    { value: '12M+', label: 'Citizens Served' },
    { value: '250+', label: 'Government Entities' },
    { value: '98%', label: 'Uptime Reliability' },
  ];

  return (
    <section className="py-24 bg-primary text-white" id="impact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx}>
              <div className="text-4xl lg:text-6xl font-black mb-2">{stat.value}</div>
              <div className="text-white/80 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
