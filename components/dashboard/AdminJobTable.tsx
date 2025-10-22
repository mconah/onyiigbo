import React from 'react';
import Button from '../Button';
import { ServiceRequest, User } from '../../data/mockData';

interface AdminJobTableProps {
    jobs: ServiceRequest[];
    users: User[]; // List of potential providers (tutors/service providers)
    onAssign: (job: ServiceRequest) => void;
    onStatusChange: (jobId: string, newStatus: ServiceRequest['status']) => void;
}

const AdminJobTable: React.FC<AdminJobTableProps> = ({ jobs, users, onAssign, onStatusChange }) => {
    const getStatusChipClasses = (status: ServiceRequest['status']) => {
        switch(status) {
            case 'Completed':
                return 'bg-igbo-leaf-green text-white';
            case 'In Progress':
                return 'bg-blue-500 text-white';
            case 'Pending':
                return 'bg-yellow-500 text-white';
            case 'Cancelled':
                return 'bg-error text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const getAssignedProviderName = (assignedToAppwriteId: string | null) => {
        if (!assignedToAppwriteId) return 'N/A';
        const provider = users.find(u => u.appwrite_user_id === assignedToAppwriteId);
        return provider ? provider.name : 'Unknown';
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-primary-text mb-6">Job Management</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-soft-gray">
                            <tr>
                                <th className="p-3 text-primary-text">Request ID</th>
                                <th className="p-3 text-primary-text">Client Name</th>
                                <th className="p-3 text-primary-text">Service</th>
                                <th className="p-3 text-primary-text">Assigned To</th>
                                <th className="p-3 text-primary-text">Status</th>
                                <th className="p-3 text-primary-text">Date</th>
                                <th className="p-3 text-primary-text">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map(job => (
                                <tr key={job.$id} className="border-b border-soft-gray hover:bg-light-lavender/50">
                                    <td className="p-3 font-mono text-sm text-secondary-text">{job.$id.substring(0, 8)}...</td>
                                    <td className="p-3 text-secondary-text">{job.clientName}</td>
                                    <td className="p-3 text-secondary-text">{job.service}</td>
                                    <td className="p-3 text-secondary-text">{getAssignedProviderName(job.assigned_provider_appwrite_id)}</td>
                                    <td className="p-3">
                                        <select 
                                            value={job.status} 
                                            onChange={(e) => onStatusChange(job.$id, e.target.value as ServiceRequest['status'])}
                                            className={`text-xs font-semibold px-2 py-1 rounded-full border-none ${getStatusChipClasses(job.status)} focus:ring-1 focus:ring-accent-primary text-primary-text`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="p-3 text-secondary-text">{job.date}</td>
                                    <td className="p-3 space-x-2">
                                         {job.status === 'Pending' && (
                                            <Button variant="primary" className="px-2 py-1 text-xs" onClick={() => onAssign(job)}>Assign</Button>
                                         )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminJobTable;