import React from 'react';
import { Card } from './ui/Card';

interface Props {
  plannerReasoning?: string;
  directorReasoning?: string;
}

export const AgentInsights: React.FC<Props> = ({ plannerReasoning, directorReasoning }) => {
  return (
    <Card title="Agent Reasoning Engine" className="border-slate-700 bg-slate-900/80">
        <div className="space-y-4">
            {plannerReasoning && (
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <h4 className="text-[10px] font-bold text-blue-400 uppercase">Planner Strategy</h4>
                    </div>
                    <div className="pl-4 border-l border-blue-900 ml-1">
                        <p className="text-xs text-slate-300 italic leading-relaxed">"{plannerReasoning}"</p>
                    </div>
                </div>
            )}

            {directorReasoning && (
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <h4 className="text-[10px] font-bold text-purple-400 uppercase">Creative Logic</h4>
                    </div>
                    <div className="pl-4 border-l border-purple-900 ml-1">
                         <p className="text-xs text-slate-300 italic leading-relaxed">"{directorReasoning}"</p>
                    </div>
                </div>
            )}
        </div>
    </Card>
  );
};