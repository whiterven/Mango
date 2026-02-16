import React from 'react';
import { Button } from '../ui/Button';

export const PricingPreview: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <section className="py-20 px-6 bg-[#0b1120]">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-black font-display text-white mb-10">Simple Pricing.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {/* Starter */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <h3 className="font-bold text-white">Starter</h3>
                    <div className="text-2xl font-black text-white mt-2">$29<span className="text-xs font-normal text-slate-500">/mo</span></div>
                    <ul className="mt-4 space-y-2 text-xs text-slate-400">
                        <li>• 50 Credits</li>
                        <li>• Basic Strategy</li>
                    </ul>
                </div>
                
                {/* Pro */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-brand-500 relative transform scale-105 shadow-2xl">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Most Popular</div>
                    <h3 className="font-bold text-white">Growth</h3>
                    <div className="text-2xl font-black text-white mt-2">$79<span className="text-xs font-normal text-slate-500">/mo</span></div>
                    <ul className="mt-4 space-y-2 text-xs text-slate-300">
                        <li>• Unlimited Credits</li>
                        <li>• Competitor Spy</li>
                        <li>• Brand Memory</li>
                    </ul>
                    <Button onClick={onStart} className="w-full mt-6" size="sm">Start Free Trial</Button>
                </div>

                {/* Agency */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <h3 className="font-bold text-white">Agency</h3>
                    <div className="text-2xl font-black text-white mt-2">$149<span className="text-xs font-normal text-slate-500">/mo</span></div>
                    <ul className="mt-4 space-y-2 text-xs text-slate-400">
                        <li>• Team Seats</li>
                        <li>• API Access</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
  );
};