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
    <header className="bg-light-lavender/80 backdrop-blur-lg sticky top-0 z-50 border-b border-soft-gray">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <button onClick={() => handleNavClick({ page: 'home' })} className="text-3xl font-unica-one text-primary-text">
          OnyiIgbo
        </button>
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick({ page: link.page })}
              className={`font-medium transition-colors duration-300 ${currentPage === link.page ? 'text-accent-primary' : 'text-secondary-text hover:text-accent-primary'}`}
            >
              {link.name}
            </button>
          ))}
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          {user && (
            <button onClick={onOpenChatPanel} className="text-secondary-text hover:text-accent-primary transition-colors duration-300">
              <ChatIcon className="w-6 h-6" />
            </button>
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
              <button onClick={() => handleNavClick({ page: 'login' })} className="text-secondary-text hover:text-accent-primary transition-colors duration-300 font-bold">
                Log In
              </button>
              <Button onClick={() => handleNavClick({ page: 'signup' })} variant="primary">Sign Up</Button>
            </>
          )}
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg
              className="w-6 h-6 text-primary-text"
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
      {isMenuOpen && (
        <div className="md:hidden bg-light-lavender pb-4">
          <nav className="flex flex-col items-center space-y-4">
            {navLinks.map((link) => (
               <button
                key={link.name}
                onClick={() => handleNavClick({ page: link.page })}
                className={`font-medium transition-colors duration-300 ${currentPage === link.page ? 'text-accent-primary' : 'text-secondary-text hover:text-accent-primary'}`}
              >
                {link.name}
              </button>
            ))}
            {user && (
               <button onClick={onOpenChatPanel} className="text-secondary-text hover:text-accent-primary transition-colors duration-300 py-2">
                 <ChatIcon className="w-6 h-6 inline-block mr-2" /> Chat
               </button>
            )}
            {user ? (
              <>
                <Button variant="secondary" className="w-1/2" onClick={() => handleNavClick({ page: user.role === 'Admin' ? 'admin' : 'dashboard' })}>Dashboard</Button>
                <Button variant="primary" className="w-1/2" onClick={onLogout}>Log Out</Button>
              </>
            ) : (
              <>
                <button onClick={() => handleNavClick({ page: 'login' })} className="text-secondary-text hover:text-accent-primary transition-colors duration-300 font-bold py-2">
                  Log In
                </button>
                <Button variant="primary" className="w-1/2" onClick={() => handleNavClick({ page: 'signup' })}>Sign Up</Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;