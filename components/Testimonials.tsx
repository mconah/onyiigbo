import React, { useState, useEffect } from 'react';

const testimonials = [
  {
    quote: "OnyiIgbo connected me with an amazing tutor who transformed my Igbo learning experience. Highly recommend!",
    author: "Jessica M.",
    role: "Student",
    avatar: "./logo-short.png"
  },
  {
    quote: "The translation service was flawless and delivered ahead of schedule. Truly professional and culturally accurate.",
    author: "David L.",
    role: "Business Owner",
    avatar: "./logo-short.png"
  },
  {
    quote: "Managing content on the Igbo Log is so intuitive with their admin tools. A fantastic platform for cultural sharing.",
    author: "Ngozi O.",
    role: "Content Contributor",
    avatar: "./logo-short.png"
  },
   {
    quote: "Finding a verified voice-over artist for my project was a breeze. OnyiIgbo makes connecting with talent incredibly easy.",
    author: "Michael P.",
    role: "Filmmaker",
    avatar: "./logo-short.png"
  },
   {
    quote: "The personalized tutoring plans are incredible. My fluency has improved so much in just a few months!",
    author: "Sarah K.",
    role: "Language Learner",
    avatar: "./logo-short.png"
  },
];

const Testimonials: React.FC = () => {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationClass('flyOut'); // Start fade out
      setTimeout(() => {
        setCurrentTestimonialIndex((prevIndex) => 
          (prevIndex + 1) % testimonials.length
        );
        setAnimationClass('flyIn'); // Start fade in
      }, 500); // Duration of flyOut animation
    }, 5000); // Change testimonial every 5 seconds

    setAnimationClass('flyIn'); // Initial animation on mount

    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = testimonials[currentTestimonialIndex];

  return (
  <section className="relative py-14 md:py-18">
  <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-16 left-[12%] h-64 w-64 rounded-full bg-accent-primary/25 blur-3xl opacity-70 animate-[float_20s_ease-in-out_infinite]" />
        <div className="absolute bottom-12 right-[18%] h-72 w-72 rounded-full bg-igbo-leaf-green/20 blur-3xl opacity-60 animate-[float_14s_ease-in-out_infinite]" />
      </div>
      <div className="container mx-auto px-6 text-center">
        <h2 className="font-unica-one text-4xl md:text-5xl font-bold text-primary-text mb-10">
          What Our Clients Say
        </h2>
        <div className="relative max-w-6xl mx-auto flex flex-col lg:flex-row items-center lg:items-stretch gap-8 rounded-[32px] border border-white/50 bg-white/60 p-10 shadow-[0_35px_80px_-30px_rgba(15,23,42,0.65)] backdrop-blur-2xl">
          {/* Left side: Dynamic Testimonial */}
          <div className="lg:w-1/2 flex flex-col justify-center items-center p-6 rounded-3xl lg:rounded-none lg:rounded-l-[28px] border border-white/40 bg-white/70 backdrop-blur-xl shadow-[0_18px_45px_-30px_rgba(15,23,42,0.6)]">
            <div className={`text-center ${animationClass} animation-fill-forwards`}>
              <p className="italic text-xl text-secondary-text/85 mb-6">"{currentTestimonial.quote}"</p>
              <img 
                src={currentTestimonial.avatar} 
                alt={currentTestimonial.author} 
                className="w-20 h-20 rounded-full mx-auto mb-3 border-[3px] border-accent-primary/70 shadow-[0_12px_35px_-20px_rgba(155,93,229,0.6)]" 
              />
              <h3 className="font-bold text-lg text-primary-text">{currentTestimonial.author}</h3>
              <p className="text-sm text-gray-500">{currentTestimonial.role}</p>
            </div>
          </div>

          {/* Right side: Static Text */}
          <div className="lg:w-1/2 p-6 flex flex-col justify-center text-left">
            <h3 className="font-unica-one text-3xl text-primary-text mb-4">Your Success is Our Story</h3>
            <p className="text-secondary-text/85 text-lg leading-relaxed">
              At OnyiIgbo, we're dedicated to providing unparalleled Igbo language services and fostering a vibrant community. Hearing from our clients motivates us to continually improve and expand our offerings.
            </p>
            <p className="text-secondary-text/85 text-lg leading-relaxed mt-4">
              Whether it's mastering the language, ensuring precise translations, or sharing cultural narratives, we are proud to be part of your journey. Join countless others who have experienced the OnyiIgbo difference!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;