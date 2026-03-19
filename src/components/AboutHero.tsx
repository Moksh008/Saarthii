export function AboutHero() {
  return (
    <section className="relative pt-32 pb-20 bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span>Our Story</span>
        </div>
        <h1 className="text-4xl lg:text-7xl font-bold text-white mb-8 tracking-tight">
          Empowering Governance <br /> <span className="text-primary">Through Innovation</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Saarthii is dedicated to building trust and transparency in public service delivery through cutting-edge GovTech solutions that bridge the gap between citizens and administration.
        </p>
        <div className="flex justify-center gap-4">
          <div className="flex items-center gap-2 text-white/60 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
            <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
            <span className="text-sm font-medium">100% Secure</span>
          </div>
          <div className="flex items-center gap-2 text-white/60 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
            <span className="material-symbols-outlined text-primary text-xl">shield_with_heart</span>
            <span className="text-sm font-medium">Citizen Data Protection</span>
          </div>
        </div>
      </div>
    </section>
  );
}
