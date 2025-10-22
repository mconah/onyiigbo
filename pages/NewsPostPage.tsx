import React, { useEffect, useState } from 'react';
import { NewsPost } from '../data/mockData';
import { databases, dbId, newsPostsCollectionId } from '../lib/appwrite';
import { AppwriteException } from 'appwrite';
import LexicalRenderer from '../components/LexicalRenderer';

interface NewsPostPageProps {
  newsPostId: string; // Changed to string for Appwrite $id
}

const NewsPostPage: React.FC<NewsPostPageProps> = ({ newsPostId }) => {
  const [post, setPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const doc = await databases.getDocument(
          dbId,
          newsPostsCollectionId,
          newsPostId
        );
        setPost({
          $id: doc.$id,
          title: doc.title,
          author: doc.author_name,
          date: new Date(doc.date_published).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          category: doc.category,
          excerpt: doc.excerpt,
          content: doc.content, // Lexical JSON string
          image: doc.image,
        } as NewsPost); // Cast to NewsPost type
      } catch (err) {
        console.error('Failed to fetch news post:', err);
        if (err instanceof AppwriteException) {
            setError(err.message);
        } else {
            setError('Failed to load news post.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNewsPost();
  }, [newsPostId]);

  if (loading) return <div className="text-center py-10 text-primary-text">Loading news post...</div>;
  if (error) return <div className="text-center py-10 text-error">{error}</div>;
  if (!post) return <div className="text-center py-10 text-secondary-text">News post not found.</div>;

  return (
    <div className="bg-white">
      <header className="relative h-96">
        <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white p-6">
                <span className="bg-accent-primary px-3 py-1 rounded-full text-sm font-bold uppercase">{post.category}</span>
                <h1 className="font-unica-one text-4xl md:text-6xl mt-4">{post.title}</h1>
                <p className="mt-4 text-lg">By {post.author} &bull; {post.date}</p>
            </div>
        </div>
      </header>
      
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
            <div className="prose lg:prose-xl max-w-none text-secondary-text">
                {post.content && <LexicalRenderer content={post.content} />}
                {!post.content && <p>{post.excerpt}</p>} {/* Fallback if content is somehow empty */}
            </div>
        </div>
      </section>
    </div>
  );
};

export default NewsPostPage;