import React from 'react';
import { Button } from '../components/ui/Button';

export const NotFound: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8 relative">
          <div className="text-[150px] font-black text-slate-800 leading-none select-none">404</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-yellow-500 whitespace-nowrap">
              Creative Not Found
          </div>
      </div>
      
      <p className="text-slate-400 max-w-md mb-8 text-sm leading-relaxed">
          The page you are looking for has been archived or never existed. 
          Our agents are currently scanning the void to find it, but you should probably just go back.
      </p>

      <div className="flex gap-4">
          <Button onClick={() => onNavigate('landing')} variant="secondary">Go Home</Button>
          <Button onClick={() => onNavigate('dashboard')}>Back to Dashboard</Button>
      </div>
    </div>
  );
};