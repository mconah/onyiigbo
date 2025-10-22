import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Tutors from '../components/Tutors';
import IgboLogPreview from '../components/IgboLogPreview';
import TrustLogos from '../components/TrustLogos';
import Testimonials from '../components/Testimonials';
import Partners from '../components/Partners';
import NewsPreview from '../components/NewsPreview';
import { Route } from '../App';

interface HomePageProps {
  onNavigate: (route: Route) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <TrustLogos />
      <Services />
      <Testimonials />
      <Tutors onNavigate={onNavigate} />
      <Partners />
      <NewsPreview onNavigate={onNavigate} />
      <IgboLogPreview onNavigate={onNavigate} />
    </>
  );
};

export default HomePage;