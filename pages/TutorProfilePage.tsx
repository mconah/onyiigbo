import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import { Tutor } from '../data/mockData'; // Import Tutor interface
import { databases, dbId, usersCollectionId } from '../lib/appwrite';
import { AppwriteException } from 'appwrite';
import { useChat } from '../components/ChatProvider'; // NEW: Import useChat hook
import { Route } from '../App'; // NEW: Import Route

interface TutorProfilePageProps {
  tutorId: string; // Changed to string for Appwrite $id
}

const TutorProfilePage: React.FC<TutorProfilePageProps> = ({ tutorId }) => {
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { createChat, openChatById, currentUser, navigate } = useChat(); // NEW: Use chat context

  useEffect(() => {
    const fetchTutor = async () => {
      setLoading(true);
      setError(null);
      try {
        const doc = await databases.getDocument(
          dbId,
          usersCollectionId,
          tutorId
        );
        setTutor({
          $id: doc.$id,
          name: doc.name,
          location: doc.location || 'Remote',
          specialty: doc.specialty || 'Beginner',
          availability: doc.availability || 'remote',
          avatar: doc.avatar || 'https://picsum.photos/seed/default/200',
          bio: doc.bio || 'This tutor has not provided a bio yet. They are passionate about teaching Igbo language and culture.',
        } as Tutor); // Cast to Tutor type
      } catch (err) {
        console.error('Failed to fetch tutor profile:', err);
        if (err instanceof AppwriteException) {
            setError(err.message);
        } else {
            setError('Failed to load tutor profile.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTutor();
  }, [tutorId]);

  // NEW: Handle initiating chat
  const handleInitiateChat = async () => {
    if (!currentUser) {
      navigate({ page: 'login' });
      return;
    }
    if (currentUser.appwrite_user_id === tutor?.appwrite_user_id) {
      alert("You cannot chat with yourself!");
      return;
    }
    if (tutor) {
      const chatId = await createChat(tutor.appwrite_user_id, tutor.name);
      if (chatId) {
        openChatById(chatId);
      }
    }
  };


  if (loading) return <div className="text-center py-10 text-primary-text">Loading tutor profile...</div>;
  if (error) return <div className="text-center py-10 text-error">{error}</div>;
  if (!tutor) return <div className="text-center py-10 text-secondary-text">Tutor not found.</div>;

  return (
    <div className="bg-white">
      <header className="bg-light-lavender py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img 
              src={tutor.avatar} 
              alt={tutor.name}
              className="w-40 h-40 rounded-full object-cover border-8 border-white shadow-lg"
            />
            <div>
              <h1 className="font-unica-one text-5xl font-bold text-primary-text">{tutor.name}</h1>
              <p className="text-xl text-accent-primary font-semibold">{tutor.location}</p>
              <div className="mt-4 flex gap-2">
                 <span className="inline-block bg-accent-primary/10 text-accent-primary text-sm font-semibold mr-2 px-3 py-1 rounded-full">
                    {tutor.specialty}
                </span>
                <span className={`inline-block text-sm font-semibold mr-2 px-3 py-1 rounded-full ${tutor.availability === 'remote' ? 'bg-blue-100 text-blue-800' : 'bg-igbo-leaf-green text-white'}`}>
                    {tutor.availability === 'remote' ? 'Remote Tutoring' : 'In-person Tutoring'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <section className="py-20">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="md:col-span-2">
            <h2 className="font-unica-one text-3xl font-bold text-primary-text mb-4">About Me</h2>
            <div className="prose lg:prose-lg text-secondary-text max-w-none">
              <p>{tutor.bio}</p>
              <p>Whether you're starting from scratch or looking to perfect your fluency, I tailor my lessons to your specific goals. My approach is interactive and immersive, focusing on building a strong foundation in grammar while encouraging confident conversation. I look forward to helping you on your Igbo language journey!</p>
            </div>
            
            <h2 className="font-unica-one text-3xl font-bold text-primary-text mt-12 mb-4">Services Offered</h2>
            <ul className="list-disc list-inside space-y-2 text-secondary-text text-lg">
                <li>One-on-One Tutoring ({tutor.availability === 'remote' ? 'Remote' : 'In-person'})</li>
                <li>Group Classes for Beginners</li>
                <li>Conversational Practice Sessions</li>
                <li>Exam Preparation (for language proficiency tests)</li>
            </ul>
          </div>
          
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-light-lavender/60 p-6 rounded-lg shadow-lg border border-soft-gray">
              <h3 className="font-unica-one text-2xl font-bold text-primary-text mb-4">Book a Session</h3>
              <p className="text-secondary-text mb-6">Ready to start learning? Schedule an introductory session with {tutor.name} today!</p>
              <Button className="w-full">Request a Booking</Button>
              {currentUser && currentUser.appwrite_user_id !== tutor.appwrite_user_id && (
                <Button className="w-full mt-4" variant="secondary" onClick={handleInitiateChat}>Chat with {tutor.name}</Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TutorProfilePage;