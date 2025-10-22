import React, { useEffect, useState } from 'react';
import { Route } from '../App';
import { Post } from '../data/mockData';
import { databases, dbId, blogPostsCollectionId } from '../lib/appwrite';
import { Query } from 'appwrite';

interface IgboLogPreviewProps {
  onNavigate: (route: Route) => void;
}

const IgboLogPreview: React.FC<IgboLogPreviewProps> = ({ onNavigate }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await databases.listDocuments(
          dbId,
          blogPostsCollectionId,
          [Query.limit(3), Query.orderDesc('$createdAt')] // Fetch latest 3 posts
        );
        const fetchedPosts: Post[] = response.documents.map(doc => ({
          $id: doc.$id,
          title: doc.title,
          author: doc.author_name, // Map to existing author field
          date: new Date(doc.date_published).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          category: doc.category,
          excerpt: doc.excerpt,
          content: doc.content,
        }));
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Failed to fetch blog posts for preview:', err);
        setError('Failed to load blog posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="text-center py-10 text-primary-text">Loading blog posts...</div>;
  if (error) return <div className="text-center py-10 text-error">{error}</div>;
  if (posts.length === 0) return (
    <section id="igbo-log" className="py-20 bg-light-lavender">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-12">
          <h2 className="font-unica-one text-4xl md:text-5xl font-bold text-primary-text">
            From the Igbo Log
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto text-secondary-text">
            No blog posts found at the moment. Check back later for new content!
          </p>
        </div>
        <div className="mt-12">
            <button onClick={() => onNavigate({ page: 'igbo-log' })} className="font-bold text-accent-primary hover:text-accent-hover text-lg">
                Explore All Posts
            </button>
        </div>
      </div>
    </section>
  );

  return (
    <section id="igbo-log" className="py-20 bg-light-lavender">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-12">
          <h2 className="font-unica-one text-4xl md:text-5xl font-bold text-primary-text">
            From the Igbo Log
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto text-secondary-text">
            A public journal where our community shares cultural stories, insights, and experiences in Igbo.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {posts.map((post) => (
            <div
              key={post.$id}
              className="bg-white p-6 rounded-lg shadow-lg flex flex-col"
            >
              <h3 className="text-xl font-bold font-unica-one text-primary-text mb-3">
                {post.title}
              </h3>
              <p className="text-secondary-text leading-relaxed flex-grow">
                {post.excerpt}
              </p>
              <div className="mt-4 pt-4 border-t border-soft-gray">
                <span className="text-sm font-bold text-secondary-text">By {post.author}</span>
                <button onClick={() => onNavigate({ page: 'blog-post', id: post.$id })} className="text-sm text-accent-primary hover:text-accent-hover font-bold float-right">
                  Read More &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
         <div className="mt-12">
            <button onClick={() => onNavigate({ page: 'igbo-log' })} className="font-bold text-accent-primary hover:text-accent-hover text-lg">
                Explore All Posts
            </button>
        </div>
      </div>
    </section>
  );
};

export default IgboLogPreview;