
import React from 'react';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';

export const Help: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans">
      <nav className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
             <button onClick={() => onNavigate('landing')} className="font-bold text-white text-lg">Mango</button>
             <button onClick={() => onNavigate('dashboard')} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded text-white transition-colors">Go to App</button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-white mb-4 font-display">Help Center</h1>
            <p className="text-slate-500 mb-8">Search our knowledge base or browse categories.</p>
            <div className="max-w-xl mx-auto relative">
                <input 
                    type="text" 
                    placeholder="Search for articles (e.g. 'How to change billing')" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-full px-6 py-4 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none shadow-xl placeholder-slate-600"
                />
                <button className="absolute right-3 top-3 bg-brand-600 p-2 rounded-full text-white">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="hover:border-brand-500/50 transition-colors cursor-pointer text-center py-8">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🚀</div>
                <h3 className="font-bold text-white mb-2">Getting Started</h3>
                <p className="text-xs text-slate-500">Account setup, first campaign, and basics.</p>
            </Card>
            <Card className="hover:border-brand-500/50 transition-colors cursor-pointer text-center py-8">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">💳</div>
                <h3 className="font-bold text-white mb-2">Billing & Plans</h3>
                <p className="text-xs text-slate-500">Invoices, upgrades, and cancellations.</p>
            </Card>
            <Card className="hover:border-brand-500/50 transition-colors cursor-pointer text-center py-8">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🛠</div>
                <h3 className="font-bold text-white mb-2">Troubleshooting</h3>
                <p className="text-xs text-slate-500">Common errors and how to fix them.</p>
            </Card>
        </div>

        <div className="space-y-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h3>
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h4 className="font-bold text-white text-sm mb-2">How do I delete a Brand Kit?</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Go to the Brand Kit page, hover over the brand card you want to remove, and click the trash icon in the top right corner.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h4 className="font-bold text-white text-sm mb-2">Are the images really copyright free?</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Yes. Under our Terms of Service, you own full commercial rights to any image generated during your subscription period.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h4 className="font-bold text-white text-sm mb-2">Why did my generation fail?</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Occasional API timeouts happen. If a generation fails, we do not deduct credits. Please try refreshing the page or simplifying your prompt inputs.</p>
            </div>
        </div>

        <div className="text-center mt-16">
            <p className="text-slate-500 text-sm mb-4">Still stuck?</p>
            <button onClick={() => onNavigate('contact')} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-full transition-colors">Contact Support</button>
        </div>
      </main>
      
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
