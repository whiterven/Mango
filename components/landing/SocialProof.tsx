import React from 'react';

export const SocialProof: React.FC = () => {
  return (
    <div className="border-y border-slate-800/50 bg-[#0b1120] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-8">
            <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Trusted by modern growth teams</p>
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                <span className="text-xl font-black font-display text-white tracking-tighter">DROPSHIP<span className="font-light text-slate-400">WEEKLY</span></span>
                <span className="text-lg font-bold font-sans text-white">Marketing<span className="text-brand-500">Brew</span></span>
                <span className="text-lg font-bold font-mono text-white tracking-widest border-2 border-white px-2">ECOMM</span>
                <span className="text-2xl font-serif font-italic text-white">The Hustle</span>
                <span className="text-xl font-black font-sans text-white tracking-tight">AD<span className="font-light text-slate-400">WORLD</span></span>
            </div>
        </div>
    </div>
  );
};