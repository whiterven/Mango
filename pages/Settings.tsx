
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { isSupabaseConnected, testSupabaseConnection } from '../lib/supabase';

export const Settings: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const [profile, setProfile] = useState({
    name: 'Marketing Team',
    email: 'team@company.com',
    company: 'Acme Corp'
  });

  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'offline'>('checking');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false
  });

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setDbStatus('checking');
    if (!isSupabaseConnected()) {
      setDbStatus('offline');
      return;
    }
    const isLive = await testSupabaseConnection();
    setDbStatus(isLive ? 'connected' : 'offline');
  };

  const handleClearData = () => {
    if (confirm("Are you sure? This will delete all local campaigns and brands. This cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
       <div className="flex justify-between items-end">
           <div>
             <h2 className="text-xl font-bold text-white">Settings</h2>
             <p className="text-slate-500 text-sm">Manage your account, billing, and preferences.</p>
           </div>
           <Button variant="outline" onClick={() => onNavigate('dashboard')}>Back to Dashboard</Button>
       </div>

       {/* System Status */}
       <Card title="System Status">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${dbStatus === 'connected' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                <div>
                   <h4 className="text-sm font-bold text-white">Database Connection</h4>
                   <p className="text-xs text-slate-500">
                      {dbStatus === 'checking' ? 'Checking connection...' : 
                       dbStatus === 'connected' ? 'Connected to Supabase Cloud' : 
                       'Running in Offline Mode (Local Storage)'}
                   </p>
                </div>
             </div>
             {dbStatus === 'offline' && (
               <div className="text-right">
                 <Button size="sm" variant="outline" onClick={checkConnection}>Retry Connection</Button>
               </div>
             )}
          </div>
          {dbStatus === 'offline' && (
             <div className="mt-4 p-3 bg-yellow-900/10 border border-yellow-900/30 rounded text-xs text-yellow-500">
                ⚠️ Connect your Supabase project in the <code>.env</code> file to enable cloud sync and team collaboration.
             </div>
          )}
       </Card>

       {/* Account & Profile */}
       <Card title="Account Profile">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Input 
                 label="Display Name" 
                 value={profile.name} 
                 onChange={(e) => setProfile({...profile, name: e.target.value})} 
               />
               <Input 
                 label="Email Address" 
                 value={profile.email} 
                 onChange={(e) => setProfile({...profile, email: e.target.value})} 
               />
               <Input 
                 label="Company Name" 
                 value={profile.company} 
                 onChange={(e) => setProfile({...profile, company: e.target.value})} 
               />
               <div className="flex items-end">
                   <Button className="w-full" variant="secondary">Save Profile Changes</Button>
               </div>
           </div>
       </Card>

       {/* Subscription & Billing */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2">
               <Card title="Subscription" className="h-full border-brand-500/20">
                   <div className="flex justify-between items-start mb-6">
                       <div className="flex items-center gap-3">
                           <div className="w-12 h-12 bg-gradient-to-br from-brand-600 to-yellow-600 rounded-lg flex items-center justify-center text-xl font-black text-white shadow-lg">
                               Pro
                           </div>
                           <div>
                               <h3 className="font-bold text-white text-lg">Pro Growth Plan</h3>
                               <p className="text-xs text-slate-400">$79.00 / month • Renews Feb 14</p>
                           </div>
                       </div>
                       <Badge color="green">Active</Badge>
                   </div>
                   
                   <div className="space-y-3 mb-6">
                       <div className="flex justify-between text-xs text-slate-300">
                           <span>Generations</span>
                           <span className="font-mono">1,240 / Unlimited</span>
                       </div>
                       <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                           <div className="bg-brand-500 w-[20%] h-full"></div>
                       </div>
                       <p className="text-[10px] text-slate-500">You are using 20% of your fair usage limit.</p>
                   </div>

                   <div className="flex gap-3">
                       <Button onClick={() => onNavigate('billing')} className="flex-1">Manage Billing & Invoices</Button>
                       <Button variant="outline" onClick={() => onNavigate('pricing')}>Upgrade Plan</Button>
                   </div>
               </Card>
           </div>

           {/* Support */}
           <div>
               <Card title="Support & Help" className="h-full">
                   <div className="space-y-4">
                       <p className="text-xs text-slate-400">Need help with a campaign or have a feature request?</p>
                       <Button variant="secondary" onClick={() => onNavigate('help')} className="w-full justify-start gap-2">
                           <span className="text-lg">📚</span> Help Center
                       </Button>
                       <Button variant="secondary" onClick={() => onNavigate('contact')} className="w-full justify-start gap-2">
                           <span className="text-lg">💬</span> Contact Support
                       </Button>
                       <Button variant="secondary" onClick={() => onNavigate('changelog')} className="w-full justify-start gap-2">
                           <span className="text-lg">📢</span> View Changelog
                       </Button>
                   </div>
               </Card>
           </div>
       </div>

       {/* Preferences */}
       <Card title="Preferences">
           <div className="space-y-3">
               <h4 className="text-xs font-bold text-slate-400 uppercase">Notifications</h4>
               <label className="flex items-center justify-between p-2 hover:bg-slate-800/30 rounded cursor-pointer">
                   <span className="text-sm text-slate-300">Email Alerts (Campaign Complete)</span>
                   <input type="checkbox" checked={notifications.email} onChange={() => setNotifications({...notifications, email: !notifications.email})} className="accent-brand-500" />
               </label>
               <label className="flex items-center justify-between p-2 hover:bg-slate-800/30 rounded cursor-pointer">
                   <span className="text-sm text-slate-300">Marketing & Tips</span>
                   <input type="checkbox" checked={notifications.marketing} onChange={() => setNotifications({...notifications, marketing: !notifications.marketing})} className="accent-brand-500" />
               </label>
           </div>
       </Card>

       {/* Danger Zone */}
       <div className="border border-red-900/30 bg-red-900/5 rounded-xl p-6">
           <h3 className="text-red-400 font-bold text-sm mb-2">Danger Zone</h3>
           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
               <p className="text-xs text-slate-500">
                   Clear all local data, campaigns, and brand kits. This action cannot be undone.
               </p>
               <Button variant="danger" onClick={handleClearData} size="sm">Reset Workspace Data</Button>
           </div>
       </div>
       
       <div className="text-center text-[10px] text-slate-600 font-mono pt-4">
           Mango Pro v2.1.0 • Build 2026.01.14
       </div>
    </div>
  );
};
