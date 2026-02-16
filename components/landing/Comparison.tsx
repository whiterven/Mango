
import React from 'react';

export const Comparison: React.FC = () => {
  return (
    <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black font-display text-white mb-2">Math, not magic.</h2>
                <p className="text-slate-400 text-sm">Why modern teams choose AI over outsourcing.</p>
            </div>
            
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="grid grid-cols-4 bg-[#0b1120] p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800">
                    <div className="col-span-1"></div>
                    <div className="col-span-1 text-center">Agency</div>
                    <div className="col-span-1 text-center">Freelancer</div>
                    <div className="col-span-1 text-center text-brand-400">Mango</div>
                </div>

                {[
                    { label: 'Time to Delivery', agency: '5-7 Days', free: '2-3 Days', us: '30 Seconds' },
                    { label: 'Cost per Creative', agency: '$250+', free: '$100+', us: '$0.50' },
                    { label: 'Psychology Check', agency: 'Rarely', free: 'Never', us: 'Always' },
                    { label: 'Revisions', agency: 'Charged extra', free: 'Charged extra', us: 'Unlimited' },
                    { label: 'Asset Ownership', agency: 'Usage Rights', free: 'Varies', us: '100% Yours' },
                ].map((row, i) => (
                    <div key={i} className="grid grid-cols-4 p-4 border-b border-slate-800 items-center hover:bg-slate-800/30 transition-colors">
                        <div className="col-span-1 font-bold font-display text-xs text-white">{row.label}</div>
                        <div className="col-span-1 text-center text-slate-400 text-xs">{row.agency}</div>
                        <div className="col-span-1 text-center text-slate-400 text-xs">{row.free}</div>
                        <div className="col-span-1 text-center font-bold text-brand-400 text-xs">{row.us}</div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
};
