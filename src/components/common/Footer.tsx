


export function Footer() {
  return (
    <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-12 mb-16">
          
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-1 rounded-lg text-white">
                <span translate="no" className="material-symbols-outlined notranslate block">account_balance</span>
              </div>
              <span className="text-xl font-bold text-slate-900">Saarthii</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Pioneering the next generation of government technology to empower leaders and serve communities.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center transition-all hover:bg-primary hover:text-white">
                <span translate="no" className="material-symbols-outlined notranslate">share</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center transition-all hover:bg-primary hover:text-white">
                <span translate="no" className="material-symbols-outlined notranslate">group</span>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-slate-900">Solutions</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 text-sm transition-colors hover:text-primary">Digital Identity</a></li>
              <li><a href="#" className="text-slate-500 text-sm transition-colors hover:text-primary">Public Finance</a></li>
              <li><a href="#" className="text-slate-500 text-sm transition-colors hover:text-primary">Health Intelligence</a></li>
              <li><a href="#" className="text-slate-500 text-sm transition-colors hover:text-primary">Smart Cities</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-slate-900">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 text-sm transition-colors hover:text-primary">About Us</a></li>
              <li><a href="#" className="text-slate-500 text-sm transition-colors hover:text-primary">Case Studies</a></li>
              <li><a href="#" className="text-slate-500 text-sm transition-colors hover:text-primary">Security</a></li>
              <li><a href="#" className="text-slate-500 text-sm transition-colors hover:text-primary">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-slate-900">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 text-sm transition-colors hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-500 text-sm transition-colors hover:text-primary">Terms of Service</a></li>
              <li><a href="#" className="text-slate-500 text-sm transition-colors hover:text-primary">GDPR Compliance</a></li>
            </ul>
          </div>
          
        </div>
        
        <div className="pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
          <p>© 2024 Saarthii GovTech Systems. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
