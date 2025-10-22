import React, { useEffect, useState } from 'react';
import { Route } from '../App';
import { NewsPost } from '../data/mockData';
import NewsPostCard from './NewsPostCard';
import { databases, dbId, newsPostsCollectionId } from '../lib/appwrite';
import { Query } from 'appwrite';

interface NewsPreviewProps {
  onNavigate: (route: Route) => void;
}

const NewsPreview: React.FC<NewsPreviewProps> = ({ onNavigate }) => {
  const [featuredNews, setFeaturedNews] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await databases.listDocuments(
          dbId,
          newsPostsCollectionId,
          [Query.limit(1), Query.orderDesc('$createdAt')] // Fetch the single latest news post
        );
        if (response.documents.length > 0) {
          const doc = response.documents[0];
          setFeaturedNews({
            $id: doc.$id,
            title: doc.title,
            author: doc.author_name,
            date: new Date(doc.date_published).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            category: doc.category,
            excerpt: doc.excerpt,
            content: doc.content,
            image: doc.image,
          });
        }
      } catch (err) {
        console.error('Failed to fetch featured news:', err);
        setError('Failed to load news.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedNews();
  }, []);

  if (loading) return <div className="text-center py-10 text-primary-text">Loading news...</div>;
  if (error) return <div className="text-center py-10 text-error">{error}</div>;
  
  return (
    <section id="news-preview" className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-12">
          <h2 className="font-unica-one text-4xl md:text-5xl font-bold text-primary-text">
            Latest News & Updates
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto text-secondary-text">
            Stay informed with the latest announcements, features, and community highlights from OnyiIgbo.
          </p>
        </div>
        {featuredNews ? (
            <div className="max-w-xl mx-auto text-left"> {/* Centered single news item */}
                <NewsPostCard key={featuredNews.$id} post={featuredNews} onNavigate={onNavigate} />
            </div>
        ) : (
            <p className="text-secondary-text text-center py-4">No news to display at the moment.</p>
        )}
         <div className="mt-12">
            <button onClick={() => onNavigate({ page: 'news' })} className="font-bold text-accent-primary hover:text-accent-hover text-lg">
                View All News &rarr;
            </button>
        </div>
      </div>
    </section>
  );
};

export default NewsPreview;