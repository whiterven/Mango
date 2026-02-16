
import React, { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onChangeView: (view: string) => void;
  apiKeyReady: boolean;
  onRequestKey: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView, apiKeyReady, onRequestKey }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Grouped Navigation
  const navGroups = [
    {
      title: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { id: 'create', label: 'Campaign Builder', icon: 'M12 4v16m8-8H4' },
        { id: 'batch', label: 'Batch Generator', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
        { id: 'tasks', label: 'Tasks & Todo', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
      ]
    },
    {
      title: 'Assets',
      items: [
        { id: 'studio', label: 'Creative Studio', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
        { id: 'library', label: 'Image Library', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { id: 'templates', label: 'Viral Patterns', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
      ]
    },
    {
      title: 'Configuration',
      items: [
        { id: 'brand', label: 'Brand DNA', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
        { id: 'schedule', label: 'Scheduler', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col md:flex-row font-sans text-sm">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-3 bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
          <div className="flex items-center gap-2">
             <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-yellow-500 rounded-md flex items-center justify-center font-bold text-white text-base">M</div>
             <span className="font-bold text-base text-white">Mango</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-300">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
             </svg>
          </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 w-60 bg-slate-900 border-r border-slate-800 flex flex-col z-30 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="hidden md:flex p-5 border-b border-slate-800 items-center gap-2.5 mb-2">
          <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-yellow-500 rounded-md flex items-center justify-center font-bold text-white shadow-lg shadow-brand-500/20 text-base">M</div>
          <span className="font-bold text-lg tracking-tight text-white">Mango</span>
          <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700 ml-auto">PRO</span>
        </div>

        <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
          {navGroups.map((group, idx) => (
             <div key={idx}>
                <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">{group.title}</h3>
                <div className="space-y-0.5">
                    {group.items.map((item) => (
                        <button
                        key={item.id}
                        onClick={() => {
                            onChangeView(item.id);
                            setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                            currentView === item.id 
                            ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-sm' 
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
                        }`}
                        >
                        <svg className={`w-4 h-4 ${currentView === item.id ? 'text-brand-500' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                        <span className="font-medium text-xs">{item.label}</span>
                        </button>
                    ))}
                </div>
             </div>
          ))}
        </nav>

        {/* User / Settings Footer (No Connected Button) */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-300">
                   MK
                </div>
                <div>
                    <p className="text-xs font-bold text-white">Marketing Team</p>
                    <p className="text-[10px] text-slate-500">Enterprise Plan</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full md:ml-0 bg-[#0b1120]">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-white capitalize tracking-tight">{currentView.replace('-', ' ')}</h1>
            <p className="text-slate-500 text-xs">Enterprise Ad Generation Platform</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={onRequestKey} 
                className={`text-xs px-3 py-1.5 rounded border transition-colors ${apiKeyReady ? 'border-green-900 bg-green-900/10 text-green-500' : 'border-red-900 bg-red-900/10 text-red-500'}`}
             >
                 {apiKeyReady ? '● System Online' : '● API Key Required'}
             </button>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};
