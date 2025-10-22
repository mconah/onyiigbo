import React from 'react';
import Button from '../Button';
import { NewsPost } from '../../data/mockData';

interface AdminNewsTableProps {
    newsPosts: NewsPost[];
    onCreateNewsPost: () => void;
    onEditNewsPost: (newsPost: NewsPost) => void;
    onDeleteNewsPost: (newsPostId: string) => void;
}

const AdminNewsTable: React.FC<AdminNewsTableProps> = ({ newsPosts, onCreateNewsPost, onEditNewsPost, onDeleteNewsPost }) => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-primary-text mb-6">News Management</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-end mb-4">
                    <Button onClick={onCreateNewsPost}>Create New News Post</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-soft-gray">
                            <tr>
                                <th className="p-3 text-primary-text">Title</th>
                                <th className="p-3 text-primary-text">Author</th>
                                <th className="p-3 text-primary-text">Category</th>
                                <th className="p-3 text-primary-text">Date</th>
                                <th className="p-3 text-primary-text">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newsPosts.map(newsPost => (
                                <tr key={newsPost.$id} className="border-b border-soft-gray hover:bg-light-lavender/50">
                                    <td className="p-3 font-bold text-secondary-text">{newsPost.title}</td>
                                    <td className="p-3 text-secondary-text">{newsPost.author}</td>
                                    <td className="p-3"><span className="bg-accent-primary/10 text-accent-primary text-xs font-semibold px-2.5 py-0.5 rounded-full">{newsPost.category}</span></td>
                                    <td className="p-3 text-secondary-text">{newsPost.date}</td>
                                    <td className="p-3 space-x-2">
                                        <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => onEditNewsPost(newsPost)}>Edit</Button>
                                        <Button variant="primary" className="bg-error hover:bg-red-700 px-2 py-1 text-xs" onClick={() => onDeleteNewsPost(newsPost.$id)}>Delete</Button>
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

export default AdminNewsTable;