import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { AdCopy } from '../types';

interface Props {
  copy?: AdCopy;
}

export const CopyPanel: React.FC<Props> = ({ copy }) => {
  const [copied, setCopied] = useState('');

  if (!copy) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <Card title="Ad Text & Copy">
      <div className="space-y-4">
        {/* Headline */}
        <div className="group relative">
          <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Headline</label>
          <div className="bg-slate-900 p-3 rounded border border-slate-700 text-sm font-bold text-white">
            {copy.headline}
          </div>
          <button 
            onClick={() => handleCopy(copy.headline, 'headline')}
            className="absolute top-6 right-2 text-[10px] bg-slate-800 px-2 py-1 rounded border border-slate-600 text-slate-300 hover:text-white transition-colors"
          >
            {copied === 'headline' ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Primary Text */}
        <div className="group relative">
          <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Primary Text</label>
          <div className="bg-slate-900 p-3 rounded border border-slate-700 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
            {copy.primaryText}
          </div>
          <button 
            onClick={() => handleCopy(copy.primaryText, 'primaryText')}
            className="absolute top-6 right-2 text-[10px] bg-slate-800 px-2 py-1 rounded border border-slate-600 text-slate-300 hover:text-white transition-colors"
          >
            {copied === 'primaryText' ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between bg-slate-900/50 p-2 rounded border border-slate-800">
           <span className="text-[10px] text-slate-500 font-bold uppercase">Call to Action</span>
           <span className="text-xs font-bold text-brand-400 bg-brand-900/20 px-2 py-1 rounded border border-brand-900/50">
             {copy.cta}
           </span>
        </div>
      </div>
    </Card>
  );
};