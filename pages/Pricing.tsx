
import React from 'react';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { billingService } from '../services/db/billingService';

export const Pricing: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();

  const handleAction = (planId: string) => {
    if (user) {
        // Trigger Checkout
        billingService.startSubscription(planId);
    } else {
        // Redirect to Signup
        onNavigate('signup');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans">
      <nav className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
             <button onClick={() => onNavigate('landing')} className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-yellow-400 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-brand-500/20 font-display transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">M</div>
                <span className="font-bold text-white text-lg tracking-tight font-display">Mango</span>
             </button>
             <div className="flex gap-4">
                 {user ? (
                     <button onClick={() => onNavigate('dashboard')} className="text-xs font-bold text-white bg-slate-800 px-4 py-2 rounded-full hover:bg-slate-700 transition-colors">Dashboard</button>
                 ) : (
                     <>
                        <button onClick={() => onNavigate('login')} className="text-xs font-bold text-slate-400 hover:text-white transition-colors">Log In</button>
                        <button onClick={() => onNavigate('signup')} className="text-xs bg-white text-slate-900 font-bold px-4 py-2 rounded-full hover:bg-slate-200 transition-colors">Get Access</button>
                     </>
                 )}
             </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-display tracking-tight">Simple, transparent pricing.</h1>
            <p className="text-slate-400 text-lg">
                Stop paying $2,000/mo for an agency. Start generating high-converting ads for the price of a coffee per day.
            </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {/* Starter */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col hover:border-slate-700 transition-colors">
                <h3 className="text-xl font-bold text-white mb-2 font-display">Starter</h3>
                <div className="text-5xl font-black text-white mb-4 tracking-tighter">$29<span className="text-sm font-bold text-slate-500 tracking-normal">/mo</span></div>
                <p className="text-sm text-slate-400 mb-8 border-b border-slate-800 pb-8">Perfect for solo founders testing ideas.</p>
                
                <div className="flex-1 space-y-4 mb-8">
                    {['50 Credits / month', 'Basic Strategy Agent', '1 User Seat', 'Standard Support', 'Commercial License'].map((feat, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                            <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            {feat}
                        </div>
                    ))}
                </div>
                <Button onClick={() => handleAction('price_starter_monthly')} variant="outline" className="w-full py-3 rounded-xl border-slate-700 hover:bg-slate-800">
                    {user ? 'Subscribe' : 'Get Started'}
                </Button>
            </div>

            {/* Growth */}
            <div className="bg-slate-900 border-2 border-brand-500 rounded-3xl p-8 flex flex-col relative shadow-2xl shadow-brand-900/20 transform md:-translate-y-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-brand-500 to-yellow-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">Most Popular</div>
                <h3 className="text-xl font-bold text-white mb-2 font-display">Growth</h3>
                <div className="text-5xl font-black text-white mb-4 tracking-tighter">$79<span className="text-sm font-bold text-slate-500 tracking-normal">/mo</span></div>
                <p className="text-sm text-slate-400 mb-8 border-b border-slate-800 pb-8">For teams scaling ad spend aggressively.</p>
                
                <div className="flex-1 space-y-4 mb-8">
                    {['Unlimited Credits', 'Competitor Spy Agent', 'Brand Memory System', 'Priority Support', '3 User Seats', 'Export to FB/TikTok'].map((feat, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-white font-medium">
                            <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            {feat}
                        </div>
                    ))}
                </div>
                <Button onClick={() => handleAction('price_pro_monthly')} className="w-full py-3 rounded-xl text-base shadow-brand-500/25">
                    {user ? 'Upgrade Now' : 'Start Free Trial'}
                </Button>
            </div>

            {/* Agency */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col hover:border-slate-700 transition-colors">
                <h3 className="text-xl font-bold text-white mb-2 font-display">Agency</h3>
                <div className="text-5xl font-black text-white mb-4 tracking-tighter">$149<span className="text-sm font-bold text-slate-500 tracking-normal">/mo</span></div>
                <p className="text-sm text-slate-400 mb-8 border-b border-slate-800 pb-8">For agencies managing multiple clients.</p>
                
                <div className="flex-1 space-y-4 mb-8">
                    {['Everything in Growth', '10 User Seats', 'Client Workspaces', 'White-label Reports', 'API Access', 'Dedicated Account Manager'].map((feat, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                            <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            {feat}
                        </div>
                    ))}
                </div>
                <Button onClick={() => onNavigate('contact')} variant="outline" className="w-full py-3 rounded-xl border-slate-700 hover:bg-slate-800">Contact Sales</Button>
            </div>
        </div>

        {/* FAQ Preview */}
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
                 {[
                     { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time. You will retain access until the end of your billing period." },
                     { q: "What happens to my credits?", a: "On the Starter plan, credits do not roll over. On Growth and Agency, you have unlimited generations." },
                     { q: "Do you offer refunds?", a: "We offer a 7-day money-back guarantee if you haven't generated more than 10 images." }
                 ].map((item, i) => (
                     <div key={i} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                         <h4 className="font-bold text-white text-sm mb-2">{item.q}</h4>
                         <p className="text-slate-400 text-xs leading-relaxed">{item.a}</p>
                     </div>
                 ))}
            </div>
        </div>

      </main>
      
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
