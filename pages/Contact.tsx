
import React, { useState } from 'react';
import { Footer } from '../components/layout/Footer';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const Contact: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans flex flex-col">
      <nav className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
             <button onClick={() => onNavigate('landing')} className="font-bold text-white text-lg">Mango</button>
             <button onClick={() => onNavigate('dashboard')} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded text-white transition-colors">Go to App</button>
        </div>
      </nav>

      <main className="flex-1 max-w-xl w-full mx-auto px-6 py-20">
        <div className="text-center mb-12">
            <h1 className="text-3xl font-black text-white mb-4 font-display">How can we help?</h1>
            <p className="text-slate-500">
                Our support team usually responds within 2 hours during business days.
            </p>
        </div>

        {sent ? (
            <div className="bg-green-900/20 border border-green-500/30 p-8 rounded-2xl text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg shadow-green-500/20">✓</div>
                <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-slate-400 text-sm">We've received your inquiry and will get back to you shortly.</p>
                <Button onClick={() => onNavigate('dashboard')} className="mt-6" variant="secondary">Return to Dashboard</Button>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <Input label="First Name" placeholder="Jane" required />
                    <Input label="Last Name" placeholder="Doe" required />
                </div>
                <Input label="Email Address" type="email" placeholder="jane@company.com" required />
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Subject</label>
                    <select className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-500">
                        <option>General Inquiry</option>
                        <option>Billing Issue</option>
                        <option>Technical Support</option>
                        <option>Feature Request</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Message</label>
                    <textarea 
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white h-32 focus:outline-none focus:ring-1 focus:ring-brand-500 placeholder-slate-600"
                        placeholder="Tell us what you need help with..."
                        required
                    />
                </div>
                <Button type="submit" className="w-full" size="lg">Send Message</Button>
            </form>
        )}
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
             <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                 <h4 className="text-white font-bold text-sm mb-1">Email Us</h4>
                 <a href="mailto:support@usemango.ai" className="text-brand-400 text-xs hover:underline">support@usemango.ai</a>
             </div>
             <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                 <h4 className="text-white font-bold text-sm mb-1">Live Chat</h4>
                 <span className="text-slate-500 text-xs">Available 9am - 5pm EST</span>
             </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
