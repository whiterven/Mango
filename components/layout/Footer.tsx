
import React from 'react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0b1120] border-t border-slate-800/50 pt-16 pb-8 text-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
               <div className="w-6 h-6 bg-gradient-to-br from-brand-500 to-yellow-500 rounded flex items-center justify-center font-bold text-white text-xs">M</div>
               <span className="font-bold text-white tracking-tight">Mango</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed mb-4">
              AI-powered creative stack for modern growth teams. Stop waiting for agencies.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><button onClick={() => onNavigate('landing')} className="hover:text-brand-400 transition-colors">Home</button></li>
              <li><button onClick={() => onNavigate('pricing')} className="hover:text-brand-400 transition-colors">Pricing</button></li>
              <li><button onClick={() => onNavigate('changelog')} className="hover:text-brand-400 transition-colors">Changelog</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><button onClick={() => onNavigate('help')} className="hover:text-brand-400 transition-colors">Help Center</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-brand-400 transition-colors">Contact Us</button></li>
              <li><button onClick={() => onNavigate('billing')} className="hover:text-brand-400 transition-colors">Billing Support</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><button onClick={() => onNavigate('privacy')} className="hover:text-brand-400 transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('terms')} className="hover:text-brand-400 transition-colors">Terms of Service</button></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-xs">© 2026 Mango AI Inc. All rights reserved.</p>
          <div className="flex gap-4">
             {/* Social placeholders */}
             <div className="w-4 h-4 bg-slate-800 rounded-full"></div>
             <div className="w-4 h-4 bg-slate-800 rounded-full"></div>
             <div className="w-4 h-4 bg-slate-800 rounded-full"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};
