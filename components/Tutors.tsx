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
  <section className="relative py-14 md:py-18">
      <div className="container mx-auto px-6 text-center">
        <h2 className="font-unica-one text-4xl md:text-5xl font-bold text-primary-text mb-6">
          Connect with Expert Igbo Tutors
        </h2>
        <p className="text-lg text-secondary-text/80 mb-8 leading-relaxed">
          No tutors found at the moment. Check back later or explore our services.
        </p>
        <Button variant="primary" onClick={() => onNavigate({ page: 'tutors' })}>Browse All Tutors</Button>
      </div>
    </section>
  );

  return (
  <section id="tutors" className="relative py-14 md:py-18">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-10 right-[18%] h-64 w-64 rounded-full bg-accent-primary/25 blur-3xl opacity-60 animate-[float_16s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 left-[12%] h-72 w-72 rounded-full bg-igbo-leaf-green/20 blur-3xl opacity-60 animate-[float_20s_ease-in-out_infinite]" />
      </div>
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 rounded-[32px] border border-white/50 bg-white/60 p-10 shadow-[0_35px_80px_-32px_rgba(15,23,42,0.65)] backdrop-blur-2xl">
          <div className="lg:w-1/2 text-center lg:text-left">
            <span className="inline-flex items-center rounded-full border border-white/60 bg-white/50 px-4 py-1 text-sm font-semibold text-accent-primary backdrop-blur-xl">
              Community Experts
            </span>
            <h2 className="font-unica-one text-4xl md:text-5xl font-bold text-primary-text mb-6 mt-6">
              Connect with Expert Igbo Tutors
            </h2>
            <p className="text-lg text-secondary-text/85 mb-8 leading-relaxed">
              Find the perfect tutor to guide you on your language journey. Browse profiles, filter by location for in-person sessions, and book lessons directly through our secure platform.
            </p>
            <Button variant="primary" onClick={() => onNavigate({ page: 'tutors' })}>Browse All Tutors</Button>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="space-y-5">
              {tutors.map((tutor) => (
                <div key={tutor.$id} className="flex items-center gap-4 rounded-2xl border border-white/50 bg-white/70 p-4 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.55)] backdrop-blur-xl transition-transform duration-500 hover:-translate-y-1">
                  <img
                    src={tutor.avatar}
                    alt={tutor.name}
                    className="w-16 h-16 rounded-full object-cover border-[3px] border-accent-primary/70 shadow-[0_12px_32px_-22px_rgba(155,93,229,0.7)]"
                  />
                  <div>
                    <h4 className="font-bold text-lg text-primary-text">{tutor.name}</h4>
                    <p className="text-sm text-accent-primary font-semibold">{tutor.location}</p>
                    <p className="text-sm text-secondary-text/80 mt-1 line-clamp-2">{tutor.bio}</p>
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