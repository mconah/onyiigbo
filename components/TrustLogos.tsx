import React from 'react';

const trustLogos = [
  { id: 1, src: './lexrunit.png', alt: 'Google Workspace' },
  { id: 2, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png', alt: 'Amazon' },
  { id: 3, src: 'https://sinod.lexrunit.com/sinod-logo.png', alt: 'Microsoft' },
  { id: 4, src: './logo-short.png', alt: 'Slack' },
  { id: 5, src: 'https://appwrite.io/images/logos/logo.svg', alt: 'Meta' },
  { id: 6, src: './logo.png', alt: 'Apple' },
  { id: 7, src: 'https://appwrite.io/images/logos/logo.svg', alt: 'Netflix' },
  { id: 8, src: './lexrunit.png', alt: 'LinkedIn' },
  { id: 9, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png', alt: 'Zoom' },
  { id: 10, src: './lyperos.png', alt: 'HP' },
  { id: 11, src: './logo-short.png', alt: 'Adobe' },
  { id: 12, src: './lyperos.png', alt: 'Dell' },
  { id: 13, src: './logo-long.png', alt: 'IBM' },
  { id: 14, src: './logo.png', alt: 'Spotify' },
  { id: 15, src: './lexrunit.png', alt: 'Airbnb' },
];

const TrustLogos: React.FC = () => {
  return (
    <section className="relative py-16">
  <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-32 max-w-5xl rounded-[32px] bg-white/40 blur-3xl" />
      <div className="container mx-auto px-6 text-center">
        <h2 className="font-unica-one text-2xl md:text-3xl font-bold text-primary-text/90 mb-10">
          Trusted by Leading Companies
        </h2>
  <div className="rounded-[28px] border border-white/50 bg-white/60 px-6 py-8 shadow-[0_25px_60px_-28px_rgba(15,23,42,0.65)] backdrop-blur-2xl">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-y-8 items-center justify-items-center max-w-6xl mx-auto">
          {trustLogos.map((logo, index) => (
            <img 
              key={logo.id} 
              src={logo.src} 
              alt={logo.alt} 
              className="h-10 mx-auto opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform scale-90"
              style={{ 
                filter: 'grayscale(100%) brightness(0) opacity(0.7)',
                animation: `popIn 0.8s ease-out forwards`,
                animationDelay: `${0.08 * index}s`
              }}
            />
          ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustLogos;