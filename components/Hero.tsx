import React, { useEffect, useState } from 'react';
import Button from './Button';
import { Route } from '../App';

interface HeroProps {
  onNavigate: (route: Route) => void;
}

const heroSlides = [
  {
    id: 'immersion',
    image:
      'https://cdn.pixabay.com/photo/2022/07/08/13/34/woman-7309273_1280.jpg?auto=format&fit=crop&w=1200&q=80',
    title: 'Immersive Igbo Lessons',
    description:
      'Connect with tutors who personalise every lesson to your pace while grounding you in authentic Igbo expressions.',
  },
  {
    id: 'culture',
    image:
      'https://cdn.pixabay.com/photo/2023/06/24/15/48/dance-8085491_1280.jpg?auto=format&fit=crop&w=1200&q=80',
    title: 'Culture-First Experiences',
    description:
      'Dive into storytelling sessions, proverbs, and curated cultural content designed by our vibrant community.',
  },
  {
    id: 'services',
    image:
      'https://cdn.pixabay.com/photo/2024/11/10/01/01/ai-generated-9186950_1280.png?auto=format&fit=crop&w=1200&q=80',
    title: 'Professional Language Services',
    description:
      'From translation to voice-overs, work with verified experts who deliver precise, culturally nuanced results.',
  },
];

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
  <section className="relative overflow-hidden py-16 md:py-20">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-y-0 left-1/2 h-[125%] w-[88%] -translate-x-1/2 rounded-[40px] bg-white/45 blur-3xl" />
        <div className="absolute -left-24 top-[-32%] h-[26rem] w-[26rem] rounded-full bg-accent-primary/25 blur-3xl opacity-70 animate-[float_14s_ease-in-out_infinite]" />
        <div className="absolute right-[-12%] bottom-[-38%] h-[32rem] w-[32rem] rounded-full bg-igbo-leaf-green/18 blur-3xl opacity-70 animate-[float_18s_ease-in-out_infinite]" />
        <div className="absolute left-[12%] bottom-[8%] hidden h-32 w-32 rounded-full border border-white/50 bg-white/60 blur-xl md:block" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
  <div className="relative overflow-hidden rounded-[36px] border border-white/55 bg-white/60 px-8 py-12 md:px-14 md:py-12 shadow-[0_40px_110px_-45px_rgba(15,23,42,0.6)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute -top-10 left-1/3 h-24 w-24 -translate-x-1/2 rounded-full bg-accent-primary/30 blur-xl opacity-70 animate-[float_12s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute bottom-6 right-10 hidden h-20 w-20 rounded-full border border-white/50 bg-white/60 blur-lg md:block" />

          <div className="relative grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="text-center lg:text-left">
              <h1 className="font-unica-one text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] text-primary-text">
                Your Gateway to Igbo Language & Culture
              </h1>
              <p className="mt-5 text-lg md:text-xl text-secondary-text/85">
                Nnọọ! Partner with verified professionals for translation, tutoring, cultural consulting, and beyond. Experience Igbo heritage through tailored services and community-powered resources.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
                <Button variant="primary" className="w-full sm:w-auto shadow-glass" onClick={() => onNavigate({ page: 'services' })}>
                  Request a Language Service
                </Button>
                <Button variant="secondary" className="w-full sm:w-auto" onClick={() => onNavigate({ page: 'tutors' })}>
                  Find a Tutor
                </Button>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[460px]">
                <div className="absolute -inset-4 rounded-[32px] border border-white/40 bg-gradient-to-br from-accent-primary/15 via-transparent to-igbo-leaf-green/22 blur-2xl" />
                <div className="relative overflow-hidden rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.6)] backdrop-blur-2xl">
                  <div className="pointer-events-none absolute -top-10 right-6 h-24 w-24 rounded-full bg-accent-primary/25 blur-3xl opacity-70" />
                  <div className="pointer-events-none absolute -bottom-8 left-4 h-28 w-28 rounded-full bg-igbo-leaf-green/25 blur-3xl opacity-70" />
                  <div className="relative h-[360px] overflow-hidden rounded-[28px] border border-white/40 bg-black/10">
                    {heroSlides.map((slide, index) => (
                      <div
                        key={slide.id}
                        className={`absolute inset-0 transition-all duration-700 ease-out ${
                          index === activeSlide
                            ? 'opacity-100 translate-y-0'
                            : 'pointer-events-none opacity-0 translate-y-6'
                        }`}
                      >
                        <img
                          src={`${slide.image}&sat=-10`}
                          alt={slide.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/40 bg-white/75 p-5 text-left shadow-[0_18px_45px_-28px_rgba(15,23,42,0.55)] backdrop-blur-xl">
                          <span className="text-xs font-semibold uppercase tracking-wide text-accent-primary">
                            Spotlight
                          </span>
                          <p className="mt-2 text-lg font-bold text-primary-text">{slide.title}</p>
                          <p className="mt-1 text-sm text-secondary-text/80">{slide.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="relative mt-6 flex items-center justify-center gap-3">
                    {heroSlides.map((slide, index) => (
                      <button
                        key={slide.id}
                        onClick={() => setActiveSlide(index)}
                        aria-label={`Show slide ${index + 1}`}
                        className={`h-2.5 w-8 rounded-full transition-all duration-300 ${
                          index === activeSlide
                            ? 'bg-gradient-to-r from-accent-primary to-igbo-leaf-green'
                            : 'bg-white/60 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;