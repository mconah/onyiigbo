import React, { useState } from 'react';
import { User } from '../../data/mockData'; // Import User from mockData
import Button from '../Button';
import { databases, dbId, usersCollectionId } from '../../lib/appwrite';
import { AppwriteException } from 'appwrite';

interface SettingsPanelProps {
  user: User;
  setUser: (updatedUser: User) => void; // Changed type for consistency
}

// Define interest options based on role
const getInterestOptionsForRole = (role: User['role']): string[] => {
  if (role === 'Admin') {
    // Admins can select all interests
    return [
      'Request a Language Service',
      'Find a Tutor',
      'Become a Tutor',
      'Become a Service Provider',
      'Explore Igbo Culture'
    ];
  } else if (role === 'Service Provider') {
    // Service providers can choose what services they offer
    return [
      'Become a Tutor',
      'Become a Service Provider',
      'Explore Igbo Culture'
    ];
  } else {
    // Clients can select what they want to do
    return [
      'Request a Language Service',
      'Find a Tutor',
      'Explore Igbo Culture'
    ];
  }
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({ user, setUser }) => {
  const [name, setName] = useState(user.name);
  // Convert comma-separated string to array for UI
  const [interests, setInterests] = useState<string[]>(
    user.interests ? user.interests.split(', ').filter(i => i.trim()) : []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Get available interests based on user role
  const availableInterests = getInterestOptionsForRole(user.role);

  const handleInterestChange = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Convert interests array back to comma-separated string for storage
    const interestsString = interests.join(', ');
    
    try {
      const updatedDoc = await databases.updateDocument(
        dbId,
        usersCollectionId,
        user.$id,
        {
          name,
          interests: interestsString,
        }
      );
      
      const updatedUser: User = {
        ...user,
        name: updatedDoc.name,
        interests: updatedDoc.interests,
      };
      setUser(updatedUser);
      setSuccess('Changes saved successfully!');
    } catch (err) {
      console.error('Error saving changes:', err);
      if (err instanceof AppwriteException) {
          setError(err.message);
      } else {
          setError('An unexpected error occurred while saving changes.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-primary-text mb-6">Settings</h2>
      <div className="bg-white p-8 rounded-lg shadow-sm space-y-8">
        {error && (
            <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg mb-6 text-center text-secondary-text">
                {error}
            </div>
        )}
        {success && (
            <div className="bg-success/10 border border-success text-success px-4 py-3 rounded-lg mb-6 text-center text-igbo-leaf-green">
                {success}
            </div>
        )}

        <div>
          <h3 className="text-xl font-bold font-unica-one text-primary-text mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-secondary-text mb-2">Full Name</label>
              <input 
                type="text" 
                id="name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full max-w-sm px-4 py-2 bg-input-bg border border-soft-gray rounded-lg text-primary-text focus:ring-accent-primary focus:border-accent-primary" 
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-secondary-text mb-2">Email Address</label>
              <input type="email" id="email" value={user.email} disabled className="w-full max-w-sm px-4 py-2 bg-gray-200 border border-soft-gray rounded-lg cursor-not-allowed text-secondary-text" />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-unica-one text-xl font-bold text-primary-text mb-4">My Interests</h3>
          <p className="text-secondary-text mb-4">
            Select what you'd like to do on OnyiIgbo. 
            {user.role === 'Admin' && ' As an admin, you have access to all interests.'}
            {user.role === 'Service Provider' && ' Choose the services you want to offer.'}
            {user.role === 'Client' && ' Choose what you want to explore.'}
          </p>
          <div className="space-y-2">
            {availableInterests.map(interest => (
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
          {user.role === 'Service Provider' && interests.includes('Become a Tutor') && (
            <p className="text-sm text-igbo-leaf-green mt-3 bg-igbo-leaf-green/10 p-3 rounded-lg border border-igbo-leaf-green">
              ✓ You'll appear on the Tutors page once your account is verified.
            </p>
          )}
        </div>
        
        <div>
          {/* Fix: Added disabled prop */}
          <Button onClick={handleSaveChanges} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;