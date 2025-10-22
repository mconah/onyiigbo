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
    <section id="services" className="py-20 bg-light-lavender">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-unica-one text-4xl md:text-5xl font-bold text-primary-text">
            Professional Igbo Language Services
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto text-secondary-text">
            Our verified vendors deliver top-quality services tailored to your specific needs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceList.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-accent-primary/10 mb-6">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold font-unica-one text-primary-text mb-3">
                {service.title}
              </h3>
              <p className="text-secondary-text leading-relaxed">
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