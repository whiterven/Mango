import React from 'react';
import { CreativeControls as CreativeControlsType } from '../types';

interface Props {
  value: CreativeControlsType;
  onChange: (val: CreativeControlsType) => void;
}

export const CreativeControls: React.FC<Props> = ({ value, onChange }) => {
  const handleChange = (key: keyof CreativeControlsType, val: any) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 space-y-4">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Visual DNA Tuning</h4>
      
      {/* Minimalism Slider */}
      <div>
        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
          <span>Busy / Chaotic</span>
          <span>Minimalist / Clean</span>
        </div>
        <input 
          type="range" 
          min="0" max="100" 
          value={value.minimalism}
          onChange={(e) => handleChange('minimalism', parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
        />
      </div>

      {/* Vibrancy Slider */}
      <div>
        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
          <span>Muted / Matte</span>
          <span>Vibrant / Neon</span>
        </div>
        <input 
          type="range" 
          min="0" max="100" 
          value={value.vibrancy}
          onChange={(e) => handleChange('vibrancy', parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
        />
      </div>

      {/* Drama Slider */}
      <div>
        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
          <span>Flat / Soft</span>
          <span>High Drama / Contrast</span>
        </div>
        <input 
          type="range" 
          min="0" max="100" 
          value={value.lightingDrama}
          onChange={(e) => handleChange('lightingDrama', parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
        />
      </div>

      {/* Mood Selector */}
      <div>
         <label className="block text-[10px] text-slate-400 mb-1.5">Atmosphere Vibe</label>
         <div className="grid grid-cols-4 gap-2">
            {['luxury', 'energetic', 'trustworthy', 'edgy'].map((m) => (
              <button
                key={m}
                onClick={() => handleChange('mood', m)}
                className={`text-[10px] font-medium py-1.5 px-2 rounded border transition-all capitalize ${
                  value.mood === m
                    ? 'bg-brand-600 border-brand-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                {m}
              </button>
            ))}
         </div>
      </div>
    </div>
  );
};