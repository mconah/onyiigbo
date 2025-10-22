import React, { useEffect, useState } from 'react';
import Button from './Button';
import { Route } from '../App';
import { Tutor } from '../data/mockData'; // Import Tutor
import { databases, dbId, usersCollectionId } from '../lib/appwrite';
import { Query } from 'appwrite';

interface TutorsProps {
  onNavigate: (page: Route) => void;
}

const Tutors: React.FC<TutorsProps> = ({ onNavigate }) => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutors = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await databases.listDocuments(
          dbId,
          usersCollectionId,
          [
            Query.equal('role', ['Tutor', 'Service Provider']),
            Query.equal('status', 'Verified'),
            Query.limit(3), // Fetch only 3 for preview
            Query.orderDesc('$createdAt'), // Latest tutors
          ]
        );
        const fetchedTutors: Tutor[] = response.documents.map(doc => ({
          $id: doc.$id,
          // Fix: Add appwrite_user_id to satisfy the Tutor interface
          appwrite_user_id: doc.appwrite_user_id, 
          name: doc.name,
          location: doc.location || 'Remote',
          specialty: doc.specialty || 'Beginner',
          availability: doc.availability || 'remote',
          avatar: doc.avatar || 'https://picsum.photos/seed/default/200',
          bio: doc.bio || 'This tutor has not provided a bio yet.',
        }));
        setTutors(fetchedTutors);
      } catch (err) {
        console.error('Failed to fetch tutors for preview:', err);
        setError('Failed to load tutors.');
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  if (loading) return <div className="text-center py-10 text-primary-text">Loading tutors...</div>;
  if (error) return <div className="text-center py-10 text-error">{error}</div>;
  if (tutors.length === 0) return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="font-unica-one text-4xl md:text-5xl font-bold text-primary-text mb-6">
          Connect with Expert Igbo Tutors
        </h2>
        <p className="text-lg text-secondary-text mb-8 leading-relaxed">
          No tutors found at the moment. Check back later or explore our services.
        </p>
        <Button variant="primary" onClick={() => onNavigate({ page: 'tutors' })}>Browse All Tutors</Button>
      </div>
    </section>
  );

  return (
    <section id="tutors" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="font-unica-one text-4xl md:text-5xl font-bold text-primary-text mb-6">
              Connect with Expert Igbo Tutors
            </h2>
            <p className="text-lg text-secondary-text mb-8 leading-relaxed">
              Find the perfect tutor to guide you on your language journey. Browse profiles, filter by location for in-person sessions, and book lessons directly through our secure platform.
            </p>
            <Button variant="primary" onClick={() => onNavigate({ page: 'tutors' })}>Browse All Tutors</Button>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="space-y-4">
              {tutors.map((tutor) => (
                <div key={tutor.$id} className="flex items-center bg-light-lavender p-4 rounded-lg shadow-sm">
                  <img
                    src={tutor.avatar}
                    alt={tutor.name}
                    className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-accent-primary"
                  />
                  <div>
                    <h4 className="font-bold text-lg text-primary-text">{tutor.name}</h4>
                    <p className="text-sm text-accent-primary font-semibold">{tutor.location}</p>
                    <p className="text-sm text-secondary-text mt-1 line-clamp-2">{tutor.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tutors;