import React from 'react';
import Button from '../Button';
import { Post } from '../../data/mockData';

interface AdminContentTableProps {
    posts: Post[];
    onCreatePost: () => void;
    onEditPost: (post: Post) => void;
    onDeletePost: (postId: string) => void; 
}

const AdminContentTable: React.FC<AdminContentTableProps> = ({ posts, onCreatePost, onEditPost, onDeletePost }) => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-primary-text mb-6">Content Management (Igbo Log)</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-end mb-4">
                    <Button onClick={onCreatePost}>Create New Post</Button>
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
                            {posts.map(post => (
                                <tr key={post.$id} className="border-b border-soft-gray hover:bg-light-lavender/50">
                                    <td className="p-3 font-bold text-secondary-text">{post.title}</td>
                                    <td className="p-3 text-secondary-text">{post.author}</td>
                                    <td className="p-3"><span className="bg-accent-primary/10 text-accent-primary text-xs font-semibold px-2.5 py-0.5 rounded-full">{post.category}</span></td>
                                    <td className="p-3 text-secondary-text">{post.date}</td>
                                    <td className="p-3 space-x-2">
                                        <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => onEditPost(post)}>Edit</Button>
                                        <Button variant="primary" className="bg-error hover:bg-red-700 px-2 py-1 text-xs" onClick={() => onDeletePost(post.$id)}>Delete</Button>
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

export default AdminContentTable;