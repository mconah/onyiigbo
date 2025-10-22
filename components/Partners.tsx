

import React from 'react';

const partnerLogos = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Amazon_Web_Services_Logo.svg/1024px-Amazon_Web_Services_Logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Microsoft_Azure_Logo.svg/2560px-Microsoft_Azure_Logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Cloudflare_Logo.svg/2560px-Cloudflare_Logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Adobe_Inc._logo.svg/2560px-Adobe_Inc._logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Amazon_Web_Services_Logo.svg/1024px-Amazon_Web_Services_Logo.svg.png', // Duplicate for seamless scroll
];

const Partners: React.FC = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="font-unica-one text-2xl md:text-3xl font-bold text-primary-text mb-8">
          Our Valued Partners
        </h2>
        <div className="relative overflow-hidden h-20">
          <div className="absolute inset-0 flex items-center justify-center animate-scroll-partners">
            {partnerLogos.map((logo, index) => (
              <img 
                key={index} 
                src={logo} 
                alt={`Partner ${index + 1}`} 
                className="h-10 mx-8 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                style={{ filter: 'grayscale(100%) brightness(0) opacity(0.6)' }}
              />
            ))}
            {/* Duplicate for seamless loop */}
            {partnerLogos.map((logo, index) => (
              <img 
                key={`duplicate-${index}`} 
                src={logo} 
                alt={`Partner ${index + 1}`} 
                className="h-10 mx-8 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                style={{ filter: 'grayscale(100%) brightness(0) opacity(0.6)' }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;