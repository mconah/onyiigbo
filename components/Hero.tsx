import React from 'react';
import Button from './Button';
import { Route } from '../App';

interface HeroProps {
  onNavigate: (route: Route) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative text-center py-20 md:py-32 bg-gradient-to-br from-light-lavender to-white animate-gradientShift bg-[length:200%_200%] overflow-hidden">
       <div className="absolute inset-0 bg-light-lavender opacity-20"></div>
       <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-accent-primary/5 rounded-full filter blur-3xl opacity-70"></div>
       <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-igbo-leaf-green/5 rounded-full filter blur-3xl opacity-70"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <h1 className="font-unica-one text-5xl md:text-7xl lg:text-8xl font-bold text-primary-text leading-tight mb-4 drop-shadow-md">
          Your Gateway to Igbo Language & Culture
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-secondary-text mb-8">
          Nnọọ! Connect with verified professionals for translation, tutoring, and more. Celebrate and engage with the Igbo heritage.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button variant="primary" className="w-full sm:w-auto" onClick={() => onNavigate({ page: 'services' })}>
            Request a Language Service
          </Button>
          <Button variant="secondary" className="w-full sm:w-auto" onClick={() => onNavigate({ page: 'tutors' })}>
            Find a Tutor
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;