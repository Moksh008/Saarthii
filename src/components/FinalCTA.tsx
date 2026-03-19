


export function FinalCTA() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-[2rem] p-12 lg:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[48px]"></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Ready to Modernize Your Administration?</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">Join the digital governance revolution and provide the service your citizens deserve.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5">Schedule a Consultation</button>
              <button className="bg-slate-800 text-white border border-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition-colors hover:bg-slate-700">Download Brochure</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
