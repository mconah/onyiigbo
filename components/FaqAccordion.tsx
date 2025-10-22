import React, { useState } from 'react';

interface FaqAccordionProps {
  question: string;
  answer: string;
}

const FaqAccordion: React.FC<FaqAccordionProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-soft-gray rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 text-left font-bold text-lg text-primary-text"
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <svg
          className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="p-5 pt-0 text-secondary-text leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

export default FaqAccordion;