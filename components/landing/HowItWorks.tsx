
import React from 'react';

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block text-[10px] font-bold text-brand-400 bg-brand-900/10 border border-brand-900/20 px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            The Pipeline
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-display text-white mb-4">How it works.</h2>
          <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
            We replaced the "Creative Strategist", "Copywriter", and "Designer" with 3 specialized AI agents working in sequence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Lines (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-800 to-transparent -z-10 transform -translate-y-1/2"></div>

          {/* Step 1 */}
          <div className="bg-[#0f172a] p-8 rounded-3xl border border-slate-800 hover:border-brand-500/40 transition-all duration-300 relative group shadow-2xl hover:-translate-y-1">
             <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-slate-800 group-hover:scale-110 transition-transform duration-300 group-hover:bg-indigo-900/20 group-hover:border-indigo-500/30">
                <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
             </div>
             <div className="absolute top-6 right-6 text-slate-700 font-black font-mono text-xs bg-slate-900 px-2 py-1 rounded border border-slate-800 group-hover:text-brand-500 group-hover:border-brand-500/30 transition-colors">01</div>
             <h3 className="text-xl font-bold font-display text-white mb-3">The Strategist</h3>
             <p className="text-slate-400 text-xs leading-relaxed">
               Reads your URL. Analyzes audience psychographics. Decides on the "Hook", "Angle", and "Emotional Trigger".
             </p>
             <div className="mt-4 p-2 bg-slate-900 rounded border border-slate-800 text-[10px] text-slate-500 font-mono flex items-center gap-2">
                <span className="text-brand-500">→</span> Output: "FOMO Angle"
             </div>
          </div>

          {/* Step 2 */}
          <div className="bg-[#0f172a] p-8 rounded-3xl border border-slate-800 hover:border-brand-500/40 transition-all duration-300 relative group shadow-2xl hover:-translate-y-1">
             <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-slate-800 group-hover:scale-110 transition-transform duration-300 group-hover:bg-pink-900/20 group-hover:border-pink-500/30">
                <svg className="w-8 h-8 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
             </div>
             <div className="absolute top-6 right-6 text-slate-700 font-black font-mono text-xs bg-slate-900 px-2 py-1 rounded border border-slate-800 group-hover:text-brand-500 group-hover:border-brand-500/30 transition-colors">02</div>
             <h3 className="text-xl font-bold font-display text-white mb-3">The Director</h3>
             <p className="text-slate-400 text-xs leading-relaxed">
               Sets lighting, camera lens, composition, and brand colors. It distinguishes "Luxury" vs "Cheap" aesthetics.
             </p>
             <div className="mt-4 p-2 bg-slate-900 rounded border border-slate-800 text-[10px] text-slate-500 font-mono flex items-center gap-2">
                <span className="text-brand-500">→</span> Output: "85mm f/1.8, Moody"
             </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#0f172a] p-8 rounded-3xl border border-slate-800 hover:border-brand-500/40 transition-all duration-300 relative group shadow-2xl hover:-translate-y-1">
             <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             </div>
             <div className="absolute top-6 right-6 text-slate-700 font-black font-mono text-xs bg-slate-900 px-2 py-1 rounded border border-slate-800 group-hover:text-brand-500 group-hover:border-brand-500/30 transition-colors">03</div>
             <h3 className="text-xl font-bold font-display text-white mb-3">The Generator</h3>
             <p className="text-slate-400 text-xs leading-relaxed">
               Renders high-fidelity assets using our proprietary visual engine. Packages images with compliant ad copy.
             </p>
             <div className="mt-4 p-2 bg-slate-900 rounded border border-slate-800 text-[10px] text-slate-500 font-mono flex items-center gap-2">
                <span className="text-brand-500">→</span> Output: 3x High-Res PNGs
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
