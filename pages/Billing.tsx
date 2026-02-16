
import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { creditService, CreditState } from '../services/creditService';

export const Billing: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const [credits, setCredits] = useState<CreditState>({ total: 0, used: 0, history: [] });

  useEffect(() => {
    setCredits(creditService.getState());
  }, []);

  const percentage = Math.min((credits.used / credits.total) * 100, 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-4">
           <Button variant="secondary" size="sm" onClick={() => onNavigate('dashboard')} className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back
           </Button>
           <div>
              <h2 className="text-xl font-bold text-white">Billing & Credits</h2>
              <p className="text-slate-500 text-sm">Manage your subscription and usage limits.</p>
           </div>
        </div>
        <Button>Upgrade Plan</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Usage Card */}
         <div className="md:col-span-2 space-y-6">
             <Card title="Credit Usage" className="border-brand-500/30 bg-slate-900/80">
                 <div className="flex justify-between items-end mb-4">
                     <div>
                         <div className="text-3xl font-black text-white mb-1">
                             {credits.total - credits.used} <span className="text-sm font-normal text-slate-500">available</span>
                         </div>
                         <p className="text-xs text-slate-400">Resets on Feb 14, 2026</p>
                     </div>
                     <div className="text-right">
                         <Badge color={percentage > 90 ? 'red' : 'green'}>{percentage.toFixed(0)}% Used</Badge>
                     </div>
                 </div>

                 {/* Bar */}
                 <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden mb-6 border border-slate-700">
                     <div 
                        className={`h-full transition-all duration-1000 ${percentage > 90 ? 'bg-red-500' : 'bg-gradient-to-r from-brand-500 to-yellow-500'}`} 
                        style={{ width: `${percentage}%` }}
                     ></div>
                 </div>

                 <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                     <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Usage History</h4>
                     <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                         {credits.history.length === 0 ? (
                             <p className="text-xs text-slate-500 italic">No usage history yet.</p>
                         ) : (
                             credits.history.map((h, i) => (
                                 <div key={i} className="flex justify-between text-xs border-b border-slate-800/50 pb-2 last:border-0">
                                     <span className="text-white">{h.action}</span>
                                     <div className="flex gap-4">
                                         <span className="text-slate-500">{new Date(h.date).toLocaleDateString()}</span>
                                         <span className="text-red-400 font-mono">-{h.amount}</span>
                                     </div>
                                 </div>
                             ))
                         )}
                     </div>
                 </div>
             </Card>

             <Card title="Payment Method">
                 <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-lg">
                     <div className="flex items-center gap-3">
                         <div className="w-10 h-6 bg-slate-700 rounded flex items-center justify-center text-[10px] font-bold text-white">VISA</div>
                         <div>
                             <p className="text-sm text-white font-mono">•••• 4242</p>
                             <p className="text-[10px] text-slate-500">Expires 12/28</p>
                         </div>
                     </div>
                     <Button variant="outline" size="sm">Update</Button>
                 </div>
             </Card>
         </div>

         {/* Sidebar Actions */}
         <div className="space-y-6">
             <div className="bg-gradient-to-br from-brand-600 to-red-500 p-6 rounded-2xl text-white shadow-lg">
                 <h3 className="font-bold mb-2">Go Unlimited</h3>
                 <p className="text-xs text-white/80 mb-4 leading-relaxed">
                     Agency plans include unlimited generations and team seats.
                 </p>
                 <Button className="w-full bg-white text-brand-600 hover:bg-slate-100 border-none">View Agency Plans</Button>
             </div>

             <Card title="Invoices">
                 <div className="space-y-2">
                     <div className="flex justify-between text-xs p-2 hover:bg-slate-800 rounded cursor-pointer">
                         <span className="text-white">Jan 2026</span>
                         <span className="text-brand-400">PDF</span>
                     </div>
                     <div className="flex justify-between text-xs p-2 hover:bg-slate-800 rounded cursor-pointer">
                         <span className="text-white">Dec 2025</span>
                         <span className="text-brand-400">PDF</span>
                     </div>
                 </div>
             </Card>
         </div>
      </div>
    </div>
  );
};
