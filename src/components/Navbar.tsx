


export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-bg-light/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">account_balance</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Saarthii</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#problem" className="text-sm font-medium hover:text-primary transition-colors">Problem</a>
            <a href="#solution" className="text-sm font-medium hover:text-primary transition-colors">Solution</a>
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <a href="#impact" className="text-sm font-medium hover:text-primary transition-colors">Impact</a>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-sm font-semibold px-4 py-2 hover:text-primary transition-colors">Login</button>
            <button className="bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 hover:shadow-xl hover:shadow-primary/30 transition-all">Request Demo</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
