import React, { useEffect, useState } from 'react';
import { Route } from '../App';
import { NewsPost } from '../data/mockData';
import NewsPostCard from '../components/NewsPostCard';
import { databases, dbId, newsPostsCollectionId } from '../lib/appwrite';
import { Query } from 'appwrite';

interface NewsPageProps {
  onNavigate: (route: Route) => void;
}

const NewsPage: React.FC<NewsPageProps> = ({ onNavigate }) => {
  const [allNews, setAllNews] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await databases.listDocuments(
          dbId,
          newsPostsCollectionId,
          [Query.limit(100), Query.orderDesc('$createdAt')] // Fetch all news posts
        );
        const fetchedNews: NewsPost[] = response.documents.map(doc => ({
          $id: doc.$id,
          title: doc.title,
          author: doc.author_name,
          date: new Date(doc.date_published).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          category: doc.category,
          excerpt: doc.excerpt,
          content: doc.content,
          image: doc.image,
        }));
        setAllNews(fetchedNews);
      } catch (err) {
        console.error('Failed to fetch news posts:', err);
        setError('Failed to load news posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) return <div className="text-center py-10 text-primary-text">Loading news...</div>;
  if (error) return <div className="text-center py-10 text-error">{error}</div>;

  return (
    <div className="bg-light-lavender">
       <header className="bg-white py-16 text-center">
        <div className="container mx-auto px-6">
          <h1 className="font-unica-one text-5xl md:text-6xl font-bold text-primary-text">OnyiIgbo News</h1>
          <p className="mt-4 text-lg max-w-3xl mx-auto text-secondary-text">
            Stay up-to-date with our latest announcements, platform updates, and community news.
          </p>
        </div>
      </header>

      <section className="py-20">
        <div className="container mx-auto px-6">
            <h2 className="font-unica-one text-3xl font-bold text-primary-text mb-8">All Articles</h2>
            {allNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allNews.map((newsItem) => (
                        <NewsPostCard key={newsItem.$id} post={newsItem} onNavigate={onNavigate} />
                    ))}
                </div>
            ) : (
                <p className="text-secondary-text text-center py-4">No news articles to display.</p>
            )}
        </div>
      </section>
    </div>
  );
};

export default NewsPage;