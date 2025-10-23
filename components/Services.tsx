import React from 'react';
import { TranslateIcon, MicrophoneIcon, DocumentCheckIcon } from './icons/ServiceIcons';

const serviceList = [
  {
    icon: <TranslateIcon />,
    title: 'Translation',
    description: 'Accurate and culturally nuanced translations for documents, websites, and media.',
  },
  {
    icon: <MicrophoneIcon />,
    title: 'Transcription & Voice Over',
    description: 'Professional transcription of audio/video and authentic voice-overs for your projects.',
  },
  {
    icon: <DocumentCheckIcon />,
    title: 'Proofreading & Editing',
    description: 'Ensure your Igbo content is flawless with our expert proofreading and editing services.',
  },
];

const Services: React.FC = () => {
  return (
  <section id="services" className="relative py-14 md:py-18">
  <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-[10%] h-48 w-48 rounded-full bg-accent-primary/25 blur-3xl opacity-60 animate-[float_16s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 right-[12%] h-56 w-56 rounded-full bg-igbo-leaf-green/20 blur-3xl opacity-60 animate-[float_18s_ease-in-out_infinite]" />
      </div>
      <div className="container mx-auto px-6">
  <div className="relative text-center mb-12 max-w-3xl mx-auto">
          <h2 className="font-unica-one text-4xl md:text-5xl font-bold text-primary-text mt-6">
            Professional Igbo Language Services
          </h2>
          <p className="mt-4 text-lg text-secondary-text/80">
            Our verified vendors deliver top-quality services tailored to your specific needs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceList.map((service, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-[28px] border border-white/50 bg-white/60 p-8 shadow-[0_28px_60px_-28px_rgba(15,23,42,0.8)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_40px_80px_-32px_rgba(15,23,42,0.75)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative flex items-center justify-center h-16 w-16 rounded-2xl border border-white/60 bg-white/70 mb-6 shadow-[0_12px_30px_-20px_rgba(155,93,229,0.8)]">
                {service.icon}
              </div>
              <h3 className="relative text-2xl font-bold font-unica-one text-primary-text mb-3">
                {service.title}
              </h3>
              <p className="relative text-secondary-text/80 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;