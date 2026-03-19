import React from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { i18n, t } = useTranslation('common');

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <select
        value={i18n.language}
        onChange={changeLanguage}
        className="form-select block w-full rounded-lg border border-gray-200 shadow-sm focus:border-accent-primary focus:ring focus:ring-accent-primary focus:ring-opacity-50 text-sm py-2 px-3 bg-white/70 backdrop-blur-xl text-secondary-text outline-none cursor-pointer transition-colors hover:bg-white/90"
        aria-label={t('language.select')}
      >
        <option value="" disabled>{t('language.select')}</option>
        <option value="ig">{t('language.igbo')}</option>
        <option value="en">{t('language.english')}</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
