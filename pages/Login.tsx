
import React, { useState } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const Login: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      onNavigate('dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div onClick={() => onNavigate('landing')} className="inline-flex items-center gap-2 mb-6 cursor-pointer group">
             <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-yellow-400 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-brand-500/20 font-display transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">M</div>
          </div>
          <h1 className="text-2xl font-black font-display text-white mb-2">Welcome back</h1>
          <p className="text-slate-400 text-sm">Enter your credentials to access your workspace.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="name@company.com" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              required
            />
            
            <div className="space-y-1">
              <Input 
                label="Password" 
                type="password" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                required
              />
              <div className="text-right">
                <button type="button" onClick={() => onNavigate('forgot-password')} className="text-[10px] text-brand-400 hover:text-brand-300 font-medium">
                  Forgot password?
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full py-3 text-sm" isLoading={isLoading}>
              Sign In
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-slate-900 text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white py-2 rounded-lg transition-colors text-xs font-medium">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
                Google
              </button>
              <button type="button" className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white py-2 rounded-lg transition-colors text-xs font-medium">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/50">
               <button 
                 type="button"
                 onClick={() => onNavigate('dashboard')}
                 className="w-full py-2.5 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold rounded-lg border border-slate-700/50 hover:border-slate-600 transition-all flex items-center justify-center gap-2 group"
               >
                 <span>Skip login for now</span>
                 <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
               </button>
            </div>
          </form>
        </div>

        <p className="text-center mt-6 text-xs text-slate-500">
          Don't have an account?{' '}
          <button onClick={() => onNavigate('signup')} className="text-brand-400 hover:text-brand-300 font-bold hover:underline">
            Create account
          </button>
        </p>
      </div>
    </div>
  );
};
