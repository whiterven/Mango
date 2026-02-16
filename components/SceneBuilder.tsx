import React from 'react';
import { SceneConfiguration } from '../types';
import { Card } from './ui/Card';

interface Props {
  value: SceneConfiguration;
  onChange: (val: SceneConfiguration) => void;
}

export const SceneBuilder: React.FC<Props> = ({ value, onChange }) => {
  const update = (key: keyof SceneConfiguration, val: any) => {
    onChange({ ...value, [key]: val });
  };

  const backgrounds = ['Studio Solid', 'Lifestyle Living Room', 'Urban Street', 'Nature/Outdoor', 'Abstract Gradient', 'Office/Desk'];
  const lightings = ['Softbox (Clean)', 'Golden Hour (Warm)', 'Neon/Cyberpunk', 'Hard Flash (Trendy)', 'Natural Window'];
  const angles = ['Eye Level', 'Low Angle (Hero)', 'Top Down (Flatlay)', 'Dutch Angle (Dynamic)', 'Close-up Macro'];

  return (
    <Card title="Scene Builder (Pro)" className="border-brand-500/30 bg-slate-900/40">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           
           <div>
               <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block">Background Setting</label>
               <select 
                 className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
                 value={value.background}
                 onChange={e => update('background', e.target.value)}
               >
                   <option value="">AI Suggested (Default)</option>
                   {backgrounds.map(b => <option key={b} value={b}>{b}</option>)}
               </select>
           </div>

           <div>
               <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block">Lighting Setup</label>
               <select 
                 className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
                 value={value.lighting}
                 onChange={e => update('lighting', e.target.value)}
               >
                   <option value="">AI Suggested (Default)</option>
                   {lightings.map(b => <option key={b} value={b}>{b}</option>)}
               </select>
           </div>

           <div>
               <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block">Camera Angle</label>
               <select 
                 className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
                 value={value.cameraAngle}
                 onChange={e => update('cameraAngle', e.target.value)}
               >
                   <option value="">AI Suggested (Default)</option>
                   {angles.map(b => <option key={b} value={b}>{b}</option>)}
               </select>
           </div>

           <div>
               <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block">Key Props (Comma separated)</label>
               <input 
                 type="text"
                 className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-white placeholder-slate-600"
                 placeholder="e.g. Laptop, Coffee cup, Sunglasses"
                 value={value.props.join(', ')}
                 onChange={e => update('props', e.target.value.split(',').map(s => s.trim()))}
               />
           </div>
       </div>
    </Card>
  );
};