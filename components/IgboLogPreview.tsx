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
  <section id="igbo-log" className="relative py-20 md:py-24">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-12">
          <h2 className="font-unica-one text-4xl md:text-5xl font-bold text-primary-text">
            From the Igbo Log
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto text-secondary-text/80">
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
  <section id="igbo-log" className="relative py-20 md:py-24">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-14 left-[18%] h-60 w-60 rounded-full bg-accent-primary/25 blur-3xl opacity-60 animate-[float_18s_ease-in-out_infinite]" />
        <div className="absolute bottom-10 right-[22%] h-72 w-72 rounded-full bg-igbo-leaf-green/18 blur-3xl opacity-60 animate-[float_20s_ease-in-out_infinite]" />
      </div>
      <div className="container mx-auto px-6 text-center">
        <div className="mb-14">
          <span className="inline-flex items-center rounded-full border border-white/60 bg-white/50 px-4 py-1 text-sm font-semibold text-accent-primary backdrop-blur-xl">
            Community Stories
          </span>
          <h2 className="font-unica-one text-4xl md:text-5xl font-bold text-primary-text mt-6">
            From the Igbo Log
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto text-secondary-text/85">
            A public journal where our community shares cultural stories, insights, and experiences in Igbo.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {posts.map((post) => (
            <div
              key={post.$id}
              className="group relative overflow-hidden rounded-[24px] border border-white/50 bg-white/70 p-6 shadow-[0_25px_70px_-32px_rgba(15,23,42,0.7)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_90px_-35px_rgba(15,23,42,0.75)] flex flex-col"
            >
              <div className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-white/60 via-transparent to-white/20" />
              <h3 className="relative text-xl font-bold font-unica-one text-primary-text mb-3">
                {post.title}
              </h3>
              <p className="relative text-secondary-text/80 leading-relaxed flex-grow">
                {post.excerpt}
              </p>
              <div className="relative mt-4 pt-4 border-t border-white/50 text-sm text-secondary-text/70 flex justify-between items-center">
                <span className="font-bold">By {post.author}</span>
                <button onClick={() => onNavigate({ page: 'blog-post', id: post.$id })} className="text-accent-primary hover:text-accent-hover font-bold">
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