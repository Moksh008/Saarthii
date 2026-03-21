import { Home, Phone, Info, HelpCircle, Network } from "lucide-react";

export function HeroSection() {
  return (
    <div className="flex flex-col w-full pt-[70px]">
      {/* Government Top Bar */}
      <div className="bg-slate-900 text-slate-50 text-[10px] sm:text-xs py-2 px-4 sm:px-6 lg:px-8 hidden lg:flex justify-between items-center w-full">
        <div className="flex items-center gap-4 divide-x divide-slate-700">
          <div className="flex flex-col pr-4 leading-tight">
            <span className="font-semibold text-white/90">भारत सरकार</span>
            <span className="text-white/70">Government of India</span>
          </div>
          <div className="flex flex-col pl-4 leading-tight">
            <span className="font-semibold text-white/90">कार्मिक, लोक शिकायत और पेंशन मंत्रालय</span>
            <span className="text-white/70">Ministry of Personnel, Public Grievances & Pensions</span>
          </div>
        </div>
        <div className="flex items-center gap-4 divide-x divide-slate-700 text-white/80">
          <a href="/" className="flex items-center gap-1.5 pl-4 hover:text-white transition-colors"><Home className="w-3.5 h-3.5" /> Home</a>
          <a href="#contact" className="flex items-center gap-1.5 pl-4 hover:text-white transition-colors"><Phone className="w-3.5 h-3.5" /> Contact Us</a>
          <a href="/about" className="flex items-center gap-1.5 pl-4 hover:text-white transition-colors"><Info className="w-3.5 h-3.5" /> About Us</a>
          <a href="#faq" className="flex items-center gap-1.5 pl-4 hover:text-white transition-colors"><HelpCircle className="w-3.5 h-3.5" /> FAQs/Help</a>
          <a href="#sitemap" className="flex items-center gap-1.5 pl-4 hover:text-white transition-colors"><Network className="w-3.5 h-3.5" /> Site Map</a>
        </div>
      </div>

      <section className="relative px-4 pt-10 pb-16 sm:px-6 lg:px-8 bg-slate-50 min-h-[90vh] flex items-center justify-center">
      {/* Large rounded container */}
      <div className="relative w-full max-w-[1400px] mx-auto rounded-[2rem] sm:rounded-[3rem] overflow-hidden min-h-[600px] lg:min-h-[750px] flex items-center shadow-2xl shadow-slate-200/50">
        
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop" 
            alt="Professional at work" 
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent w-full md:w-3/4"></div>

        {/* Content Container */}
        <div className="relative z-10 p-8 sm:p-12 lg:p-20 flex flex-col justify-center w-full max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
            Strategic Clarity.<br/> Sustainable Growth.
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-xl leading-relaxed font-medium">
            Saarthii helps governments refine strategy, strengthen operations, and scale with confidence through data-driven GovTech and practical execution.
          </p>
          <div>
            <button className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg transition-all hover:bg-slate-50 hover:shadow-lg flex items-center gap-2 group">
              Book a Call 
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Stats floating card */}
        <div className="absolute bottom-8 right-8 z-10 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl max-w-xs text-white">
            <div className="flex -space-x-3 mb-4">
              <img className="w-12 h-12 rounded-full border-2 border-white/50 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="User 1"/>
              <img className="w-12 h-12 rounded-full border-2 border-white/50 object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop" alt="User 2"/>
              <img className="w-12 h-12 rounded-full border-2 border-white/50 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" alt="User 3"/>
              <div className="w-12 h-12 rounded-full border-2 border-white/50 bg-[#c4f052] text-slate-900 flex items-center justify-center text-lg font-bold shadow-inner">+</div>
            </div>
            <h3 className="text-4xl font-bold mb-1">30k+</h3>
            <p className="text-sm text-white/90 font-medium">Happy clients we have world-wide.</p>
          </div>
        </div>

      </div>
    </section>
    </div>
  );
}
