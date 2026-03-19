import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all translation files (ig)
import igCommon from './i18/ig/common.json';
import igHome from './i18/ig/home.json';
import igServices from './i18/ig/services.json';
import igTutors from './i18/ig/tutors.json';
import igIgboLog from './i18/ig/igbo-log.json';
import igAboutUs from './i18/ig/aboutus.json';
import igHelp from './i18/ig/help.json';
import igTerms from './i18/ig/terms.json';
import igLogin from './i18/ig/login.json';
import igSignup from './i18/ig/signup.json';
import igDashboard from './i18/ig/dashboard.json';
import igAdmin from './i18/ig/admin.json';
import igNews from './i18/ig/news.json';
import igCareers from './i18/ig/careers.json';
import igServiceProviderPortal from './i18/ig/service-provider-portal.json';
import igTutorProfile from './i18/ig/tutor-profile.json';
import igBlogPost from './i18/ig/blog-post.json';
import igNewsPost from './i18/ig/news-post.json';
import igChat from './i18/ig/chat.json';

// Import all translation files (en)
import enCommon from './i18/en/common.json';
import enHome from './i18/en/home.json';
import enServices from './i18/en/services.json';
import enTutors from './i18/en/tutors.json';
import enIgboLog from './i18/en/igbo-log.json';
import enAboutUs from './i18/en/aboutus.json';
import enHelp from './i18/en/help.json';
import enTerms from './i18/en/terms.json';
import enLogin from './i18/en/login.json';
import enSignup from './i18/en/signup.json';
import enDashboard from './i18/en/dashboard.json';
import enAdmin from './i18/en/admin.json';
import enNews from './i18/en/news.json';
import enCareers from './i18/en/careers.json';
import enServiceProviderPortal from './i18/en/service-provider-portal.json';
import enTutorProfile from './i18/en/tutor-profile.json';
import enBlogPost from './i18/en/blog-post.json';
import enNewsPost from './i18/en/news-post.json';
import enChat from './i18/en/chat.json';

// Merge all translation files for each language
const igResources = {
  common: igCommon,
  home: igHome,
  services: igServices,
  tutors: igTutors,
  'igbo-log': igIgboLog,
  aboutus: igAboutUs,
  help: igHelp,
  terms: igTerms,
  login: igLogin,
  signup: igSignup,
  dashboard: igDashboard,
  admin: igAdmin,
  news: igNews,
  careers: igCareers,
  'service-provider-portal': igServiceProviderPortal,
  'tutor-profile': igTutorProfile,
  'blog-post': igBlogPost,
  'news-post': igNewsPost,
  chat: igChat,
};

const enResources = {
  common: enCommon,
  home: enHome,
  services: enServices,
  tutors: enTutors,
  'igbo-log': enIgboLog,
  aboutus: enAboutUs,
  help: enHelp,
  terms: enTerms,
  login: enLogin,
  signup: enSignup,
  dashboard: enDashboard,
  admin: enAdmin,
  news: enNews,
  careers: enCareers,
  'service-provider-portal': enServiceProviderPortal,
  'tutor-profile': enTutorProfile,
  'blog-post': enBlogPost,
  'news-post': enNewsPost,
  chat: enChat,
};

const resources = {
  ig: igResources,
  en: enResources,
};

const namespaces = [
  'common', 'home', 'services', 'tutors', 'igbo-log', 'aboutus', 'help', 
  'terms', 'login', 'signup', 'dashboard', 'admin', 'news', 'careers', 
  'service-provider-portal', 'tutor-profile', 'blog-post', 'news-post', 'chat'
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ig',
    lng: 'ig',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    // Enable automatic translation with fallback to correct translations
    missingKeyHandler: (lng, ns, key) => {
      // Log missing keys for manual translation
      console.warn(`Missing translation key: ${key} for language: ${lng} in namespace: ${ns}`);
    },
    // Use common as default namespace
    defaultNS: 'common',
    // Fallback namespaces
    fallbackNS: ['common'],
    // Load all namespaces
    ns: namespaces,
  });

export default i18n;
