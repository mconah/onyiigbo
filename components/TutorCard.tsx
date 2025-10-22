import React from 'react';
import Button from './Button';
import { Route } from '../App';
import { Tutor } from '../data/mockData'; // Import Tutor interface

interface TutorCardProps {
  tutor: Tutor;
  onNavigate: (route: Route) => void;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor, onNavigate }) => {
  const { $id, name, location, specialty, availability, avatar } = tutor;
  return (
    <div className="bg-white border border-soft-gray rounded-lg shadow-lg text-center p-6 flex flex-col hover:-translate-y-2 transition-transform duration-300">
      <img
        src={avatar}
        alt={name}
        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-accent-primary/50"
      />
      <h3 className="font-unica-one text-2xl text-primary-text mb-1">{name}</h3>
      <p className="text-accent-primary font-semibold mb-2">{location}</p>
      <div className="flex-grow mb-4">
        <span className="inline-block bg-accent-primary/10 text-accent-primary text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
          {specialty}
        </span>
        <span className={`inline-block text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full ${availability === 'remote' ? 'bg-blue-100 text-blue-800' : 'bg-igbo-leaf-green text-white'}`}>
          {availability === 'remote' ? 'Remote' : 'In-person'}
        </span>
      </div>
      <Button variant="secondary" className="w-full" onClick={() => onNavigate({ page: 'tutor-profile', id: $id })}>View Profile</Button>
    </div>
  );
};

export default TutorCard;