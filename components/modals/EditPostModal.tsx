
import React, { useState } from 'react';
import Button from '../Button';
import { Post } from '../../data/mockData';
// Fix: Change default import to named import for LexicalEditor
import LexicalEditor from '../LexicalEditor';

interface EditPostModalProps {
  post: Post;
  onUpdatePost: (updatedPost: Post) => void;
  onClose: () => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ post, onUpdatePost, onClose }) => {
  const [title, setTitle] = useState(post.title);
  const [author, setAuthor] = useState(post.author);
  const [category, setCategory] = useState(post.category);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [content, setContent] = useState(post.content); // Lexical JSON string
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title || !author || !category || !excerpt || !content) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
        await onUpdatePost({
            ...post, // Keep existing ID and date
            title,
            author,
            category,
            excerpt,
            content, // Lexical JSON string
        });
        onClose(); // Close modal on success
    } catch (err) {
        console.error('Error updating post in modal:', err);
        setError('Failed to update post. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="font-unica-one text-3xl font-bold text-primary-text mb-6">Edit Blog Post</h2>
        {error && (
            <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg mb-4 text-center text-secondary-text">
                {error}
            </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-bold text-secondary-text mb-2">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 bg-input-bg border border-soft-gray rounded-lg focus:ring-accent-primary focus:border-accent-primary text-primary-text" required disabled={loading} />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-bold text-secondary-text mb-2">Author</label>
            <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full px-4 py-2 bg-input-bg border border-soft-gray rounded-lg focus:ring-accent-primary focus:border-accent-primary text-primary-text" required disabled={loading} />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-bold text-secondary-text mb-2">Category</label>
            <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 bg-input-bg border border-soft-gray rounded-lg focus:ring-accent-primary focus:border-accent-primary text-primary-text" placeholder="e.g., Culture, Language, History" required disabled={loading} />
          </div>
          <div>
            <label htmlFor="excerpt" className="block text-sm font-bold text-secondary-text mb-2">Excerpt (Short Summary)</label>
            <textarea id="excerpt" rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full px-4 py-2 bg-input-bg border border-soft-gray rounded-lg focus:ring-accent-primary focus:border-accent-primary text-primary-text" required disabled={loading}></textarea>
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-bold text-secondary-text mb-2">Full Content</label>
            <LexicalEditor initialEditorState={content} onEditorStateChange={setContent} />
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;