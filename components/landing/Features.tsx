import React from 'react';

export const Features: React.FC = () => {
  const features = [
    { 
        title: 'AI Ad Strategist', 
        desc: 'Analyzes your landing page to create hooks.', 
        icon: <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg> 
    },
    { 
        title: 'Competitor Spy', 
        desc: 'Upload an ad to deconstruct its strategy.', 
        icon: <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> 
    },
    { 
        title: 'Brand Memory', 
        desc: 'Stores your fonts, colors, and tone forever.', 
        icon: <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> 
    },
    { 
        title: 'Multi Variations', 
        desc: 'Generates 1, 3, or 5 variants in one click.', 
        icon: <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> 
    },
    { 
        title: 'Perf. Prediction', 
        desc: 'Estimates CTR before you spend a dollar.', 
        icon: <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> 
    },
    { 
        title: 'Auto Resizing', 
        desc: 'Exports 1:1, 4:5, and 9:16 automatically.', 
        icon: <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg> 
    },
  ];

  return (
    <section className="py-20 px-6">
       <div className="max-w-6xl mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {features.map((f, i) => (
                   <div key={i} className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all hover:bg-slate-800/50 group">
                       <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center mb-4 border border-slate-800 group-hover:border-brand-500/30 group-hover:bg-brand-500/10 transition-colors">
                           {f.icon}
                       </div>
                       <h3 className="font-bold text-white mb-2 font-display">{f.title}</h3>
                       <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                   </div>
               ))}
           </div>
       </div>
    </section>
  );
};