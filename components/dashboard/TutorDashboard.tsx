import React, { useState, useEffect } from 'react';
import Button from '../Button';
import StatCard from './StatCard';
import { ServiceRequest } from '../../data/mockData';
import { databases, dbId, serviceRequestsCollectionId } from '../../lib/appwrite';
import { AppwriteException } from 'appwrite';
import { useChat } from '../ChatProvider'; // NEW: Import useChat hook

interface TutorDashboardProps {
    tutorRequests: ServiceRequest[];
    onNavigateToSettings: () => void;
    onStatusChange: (requestId: string, newStatus: ServiceRequest['status']) => void;
    onOpenChat: () => void; // NEW: Prop to open the chat panel
}

const TutorDashboard: React.FC<TutorDashboardProps> = ({ tutorRequests, onNavigateToSettings, onStatusChange, onOpenChat }) => {
    const newBookingRequests = tutorRequests.filter(req => req.status === 'Pending');
    const activeAssignments = tutorRequests.filter(req => req.status === 'In Progress');
    const completedAssignments = tutorRequests.filter(req => req.status === 'Completed');

    const { createChat, openChatByServiceRequest, currentUser } = useChat(); // NEW: Use chat context

    // NEW: Handle accepting a job and creating a chat
    const handleAcceptJob = async (req: ServiceRequest) => {
      await onStatusChange(req.$id, 'In Progress');
      if (req.client_appwrite_id && currentUser) {
        // Automatically open chat with client if not already open/created
        openChatByServiceRequest(req.client_appwrite_id, req.clientName, req.$id);
      }
    };

    const handleChatWithClient = async (req: ServiceRequest) => {
      if (req.client_appwrite_id && currentUser) {
        // Open chat with client
        openChatByServiceRequest(req.client_appwrite_id, req.clientName, req.$id);
      }
    };

    const getStatusChipClasses = (status: ServiceRequest['status']) => {
        switch(status) {
            case 'Completed': return 'bg-igbo-leaf-green text-white';
            case 'In Progress': return 'bg-blue-500 text-white';
            case 'Pending': return 'bg-yellow-500 text-white';
            case 'Cancelled': return 'bg-error text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-primary-text mb-6">Tutor & Provider Hub</h2>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="New Requests" value={newBookingRequests.length} description="Awaiting confirmation" variant={newBookingRequests.length > 0 ? 'warning' : 'default'} />
                <StatCard title="Active Assignments" value={activeAssignments.length} description="Currently working on" />
                <StatCard title="Completed Jobs" value={completedAssignments.length} description="Successfully finished" variant="success" />
            </div>

            {/* New Booking Requests */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h3 className="text-xl font-bold font-unica-one text-primary-text mb-4">New Booking Requests</h3>
                 {newBookingRequests.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-soft-gray">
                                    <th className="p-2 text-primary-text">Client Name</th>
                                    <th className="p-2 text-primary-text">Service</th>
                                    <th className="p-2 text-primary-text">Requested Date</th>
                                    <th className="p-2 text-primary-text">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newBookingRequests.map(req => (
                                    <tr key={req.$id} className="border-b border-soft-gray hover:bg-light-lavender/50">
                                        <td className="p-2 font-bold text-secondary-text">{req.clientName}</td>
                                        <td className="p-2 text-secondary-text">{req.service}</td>
                                        <td className="p-2 space-x-2">
                                            <Button variant="primary" className="px-3 py-1 text-sm" onClick={() => handleAcceptJob(req)}>Accept</Button>
                                            <Button variant="secondary" className="px-3 py-1 text-sm" onClick={() => onStatusChange(req.$id, 'Cancelled')}>Decline</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 ) : (
                    <p className="text-secondary-text text-center py-4">No new booking requests at this time.</p>
                 )}
            </div>

            {/* Active Assignments */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h3 className="text-xl font-bold font-unica-one text-primary-text mb-4">My Active Assignments</h3>
                 {activeAssignments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-soft-gray">
                                    <th className="p-2 text-primary-text">Client Name</th>
                                    <th className="p-2 text-primary-text">Service</th>
                                    <th className="p-2 text-primary-text">Status</th>
                                    <th className="p-2 text-primary-text">Deadline</th>
                                    <th className="p-2 text-primary-text">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeAssignments.map(req => (
                                    <tr key={req.$id} className="border-b border-soft-gray hover:bg-light-lavender/50">
                                        <td className="p-2 font-bold text-secondary-text">{req.clientName}</td>
                                        <td className="p-2 text-secondary-text">{req.service}</td>
                                        <td className="p-2">
                                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusChipClasses(req.status)}`}>{req.status}</span>
                                        </td>
                                        <td className="p-2 text-secondary-text">{req.deadline || 'N/A'}</td>
                                        <td className="p-2 space-x-2">
                                            <Button variant="primary" className="px-3 py-1 text-sm" onClick={() => onStatusChange(req.$id, 'Completed')}>Mark Completed</Button>
                                            <Button variant="secondary" className="px-3 py-1 text-sm" onClick={() => handleChatWithClient(req)}>Chat</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 ) : (
                    <p className="text-secondary-text text-center py-4">No active assignments.</p>
                 )}
            </div>

             {/* Profile Management */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                 <h3 className="text-xl font-bold font-unica-one text-primary-text mb-4">Manage Your Profile</h3>
                 <p className="text-secondary-text mb-4">Keep your profile updated to attract more students and clients. Make sure your availability is current.</p>
                 <Button onClick={onNavigateToSettings}>Edit My Public Profile</Button>
            </div>
        </div>
    );
};

export default TutorDashboard;