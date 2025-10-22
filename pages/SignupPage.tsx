import React, { useState } from 'react';
import Button from '../components/Button';
import { User } from '../data/mockData';
import { account, databases, usersCollectionId, dbId } from '../lib/appwrite';
import { ID, AppwriteException } from 'appwrite';

interface SignupPageProps {
  onLogin: (appwriteUserId: string) => void;
  onNavigate: (page: 'login' | 'home') => void;
}

const interestOptions = [
  'Request a Language Service',
  'Find a Tutor',
  'Become a Tutor',
  'Become a Service Provider',
  'Explore Igbo Culture'
];

const SignupPage: React.FC<SignupPageProps> = ({ onLogin, onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInterestChange = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Determine initial role and status
    const isProvider = interests.includes('Become a Tutor') || interests.includes('Become a Service Provider');
    const role: User['role'] = isProvider ? 'Service Provider' : 'Client';
    const status: User['status'] = isProvider ? 'Pending Verification' : 'Active';

    try {
      // 1. Create Appwrite Auth user
      const appwriteUser = await account.create(
        ID.unique(),
        email,
        password,
        name
      );

      // 2. Create email session (logs the user in immediately)
      // Fix: Use createEmailPasswordSession for email/password login
      await account.createEmailPasswordSession(email, password);

      // 3. Create custom user_profile document
      await databases.createDocument(
        dbId,
        usersCollectionId,
        ID.unique(),
        {
          appwrite_user_id: appwriteUser.$id,
          name,
          email,
          role,
          interests: interests.join(', '), // Convert array to comma-separated string
          status,
          joined: new Date().toISOString().split('T')[0],
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=9B5DE5&color=FFFFFF`, // Generate avatar
          // Optional fields can be set as empty strings or null
          bio: '',
          location: '',
          specialty: 'Beginner',
        }
      );

      onLogin(appwriteUser.$id); // Notify App that user is logged in
    } catch (err) {
      console.error('Signup failed:', err);
       if (err instanceof AppwriteException) {
              setError(err.message);
            } else {
              setError('An unexpected error occurred during signup.');
            }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-20 flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto">
        <div className="bg-light-lavender/50 p-8 rounded-xl shadow-2xl border border-soft-gray">
          <h1 className="font-unica-one text-4xl text-center font-bold text-primary-text mb-2">Create Your Account</h1>
          <p className="text-center text-secondary-text mb-8">Join our community to connect and grow.</p>
          
          {error && (
            <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg mb-6 text-center">
                {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-secondary-text mb-2">Full Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-input-bg border border-soft-gray rounded-lg focus:ring-accent-primary focus:border-accent-primary text-primary-text" placeholder="Adaeze Nwosu" required disabled={loading} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-secondary-text mb-2">Email Address</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-input-bg border border-soft-gray rounded-lg focus:ring-accent-primary focus:border-accent-primary text-primary-text" placeholder="you@example.com" required disabled={loading} />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-secondary-text mb-2">Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-input-bg border border-soft-gray rounded-lg focus:ring-accent-primary focus:border-accent-primary text-primary-text" placeholder="Minimum 8 characters" required disabled={loading} />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-secondary-text mb-3">What are you here for?</label>
              <div className="space-y-2">
                {interestOptions.map(interest => (
                  <label key={interest} className="flex items-center p-3 bg-input-bg border border-soft-gray rounded-lg cursor-pointer hover:bg-accent-primary/10 max-w-sm">
                    <input 
                      type="checkbox" 
                      className="h-5 w-5 rounded border-gray-300 text-accent-primary focus:ring-accent-primary"
                      checked={interests.includes(interest)}
                      onChange={() => handleInterestChange(interest)}
                      disabled={loading}
                    />
                    <span className="ml-3 text-secondary-text">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="text-center">
              {/* Fix: Added disabled prop */}
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </form>
          <p className="text-center text-secondary-text mt-6">
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} className="font-bold text-accent-primary hover:text-accent-hover" disabled={loading}>
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;