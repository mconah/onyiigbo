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
  const [role, setRole] = useState<'Client' | 'Service Provider' | 'Admin'>('Client');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get available interests based on selected role
  const getInterestOptionsForRole = (userRole: 'Client' | 'Service Provider' | 'Admin'): string[] => {
    if (userRole === 'Admin') {
      return interestOptions; // All interests
    } else if (userRole === 'Service Provider') {
      return ['Become a Tutor', 'Become a Service Provider', 'Explore Igbo Culture'];
    } else {
      return ['Request a Language Service', 'Find a Tutor', 'Explore Igbo Culture'];
    }
  };

  const availableInterests = getInterestOptionsForRole(role);

  const handleInterestChange = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  // When role changes, reset interests to valid ones for new role
  const handleRoleChange = (newRole: 'Client' | 'Service Provider' | 'Admin') => {
    setRole(newRole);
    const newAvailableInterests = getInterestOptionsForRole(newRole);
    // Keep only interests that are valid for the new role
    setSelectedInterests(prev => prev.filter(i => newAvailableInterests.includes(i)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Determine initial role and status based on selected role
    const isProvider = role === 'Service Provider';
    const userRole: User['role'] = role;
    const status: User['status'] = role === 'Service Provider' ? 'Pending Verification' : (role === 'Admin' ? 'Verified' : 'Active');
    
    // Convert selected interests to comma-separated string
    const interestsString = role === 'Admin' ? interestOptions.join(', ') : selectedInterests.join(', ');    try {
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
          role: userRole,
          interests: interestsString,
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
              <label className="block text-sm font-bold text-secondary-text mb-3">Select your role</label>
              <div className="space-y-2">
                <label className="flex items-center p-3 bg-input-bg border border-soft-gray rounded-lg cursor-pointer hover:bg-accent-primary/10 max-w-sm">
                  <input type="radio" name="role" value="Client" checked={role === 'Client'} onChange={() => handleRoleChange('Client')} disabled={loading} className="h-5 w-5 text-accent-primary focus:ring-accent-primary" />
                  <span className="ml-3 text-secondary-text">Client</span>
                </label>
                <label className="flex items-center p-3 bg-input-bg border border-soft-gray rounded-lg cursor-pointer hover:bg-accent-primary/10 max-w-sm">
                  <input type="radio" name="role" value="Service Provider" checked={role === 'Service Provider'} onChange={() => handleRoleChange('Service Provider')} disabled={loading} className="h-5 w-5 text-accent-primary focus:ring-accent-primary" />
                  <span className="ml-3 text-secondary-text">Service Provider</span>
                </label>
                <label className="flex items-center p-3 bg-input-bg border border-soft-gray rounded-lg cursor-pointer hover:bg-accent-primary/10 max-w-sm">
                  <input type="radio" name="role" value="Admin" checked={role === 'Admin'} onChange={() => handleRoleChange('Admin')} disabled={loading} className="h-5 w-5 text-accent-primary focus:ring-accent-primary" />
                  <span className="ml-3 text-secondary-text">Admin</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-secondary-text mb-3">
                What are you interested in?
                {role === 'Admin' && <span className="text-xs font-normal ml-2">(All interests auto-selected for admins)</span>}
              </label>
              <div className="space-y-2">
                {availableInterests.map(interest => (
                  <label key={interest} className="flex items-center p-3 bg-input-bg border border-soft-gray rounded-lg cursor-pointer hover:bg-accent-primary/10 max-w-sm">
                    <input 
                      type="checkbox" 
                      className="h-5 w-5 rounded border-gray-300 text-accent-primary focus:ring-accent-primary"
                      checked={role === 'Admin' || selectedInterests.includes(interest)}
                      onChange={() => handleInterestChange(interest)}
                      disabled={loading || role === 'Admin'}
                    />
                    <span className="ml-3 text-secondary-text">{interest}</span>
                  </label>
                ))}
              </div>
              {role === 'Service Provider' && selectedInterests.includes('Become a Tutor') && (
                <p className="text-sm text-igbo-leaf-green mt-3 bg-igbo-leaf-green/10 p-3 rounded-lg border border-igbo-leaf-green">
                  ✓ You'll appear on the Tutors page once verified!
                </p>
              )}
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