import React, { useState, useEffect } from 'react';
import { Dumbbell, Menu, X, Sparkles, LogIn, ArrowUp, LogOut, LayoutDashboard } from 'lucide-react';
import Footer from './Footer';
import GymBot from './GymBot';
import { supabase } from '../lib/supabaseClient';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);

    // Check auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onNavigate('home');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', href: '#home', page: 'home' },
    { name: 'Programs', href: '#programs', page: 'home' },
    { name: 'AI Coach', href: '#ai-coach', page: 'home' },
    { name: 'Pricing', href: '#pricing', page: 'home' },
    { name: 'Contact', href: '#contact', page: 'home' },
  ];

  const handleNavClick = (e: React.MouseEvent, link: any) => {
    if (currentPage !== 'home' && link.page === 'home') {
        e.preventDefault();
        onNavigate('home');
        setTimeout(() => {
            const element = document.querySelector(link.href);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-lime-500 selection:text-black relative">
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-md border-b border-zinc-800 py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 group outline-none">
            <div className="relative">
                <Dumbbell className="w-8 h-8 text-lime-400 group-hover:rotate-45 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-lime-400 blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
            </div>
            <span className="text-xl md:text-2xl font-heading font-bold text-white tracking-tighter">
              MYFITNESS<span className="text-lime-400">HUB</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex gap-8 xl:gap-12 items-center">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.page === 'home' && currentPage === 'home' ? link.href : '#'}
                onClick={(e) => handleNavClick(e, link)}
                className={`text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${link.name === 'AI Coach' ? 'text-cyan-400 hover:text-cyan-300' : 'text-zinc-300 hover:text-lime-400'}`}
              >
                {link.name === 'AI Coach' && <Sparkles className="w-3.5 h-3.5" />}
                {link.name}
              </a>
            ))}
            
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-zinc-800">
                {user ? (
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => onNavigate('dashboard')}
                            className="text-white hover:text-lime-400 font-bold text-sm uppercase flex items-center gap-2 transition-colors"
                        >
                             <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="text-zinc-500 hover:text-red-400 font-bold text-sm uppercase flex items-center gap-2 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <>
                        <button 
                            onClick={() => onNavigate('login')}
                            className="text-white hover:text-lime-400 font-bold text-sm uppercase flex items-center gap-2"
                        >
                            <LogIn className="w-4 h-4" /> Login
                        </button>
                        <button 
                            onClick={() => onNavigate('signup')}
                            className="px-6 py-2 bg-lime-500 text-black font-bold uppercase text-sm tracking-wide hover:bg-white transition-colors skew-x-[-10deg]"
                        >
                            <span className="block skew-x-[10deg]">Join Now</span>
                        </button>
                    </>
                )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden text-white hover:text-lime-400 transition-colors p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden absolute top-full left-0 w-full bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800 transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-[600px] py-4' : 'max-h-0 py-0'}`}>
          <div className="px-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.page === 'home' && currentPage === 'home' ? link.href : '#'}
                onClick={(e) => handleNavClick(e, link)}
                className="text-lg font-heading font-bold uppercase text-zinc-300 hover:text-lime-400 py-2 border-b border-zinc-900"
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col gap-3 mt-2 pt-2 border-t border-zinc-800">
                {user ? (
                    <>
                        <button 
                             onClick={() => { onNavigate('dashboard'); setIsMobileMenuOpen(false); }}
                             className="w-full py-3 bg-zinc-800 text-white font-bold uppercase tracking-wide hover:bg-zinc-700 rounded flex items-center justify-center gap-2"
                        >
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="w-full py-3 bg-zinc-900 text-red-400 font-bold uppercase tracking-wide hover:bg-zinc-800 rounded flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                            onClick={() => { onNavigate('login'); setIsMobileMenuOpen(false); }}
                            className="w-full py-3 bg-zinc-800 text-white font-bold uppercase tracking-wide hover:bg-zinc-700 rounded"
                        >
                            Login
                        </button>
                        <button 
                            onClick={() => { onNavigate('signup'); setIsMobileMenuOpen(false); }}
                            className="w-full py-3 bg-lime-500 text-black font-bold uppercase tracking-wide hover:bg-lime-400 rounded"
                        >
                            Join Now
                        </button>
                    </>
                )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      {/* Persistent GymBot AI Coach */}
      <GymBot />

      {/* Scroll To Top Button */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-24 right-6 z-40 p-3 bg-zinc-800 text-white rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-zinc-700 hover:bg-lime-500 hover:text-black hover:border-lime-500 transition-all duration-300 transform ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>

      {currentPage === 'home' && <Footer />}
    </div>
  );
};

export default Layout;