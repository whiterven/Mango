
import React from 'react';
import { Button } from '../ui/Button';

export const CompetitorSpy: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <section className="bg-gradient-to-b from-[#0f172a] to-black py-24 px-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-0 w-1/2 h-full bg-brand-600/5 blur-[120px] -z-10"></div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
                <div className="inline-block text-[10px] font-bold text-white bg-red-600 px-2 py-1 rounded mb-6 uppercase tracking-widest animate-pulse">
                    Killer Feature
                </div>
                <h2 className="text-4xl md:text-5xl font-black font-display text-white mb-6 leading-tight">
                    Steal your competitor's <br/>
                    <span className="text-slate-500">winning strategy.</span>
                </h2>
                <p className="text-slate-400 mb-8 leading-relaxed text-sm">
                    Don't guess what works. Mango doesn't just create; it spies. Upload any successful ad from your niche, and our <strong>Competitor Agent</strong> will deconstruct it.
                </p>
                
                <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">1</span>
                        <p className="text-sm text-slate-300">Extracts the core hook & psychological trigger.</p>
                    </li>
                    <li className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">2</span>
                        <p className="text-sm text-slate-300">Identifies visual weaknesses (e.g. "Too dark", "Boring font").</p>
                    </li>
                    <li className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">3</span>
                        <p className="text-sm text-slate-300">Generates a superior "Counter-Creative" instantly.</p>
                    </li>
                </ul>
                
                <Button onClick={onStart} size="lg" className="w-full md:w-auto">Try Competitor Spy</Button>
            </div>

            <div className="relative">
                {/* Visual Representation of Analysis */}
                <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl transform rotate-2">
                    <div className="absolute -top-4 -right-4 bg-green-500 text-black font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider border border-green-400 shadow-lg flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        Analysis Complete
                    </div>
                    
                    <div className="flex gap-4 mb-6">
                        <div className="w-24 h-32 bg-slate-800 rounded-lg border border-slate-700"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-2 bg-slate-800 rounded w-3/4"></div>
                            <div className="h-2 bg-slate-800 rounded w-1/2"></div>
                            <div className="mt-4 p-3 bg-red-900/10 border border-red-900/30 rounded text-[10px] text-red-300 font-mono">
                                ! WEAKNESS DETECTED:<br/>
                                Low contrast typography.<br/>
                                Lacks social proof element.
                            </div>
                        </div>
                    </div>

                    <div className="bg-brand-900/10 border border-brand-500/30 p-4 rounded-xl">
                        <div className="text-[10px] text-brand-400 font-bold uppercase mb-2">Generating Counter-Strategy</div>
                        <div className="space-y-2">
                            <div className="h-1.5 bg-brand-500/20 rounded-full overflow-hidden">
                                <div className="h-full bg-brand-500 w-3/4 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};
