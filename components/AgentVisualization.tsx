import React, { useEffect, useState } from 'react';

interface AgentVisualizationProps {
  agentName: string;
  role: string;
  status: 'idle' | 'working' | 'done';
  logs: string[];
}

export const AgentVisualization: React.FC<AgentVisualizationProps> = ({ agentName, role, status, logs }) => {
  const [displayLogs, setDisplayLogs] = useState<string[]>([]);

  useEffect(() => {
    if (logs.length > 0) {
      setDisplayLogs(logs.slice(-3)); // Show last 3 logs
    }
  }, [logs]);

  return (
    <div className={`p-6 rounded-xl border transition-all duration-500 ${
      status === 'working' 
        ? 'bg-slate-800/80 border-brand-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]' 
        : status === 'done'
        ? 'bg-slate-800/50 border-green-500/50'
        : 'bg-slate-800/30 border-slate-700'
    }`}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl
          ${status === 'working' ? 'bg-brand-500 text-white animate-pulse' : 'bg-slate-700 text-slate-400'}
          ${status === 'done' ? '!bg-green-500 text-white' : ''}
        `}>
          {status === 'working' ? (
             <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : (
            <span>{agentName[0]}</span>
          )}
        </div>
        <div>
          <h3 className="font-bold text-lg text-white">{agentName}</h3>
          <p className="text-sm text-slate-400">{role}</p>
        </div>
      </div>
      
      <div className="space-y-2 font-mono text-xs">
        {displayLogs.map((log, i) => (
          <div key={i} className="text-brand-200 opacity-80 border-l-2 border-brand-500/30 pl-2">
            {">"} {log}
          </div>
        ))}
        {status === 'working' && (
             <div className="text-brand-400 opacity-60 animate-pulse pl-2">_ thinking...</div>
        )}
      </div>
    </div>
  );
};