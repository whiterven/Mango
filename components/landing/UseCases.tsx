import React from 'react';

export const UseCases: React.FC = () => {
  const cases = [
    { title: 'Ecommerce', desc: 'Test 10 product angles in one day.' },
    { title: 'SaaS Startups', desc: 'Explain complex software simply.' },
    { title: 'Agencies', desc: 'Service 5x more clients without hiring.' },
    { title: 'Course Creators', desc: 'Sell the dream with high-status visuals.' },
  ];

  return (
    <section className="py-20 px-6 bg-slate-900/10">
        <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-black font-display text-white text-center mb-10">Built for...</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cases.map((c, i) => (
                    <div key={i} className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-slate-600 transition-colors text-center">
                        <h3 className="font-bold text-white text-sm mb-2">{c.title}</h3>
                        <p className="text-xs text-slate-400 leading-tight">{c.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
};