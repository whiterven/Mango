
import React, { useState } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const ForgotPassword: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate api call
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div onClick={() => onNavigate('landing')} className="inline-flex items-center gap-2 mb-6 cursor-pointer group">
             <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-yellow-400 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-brand-500/20 font-display transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">M</div>
          </div>
          <h1 className="text-2xl font-black font-display text-white mb-2">Reset Password</h1>
          <p className="text-slate-400 text-sm">Enter your email to receive recovery instructions.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          {isSent ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Check your email</h3>
              <p className="text-slate-400 text-sm mb-6">
                We've sent a password reset link to <span className="font-bold text-white">{email}</span>.
              </p>
              <Button onClick={() => onNavigate('login')} className="w-full">Back to Login</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="name@company.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              
              <Button type="submit" className="w-full py-3 text-sm" isLoading={isLoading}>
                Send Reset Link
              </Button>

              <div className="text-center">
                <button type="button" onClick={() => onNavigate('login')} className="text-xs text-slate-500 hover:text-white transition-colors">
                  ← Back to Log In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
