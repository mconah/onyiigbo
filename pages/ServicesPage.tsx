import React from 'react';
import { TranslateIcon, MicrophoneIcon, DocumentCheckIcon } from '../components/icons/ServiceIcons';
import Button from '../components/Button';
import { Route } from '../App';

interface ServicesPageProps {
  onNavigate: (route: Route) => void;
}

const serviceList = [
  {
    icon: <TranslateIcon />,
    title: 'Translation',
    description: 'Accurate, culturally nuanced translations that resonate.',
    details: ['Documents', 'Websites', 'Apps', 'Media'],
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80'
  },
  {
    icon: <MicrophoneIcon />,
    title: 'Voice & Transcription',
    description: 'Professional voice-overs and accurate transcriptions.',
    details: ['Audio', 'Video', 'Voice-overs', 'Podcasts'],
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80'
  },
  {
    icon: <DocumentCheckIcon />,
    title: 'Proofreading & Editing',
    description: 'Flawless content with expert editing services.',
    details: ['Academic', 'Business', 'Manuscripts', 'Web Content'],
    image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&q=80'
  },
];

const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <header className="relative bg-accent-primary py-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary to-igbo-purple"></div>
        <div className="container mx-auto px-6 relative z-10">
          <img 
            src="/logo-short.png" 
            alt="Onyị Igbo Logo" 
            className="h-20 md:h-24 mx-auto mb-6 animate-fade-in"
          />
          <h1 className="font-unica-one text-5xl md:text-7xl font-bold text-white mb-4 animate-fade-in">
            Language Services
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/95 mb-8">
            Expert Igbo language solutions for every need
          </p>
          <Button 
            variant="secondary" 
            className="bg-white text-accent-primary hover:bg-white/90 transition-all transform hover:scale-105"
            onClick={() => onNavigate('signup')}
          >
            Get Started →
          </Button>
        </div>
      </header>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {serviceList.map((service, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 border border-soft-gray"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-text/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-bold font-unica-one text-white">
                      {service.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-secondary-text text-lg mb-4">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {service.details.map((detail, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 bg-accent-primary/10 text-accent-primary text-sm rounded-full font-medium"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="font-unica-one text-4xl md:text-5xl font-bold text-primary-text text-center mb-16">
            Why Choose Onyị Igbo?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-igbo-leaf-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-igbo-leaf-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary-text mb-2">Verified Experts</h3>
              <p className="text-secondary-text">Native speakers & certified professionals</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary-text mb-2">Fast Turnaround</h3>
              <p className="text-secondary-text">Quick delivery without compromising quality</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-igbo-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-igbo-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary-text mb-2">Quality Guaranteed</h3>
              <p className="text-secondary-text">100% satisfaction or your money back</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary to-igbo-purple"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="font-unica-one text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/95">
            Tell us about your project and we'll match you with the perfect expert
          </p>
          <Button 
            variant="secondary" 
            className="bg-white text-accent-primary hover:bg-white/90 transition-all transform hover:scale-105 text-lg px-8 py-4"
            onClick={() => onNavigate('signup')}
          >
            Sign Up to Get Started →
          </Button>
        </div>
      </section>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ServicesPage;