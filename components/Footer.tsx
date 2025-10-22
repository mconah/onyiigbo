import React from 'react';
import { FacebookIcon, TwitterIcon, InstagramIcon } from './icons/SocialIcons';
import { Route } from '../App';

interface FooterProps {
  onNavigate: (route: Route) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer id="footer" className="bg-primary-text text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-unica-one mb-4">OnyiIgbo</h3>
            <p className="text-gray-400">Connecting the world to the heart of Igbo language and culture.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase">Quick Links</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate({ page: 'services' })} className="hover:text-accent-primary transition-colors">Services</button></li>
              <li><button onClick={() => onNavigate({ page: 'tutors' })} className="hover:text-accent-primary transition-colors">Find a Tutor</button></li>
              <li><button onClick={() => onNavigate({ page: 'igbo-log' })} className="hover:text-accent-primary transition-colors">Igbo Log</button></li>
              <li><button onClick={() => onNavigate({ page: 'news' })} className="hover:text-accent-primary transition-colors">News</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase">Support</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate({ page: 'about' })} className="hover:text-accent-primary transition-colors">About Us</button></li>
              <li><button onClick={() => onNavigate({ page: 'help' })} className="hover:text-accent-primary transition-colors">Help Center</button></li>
              <li><button onClick={() => onNavigate({ page: 'terms' })} className="hover:text-accent-primary transition-colors">Terms of Service</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter"><TwitterIcon /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook"><FacebookIcon /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram"><InstagramIcon /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} OnyiIgbo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;