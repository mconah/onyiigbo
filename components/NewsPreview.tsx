import React, { useEffect, useState } from 'react';
import { Route } from '../App';
import { NewsPost } from '../data/mockData';
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
    <section id="news-preview" className="relative py-16 md:py-20">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-12 right-[15%] h-56 w-56 rounded-full bg-accent-primary/25 blur-3xl opacity-60 animate-[float_20s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 left-[18%] h-64 w-64 rounded-full bg-igbo-leaf-green/20 blur-3xl opacity-60 animate-[float_16s_ease-in-out_infinite]" />
      </div>
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="mt-6 font-unica-one text-4xl md:text-5xl font-bold text-primary-text">
              Latest News & Updates
            </h2>
            <p className="mt-4 text-lg text-secondary-text/85 md:mx-auto md:max-w-3xl">
              Stay informed with the latest announcements, features, and community highlights from OnyiIgbo.
            </p>
          </div>

          {featuredNews ? (
            <article className="relative overflow-hidden rounded-[36px] border border-white/55 bg-white/70 shadow-[0_35px_90px_-40px_rgba(15,23,42,0.6)] backdrop-blur-2xl">
              <div className="grid gap-0 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
                <div className="p-8 sm:p-10 md:p-12">
                  <span className="inline-flex items-center rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-primary">
                    {featuredNews.category}
                  </span>
                  <h3 className="mt-5 font-unica-one text-3xl md:text-4xl font-bold text-primary-text">
                    {featuredNews.title}
                  </h3>
                  <p className="mt-4 text-base md:text-lg leading-relaxed text-secondary-text/85">
                    {featuredNews.excerpt}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-secondary-text/70">
                    <span>By {featuredNews.author}</span>
                    <span className="h-1 w-1 rounded-full bg-secondary-text/40" aria-hidden="true" />
                    <span>{featuredNews.date}</span>
                  </div>
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <button
                      onClick={() => onNavigate({ page: 'news-post', id: featuredNews.$id })}
                      className="inline-flex items-center justify-center rounded-2xl border border-accent-primary/50 bg-accent-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-accent-hover"
                    >
                      Read full story
                    </button>
                    <button
                      onClick={() => onNavigate({ page: 'news' })}
                      className="inline-flex items-center justify-center rounded-2xl border border-accent-primary/40 px-6 py-3 text-sm font-semibold text-accent-primary transition-all duration-300 hover:bg-accent-primary hover:text-white"
                    >
                      Browse all news
                    </button>
                  </div>
                </div>
                <div className="relative min-h-[280px]">
                  <div className="absolute inset-0">
                    <img
                      src={featuredNews.image || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80'}
                      alt={featuredNews.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
                  </div>
                </div>
              </div>
            </article>
          ) : (
            <p className="py-4 text-center text-secondary-text/80">No news to display at the moment.</p>
          )}

          <div className="mt-10 text-center text-sm text-secondary-text/70">Curated by the OnyiIgbo editorial team</div>
        </div>
      </div>
    </section>
  );
};

export default NewsPreview;