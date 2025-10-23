import React, { useState } from 'react';
import Button from '../components/Button';
import { Route } from '../App';
import { User } from '../data/mockData';
import { databases, dbId, serviceRequestsCollectionId } from '../lib/appwrite';
import { ID, AppwriteException } from 'appwrite';

interface RequestServicePageProps {
  user: User | null;
  onNavigate: (route: Route) => void;
}

const serviceOptions = [
  'Translation',
  'Transcription',
  'Voice Over',
  'Proofreading & Editing',
  'Tutoring',
  'Other'
];

const RequestServicePage: React.FC<RequestServicePageProps> = ({ user, onNavigate }) => {
  const [serviceType, setServiceType] = useState('Translation');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please log in to request a service');
      setTimeout(() => onNavigate('login'), 2000);
      return;
    }

    if (!description.trim()) {
      setError('Please provide project details');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await databases.createDocument(
        dbId,
        serviceRequestsCollectionId,
        ID.unique(),
        {
          service_type: serviceType,
          client_appwrite_id: user.appwrite_user_id,
          client_name: user.name,
          description: description.trim(),
          budget: budget || 'Not specified',
          deadline: deadline || 'Flexible',
          status: 'Pending',
          date_requested: new Date().toISOString().split('T')[0],
          assigned_provider_appwrite_id: null
        }
      );

      setSuccess(true);
      setDescription('');
      setBudget('');
      setDeadline('');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => onNavigate('dashboard'), 2000);
    } catch (err) {
      console.error('Failed to submit service request:', err);
      if (err instanceof AppwriteException) {
        setError(err.message);
      } else {
        setError('Failed to submit request. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-light-lavender/30 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-br from-accent-primary to-igbo-purple py-16 text-center">
        <div className="container mx-auto px-6">
          <h1 className="font-unica-one text-5xl md:text-6xl font-bold text-white mb-4">
            Request a Service
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Tell us about your project and we'll connect you with the perfect expert
          </p>
        </div>
      </header>

      {/* Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-3xl">
          {success ? (
            <div className="bg-white p-12 rounded-2xl shadow-xl text-center">
              <div className="w-20 h-20 bg-igbo-leaf-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">✓</span>
              </div>
              <h2 className="text-3xl font-bold text-primary-text mb-4">Request Submitted!</h2>
              <p className="text-lg text-secondary-text mb-6">
                We've received your request. Our team will review it and match you with an expert shortly.
              </p>
              <p className="text-secondary-text">
                Redirecting to your dashboard...
              </p>
            </div>
          ) : (
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl">
              {error && (
                <div className="bg-error/10 border-l-4 border-error text-error px-6 py-4 rounded-lg mb-6">
                  <p className="font-bold">Error</p>
                  <p>{error}</p>
                </div>
              )}

              {!user && (
                <div className="bg-accent-primary/10 border-l-4 border-accent-primary text-accent-primary px-6 py-4 rounded-lg mb-6">
                  <p className="font-bold">Login Required</p>
                  <p>You must be logged in to request a service.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Type */}
                <div>
                  <label htmlFor="service-type" className="block text-sm font-bold text-secondary-text mb-3">
                    What service do you need? <span className="text-error">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {serviceOptions.map((service) => (
                      <label
                        key={service}
                        className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          serviceType === service
                            ? 'border-accent-primary bg-accent-primary/10'
                            : 'border-soft-gray hover:border-accent-primary/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="service"
                          value={service}
                          checked={serviceType === service}
                          onChange={(e) => setServiceType(e.target.value)}
                          className="sr-only"
                          disabled={loading}
                        />
                        <span className={`text-sm font-medium ${
                          serviceType === service ? 'text-accent-primary' : 'text-secondary-text'
                        }`}>
                          {service}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <label htmlFor="description" className="block text-sm font-bold text-secondary-text mb-3">
                    Project Details <span className="text-error">*</span>
                  </label>
                  <textarea
                    id="description"
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-input-bg border border-soft-gray rounded-lg focus:ring-accent-primary focus:border-accent-primary text-primary-text resize-none"
                    placeholder="Describe your project, requirements, expected deliverables, etc."
                    required
                    disabled={loading || !user}
                  />
                  <p className="text-xs text-secondary-text mt-2">
                    Be as specific as possible to help us match you with the right expert
                  </p>
                </div>

                {/* Budget & Deadline Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Budget */}
                  <div>
                    <label htmlFor="budget" className="block text-sm font-bold text-secondary-text mb-3">
                      Budget (Optional)
                    </label>
                    <input
                      type="text"
                      id="budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full px-4 py-3 bg-input-bg border border-soft-gray rounded-lg focus:ring-accent-primary focus:border-accent-primary text-primary-text"
                      placeholder="e.g. $500 - $1000"
                      disabled={loading || !user}
                    />
                  </div>

                  {/* Deadline */}
                  <div>
                    <label htmlFor="deadline" className="block text-sm font-bold text-secondary-text mb-3">
                      Deadline (Optional)
                    </label>
                    <input
                      type="text"
                      id="deadline"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-4 py-3 bg-input-bg border border-soft-gray rounded-lg focus:ring-accent-primary focus:border-accent-primary text-primary-text"
                      placeholder="e.g. 2 weeks, ASAP, etc."
                      disabled={loading || !user}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => onNavigate('services')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    disabled={loading || !user}
                  >
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </div>
              </form>

              {user && (
                <div className="mt-8 p-4 bg-light-lavender/50 rounded-lg border border-soft-gray">
                  <p className="text-sm text-secondary-text">
                    <span className="font-bold">What happens next?</span> Our team will review your request and match you with a qualified expert. You'll be notified via email and can track progress in your dashboard.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default RequestServicePage;
