import React from 'react';

interface PerformanceMetrics {
  attention: number;
  clarity: number;
  conversion: number;
  overall: number;
  reasoning: string;
}

interface Props {
  score: PerformanceMetrics;
  title?: string;
  className?: string;
}

export const PerformanceScore: React.FC<Props> = ({ score, title = "Predictive Performance", className }) => {
  const getScoreColor = (val: number) => {
    if (val >= 85) return 'text-green-400';
    if (val >= 70) return 'text-brand-400';
    if (val >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getBarColor = (val: number) => {
    if (val >= 85) return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]';
    if (val >= 70) return 'bg-brand-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]';
    if (val >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`bg-slate-800/40 p-5 rounded-lg border border-slate-700/50 backdrop-blur-sm ${className || ''}`}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            {title}
          </h4>
          <p className="text-[10px] text-slate-500 mt-1">AI-estimated CTR potential</p>
        </div>
        <div className={`text-4xl font-black tracking-tighter ${getScoreColor(score.overall)}`}>
          {score.overall}
        </div>
      </div>

      <div className="space-y-4 mb-5">
        {/* Attention */}
        <div className="group">
          <div className="flex justify-between text-[10px] text-slate-300 mb-1.5 uppercase font-semibold tracking-wider">
            <span>Attention (Stop)</span>
            <span>{score.attention}/100</span>
          </div>
          <div className="w-full bg-slate-900/80 h-2 rounded-full overflow-hidden border border-slate-700/50">
            <div className={`h-full transition-all duration-1000 ease-out ${getBarColor(score.attention)}`} style={{width: `${score.attention}%`}}></div>
          </div>
        </div>

        {/* Clarity */}
        <div className="group">
          <div className="flex justify-between text-[10px] text-slate-300 mb-1.5 uppercase font-semibold tracking-wider">
            <span>Clarity (Hold)</span>
            <span>{score.clarity}/100</span>
          </div>
          <div className="w-full bg-slate-900/80 h-2 rounded-full overflow-hidden border border-slate-700/50">
            <div className={`h-full transition-all duration-1000 ease-out delay-100 ${getBarColor(score.clarity)}`} style={{width: `${score.clarity}%`}}></div>
          </div>
        </div>

        {/* Conversion */}
        <div className="group">
          <div className="flex justify-between text-[10px] text-slate-300 mb-1.5 uppercase font-semibold tracking-wider">
            <span>Conversion (Click)</span>
            <span>{score.conversion}/100</span>
          </div>
          <div className="w-full bg-slate-900/80 h-2 rounded-full overflow-hidden border border-slate-700/50">
            <div className={`h-full transition-all duration-1000 ease-out delay-200 ${getBarColor(score.conversion)}`} style={{width: `${score.conversion}%`}}></div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 p-3 rounded border border-slate-700/50 relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-brand-500/30 rounded-l"></div>
        <p className="text-[11px] text-slate-400 leading-relaxed italic pl-2">
          "{score.reasoning}"
        </p>
      </div>
    </div>
  );
};