import React, { useState } from 'react';
import Button from '../Button';
import { Route } from '../../App';
import { ServiceRequest } from '../../data/mockData';
import ServiceRequestModal from '../modals/ServiceRequestModal';
import TutorBookingModal from '../modals/TutorBookingModal';
import { useChat } from '../ChatProvider'; // NEW: Import useChat hook

interface ClientDashboardProps {
    clientRequests: ServiceRequest[];
    onNavigate: (route: Route) => void;
    onStatusChange: (requestId: string, newStatus: ServiceRequest['status']) => void;
    onOpenChat: () => void; // NEW: Prop to open the chat panel
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ clientRequests, onNavigate, onStatusChange, onOpenChat }) => {
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<ServiceRequest | null>(null);

    const { createChat, openChatByServiceRequest, currentUser } = useChat(); // NEW: Use chat context

    const activeServiceRequests = clientRequests.filter(req => req.status === 'Pending' || req.status === 'In Progress');
    const completedServiceRequests = clientRequests.filter(req => req.status === 'Completed' || req.status === 'Cancelled');

    const handleOpenRequestModal = (request: ServiceRequest) => {
        setSelectedRequest(request);
        setIsRequestModalOpen(true);
    };

    const handleCloseRequestModal = () => {
        setIsRequestModalOpen(false);
        setSelectedRequest(null);
    };

    const handleOpenBookingModal = (booking: ServiceRequest) => {
        setSelectedBooking(booking);
        setIsBookingModalOpen(true);
    };

    const handleCloseBookingModal = () => {
        setIsBookingModalOpen(false);
        setSelectedBooking(null);
    };

    const handleChatWithTutor = async (booking: ServiceRequest) => {
        if (booking.assigned_provider_appwrite_id && currentUser) {
            // This will either open an existing chat or create a new one linked to the service request
            openChatByServiceRequest(booking.assigned_provider_appwrite_id, booking.clientName, booking.$id); // clientName is just a placeholder, actual provider name will be fetched in chat provider
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
            <h2 className="text-3xl font-bold text-primary-text mb-6">Client Hub</h2>
            
            {/* Active Service Requests */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold font-unica-one text-primary-text">My Active Service Requests</h3>
                    <Button variant="secondary" onClick={() => onNavigate({ page: 'services' })}>Request New Service</Button>
                </div>
                {activeServiceRequests.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-soft-gray">
                                    <th className="p-2 text-primary-text">Request ID</th>
                                    <th className="p-2 text-primary-text">Service</th>
                                    <th className="p-2 text-primary-text">Status</th>
                                    <th className="p-2 text-primary-text">Date</th>
                                    <th className="p-2 text-primary-text">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeServiceRequests.map(req => (
                                    <tr key={req.$id} className="border-b border-soft-gray hover:bg-light-lavender/50">
                                        <td className="p-2 font-mono text-sm text-secondary-text">{req.$id.substring(0, 8)}...</td>
                                        <td className="p-2 text-secondary-text">{req.service}</td>
                                        <td className="p-2">
                                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusChipClasses(req.status)}`}>{req.status}</span>
                                        </td>
                                        <td className="p-2 text-secondary-text">{req.date}</td>
                                        <td className="p-2">
                                            <button onClick={() => handleOpenRequestModal(req)} className="text-accent-primary hover:text-accent-hover font-bold text-sm">View</button>
                                            {req.status === 'Pending' && (
                                                <button onClick={() => onStatusChange(req.$id, 'Cancelled')} className="ml-2 text-error hover:text-red-700 font-bold text-sm">Cancel</button>
                                            )}
                                            {req.assigned_provider_appwrite_id && req.status === 'In Progress' && (
                                                <button onClick={() => handleChatWithTutor(req)} className="ml-2 text-accent-primary hover:text-accent-hover font-bold text-sm">Chat</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-secondary-text text-center py-4">No active service requests.</p>
                )}
            </div>

            {/* Completed/Cancelled Service Requests */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h3 className="text-xl font-bold font-unica-one text-primary-text">My Past Service Requests</h3>
                {completedServiceRequests.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-soft-gray">
                                    <th className="p-2 text-primary-text">Request ID</th>
                                    <th className="p-2 text-primary-text">Service</th>
                                    <th className="p-2 text-primary-text">Status</th>
                                    <th className="p-2 text-primary-text">Date</th>
                                    <th className="p-2 text-primary-text">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {completedServiceRequests.map(req => (
                                    <tr key={req.$id} className="border-b border-soft-gray hover:bg-light-lavender/50">
                                        <td className="p-2 font-mono text-sm text-secondary-text">{req.$id.substring(0, 8)}...</td>
                                        <td className="p-2 text-secondary-text">{req.service}</td>
                                        <td className="p-2">
                                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusChipClasses(req.status)}`}>{req.status}</span>
                                        </td>
                                        <td className="p-2 text-secondary-text">{req.date}</td>
                                        <td className="p-2">
                                            <button onClick={() => handleOpenRequestModal(req)} className="text-accent-primary hover:text-accent-hover font-bold text-sm">View</button>
                                            {req.assigned_provider_appwrite_id && (
                                                <button onClick={() => handleChatWithTutor(req)} className="ml-2 text-accent-primary hover:text-accent-hover font-bold text-sm">Chat</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-secondary-text text-center py-4">No past service requests.</p>
                )}
            </div>

            {/* Tutor Bookings - for simplicity, using assigned service requests */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold font-unica-one text-primary-text">My Tutor Bookings</h3>
                     <Button variant="secondary" onClick={() => onNavigate({ page: 'tutors' })}>Find a Tutor</Button>
                </div>
                 {clientRequests.filter(req => req.assigned_provider_appwrite_id && req.status !== 'Completed' && req.status !== 'Cancelled').length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-soft-gray">
                                    <th className="p-2 text-primary-text">Service</th>
                                    <th className="p-2 text-primary-text">Status</th>
                                    <th className="p-2 text-primary-text">Date</th>
                                    <th className="p-2 text-primary-text">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientRequests.filter(req => req.assigned_provider_appwrite_id && req.status !== 'Completed' && req.status !== 'Cancelled').map(book => (
                                    <tr key={book.$id} className="border-b border-soft-gray hover:bg-light-lavender/50">
                                        <td className="p-2 text-secondary-text">{book.service}</td>
                                        <td className="p-2">
                                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusChipClasses(book.status)}`}>{book.status}</span>
                                        </td>
                                        <td className="p-2 text-secondary-text">{book.date}</td>
                                        <td className="p-2">
                                            <button onClick={() => handleOpenBookingModal(book)} className="text-accent-primary hover:text-accent-hover font-bold text-sm">Manage</button>
                                            <button onClick={() => handleChatWithTutor(book)} className="ml-2 text-accent-primary hover:text-accent-hover font-bold text-sm">Chat</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-secondary-text text-center py-4">No active tutor bookings.</p>
                )}
            </div>

            {selectedRequest && (
                <ServiceRequestModal
                    request={selectedRequest}
                    onClose={handleCloseRequestModal}
                />
            )}
            {selectedBooking && (
                <TutorBookingModal
                    booking={selectedBooking}
                    onClose={handleCloseBookingModal}
                />
            )}
        </div>
    );
};

export default ClientDashboard;