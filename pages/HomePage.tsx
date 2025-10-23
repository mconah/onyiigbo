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
    <div className="relative overflow-hidden bg-gradient-to-br from-[#F6F1FF] via-[#F5FBFF] to-[#F4FFF7] text-primary-text">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-accent-primary/20 blur-3xl opacity-70" />
        <div className="absolute bottom-[-18rem] right-[15%] h-[32rem] w-[32rem] rounded-full bg-igbo-leaf-green/18 blur-3xl opacity-70" />
        <div className="absolute top-[45%] left-[8%] h-72 w-72 rounded-full bg-white/40 blur-3xl opacity-60" />
      </div>

      <div className="relative z-10 flex flex-col gap-16 md:gap-20">
        <Hero onNavigate={onNavigate} />
        <TrustLogos />
        <Services />
        <Testimonials />
        <Tutors onNavigate={onNavigate} />
        <NewsPreview onNavigate={onNavigate} />
        <IgboLogPreview onNavigate={onNavigate} />
      </div>
    </div>
  );
};

export default HomePage;