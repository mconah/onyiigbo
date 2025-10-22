import React from 'react';
import Button from '../Button';
import { User } from '../../data/mockData'; // Import User from mockData

interface AdminUserTableProps {
    users: User[];
    onVerify: (user: User) => void;
    onUserStatusChange: (userId: string, newStatus: User['status']) => void; // Changed userId to string
}

const AdminUserTable: React.FC<AdminUserTableProps> = ({ users, onVerify, onUserStatusChange }) => {
    const getStatusChip = (status: User['status']) => { // Use User['status'] for type safety
        switch(status) {
            case 'Verified':
            case 'Active':
                return <span className="bg-igbo-leaf-green text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">{status}</span>;
            case 'Pending Verification':
                return <span className="bg-yellow-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">{status}</span>;
            case 'Suspended':
                 return <span className="bg-error text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">{status}</span>;
            default:
                return null;
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-primary-text mb-6">User Management</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-soft-gray">
                            <tr>
                                <th className="p-3 text-primary-text">Name</th>
                                <th className="p-3 text-primary-text">Email</th>
                                <th className="p-3 text-primary-text">Role</th>
                                <th className="p-3 text-primary-text">Status</th>
                                <th className="p-3 text-primary-text">Joined Date</th>
                                <th className="p-3 text-primary-text">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.$id} className="border-b border-soft-gray hover:bg-light-lavender/50">
                                    <td className="p-3 font-bold text-secondary-text">{user.name}</td>
                                    <td className="p-3 text-secondary-text">{user.email}</td>
                                    <td className="p-3 text-secondary-text">{user.role}</td>
                                    <td className="p-3">{getStatusChip(user.status)}</td>
                                    <td className="p-3 text-secondary-text">{user.joined}</td>
                                    <td className="p-3 space-x-2">
                                                                            <>
                                                                                {user.status === 'Pending Verification' && (user.role === 'Tutor' || user.role === 'Service Provider') && (
                                                                                    <Button variant="primary" className="px-2 py-1 text-xs" onClick={() => onVerify(user)}>Verify</Button>
                                                                                )}
                                                                                {user.role !== 'Admin' && user.status !== 'Suspended' && (
                                                                                    <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => onUserStatusChange(user.$id, 'Suspended')}>Suspend</Button>
                                                                                )}
                                                                                {user.role !== 'Admin' && user.status === 'Suspended' && (
                                                                                    <Button variant="primary" className="px-2 py-1 text-xs" onClick={() => onUserStatusChange(user.$id, 'Active')}>Unsuspend</Button>
                                                                                )}
                                                                            </>
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

export default AdminUserTable;