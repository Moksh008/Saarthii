import { Book, Lightbulb, Target, Settings, HelpCircle, Phone } from "lucide-react";
import { Navbar1 } from "../shadcnblocks-com-navbar1";

export function Navbar() {
  const logoSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ec5b13' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M3 21h18'/><path d='M4.5 9h15'/><path d='M12 3l-8.5 6h17Z'/><path d='M6 21v-8'/><path d='M10 21v-8'/><path d='M14 21v-8'/><path d='M18 21v-8'/></svg>";

  return (
    <div className="bg-white/90 backdrop-blur-md text-slate-900 border-slate-200 fixed top-0 left-0 right-0 z-50 border-b shadow-sm">
      <Navbar1
          logo={{
            url: "/",
            src: logoSvg,
            alt: "Saarthii",
            title: "Saarthii",
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
        />
    </div>
  );
}
