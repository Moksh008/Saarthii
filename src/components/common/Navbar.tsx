import { Book, Lightbulb, Target, Settings, HelpCircle, Phone, Globe } from "lucide-react";
import { Navbar1 } from "../shadcnblocks-com-navbar1";
import { useState } from "react";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "gu", name: "Gujarati" },
  { code: "mr", name: "Marathi" },
  { code: "bn", name: "Bengali" },
  { code: "te", name: "Telugu" },
  { code: "as", name: "Assamese" },
  { code: "or", name: "Odia" },
  { code: "ta", name: "Tamil" },
  { code: "ml", name: "Malayalam" },
  { code: "ur", name: "Urdu" },
  { code: "sd", name: "Sindhi" },
  { code: "brx", name: "Bodo" },
  { code: "gom", name: "Konkani" },
  { code: "ne", name: "Nepali" },
  { code: "mni-Mtei", name: "Manipuri" },
  { code: "pa", name: "Punjabi" },
  { code: "kn", name: "Kannada" },
  { code: "doi", name: "Dogri" },
  { code: "mai", name: "Maithili" },
  { code: "ks", name: "Kashmiri" },
  { code: "sa", name: "Sanskrit" },
  { code: "sat", name: "Santhali" }
];

export function Navbar() {
  const saarthiiLogo = "/saarthii_logo.png";

  const [lang, setLang] = useState(() => {
    const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    return match?.[1] || "en";
  });

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setLang(code);
    
    // Set cookie for google translate engine
    document.cookie = `googtrans=/en/${code}; path=/`;
    document.cookie = `googtrans=/en/${code}; path=/; domain=${window.location.hostname}`;
    
    // Auto reload to apply translation
    window.location.reload();
  };

  const LanguageSelector = (
    <div className="flex items-center gap-1.5 mr-2 bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-md hover:bg-slate-100 transition-colors">
      <Globe className="w-4 h-4 text-slate-500" />
      <select 
        value={lang} 
        onChange={handleLanguageChange}
        className="bg-transparent text-xs font-medium text-slate-700 outline-none cursor-pointer appearance-none pr-4"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '12px' }}
      >
        {languages.map(l => (
          <option key={l.code} value={l.code}>{l.name}</option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      <style>{`
        /* Hide the annoying google translate top bar natively injected */
        .skiptranslate iframe,
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }
        body {
          top: 0px !important;
        }
        /* Hide the google translate popup tooltip on hover */
        #goog-gt-tt, .goog-te-balloon-frame {
          display: none !important;
        }
        .goog-text-highlight {
          background: none !important;
          box-shadow: none !important;
        }
      `}</style>
      <div className="bg-white/90 backdrop-blur-md text-slate-900 border-slate-200 fixed top-0 left-0 right-0 z-50 border-b shadow-sm">
        <Navbar1
            logo={{
              url: "/",
              src: saarthiiLogo,
              alt: "Saarthii",
              title: "",
            }}
            menu={[
              { title: "Home", url: "/" },
              {
                title: "Products",
                url: "#",
                items: [
                  { title: "Problem Space", description: "Understand the governance challenges", url: "/#problem", icon: <Target className="size-5 shrink-0 text-primary" /> },
                  { title: "Solution", description: "Our AI-driven GovTech approach", url: "/#solution", icon: <Lightbulb className="size-5 shrink-0 text-primary" /> },
                  { title: "Features", description: "Discover platform capabilities", url: "/#features", icon: <Settings className="size-5 shrink-0 text-primary" /> },
                ]
              },
              {
                title: "Resources",
                url: "#",
                items: [
                  { title: "About Us", description: "Our mission to innovate", url: "/about", icon: <Book className="size-5 shrink-0 text-primary" /> },
                  { title: "Help Center", description: "Get all the answers you need", url: "#", icon: <HelpCircle className="size-5 shrink-0 text-primary" /> },
                  { title: "Contact", description: "Talk to our experts", url: "#", icon: <Phone className="size-5 shrink-0 text-primary" /> },
                ]
              },
              { title: "Pricing", url: "#" },
              { title: "Blog", url: "#" },
            ]}
            mobileExtraLinks={[]}
            auth={{
              login: { text: "Log in", url: "/login" },
              signup: { text: "Sign up", url: "/signup" },
            }}
            customRightElement={LanguageSelector}
          />
      </div>
    </>
  );
}
