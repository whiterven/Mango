
import React, { useState, useEffect } from 'react';
import { Hero } from '../components/landing/Hero';
import { SocialProof } from '../components/landing/SocialProof';
import { HowItWorks } from '../components/landing/HowItWorks';
import { ProductDemo } from '../components/landing/ProductDemo';
import { Features } from '../components/landing/Features';
import { CompetitorSpy } from '../components/landing/CompetitorSpy';
import { Comparison } from '../components/landing/Comparison';
import { UseCases } from '../components/landing/UseCases';
import { Testimonials } from '../components/landing/Testimonials';
import { PricingPreview } from '../components/landing/PricingPreview';
import { FAQ } from '../components/landing/FAQ';
import { FinalCTA } from '../components/landing/FinalCTA';
import { Footer } from '../components/layout/Footer';

interface LandingPageProps {
  onStart: () => void;
  onNavigate: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handlePricingClick = () => {
      onNavigate('pricing');
      setIsMenuOpen(false);
  };

  const handleLogin = () => {
      onNavigate('login');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-brand-500/30 overflow-x-hidden">
      
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled || isMenuOpen ? 'bg-[#0f172a]/90 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="flex items-center justify-between px-6 max-w-6xl mx-auto">
          {/* Logo */}
          <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="flex items-center gap-2 relative z-50 group">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-yellow-400 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-brand-500/20 font-display transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">M</div>
              <span className="font-bold text-lg tracking-tight font-display">Mango</span>
          </button>

          {/* Desktop Nav Links (3 Buttons) */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900/50 p-1 rounded-full border border-white/5 backdrop-blur-md">
              <button onClick={() => scrollToSection('features')} className="px-5 py-2 rounded-full text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="px-5 py-2 rounded-full text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all">How it works</button>
              <button onClick={handlePricingClick} className="px-5 py-2 rounded-full text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all">Pricing</button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
              <button onClick={handleLogin} className="text-xs font-bold text-slate-300 hover:text-white transition-colors px-3">Log In</button>
              <button onClick={onStart} className="bg-white text-slate-900 px-5 py-2.5 rounded-full text-xs font-black hover:bg-brand-400 hover:text-white transition-all shadow-lg hover:shadow-brand-500/25 transform hover:-translate-y-0.5 active:translate-y-0">
                Get Access
              </button>
          </div>

          {/* Mobile Hamburger (Nicer Style) */}
          <button 
            className={`md:hidden relative z-50 w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isMenuOpen ? 'bg-slate-800 text-white' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            <div className="flex flex-col justify-center items-center w-5 h-5 gap-1.5 overflow-hidden">
              <span className={`block w-full h-0.5 bg-current rounded-full transition-all duration-300 ease-out ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-full h-0.5 bg-current rounded-full transition-all duration-300 ease-out ${isMenuOpen ? 'translate-x-full opacity-0' : ''}`}></span>
              <span className={`block w-full h-0.5 bg-current rounded-full transition-all duration-300 ease-out ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Clean Mobile Menu Overlay */}
        <div className={`fixed inset-0 z-40 bg-[#0f172a]/95 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
            <div className="w-full max-w-sm px-8 flex flex-col gap-6 text-center">
                <div className="space-y-4">
                    <button onClick={() => scrollToSection('features')} className="block w-full text-3xl font-black text-white hover:text-brand-500 transition-colors font-display tracking-tight">Features</button>
                    <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-3xl font-black text-white hover:text-brand-500 transition-colors font-display tracking-tight">How it works</button>
                    <button onClick={handlePricingClick} className="block w-full text-3xl font-black text-white hover:text-brand-500 transition-colors font-display tracking-tight">Pricing</button>
                </div>
                
                <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto my-4"></div>
                
                <div className="space-y-3">
                    <button onClick={handleLogin} className="w-full py-4 text-sm font-bold text-slate-300 border border-slate-700 rounded-2xl hover:bg-slate-800 hover:text-white transition-all">Log In</button>
                    <button onClick={onStart} className="w-full bg-brand-500 text-white py-4 rounded-2xl text-lg font-bold shadow-lg shadow-brand-500/20 active:scale-95 transition-all">Get Access</button>
                </div>
            </div>
        </div>
      </nav>

      <div id="hero"><Hero onStart={onStart} /></div>
      <SocialProof />
      <div id="how-it-works"><HowItWorks /></div>
      <ProductDemo />
      <div id="features"><Features /></div>
      <CompetitorSpy onStart={onStart} />
      <Comparison />
      <UseCases />
      <Testimonials />
      <div id="pricing"><PricingPreview onStart={onStart} /></div>
      <FAQ />
      <FinalCTA onStart={onStart} />
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
