import React from 'react';

interface Step {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
  agent: string;
}

export const AgentPipeline: React.FC<{ steps: Step[] }> = ({ steps }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative px-4 md:px-12">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-800 -z-10 transform -translate-y-1/2 overflow-hidden">
             {/* Animated Progress Line */}
             <div className="absolute inset-0 bg-brand-600/50 w-full -translate-x-full transition-transform duration-1000"
                style={{
                    transform: `translateX(${steps.filter(s => s.status === 'completed').length * 50 - 50}%)`
                }}
             ></div>
        </div>
        
        {steps.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center z-10">
            <div className={`relative w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
              step.status === 'completed' ? 'bg-green-500 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' :
              step.status === 'active' ? 'bg-slate-900 border-brand-500 text-brand-400 shadow-[0_0_20px_rgba(249,115,22,0.3)] scale-110' :
              'bg-slate-900 border-slate-700 text-slate-500'
            }`}>
              {step.status === 'active' && (
                 <div className="absolute inset-0 border-2 border-brand-500 rounded-full animate-ping opacity-20"></div>
              )}
              
              {step.status === 'completed' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : step.status === 'active' ? (
                  <svg className="w-5 h-5 animate-spin-slow" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
              ) : (
                <span className="text-xs font-bold font-mono">{step.id}</span>
              )}
            </div>
            
            <div className={`mt-3 text-center transition-all duration-300 ${step.status === 'active' ? 'transform translate-y-1' : ''}`}>
              <span className={`text-[10px] font-bold uppercase tracking-widest block mb-0.5 ${
                step.status === 'active' ? 'text-brand-400' : 
                step.status === 'completed' ? 'text-green-400' : 'text-slate-600'
              }`}>{step.agent}</span>
              <span className={`text-[10px] font-medium ${
                  step.status === 'active' ? 'text-white' : 'text-slate-500'
              }`}>{step.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};