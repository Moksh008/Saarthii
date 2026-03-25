import { useEffect, useRef, useState } from 'react';

const taglines = [
  'Built for the demands of modern public administration.',
  'Empowering governance with AI-driven intelligence.',
  'Secure, scalable, and citizen-first by design.',
  'Transforming public service delivery across India.',
];

export function FeaturesSection() {
  // --- Typewriter state ---
  const [lineIdx, setLineIdx] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const currentWords = taglines[lineIdx].split(' ');

  useEffect(() => {
    if (isFadingOut) return;

    if (wordCount < currentWords.length) {
      const timer = setTimeout(() => setWordCount((c) => c + 1), 120);
      return () => clearTimeout(timer);
    } else {
      // All words shown — hold for 2s, then fade out
      const hold = setTimeout(() => setIsFadingOut(true), 2000);
      return () => clearTimeout(hold);
    }
  }, [wordCount, currentWords.length, isFadingOut]);

  useEffect(() => {
    if (!isFadingOut) return;
    // After fade-out animation (600ms), move to next line
    const timer = setTimeout(() => {
      setLineIdx((prev) => (prev + 1) % taglines.length);
      setWordCount(0);
      setIsFadingOut(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [isFadingOut]);
  const features = [
    {
      icon: 'security',
      title: 'Military-Grade Security',
      desc: 'End-to-end encryption and multi-factor authentication for all government records and sensitive citizen data.',
      bg: '/images/features/security.png',
      accent: '#f97316',
    },
    {
      icon: 'query_stats',
      title: 'Predictive Analytics',
      desc: 'Anticipate public needs and potential crises before they occur using historical trend analysis and live data feeds.',
      bg: '/images/features/analytics.png',
      accent: '#3b82f6',
    },
    {
      icon: 'chat_bubble',
      title: 'Public Engagement',
      desc: 'Integrated multi-channel feedback systems to gather and process citizen sentiment in real-time across social and direct channels.',
      bg: '/images/features/engagement.png',
      accent: '#10b981',
    },
    {
      icon: 'translate',
      title: 'Multi-Lingual Support',
      desc: 'Native support for dozens of local languages and dialects ensures no citizen is left behind by technology barriers.',
      bg: '/images/features/multilingual.png',
      accent: '#f59e0b',
    },
    {
      icon: 'api',
      title: 'Open API Framework',
      desc: 'Easily connect with existing legacy software or third-party civic-tech tools to expand platform capabilities without friction.',
      bg: '/images/features/api.png',
      accent: '#06b6d4',
    },
    {
      icon: 'verified_user',
      title: 'Compliance Engine',
      desc: 'Automatically stay updated with changing regional regulations and legislative changes with our built-in compliance monitor.',
      bg: '/images/features/compliance.png',
      accent: '#8b5cf6',
    }
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean[]>(new Array(features.length).fill(false));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-idx'));
            setVisible((prev) => {
              const next = [...prev];
              next[idx] = true;
              return next;
            });
          }
        });
      },
      { threshold: 0.15 }
    );

    const cards = sectionRef.current?.querySelectorAll('[data-idx]');
    cards?.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-28 overflow-hidden" id="features">
      {/* Animated light background — 3 shades of white shifting */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f1f5f9 50%, #f8fafc 75%, #ffffff 100%)',
            backgroundSize: '400% 400%',
            animation: 'bgShift 12s ease-in-out infinite',
          }}
        />
        {/* Soft warm orb top-left */}
        <div
          className="absolute rounded-full blur-[140px] opacity-30"
          style={{
            width: '500px', height: '500px', top: '-8%', left: '-5%',
            background: 'radial-gradient(circle, #fed7aa 0%, transparent 70%)',
            animation: 'floatOrb1 18s ease-in-out infinite',
          }}
        />
        {/* Soft cool orb bottom-right */}
        <div
          className="absolute rounded-full blur-[140px] opacity-20"
          style={{
            width: '500px', height: '500px', bottom: '-8%', right: '-5%',
            background: 'radial-gradient(circle, #bfdbfe 0%, transparent 70%)',
            animation: 'floatOrb2 22s ease-in-out infinite',
          }}
        />
        {/* Subtle center glow */}
        <div
          className="absolute rounded-full blur-[160px] opacity-15"
          style={{
            width: '600px', height: '600px', top: '30%', left: '30%',
            background: 'radial-gradient(circle, #e9d5ff 0%, transparent 70%)',
            animation: 'floatOrb3 20s ease-in-out infinite',
          }}
        />
      </div>

      {/* CSS keyframes */}
      <style>{`
        @keyframes bgShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, 30px) scale(1.1); }
          66% { transform: translate(-20px, 15px) scale(0.95); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, -25px) scale(1.08); }
          66% { transform: translate(35px, -40px) scale(0.92); }
        }
        @keyframes floatOrb3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(25px, -35px) scale(1.12); }
          66% { transform: translate(-50px, 25px) scale(0.88); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes wordFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-white/70 backdrop-blur-sm text-xs font-bold tracking-widest uppercase text-slate-500 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Platform Features
          </div>
          <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-5 tracking-tight">
            Core Platform Capabilities
          </h2>
          {/* Cycling word-by-word typewriter taglines */}
          <div className="max-w-2xl mx-auto h-8" style={{ transition: 'opacity 0.6s ease', opacity: isFadingOut ? 0 : 1 }}>
            <p className="text-slate-500 text-lg leading-relaxed">
              {currentWords.slice(0, wordCount).map((word, i) => (
                <span
                  key={`${lineIdx}-${i}`}
                  className="inline-block"
                  style={{
                    opacity: 0,
                    transform: 'translateY(8px)',
                    animation: `wordFadeIn 0.35s ease forwards`,
                    animationDelay: `${i * 0.04}s`,
                    marginRight: '0.3em',
                  }}
                >
                  {word}
                </span>
              ))}
              <span className="inline-block w-[2px] h-5 bg-primary/60 align-middle ml-0.5" style={{ animation: 'blink 1s step-end infinite' }} />
            </p>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              data-idx={idx}
              className="relative rounded-3xl overflow-hidden group cursor-default"
              style={{
                minHeight: '310px',
                opacity: visible[idx] ? 1 : 0,
                transform: visible[idx] ? 'translateY(0)' : 'translateY(40px)',
                transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${idx * 0.12}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${idx * 0.12}s`,
              }}
            >
              {/* Outer glow on hover */}
              <div
                className="absolute -inset-[1px] rounded-3xl z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${feature.accent}33, transparent 40%, ${feature.accent}22, transparent 60%, ${feature.accent}33)`,
                }}
              />

              {/* Card inner */}
              <div className="relative rounded-3xl overflow-hidden h-full border border-slate-200/60 group-hover:border-white/20 transition-colors duration-500 shadow-lg shadow-slate-200/40 group-hover:shadow-2xl group-hover:shadow-slate-300/50">
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                  style={{ backgroundImage: `url(${feature.bg})` }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/70 to-slate-900/25 group-hover:from-slate-900 group-hover:via-slate-900/80 group-hover:to-slate-900/35 transition-all duration-700" />

                {/* Accent bottom glow bar on hover */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-all duration-700"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${feature.accent}, transparent)`,
                    boxShadow: `0 0 20px ${feature.accent}55, 0 0 40px ${feature.accent}22`,
                  }}
                />

                {/* Shimmer sweep on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 3s linear infinite',
                  }}
                />

                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                  <div
                    className="w-13 h-13 w-[52px] h-[52px] rounded-2xl backdrop-blur-md flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
                    style={{
                      backgroundColor: `${feature.accent}18`,
                      border: `1.5px solid ${feature.accent}40`,
                    }}
                  >
                    <span className="material-symbols-outlined text-2xl" style={{ color: feature.accent }}>
                      {feature.icon}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-white">
                    {feature.title}
                    <span
                      className="block h-[2px] mt-2 rounded-full transition-all duration-500 origin-left group-hover:w-12 w-0"
                      style={{ backgroundColor: feature.accent }}
                    />
                  </h3>

                  <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-500">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
