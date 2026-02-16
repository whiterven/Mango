
import React from 'react';
import { Button } from '../ui/Button';
import { LightPillar } from '../ui/LightPillar';

export const Hero: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <header className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-full h-[150%] max-w-5xl opacity-40 pointer-events-none -z-10">
        <LightPillar 
          topColor="#f97316" 
          bottomColor="#fbbf24"
          intensity={1}
          pillarWidth={4.5}
          rotationSpeed={0.15}
        />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="text-left relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-slate-800/80 border border-slate-700/50 backdrop-blur-md shadow-lg transform hover:scale-105 transition-transform cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-slate-300 text-[10px] font-bold uppercase tracking-widest font-display">Mango 2.0 is Live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white font-display leading-[1.05]">
            Generate high converting ads in <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-yellow-300">minutes, not days.</span>
          </h1>

          <p className="text-base text-slate-400 max-w-lg mb-8 leading-relaxed font-medium">
            Mango uses AI agents trained on real marketing psychology to create scroll-stopping creatives for Facebook and Instagram without designers, agencies, or delays.
          </p>

          <div className="flex flex-row items-center gap-4 mb-8">
            <Button onClick={onStart} size="lg" className="px-8 shadow-brand-500/25 shadow-xl hover:shadow-brand-500/40 transition-shadow">
              Start Creating Ads
            </Button>
            <button 
              onClick={onStart}
              className="px-6 py-2.5 rounded-full border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-800 hover:text-white transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Watch Demo
            </button>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
            <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> No credit card</span>
            <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> Commercial Rights</span>
          </div>
        </div>

        {/* Right Preview */}
        <div className="relative z-10 hidden lg:block perspective-1000">
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-0 transition-all duration-700">
            {/* Fake Browser Header */}
            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
              </div>
              <div className="flex-1 text-center text-[10px] text-slate-600 font-mono">agent_pipeline_v2.exe</div>
            </div>

            {/* Pipeline Visualization */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                 <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                 </div>
                 <div className="flex-1">
                    <div className="h-1.5 bg-slate-700 rounded w-1/3 mb-1.5"></div>
                    <div className="text-[10px] text-indigo-300">Analyzing consumer psychology...</div>
                 </div>
                 <div className="text-[10px] text-green-400 font-mono">DONE</div>
              </div>

              <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                 <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                 </div>
                 <div className="flex-1">
                    <div className="h-1.5 bg-slate-700 rounded w-1/2 mb-1.5"></div>
                    <div className="text-[10px] text-pink-300">Enhancing visual composition...</div>
                 </div>
                 <div className="text-[10px] text-green-400 font-mono">DONE</div>
              </div>

              {/* Generated Images Grid Mockup */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                 <div className="aspect-square bg-slate-800 rounded-lg overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-purple-500/20 animate-pulse"></div>
                    <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[8px] text-white backdrop-blur-sm">Var A</div>
                 </div>
                 <div className="aspect-square bg-slate-800 rounded-lg overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/20 to-brand-500/20 animate-pulse delay-75"></div>
                     <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[8px] text-white backdrop-blur-sm">Var B</div>
                 </div>
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -right-6 top-1/2 bg-white text-black px-4 py-2 rounded-lg shadow-xl text-xs font-bold transform rotate-6 border-2 border-slate-200 flex items-center gap-1.5">
               <span>CVR +42%</span>
               <svg className="w-3.5 h-3.5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
