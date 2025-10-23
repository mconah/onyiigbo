import React, { useState } from 'react';
import Button from './Button';
import { Route } from '../App';
import { User } from '../data/mockData';
import { ChatIcon } from './icons/ChatIcon'; // NEW: Import ChatIcon

interface HeaderProps {
    onNavigate: (route: Route) => void;
    currentPage: string;
    user: User | null;
    onLogout: () => void;
    onOpenChatPanel: () => void; // NEW: Prop to open chat panel
    onOpenInitiateChatModal: () => void; // NEW: Prop to open initiate chat modal
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage, user, onLogout, onOpenChatPanel, onOpenInitiateChatModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks: { name: string; page: 'home' | 'services' | 'tutors' | 'igbo-log' | 'about' | 'news' }[] = [
    { name: 'Services', page: 'services' },
    { name: 'Tutors', page: 'tutors' },
    { name: 'Igbo Log', page: 'igbo-log' },
    { name: 'News', page: 'news' },
    { name: 'About Us', page: 'about' },
  ];
  
  const handleNavClick = (route: Route) => {
    onNavigate(route);
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-3xl">
      <div className="mx-auto max-w-7xl px-4 pt-5">
        <div className="relative overflow-hidden rounded-[28px] border border-white/40 bg-white/75 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.45)]">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-accent-primary/10 via-transparent to-igbo-leaf-green/10 opacity-70" />
          <div className="pointer-events-none absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-accent-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 top-1/2 hidden h-40 w-40 -translate-y-1/2 rounded-full bg-igbo-leaf-green/15 blur-3xl lg:block" />

          <div className="relative flex items-center justify-between gap-6 px-5 py-4 md:px-8">
            <button onClick={() => handleNavClick({ page: 'home' })} className="group flex items-center gap-3 rounded-xl bg-white/70 px-3 py-1.5 backdrop-blur-xl transition-all duration-300 hover:bg-white/90">
              <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-accent-primary/15">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent-primary/40 to-igbo-leaf-green/30 animate-pulse-glow" />
                <img
                  src="/logo-short.png"
                  alt="OnyiIgbo emblem"
                  className="relative h-8 w-8 object-contain drop-shadow-sm"
                />
              </span>
              <span className="text-3xl font-unica-one text-primary-text transition-colors duration-300 group-hover:text-accent-primary">
                OnyiIgbo
              </span>
            </button>

            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick({ page: link.page })}
                  className={`group relative font-medium transition-all duration-300 ${currentPage === link.page ? 'text-accent-primary' : 'text-secondary-text hover:text-accent-primary'}`}
                >
                  <span className="relative z-10">{link.name}</span>
                  <span className={`absolute inset-x-0 -bottom-2 h-0.5 rounded-full bg-accent-primary transition-all duration-300 ${currentPage === link.page ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:scale-x-100 group-hover:opacity-100'}`} />
                </button>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-3">
              {user && (
                <div className="flex items-center gap-2 rounded-xl bg-white/70 px-2 py-1 backdrop-blur-xl">
                  <button onClick={onOpenChatPanel} className="rounded-lg bg-accent-primary/15 p-2 text-accent-primary transition-all duration-300 hover:bg-accent-primary hover:text-white">
                    <ChatIcon className="h-5 w-5" />
                  </button>
                  <button onClick={onOpenInitiateChatModal} className="text-xs font-semibold uppercase tracking-wide text-secondary-text hover:text-accent-primary">
                    Start Chat
                  </button>
                </div>
              )}
              {user ? (
                <>
                  <Button variant="secondary" onClick={() => handleNavClick({ page: user.role === 'Admin' ? 'admin' : 'dashboard' })}>
                    Dashboard
                  </Button>
                  <Button variant="primary" onClick={onLogout}>
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <button onClick={() => handleNavClick({ page: 'login' })} className="font-bold text-secondary-text transition-colors duration-300 hover:text-accent-primary">
                    Log In
                  </button>
                  <Button onClick={() => handleNavClick({ page: 'signup' })} variant="primary">
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-lg bg-white/70 p-2 text-primary-text backdrop-blur-xl shadow-sm transition-all duration-300 hover:bg-white"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="mt-3 overflow-hidden rounded-2xl border border-white/30 bg-white/90 px-6 py-6 shadow-lg backdrop-blur-2xl">
            <nav className="flex flex-col items-stretch space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick({ page: link.page })}
                  className={`rounded-xl px-4 py-3 text-left font-medium transition-all duration-300 ${currentPage === link.page ? 'bg-accent-primary/15 text-accent-primary' : 'text-secondary-text hover:bg-accent-primary/10 hover:text-accent-primary'}`}
                >
                  {link.name}
                </button>
              ))}
              {user && (
                <div className="flex items-center justify-between rounded-xl bg-accent-primary/10 px-4 py-3">
                  <button onClick={onOpenChatPanel} className="flex items-center gap-2 text-accent-primary">
                    <ChatIcon className="h-5 w-5" />
                    Open Chats
                  </button>
                  <button onClick={onOpenInitiateChatModal} className="text-xs font-semibold uppercase tracking-wide text-secondary-text">
                    New
                  </button>
                </div>
              )}
              {user ? (
                <>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => handleNavClick({ page: user.role === 'Admin' ? 'admin' : 'dashboard' })}
                  >
                    Dashboard
                  </Button>
                  <Button variant="primary" className="w-full" onClick={onLogout}>
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavClick({ page: 'login' })}
                    className="rounded-xl px-4 py-3 text-center font-bold text-secondary-text transition-colors duration-300 hover:text-accent-primary"
                  >
                    Log In
                  </button>
                  <Button variant="primary" className="w-full" onClick={() => handleNavClick({ page: 'signup' })}>
                    Sign Up
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;