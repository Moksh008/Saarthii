


export function HeroSection() {
  return (
    <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-primary/10 text-primary rounded-full">Future of Governance</span>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
            Empowering Governance with <span className="text-primary">AI-Driven</span> Insights
          </h1>
          <p className="text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            Saarthii provides high-end GovTech solutions to streamline administrative workflows and enhance public service delivery with precision and scale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5">Start Your Transformation</button>
            <button className="bg-white border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:bg-slate-50">View Case Studies</button>
          </div>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden p-2">
            <div className="bg-slate-100 rounded-xl aspect-video relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-200 flex flex-col p-6 z-10">
                <div className="flex gap-4 mb-6">
                  <div className="h-8 w-32 bg-slate-300 rounded-lg animate-pulse"></div>
                  <div className="h-8 w-32 bg-slate-300 rounded-lg animate-pulse"></div>
                </div>
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="h-32 bg-white rounded-xl shadow-sm"></div>
                  <div className="h-32 bg-white rounded-xl shadow-sm"></div>
                  <div className="h-32 bg-white rounded-xl shadow-sm"></div>
                </div>
                <div className="flex-grow bg-white rounded-xl shadow-sm"></div>
              </div>
              <img 
                className="absolute inset-0 w-full h-full object-cover opacity-20" 
                alt="Government dashboard showing analytics" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA412VEOaUEiH4W4tXNzbBvJ54L_jHE3Pk-DGIxbryLXKPk8ZKRxOZ8oQodw3NZ4vqt_p0bms6uIqt1t2GFu3Zu1f2bjHAwb259zv0-tJpCMP0R42rDfNI2wmzCZ9mFZ8pkDMGXibIMgaQz4H3gEA24x9-TZXyOMzUNYJ6LjaFCOhuMMUw4DsjuS9E4QnFpJrP4y10TfF0H13EW-NCbAicxEXVKHEGdBWygdSy-RzQSwbKMSnOsCDj574HahBDOhIwXN4y_CiMAIxY"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
