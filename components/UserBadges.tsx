import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { databases, dbId } from '../lib/appwrite';
import { Query } from 'appwrite';

interface Badge {
  $id: string;
  name: string;
  name_igbo: string;
  description: string;
  description_igbo: string;
  icon: string;
  rarity: string;
}

interface UserBadge {
  $id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

interface UserBadgesProps {
  userId?: string;
  showAll?: boolean;
}

const rarityColors: Record<string, string> = {
  common: 'bg-gray-100 border-gray-300',
  rare: 'bg-blue-100 border-blue-300',
  epic: 'bg-purple-100 border-purple-300',
  legendary: 'bg-yellow-100 border-yellow-400',
};

const UserBadges: React.FC<UserBadgesProps> = ({ userId, showAll = false }) => {
  const { t, i18n } = useTranslation();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState<UserBadge | null>(null);

  useEffect(() => {
    if (userId) {
      loadBadges();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const loadBadges = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        dbId,
        'user_badges',
        [
          Query.equal('user_id', userId!),
          Query.orderDesc('earned_at'),
        ]
      );

      // Fetch badge details for each user badge
      const badgesWithDetails = await Promise.all(
        response.documents.map(async (doc) => {
          try {
            const badgeDoc = await databases.getDocument(dbId, 'badges', doc.badge_id);
            return {
              $id: doc.$id,
              badge_id: doc.badge_id,
              earned_at: doc.earned_at,
              badge: {
                $id: badgeDoc.$id,
                name: badgeDoc.name,
                name_igbo: badgeDoc.name_igbo,
                description: badgeDoc.description,
                description_igbo: badgeDoc.description_igbo,
                icon: badgeDoc.icon || '🏅',
                rarity: badgeDoc.rarity || 'common',
              },
            };
          } catch {
            return {
              $id: doc.$id,
              badge_id: doc.badge_id,
              earned_at: doc.earned_at,
            };
          }
        })
      );

      setBadges(badgesWithDetails);
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayBadges = showAll ? badges : badges.slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-olive-green"></div>
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className="text-center py-4 text-secondary-text">
        <p className="text-lg mb-2">🏅</p>
        <p className="text-sm">
          {i18n.language === 'ig' ? 'Nweghị akara mmma' : 'No badges yet'}
        </p>
        <p className="text-xs mt-1">
          {i18n.language === 'ig' ? 'Malite ndeputa ihe ị nweta akara mmma' : 'Start contributing to earn badges!'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-primary-text mb-4">
        {t('gamification.badges')} ({badges.length})
      </h3>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {displayBadges.map((userBadge) => (
          <button
            key={userBadge.$id}
            onClick={() => setSelectedBadge(userBadge)}
            className={`flex flex-col items-center p-3 rounded-lg border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-olive-green ${
              rarityColors[userBadge.badge?.rarity || 'common']
            }`}
          >
            <span className="text-3xl mb-1" role="img" aria-label={userBadge.badge?.name}>
              {userBadge.badge?.icon}
            </span>
            <span className="text-xs text-center font-medium text-primary-text line-clamp-2">
              {i18n.language === 'ig' && userBadge.badge?.name_igbo
                ? userBadge.badge.name_igbo
                : userBadge.badge?.name}
            </span>
          </button>
        ))}
      </div>

      {!showAll && badges.length > 5 && (
        <button className="w-full mt-4 text-sm text-olive-green hover:underline">
          {t('common.more')}...
        </button>
      )}

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedBadge(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center">
              <span className="text-6xl mb-4 block" role="img" aria-label={selectedBadge.badge?.name}>
                {selectedBadge.badge?.icon}
              </span>
              <h3 className="text-xl font-bold text-primary-text mb-2">
                {i18n.language === 'ig' && selectedBadge.badge?.name_igbo
                  ? selectedBadge.badge.name_igbo
                  : selectedBadge.badge?.name}
              </h3>
              <p className="text-secondary-text mb-4">
                {i18n.language === 'ig' && selectedBadge.badge?.description_igbo
                  ? selectedBadge.badge.description_igbo
                  : selectedBadge.badge?.description}
              </p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${rarityColors[selectedBadge.badge?.rarity || 'common']}`}>
                  {selectedBadge.badge?.rarity?.toUpperCase()}
                </span>
                <span className="text-sm text-secondary-text">
                  {new Date(selectedBadge.earned_at).toLocaleDateString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedBadge(null)}
                className="px-4 py-2 bg-olive-green text-white rounded-md hover:bg-opacity-90"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBadges;
