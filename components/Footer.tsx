import React from 'react';
import { FacebookIcon, TwitterIcon, InstagramIcon } from './icons/SocialIcons';
import { Route } from '../App';
import { useTranslation } from 'react-i18next';

interface FooterProps {
  onNavigate: (route: Route) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useTranslation('common');

  return (
    <footer id="footer" className="bg-primary-text text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-1 mb-4">
              <img 
                src="/logo-short.png" 
                alt="OnyiIgbo Logo" 
                className="h-8 w-auto"
              />
              <span className="text-3xl font-unica-one text-white">
                OnyiIgbo
              </span>
            </div>
            <p className="text-gray-400">{t('footer.slogan')}</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase">{t('footer.quick_links')}</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate({ page: 'services' })} className="hover:text-accent-primary transition-colors">{t('footer.services')}</button></li>
              <li><button onClick={() => onNavigate({ page: 'tutors' })} className="hover:text-accent-primary transition-colors">{t('footer.find_a_tutor')}</button></li>
              <li><button onClick={() => onNavigate({ page: 'igbo-log' })} className="hover:text-accent-primary transition-colors">{t('footer.igbo_log')}</button></li>
              <li><button onClick={() => onNavigate({ page: 'news' })} className="hover:text-accent-primary transition-colors">{t('footer.news')}</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase">{t('footer.support')}</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate({ page: 'about' })} className="hover:text-accent-primary transition-colors">{t('footer.about')}</button></li>
              <li><button onClick={() => onNavigate({ page: 'help' })} className="hover:text-accent-primary transition-colors">{t('footer.help_center')}</button></li>
              <li><button onClick={() => onNavigate({ page: 'terms' })} className="hover:text-accent-primary transition-colors">{t('footer.terms_of_service')}</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase">{t('footer.follow_us')}</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter"><TwitterIcon /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook"><FacebookIcon /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram"><InstagramIcon /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} OnyiIgbo. {t('footer.all_rights_reserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;