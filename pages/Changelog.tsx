
import React from 'react';
import { Footer } from '../components/layout/Footer';
import { Badge } from '../components/ui/Badge';

export const Changelog: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans">
      <nav className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
             <button onClick={() => onNavigate('landing')} className="font-bold text-white text-lg">Mango</button>
             <button onClick={() => onNavigate('dashboard')} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded text-white transition-colors">Go to App</button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black text-white mb-2 font-display">Changelog</h1>
        <p className="text-slate-500 mb-12 text-sm">New updates and improvements to Mango.</p>

        <div className="space-y-12 relative border-l border-slate-800 ml-3 pl-8">
            {/* Entry 1 */}
            <div className="relative">
                <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-brand-500 border-4 border-[#0f172a]"></div>
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono text-slate-500">Jan 12, 2026</span>
                    <Badge color="brand">v2.1.0</Badge>
                </div>
                <h2 className="text-xl font-bold text-white mb-4">Competitor Spy & Brand Memory</h2>
                <div className="prose prose-invert prose-sm text-slate-400">
                    <p>We've added two major features requested by agencies:</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li><strong>Competitor Intelligence Agent:</strong> Upload any ad to reverse-engineer its strategy. The AI will find weaknesses and generate a counter-creative.</li>
                        <li><strong>Brand DNA System:</strong> You can now save multiple Brand Kits with hex codes, fonts, and tone guidelines. The AI will strictly adhere to these rules.</li>
                        <li>Improved rendering speed for 4K images by 30%.</li>
                    </ul>
                </div>
            </div>

            {/* Entry 2 */}
            <div className="relative">
                <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-slate-700 border-4 border-[#0f172a]"></div>
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono text-slate-500">Dec 20, 2025</span>
                    <Badge color="blue">v2.0.0</Badge>
                </div>
                <h2 className="text-xl font-bold text-white mb-4">The Big Redesign</h2>
                <div className="prose prose-invert prose-sm text-slate-400">
                    <p>Welcome to Mango 2.0. We've completely overhauled the UI to be darker, faster, and more professional.</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>New "Agent Pipeline" visualization to see the AI thinking.</li>
                        <li>Multi-variation generation (up to 5 images at once).</li>
                        <li>Added "Creative Studio" for simple text overlay edits.</li>
                        <li>Migrated backend to Gemini 3 Pro models for better photorealism.</li>
                    </ul>
                </div>
            </div>

             {/* Entry 3 */}
             <div className="relative">
                <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-slate-800 border-4 border-[#0f172a]"></div>
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono text-slate-500">Nov 05, 2025</span>
                    <Badge color="green">v1.5.0</Badge>
                </div>
                <h2 className="text-xl font-bold text-white mb-4">Batch Mode</h2>
                <div className="prose prose-invert prose-sm text-slate-400">
                    <p>For high volume testing, we introduced Batch Mode.</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>Generate concepts for 10+ products in a single click.</li>
                        <li>CSV export for bulk uploading to Facebook Ads Manager.</li>
                    </ul>
                </div>
            </div>
        </div>
      </main>
      
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
