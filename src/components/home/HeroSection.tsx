import { useState, useEffect } from "react";
import { Home, Phone, Info, HelpCircle, Network } from "lucide-react";

const TAGLINES = [
  "Govern with Intelligence. Resolve with Confidence.",
  "Modern Governance. Meaningful Action.",
  "Precision in Complaints. Progress in Governance.",
  "Public Service, Powered by Intelligence.",
  "Redefining Complaint Resolution for Governance.",
];

const WORD_DELAY = 180;   // ms between each word appearing
const LINE_PAUSE = 2200;  // ms to hold the full line before fading
const FADE_DURATION = 600; // ms for the fade-out transition

function TypewriterHeading() {
  const [lineIndex, setLineIndex] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const currentLine = TAGLINES[lineIndex];
  const words = currentLine.split(" ");

  useEffect(() => {
    if (isFading) return; // don't type while fading

    if (wordCount < words.length) {
      // Type next word
      const timer = setTimeout(() => setWordCount((c) => c + 1), WORD_DELAY);
      return () => clearTimeout(timer);
    } else {
      // Full line shown — hold, then fade out
      const holdTimer = setTimeout(() => setIsFading(true), LINE_PAUSE);
      return () => clearTimeout(holdTimer);
    }
  }, [wordCount, words.length, isFading]);

  useEffect(() => {
    if (!isFading) return;
    // After fade completes, advance to next line
    const fadeTimer = setTimeout(() => {
      setLineIndex((i) => (i + 1) % TAGLINES.length);
      setWordCount(0);
      setIsFading(false);
    }, FADE_DURATION);
    return () => clearTimeout(fadeTimer);
  }, [isFading]);

  const visibleText = words.slice(0, wordCount).join(" ");

  return (
    <div className="relative w-full h-[220px] sm:h-[240px] lg:h-[280px] mb-6">
      <h1
        className="absolute inset-0 text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight"
        style={{
          transition: `opacity ${FADE_DURATION}ms ease`,
          opacity: isFading ? 0 : 1,
        }}
      >
        {visibleText}
        <span
          className="inline-block w-[3px] h-[0.85em] bg-white/80 ml-1 align-text-bottom"
          style={{ animation: "blink 0.8s step-end infinite" }}
        />
        <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
      </h1>
    </div>
  );
}

const CAROUSEL_IMAGES = [
  "/home_back/img1.avif",
  "/home_back/img2.avif",
  "/home_back/img3.avif",
];
const SLIDE_INTERVAL = 5000; // 5 seconds per image

function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % CAROUSEL_IMAGES.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      {CAROUSEL_IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`Hero background ${i + 1}`}
          className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === activeIndex ? 1 : 0 }}
        />
      ))}
    </div>
  );
}

function StatsCard() {
  const [count, setCount] = useState(0);
  const target = 30;
  const duration = 2000; // 2 seconds

  useEffect(() => {
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuad
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl max-w-xs text-white">
      <div className="flex -space-x-3 mb-4">
        <img className="w-12 h-12 rounded-full border-2 border-white/50 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="User 1"/>
        <img className="w-12 h-12 rounded-full border-2 border-white/50 object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop" alt="User 2"/>
        <img className="w-12 h-12 rounded-full border-2 border-white/50 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" alt="User 3"/>
        <div className="w-12 h-12 rounded-full border-2 border-white/50 bg-[#c4f052] text-slate-900 flex items-center justify-center text-lg font-bold shadow-inner">+</div>
      </div>
      <h3 className="text-4xl font-bold mb-1">{count}k+</h3>
      <p className="text-sm text-white/90 font-medium">Happy users in India.</p>
    </div>
  );
}

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
      <div className="relative w-full max-w-[1400px] mx-auto rounded-[2rem] sm:rounded-[3rem] overflow-hidden min-h-[520px] lg:min-h-[620px] flex items-center shadow-2xl shadow-slate-200/50">
        
        {/* Background Image Carousel */}
        <HeroCarousel />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent w-full md:w-3/4"></div>

        {/* Content Container */}
        <div className="relative z-10 p-8 sm:p-12 lg:p-20 flex flex-col justify-center w-full max-w-3xl">
          <TypewriterHeading />
          <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-xl leading-relaxed font-medium">
            Saarthii helps governments refine strategy, strengthen operations, and scale with confidence through data-driven GovTech and practical execution.
          </p>
          <div>
            <button className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg transition-all hover:bg-slate-50 hover:shadow-lg flex items-center gap-2 group">
              Book a Call 
              <span translate="no" className="material-symbols-outlined notranslate transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Stats floating card */}
        <div className="absolute bottom-8 right-8 z-10 hidden lg:block">
          <StatsCard />
        </div>

      </div>
    </section>
    </div>
  );
}
