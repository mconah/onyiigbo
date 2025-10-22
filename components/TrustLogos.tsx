import React from 'react';

const trustLogos = [
  { id: 1, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Workspace_Logo.svg/1024px-Google_Workspace_Logo.svg.png', alt: 'Google Workspace' },
  { id: 2, src: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', alt: 'Amazon' },
  { id: 3, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/2560px-Microsoft_logo_%282012%29.svg.png', alt: 'Microsoft' },
  { id: 4, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Slack_logo.svg/2560px-Slack_logo.svg.png', alt: 'Slack' },
  { id: 5, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Meta_Platforms_logo.svg/2560px-Meta_Platforms_logo.svg.png', alt: 'Meta' },
  { id: 6, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1724px-Apple_logo_black.svg.png', alt: 'Apple' },
  { id: 7, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1280px-Netflix_2015_logo.svg.png', alt: 'Netflix' },
  { id: 8, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/600px-LinkedIn_logo_initials.png', alt: 'LinkedIn' },
  { id: 9, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Zoom_Video_Communications_Logo.svg/2560px-Zoom_Video_Communications_Logo.svg.png', alt: 'Zoom' },
  { id: 10, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/HP_logo_2012.svg/2560px-HP_logo_2012.svg.png', alt: 'HP' },
  { id: 11, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Adobe_Inc._logo.svg/2560px-Adobe_Inc._logo.svg.png', alt: 'Adobe' },
  { id: 12, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Dell_logo.png/2560px-Dell_logo.png', alt: 'Dell' },
  { id: 13, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/IBM_logo.svg/2560px-IBM_logo.svg.png', alt: 'IBM' },
  { id: 14, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Spotify_logo_vertical_black.svg/1280px-Spotify_logo_vertical_black.svg.png', alt: 'Spotify' },
  { id: 15, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Airbnb_Logo.svg/2560px-Airbnb_Logo.svg.png', alt: 'Airbnb' },
];

const TrustLogos: React.FC = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="font-unica-one text-2xl md:text-3xl font-bold text-primary-text mb-8">
          Trusted by Leading Companies
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-y-8 items-center justify-items-center max-w-6xl mx-auto">
          {trustLogos.map((logo, index) => (
            <img 
              key={logo.id} 
              src={logo.src} 
              alt={logo.alt} 
              className="h-10 mx-auto opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform scale-90"
              style={{ 
                filter: 'grayscale(100%) brightness(0) opacity(0.6)',
                animation: `popIn 0.8s ease-out forwards`,
                animationDelay: `${0.1 * index}s`
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustLogos;