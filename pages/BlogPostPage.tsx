import React, { useEffect, useState } from 'react';
import { Post } from '../data/mockData'; // Import Post interface from mockData
import { databases, dbId, blogPostsCollectionId } from '../lib/appwrite';
import { AppwriteException } from 'appwrite';
import LexicalRenderer from '../components/LexicalRenderer'; // Import LexicalRenderer

interface BlogPostPageProps {
  postId: string; // Changed to string for Appwrite $id
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ postId }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const doc = await databases.getDocument(
          dbId,
          blogPostsCollectionId,
          postId
        );
        setPost({
          $id: doc.$id,
          title: doc.title,
          author: doc.author_name,
          date: new Date(doc.date_published).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          category: doc.category,
          excerpt: doc.excerpt,
          content: doc.content, // Lexical JSON string
        } as Post); // Cast to Post type
      } catch (err) {
        console.error('Failed to fetch blog post:', err);
        if (err instanceof AppwriteException) {
            setError(err.message);
        } else {
            setError('Failed to load blog post.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (loading) return <div className="text-center py-10 text-primary-text">Loading post...</div>;
  if (error) return <div className="text-center py-10 text-error">{error}</div>;
  if (!post) return <div className="text-center py-10 text-secondary-text">Post not found.</div>;

  return (
    <div className="bg-white">
      <header className="relative h-96">
        <img 
            src={`https://picsum.photos/seed/${post.$id}/1200/800`} 
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

export default BlogPostPage;