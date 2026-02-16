
import React, { useState } from 'react';

export const ProductDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('after');

  return (
    <section className="py-20 px-6 bg-slate-900/20">
      <div className="max-w-5xl mx-auto">
         <div className="text-center mb-10">
            <h2 className="text-3xl font-black font-display text-white mb-4">See the difference.</h2>
            <p className="text-slate-400 text-sm">Real results from a generic prompt vs Mango's agent pipeline.</p>
         </div>

         <div className="bg-[#0f172a] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
             <div className="flex border-b border-slate-800">
                 <button 
                    onClick={() => setActiveTab('before')}
                    className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'before' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                 >
                     Generic AI Tool
                 </button>
                 <button 
                    onClick={() => setActiveTab('after')}
                    className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'after' ? 'bg-brand-900/20 text-brand-400' : 'text-slate-500 hover:text-slate-300'}`}
                 >
                     Mango Agents
                 </button>
             </div>

             <div className="p-8 md:p-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                     <div>
                         <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-6 font-mono text-xs text-slate-300 flex items-center gap-2">
                             <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             Input: "Fitness coaching for busy dads"
                         </div>
                         
                         {activeTab === 'before' ? (
                             <div className="space-y-4">
                                 <h3 className="text-xl font-bold text-slate-300">The "Stock Photo" Look</h3>
                                 <p className="text-slate-500 text-sm">Generic, boring, looks like clip-art. Zero emotional hook. Low click-through rate.</p>
                                 <div className="flex gap-2 mt-4">
                                     <span className="px-2 py-1 bg-red-900/20 text-red-400 text-[10px] font-bold rounded">CVR: 0.8%</span>
                                     <span className="px-2 py-1 bg-red-900/20 text-red-400 text-[10px] font-bold rounded">CTR: 0.4%</span>
                                 </div>
                             </div>
                         ) : (
                             <div className="space-y-4">
                                 <h3 className="text-xl font-bold text-white">The "Scroll Stopper"</h3>
                                 <p className="text-slate-400 text-sm">Cinematic lighting, specific "tired dad" emotional trigger, high-contrast typography, and urgency.</p>
                                 <ul className="space-y-2 text-xs text-slate-300 mt-2">
                                     <li className="flex items-center gap-2">
                                         <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                         Strategy: "Reclaim your energy" angle
                                     </li>
                                     <li className="flex items-center gap-2">
                                         <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                         Visual: Gritty gym texture, moody lighting
                                     </li>
                                     <li className="flex items-center gap-2">
                                         <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                         Hook: "Dad Bod is a Choice."
                                     </li>
                                 </ul>
                                 <div className="flex gap-2 mt-4">
                                     <span className="px-2 py-1 bg-green-900/20 text-green-400 text-[10px] font-bold rounded">CVR: 3.2%</span>
                                     <span className="px-2 py-1 bg-green-900/20 text-green-400 text-[10px] font-bold rounded">CTR: 2.1%</span>
                                 </div>
                             </div>
                         )}
                     </div>

                     <div className="relative">
                         {/* Mock Images */}
                         <div className="aspect-square bg-slate-800 rounded-2xl overflow-hidden relative shadow-lg">
                             {activeTab === 'before' ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-700 text-slate-500">
                                    <span className="text-xs font-mono">Generic_Gym_Man.jpg</span>
                                </div>
                             ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 to-slate-900 flex items-center justify-center">
                                    <div className="text-center p-6">
                                        <h4 className="text-2xl font-black text-white italic uppercase leading-none mb-2">DAD BOD<br/>IS A CHOICE.</h4>
                                        <div className="w-full h-32 bg-slate-800/50 rounded-lg animate-pulse mb-4"></div>
                                        <button className="bg-brand-500 text-white text-[10px] font-bold px-4 py-2 rounded-full">JOIN THE CHALLENGE</button>
                                    </div>
                                </div>
                             )}
                         </div>
                     </div>
                 </div>
             </div>
         </div>
      </div>
    </section>
  );
};
