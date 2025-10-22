import React, { useState, useMemo, useEffect } from 'react';
import TutorCard from '../components/TutorCard';
import { Route } from '../App';
import { Tutor } from '../data/mockData';
import { databases, dbId, usersCollectionId } from '../lib/appwrite';
import { Query } from 'appwrite';

interface TutorsPageProps {
    onNavigate: (route: Route) => void;
}

const TutorsPage: React.FC<TutorsPageProps> = ({ onNavigate }) => {
    const [allTutors, setAllTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [locationFilter, setLocationFilter] = useState('all');
    const [specialtyFilter, setSpecialtyFilter] = useState('all');

    useEffect(() => {
        const fetchAllTutors = async () => {
            setLoading(true);
            setError(null);
            try {
        // Query for verified OR active Service Providers who opted into tutoring
        const response = await databases.listDocuments(
          dbId,
          usersCollectionId,
          [
            Query.equal('role', 'Service Provider'),
            Query.limit(100) // Adjust limit as needed
          ]
        );
        
        // Filter for Active or Verified status AND "Become a Tutor" interest
        const providerDocs = response.documents.filter((doc: any) => {
          const hasValidStatus = doc.status === 'Verified' || doc.status === 'Active';
          const hasTutorInterest = (doc.interests || '').includes('Become a Tutor');
          return hasValidStatus && hasTutorInterest;
        });
        
        console.log('Total Service Providers:', response.documents.length);
        console.log('Service Providers (Active or Verified) with "Become a Tutor":', providerDocs.length);
        console.log('Tutor data:', providerDocs.map(doc => ({
          name: doc.name,
          role: doc.role,
          status: doc.status,
          interests: doc.interests
        })));
        
        const fetchedTutors: Tutor[] = providerDocs.map((doc: any) => ({
          $id: doc.$id,
          appwrite_user_id: doc.appwrite_user_id,
          name: doc.name,
          location: doc.location || 'Remote',
          specialty: doc.specialty || 'Beginner',
          availability: doc.availability || 'remote',
          avatar: doc.avatar || 'https://picsum.photos/seed/default/200',
          bio: doc.bio || 'This tutor has not provided a bio yet.',
        }));
                setAllTutors(fetchedTutors);
            } catch (err) {
                console.error('Failed to fetch all tutors:', err);
                setError('Failed to load tutors.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllTutors();
    }, []);

    const filteredTutors = useMemo(() => {
        return allTutors.filter(tutor => {
            const locationMatch = locationFilter === 'all' || tutor.availability === locationFilter;
            const specialtyMatch = specialtyFilter === 'all' || (tutor.specialty && tutor.specialty.toLowerCase() === specialtyFilter);
            return locationMatch && specialtyMatch;
        });
    }, [allTutors, locationFilter, specialtyFilter]);

  if (loading) return <div className="text-center py-10 text-primary-text">Loading tutors...</div>;
  if (error) return <div className="text-center py-10 text-error">{error}</div>;

  return (
    <div className="bg-white min-h-screen">
      <header className="bg-light-lavender py-16 text-center">
        <div className="container mx-auto px-6">
          <h1 className="font-unica-one text-5xl md:text-6xl font-bold text-primary-text">Find Your Igbo Tutor</h1>
          <p className="mt-4 text-lg max-w-3xl mx-auto text-secondary-text">
            Browse our community of expert tutors. Filter by location and specialty to find the perfect match for your learning style.
          </p>
        </div>
      </header>

      <section className="py-12">
        <div className="container mx-auto px-6">
          {/* Filter Controls */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-10 flex flex-col sm:flex-row gap-4 items-center">
            <h3 className="font-bold text-lg text-primary-text">Filter by:</h3>
            <div className="flex-grow flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <select 
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-4 py-2 bg-input-bg border border-soft-gray rounded-lg focus:ring-accent-primary focus:border-accent-primary text-secondary-text"
              >
                <option value="all">All Locations (Remote & In-person)</option>
                <option value="remote">Remote Only</option>
                <option value="in-person">In-person Only</option>
              </select>
              <select 
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="w-full px-4 py-2 bg-input-bg border border-soft-gray rounded-lg focus:ring-accent-primary focus:border-accent-primary text-secondary-text"
              >
                <option value="all">All Specialties</option>
                <option value="beginner">Beginner</option>
                <option value="conversational">Conversational</option>
                <option value="advanced">Advanced</option>
                <option value="children">Children</option>
                <option value="business">Business</option>
              </select>
            </div>
          </div>

          {/* Tutors Grid */}
          {filteredTutors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredTutors.map((tutor) => (
                    <TutorCard key={tutor.$id} tutor={tutor} onNavigate={onNavigate} />
                ))}
            </div>
          ) : (
             <div className="text-center py-16">
                <h3 className="text-2xl font-bold text-primary-text">No Tutors Found</h3>
                <p className="text-secondary-text mt-2">Try adjusting your filters to find more tutors.</p>
             </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TutorsPage;