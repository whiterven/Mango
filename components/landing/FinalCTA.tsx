
import React from 'react';
import { Footer } from '../layout/Footer';

export const FinalCTA: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <footer className="bg-[#0b1120] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        <div className="py-24 px-6 text-center relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-white font-display tracking-tight">Ready to ship?</h2>
            <p className="text-base text-slate-400 mb-10">
                Your competitors are still writing creative briefs. <br/>
                Be the one shipping ads.
            </p>
            <button 
                onClick={onStart}
                className="px-10 py-4 bg-white text-slate-900 rounded-full font-black text-lg hover:bg-slate-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] font-display transform hover:scale-105 active:scale-95"
            >
                Launch Mango
            </button>
        </div>
    </footer>
  );
};
