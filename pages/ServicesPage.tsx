import React from 'react';
import { TranslateIcon, MicrophoneIcon, DocumentCheckIcon } from '../components/icons/ServiceIcons';
import Button from '../components/Button';

const serviceList = [
  {
    icon: <TranslateIcon />,
    title: 'Translation',
    description: 'Accurate and culturally nuanced translations for documents, websites, and media. We handle everything from legal documents to creative content, ensuring your message resonates with an Igbo-speaking audience.',
    details: ['Document Translation', 'Website Localization', 'App Localization', 'Media Subtitling']
  },
  {
    icon: <MicrophoneIcon />,
    title: 'Transcription & Voice Over',
    description: 'Professional transcription of audio/video and authentic Igbo voice-overs for your projects. Our native speakers provide clear, accurate transcriptions and voice talent that brings your content to life.',
    details: ['Audio Transcription', 'Video Transcription', 'Igbo Voice-overs', 'Podcast Production']
  },
  {
    icon: <DocumentCheckIcon />,
    title: 'Proofreading & Editing',
    description: 'Ensure your Igbo content is flawless with our expert proofreading and editing services. We correct grammar, spelling, punctuation, and style to ensure professionalism and clarity.',
    details: ['Academic Papers', 'Business Documents', 'Manuscripts', 'Web Content']
  },
];


const ServicesPage: React.FC = () => {
  return (
    <div className="bg-white">
      <header className="bg-light-lavender py-16 text-center">
        <div className="container mx-auto px-6">
          <h1 className="font-unica-one text-5xl md:text-6xl font-bold text-primary-text">Our Language Services</h1>
          <p className="mt-4 text-lg max-w-3xl mx-auto text-secondary-text">
            Connecting you with verified Igbo language experts for any project, big or small.
          </p>
        </div>
      </header>
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceList.map((service, index) => (
              <div key={index} className="bg-light-lavender/50 p-8 rounded-xl shadow-lg border border-soft-gray flex flex-col">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-accent-primary/10 mb-6">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold font-unica-one text-primary-text mb-3">
                  {service.title}
                </h3>
                <p className="text-secondary-text leading-relaxed mb-4 flex-grow">
                  {service.description}
                </p>
                <ul className="space-y-2 text-secondary-text list-disc list-inside mb-6">
                    {service.details.map(detail => <li key={detail}>{detail}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-light-lavender">
        <div className="container mx-auto px-6 max-w-4xl">
           <h2 className="font-unica-one text-4xl md:text-5xl font-bold text-primary-text text-center mb-10">Request a Service</h2>
            <form className="bg-white p-8 rounded-xl shadow-2xl space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-bold text-secondary-text mb-2">Full Name</label>
                    <input type="text" id="name" className="w-full px-4 py-3 bg-input-bg border border-soft-gray rounded-lg focus:ring-accent-primary focus:border-accent-primary" placeholder="e.g. Adaeze Nwosu" />
                </div>
                 <div>
                    <label htmlFor="email" className="block text-sm font-bold text-secondary-text mb-2">Email Address</label>
                    <input type="email" id="email" className="w-full px-4 py-3 bg-input-bg border border-soft-gray rounded-lg focus:ring-accent-primary focus:border-accent-primary" placeholder="e.g. adaeze@example.com" />
                </div>
                 <div>
                    <label htmlFor="service" className="block text-sm font-bold text-secondary-text mb-2">Service Needed</label>
                    <select id="service" className="w-full px-4 py-3 bg-input-bg border border-soft-gray rounded-lg focus:ring-accent-primary focus:border-accent-primary">
                        <option>Translation</option>
                        <option>Transcription & Voice Over</option>
                        <option>Proofreading & Editing</option>
                        <option>Tutoring</option>
                        <option>Other</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="details" className="block text-sm font-bold text-secondary-text mb-2">Project Details</label>
                    <textarea id="details" rows={5} className="w-full px-4 py-3 bg-input-bg border border-soft-gray rounded-lg focus:ring-accent-primary focus:border-accent-primary" placeholder="Please describe your project, including deadlines, budget, and any specific requirements."></textarea>
                </div>
                <div className="text-center">
                    <Button type="submit" variant="primary" className="w-full sm:w-auto">Submit Request</Button>
                </div>
            </form>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;