import React, { useState } from 'react';
import Button from '../Button';
import { User } from '../../data/mockData';

interface VerificationModalProps {
  user: User;
  onConfirm: () => void;
  onClose: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ user, onConfirm, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="font-unica-one text-2xl font-bold text-primary-text mb-4">Verify User: {user.name}</h2>
        <p className="text-secondary-text mb-6">
          Are you sure you want to verify this user? Verifying will change their status to 'Verified' and grant them full access as a {user.role}.
        </p>
        <div className="space-y-2 mb-6">
          <p className="text-secondary-text"><span className="font-bold">Name:</span> {user.name}</p>
          <p className="text-secondary-text"><span className="font-bold">Email:</span> {user.email}</p>
          <p className="text-secondary-text"><span className="font-bold">Role:</span> {user.role}</p>
          <p className="text-secondary-text"><span className="font-bold">Current Status:</span> {user.status}</p>
        </div>
        <div className="flex justify-end space-x-4">
          <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="primary" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Verifying...' : 'Confirm Verification'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;