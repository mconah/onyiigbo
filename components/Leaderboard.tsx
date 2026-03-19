import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { databases, dbId } from '../lib/appwrite';
import { Query } from 'appwrite';

interface ContributorStats {
  $id: string;
  user_id: string;
  user_name?: string;
  total_points_earned: number;
  current_level: number;
  rank: string;
  total_articles: number;
  total_translations: number;
  streak_days: number;
}

interface LeaderboardProps {
  limit?: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ limit = 10 }) => {
  const { t } = useTranslation();
  const [contributors, setContributors] = useState<ContributorStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'month' | 'week'>('all');

  useEffect(() => {
    loadLeaderboard();
  }, [filter]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const queries = [
        Query.orderDesc('total_points_earned'),
        Query.limit(limit),
      ];

      const response = await databases.listDocuments(
        dbId,
        'contributor_stats',
        queries
      );

      const stats = response.documents.map((doc, index) => ({
        $id: doc.$id,
        user_id: doc.user_id,
        user_name: doc.user_name || `User ${index + 1}`,
        total_points_earned: doc.total_points_earned || 0,
        current_level: doc.current_level || 1,
        rank: doc.rank || t('gamification.rank'),
        total_articles: doc.total_articles || 0,
        total_translations: doc.total_translations || 0,
        streak_days: doc.streak_days || 0,
      }));

      setContributors(stats);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getRankColor = (index: number) => {
    if (index === 0) return 'bg-yellow-100 border-yellow-400';
    if (index === 1) return 'bg-gray-100 border-gray-400';
    if (index === 2) return 'bg-orange-100 border-orange-400';
    return 'bg-white border-soft-gray';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive-green"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary-text font-unica-one">
          {t('gamification.leaderboard')}
        </h2>
        <div className="flex gap-2">
          {(['all', 'month', 'week'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === f
                  ? 'bg-olive-green text-white'
                  : 'bg-soft-gray text-secondary-text hover:bg-light-lavender'
              }`}
            >
              {t(`common.${f}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {contributors.length === 0 ? (
          <p className="text-center text-secondary-text py-4">
            No contributors yet. Be the first!
          </p>
        ) : (
          contributors.map((contributor, index) => (
            <div
              key={contributor.$id}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-transform hover:scale-[1.02] ${getRankColor(index)}`}
            >
              <div className="text-2xl font-bold min-w-[3rem] text-center">
                {getRankIcon(index)}
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-primary-text">
                    {contributor.user_name}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-olive-green text-white rounded-full">
                    Lvl {contributor.current_level}
                  </span>
                </div>
                <div className="text-sm text-secondary-text">
                  {contributor.total_articles} {t('contributor.writeBlog')} • {contributor.total_translations} {t('gamification.translateContent')}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-bold text-olive-green">
                  {contributor.total_points_earned.toLocaleString()}
                </div>
                <div className="text-xs text-secondary-text">{t('gamification.points')}</div>
              </div>

              {contributor.streak_days > 0 && (
                <div className="flex items-center gap-1 text-orange-500">
                  <span className="text-lg">🔥</span>
                  <span className="text-sm font-medium">{contributor.streak_days}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-secondary-text">
          {t('gamification.writeArticle')}: +10 {t('gamification.points')} • {t('gamification.translateContent')}: +5 {t('gamification.points')} • {t('gamification.teachStudent')}: +20 {t('gamification.points')}
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
