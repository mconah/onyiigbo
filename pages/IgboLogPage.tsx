import React, { useEffect, useState } from 'react';
import BlogPostCard from '../components/BlogPostCard';
import Button from '../components/Button';
import { Route } from '../App';
import { Post } from '../data/mockData';
import { databases, dbId, blogPostsCollectionId } from '../lib/appwrite';
import { Query } from 'appwrite';

interface IgboLogPageProps {
  onNavigate: (route: Route) => void;
}

const IgboLogPage: React.FC<IgboLogPageProps> = ({ onNavigate }) => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
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
          [Query.limit(100), Query.orderDesc('$createdAt')] // Fetch all posts
        );
        const fetchedPosts: Post[] = response.documents.map(doc => ({
          $id: doc.$id,
          title: doc.title,
          author: doc.author_name,
          date: new Date(doc.date_published).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          category: doc.category,
          excerpt: doc.excerpt,
          content: doc.content,
        }));
        setAllPosts(fetchedPosts);
      } catch (err) {
        console.error('Failed to fetch blog posts:', err);
        setError('Failed to load blog posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const featuredPost = allPosts.length > 0 ? allPosts[0] : null;
  const otherPosts = allPosts.filter(p => p.$id !== featuredPost?.$id);

  if (loading) return <div className="text-center py-10 text-primary-text">Loading Igbo Log...</div>;
  if (error) return <div className="text-center py-10 text-error">{error}</div>;

  return (
    <div className="bg-light-lavender">
       <header className="bg-white py-16 text-center">
        <div className="container mx-auto px-6">
          <h1 className="font-unica-one text-5xl md:text-6xl font-bold text-primary-text">The Igbo Log</h1>
          <p className="mt-4 text-lg max-w-3xl mx-auto text-secondary-text">
            A community journal celebrating Igbo language, culture, and stories from around the world.
          </p>
        </div>
      </header>

      <section className="py-20">
        <div className="container mx-auto px-6">
            {/* Featured Post */}
            {featuredPost && (
            <div className="mb-16">
                 <h2 className="font-unica-one text-3xl font-bold text-primary-text mb-8">Featured Post</h2>
                 <div className="bg-white rounded-lg shadow-xl overflow-hidden md:flex">
                     <div className="md:w-1/2 p-8 flex flex-col justify-center">
                         <span className="text-accent-primary font-bold uppercase text-sm">{featuredPost.category}</span>
                         <h3 className="font-unica-one text-4xl text-primary-text mt-2 mb-4">{featuredPost.title}</h3>
                         <p className="text-secondary-text mb-4">{featuredPost.excerpt}</p>
                         <div className="text-sm text-gray-500 mb-6">
                            <span>By {featuredPost.author}</span> &bull; <span>{featuredPost.date}</span>
                         </div>
                         <div className="w-fit">
                            <Button onClick={() => onNavigate({ page: 'blog-post', id: featuredPost.$id })}>Read Full Story</Button>
                         </div>
                     </div>
                     <div className="md:w-1/2">
                        <img src={`https://picsum.photos/seed/${featuredPost.$id}/800/600`} alt="Igbo proverbs illustration" className="w-full h-full object-cover" />
                     </div>
                 </div>
            </div>
            )}

            {/* Other Posts */}
            {otherPosts.length > 0 && (
                <>
                    <h2 className="font-unica-one text-3xl font-bold text-primary-text mb-8">Latest Posts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {otherPosts.map((post) => (
                            <BlogPostCard key={post.$id} post={post} onNavigate={onNavigate} />
                        ))}
                    </div>
                </>
            )}
            {allPosts.length === 0 && !loading && (
                <div className="text-center py-16 text-secondary-text">No blog posts to display.</div>
            )}
        </div>
      </section>
    </div>
  );
};

export default IgboLogPage;