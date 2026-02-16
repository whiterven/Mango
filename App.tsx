
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CreateCampaign } from './pages/CreateCampaign';
import { BrandKit } from './pages/BrandKit';
import { Library } from './pages/Library';
import { Results } from './pages/Results';
import { Studio } from './pages/Studio';
import { Templates } from './pages/Templates';
import { BatchCreate } from './pages/BatchCreate';
import { CompetitorAnalysisPage } from './pages/CompetitorAnalysisPage';
import { CompetitorLibrary } from './pages/CompetitorLibrary';
import { Scheduler } from './pages/Scheduler';
import { Settings } from './pages/Settings';
import { LandingPage } from './pages/LandingPage';
import { Onboarding } from './pages/Onboarding';
import { ViralPatterns } from './pages/ViralPatterns';
import { Workspace } from './pages/Workspace';
import { CampaignProvider, useCampaignStore } from './store/CampaignContext';
import { ToastProvider } from './store/ToastContext';

// Public Pages
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Contact } from './pages/Contact';
import { Billing } from './pages/Billing';
import { Changelog } from './pages/Changelog';
import { Help } from './pages/Help';
import { Pricing } from './pages/Pricing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { NotFound } from './pages/NotFound';

const AppContent: React.FC = () => {
  const [view, setView] = useState('landing');
  const { currentCampaign } = useCampaignStore();

  const checkApiKey = async () => {
    const win = window as any;
    if (win.aistudio) {
        try {
            const hasKey = await win.aistudio.hasSelectedApiKey();
            if (!hasKey) {
                await win.aistudio.openSelectKey();
            }
        } catch(e) {
            console.error(e);
        }
    }
  };

  useEffect(() => {
    checkApiKey();
  }, []);

  const handleCreateComplete = () => {
      setView('results');
  };

  const handleOnboardingComplete = () => {
      setView('dashboard');
  };

  // Public Routes (No Layout)
  if (view === 'landing') return <LandingPage onStart={() => setView('login')} onNavigate={setView} />;
  if (view === 'pricing') return <Pricing onNavigate={setView} />;
  if (view === 'privacy') return <Privacy onNavigate={setView} />;
  if (view === 'terms') return <Terms onNavigate={setView} />;
  if (view === 'contact') return <Contact onNavigate={setView} />;
  if (view === 'changelog') return <Changelog onNavigate={setView} />;
  if (view === 'help') return <Help onNavigate={setView} />;
  
  // Auth Pages
  // Returning Users: Login -> Dashboard
  if (view === 'login') return <Login onNavigate={setView} />;
  // New Users: Signup -> Onboarding -> Dashboard
  if (view === 'signup') return <Signup onNavigate={(v) => v === 'dashboard' ? setView('onboarding') : setView(v)} />;
  if (view === 'forgot-password') return <ForgotPassword onNavigate={setView} />;
  
  // Onboarding (Only accessible via Signup flow)
  if (view === 'onboarding') return <Onboarding onComplete={handleOnboardingComplete} />;

  // App Routes (With Layout)
  const validAppRoutes = ['dashboard', 'create', 'batch', 'competitor', 'competitors', 'studio', 'templates', 'viral-patterns', 'brand', 'library', 'schedule', 'settings', 'billing', 'results', 'workspace'];
  
  if (validAppRoutes.includes(view)) {
    return (
      <Layout 
        currentView={view} 
        onChangeView={setView} 
      >
        {view === 'dashboard' && <Dashboard onNavigate={setView} />}
        {view === 'create' && <CreateCampaign onComplete={handleCreateComplete} />}
        {view === 'batch' && <BatchCreate onNavigate={setView} />}
        {view === 'competitor' && <CompetitorAnalysisPage onNavigate={setView} />}
        {view === 'competitors' && <CompetitorLibrary onNavigate={setView} />}
        {view === 'studio' && <Studio onNavigate={setView} />}
        {view === 'templates' && <Templates />}
        {view === 'viral-patterns' && <ViralPatterns />}
        {view === 'brand' && <BrandKit />}
        {view === 'library' && <Library />}
        {view === 'schedule' && <Scheduler />}
        {view === 'workspace' && <Workspace onNavigate={setView} />}
        {view === 'settings' && <Settings onNavigate={setView} />}
        {view === 'billing' && <Billing onNavigate={setView} />}
        {view === 'results' && currentCampaign && <Results campaignId={currentCampaign.id} onNavigate={setView} />}
      </Layout>
    );
  }

  // Fallback to 404
  return <NotFound onNavigate={setView} />;
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <CampaignProvider>
        <AppContent />
      </CampaignProvider>
    </ToastProvider>
  );
};

export default App;
