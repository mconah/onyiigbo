import React, { useState } from 'react';
import Button from '../Button';
import { ServiceRequest, User } from '../../data/mockData';

interface AssignJobModalProps {
  job: ServiceRequest;
  providers: User[]; // List of potential tutors/service providers
  onAssign: (jobId: string, providerAppwriteId: string) => void;
  onClose: () => void;
}

const AssignJobModal: React.FC<AssignJobModalProps> = ({ job, providers, onAssign, onClose }) => {
  const [selectedProviderAppwriteId, setSelectedProviderAppwriteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProviderAppwriteId) {
      setLoading(true);
      await onAssign(job.$id, selectedProviderAppwriteId);
      setLoading(false);
    } else {
      alert('Please select a provider to assign this job.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
        <h2 className="font-unica-one text-2xl font-bold text-primary-text mb-4">Assign Job: {job.service}</h2>
        <p className="text-secondary-text mb-4">
          Client: <span className="font-bold text-primary-text">{job.clientName}</span>
        </p>
        <p className="text-secondary-text mb-6">
          Description: <span className="italic text-primary-text">{job.description}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="provider" className="block text-sm font-bold text-secondary-text mb-2">Select Provider</label>
            <select
              id="provider"
              className="w-full px-4 py-2 bg-input-bg border border-soft-gray rounded-lg focus:ring-accent-primary focus:border-accent-primary text-primary-text"
              value={selectedProviderAppwriteId || ''}
              onChange={(e) => setSelectedProviderAppwriteId(e.target.value)}
              required
              disabled={loading}
            >
              <option value="" disabled>-- Select a Verified Provider --</option>
              {providers.map(provider => (
                <option key={provider.$id} value={provider.appwrite_user_id}>
                  {provider.name} ({provider.role})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Assigning...' : 'Assign Job'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignJobModal;