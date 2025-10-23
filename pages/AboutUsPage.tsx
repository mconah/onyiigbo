import React from 'react';

const teamMembers = [
  { name: 'Onyedikachi Ogbu', role: 'Founder & CEO', avatar: './logo-short.png' },
  { name: 'Onyi Raph', role: 'Head of Language Services', avatar: './logo-short.png' },
  { name: 'Onyedikachi Rapheal', role: 'Lead Community Manager', avatar: './logo-short.png' },
];

const AboutUsPage: React.FC = () => {
  return (
    <div className="bg-white">
      <header className="bg-light-lavender py-20 text-center">
        <div className="container mx-auto px-6">
          <h1 className="font-unica-one text-5xl md:text-6xl font-bold text-primary-text">About OnyiIgbo</h1>
          <p className="mt-4 text-lg max-w-3xl mx-auto text-secondary-text">
            We are passionate about preserving and promoting the richness of the Igbo language and culture for generations to come.
          </p>
        </div>
      </header>

      {/* Our Mission */}
      <section className="py-20">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-unica-one text-4xl font-bold text-primary-text mb-4">Our Mission</h2>
            <p className="text-secondary-text text-lg leading-relaxed mb-4">
              OnyiIgbo was born from a desire to create a central hub for all things Igbo. Our mission is to bridge the gap between those seeking to learn or utilize the Igbo language and the talented professionals who can provide those services. 
            </p>
            <p className="text-secondary-text text-lg leading-relaxed mb-4">
              We aim to empower Igbo speakers, create economic opportunities, and provide a platform where the culture can be celebrated and shared globally. We believe that language is the soul of a culture, and by making it more accessible, we help keep that soul vibrant and alive.
            </p>
          </div>
          <div>
            <img src="./logo.png" alt="Cultural illustration" className="rounded-lg shadow-xl" />
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-20 bg-light-lavender">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-unica-one text-4xl font-bold text-primary-text mb-12">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {teamMembers.map(member => (
              <div key={member.name} className="bg-white p-6 rounded-lg shadow-lg">
                <img src={member.avatar} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-accent-primary" />
                <h3 className="text-xl font-bold text-primary-text">{member.name}</h3>
                <p className="text-accent-primary font-semibold">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;