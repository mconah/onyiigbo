import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { databases, dbId } from '../lib/appwrite';
import { Query, ID } from 'appwrite';

interface Reward {
  $id: string;
  name: string;
  name_igbo: string;
  description: string;
  description_igbo: string;
  type: string;
  points_cost: number;
  icon: string;
  stock: number;
  is_active: boolean;
}

interface UserReward {
  $id: string;
  reward_id: string;
  redeemed_at: string;
  status: string;
  reward?: Reward;
}

interface RewardsPanelProps {
  userId?: string;
  userPoints?: number;
  onPointsUpdate?: (newPoints: number) => void;
}

const RewardsPanel: React.FC<RewardsPanelProps> = ({ userId, userPoints = 0, onPointsUpdate }) => {
  const { t, i18n } = useTranslation();
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([]);
  const [userRewards, setUserRewards] = useState<UserReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'available' | 'claimed'>('available');
  const [redeemingReward, setRedeemingReward] = useState<Reward | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadRewards();
    if (userId) {
      loadUserRewards();
    }
  }, [userId]);

  const loadRewards = async () => {
    try {
      const response = await databases.listDocuments(
        dbId,
        'rewards',
        [
          Query.equal('is_active', true),
          Query.orderAsc('points_cost'),
        ]
      );

      setAvailableRewards(response.documents as Reward[]);
    } catch (error) {
      console.error('Error loading rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserRewards = async () => {
    try {
      const response = await databases.listDocuments(
        dbId,
        'user_rewards',
        [
          Query.equal('user_id', userId!),
          Query.orderDesc('redeemed_at'),
        ]
      );

      const rewardsWithDetails = await Promise.all(
        response.documents.map(async (doc) => {
          try {
            const rewardDoc = await databases.getDocument(dbId, 'rewards', doc.reward_id);
            return {
              $id: doc.$id,
              reward_id: doc.reward_id,
              redeemed_at: doc.redeemed_at,
              status: doc.status,
              reward: rewardDoc as Reward,
            };
          } catch {
            return {
              $id: doc.$id,
              reward_id: doc.reward_id,
              redeemed_at: doc.redeemed_at,
              status: doc.status,
            };
          }
        })
      );

      setUserRewards(rewardsWithDetails);
    } catch (error) {
      console.error('Error loading user rewards:', error);
    }
  };

  const handleRedeem = async (reward: Reward) => {
    if (!userId) {
      setMessage({ type: 'error', text: i18n.language === 'ig' ? 'Banye ka ị were ọnuunụ' : 'Please login to redeem rewards' });
      return;
    }

    if (userPoints < reward.points_cost) {
      setMessage({ type: 'error', text: i18n.language === 'ig' ? 'Akara gị okeghị' : 'Not enough points' });
      return;
    }

    if (reward.stock !== -1 && reward.stock <= 0) {
      setMessage({ type: 'error', text: i18n.language === 'ig' ? 'Ọnụnụ a agwụla' : 'Out of stock' });
      return;
    }

    try {
      await databases.createDocument(dbId, 'user_rewards', ID.unique(), {
        user_id: userId,
        reward_id: reward.$id,
        redeemed_at: new Date().toISOString(),
        points_spent: reward.points_cost,
        status: 'pending',
      });

      // Update user's points
      const newPoints = userPoints - reward.points_cost;
      await databases.updateDocument(dbId, 'users', userId, {
        total_points: newPoints,
      });

      if (onPointsUpdate) {
        onPointsUpdate(newPoints);
      }

      setMessage({ type: 'success', text: i18n.language === 'ig' ? 'Ị wetaala ọnuunụ!' : 'Reward redeemed successfully!' });
      loadUserRewards();
      setRedeemingReward(null);

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error redeeming reward:', error);
      setMessage({ type: 'error', text: i18n.language === 'ig' ? 'Mmehie. Nwaa ọzọ.' : 'Error redeeming reward. Please try again.' });
    }
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
          {t('rewards.title')}
        </h2>
        <div className="flex items-center gap-2 bg-olive-green text-white px-4 py-2 rounded-lg">
          <span className="text-2xl">💎</span>
          <div>
            <span className="text-2xl font-bold">{userPoints.toLocaleString()}</span>
            <span className="text-sm ml-1">{t('gamification.points')}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-soft-gray">
        <button
          onClick={() => setSelectedTab('available')}
          className={`pb-2 px-4 font-medium transition-colors ${
            selectedTab === 'available'
              ? 'text-olive-green border-b-2 border-olive-green'
              : 'text-secondary-text hover:text-primary-text'
          }`}
        >
          {t('rewards.available')}
        </button>
        <button
          onClick={() => setSelectedTab('claimed')}
          className={`pb-2 px-4 font-medium transition-colors ${
            selectedTab === 'claimed'
              ? 'text-olive-green border-b-2 border-olive-green'
              : 'text-secondary-text hover:text-primary-text'
          }`}
        >
          {t('rewards.claimed')} ({userRewards.length})
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Available Rewards */}
      {selectedTab === 'available' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {availableRewards.length === 0 ? (
            <p className="text-center text-secondary-text col-span-2">
              {i18n.language === 'ig' ? 'Ọnweghị ọnuunụ dị ugbu a' : 'No rewards available at the moment'}
            </p>
          ) : (
            availableRewards.map((reward) => (
              <div
                key={reward.$id}
                className={`border-2 rounded-lg p-4 transition-all ${
                  userPoints >= reward.points_cost
                    ? 'border-soft-gray hover:border-olive-green'
                    : 'border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{reward.icon}</span>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-primary-text">
                      {i18n.language === 'ig' && reward.name_igbo
                        ? reward.name_igbo
                        : reward.name}
                    </h3>
                    <p className="text-sm text-secondary-text mt-1">
                      {i18n.language === 'ig' && reward.description_igbo
                        ? reward.description_igbo
                        : reward.description}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-olive-green font-bold">
                        {reward.points_cost} {t('gamification.points')}
                      </span>
                      {reward.stock !== -1 && (
                        <span className="text-xs text-secondary-text">
                          {reward.stock} {i18n.language === 'ig' ? 'fọdụrụ' : 'left'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setRedeemingReward(reward)}
                  disabled={userPoints < reward.points_cost}
                  className={`w-full mt-3 py-2 rounded-md font-medium transition-colors ${
                    userPoints >= reward.points_cost
                      ? 'bg-olive-green text-white hover:bg-opacity-90'
                      : 'bg-soft-gray text-secondary-text cursor-not-allowed'
                  }`}
                >
                  {userPoints >= reward.points_cost ? t('rewards.redeem') : t('gamification.pointsToNext')}
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Claimed Rewards */}
      {selectedTab === 'claimed' && (
        <div className="space-y-3">
          {userRewards.length === 0 ? (
            <p className="text-center text-secondary-text py-8">
              {i18n.language === 'ig' ? 'Ị wepụtabeghị ọnuunụ' : 'No rewards claimed yet'}
            </p>
          ) : (
            userRewards.map((userReward) => (
              <div
                key={userReward.$id}
                className="flex items-center gap-4 p-4 border border-soft-gray rounded-lg"
              >
                <span className="text-3xl">{userReward.reward?.icon}</span>
                <div className="flex-grow">
                  <h3 className="font-medium text-primary-text">
                    {i18n.language === 'ig' && userReward.reward?.name_igbo
                      ? userReward.reward.name_igbo
                      : userReward.reward?.name}
                  </h3>
                  <p className="text-sm text-secondary-text">
                    {new Date(userReward.redeemed_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  userReward.status === 'delivered'
                    ? 'bg-green-100 text-green-800'
                    : userReward.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {userReward.status}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Redeem Confirmation Modal */}
      {redeemingReward && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setRedeemingReward(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center">
              <span className="text-6xl mb-4 block">{redeemingReward.icon}</span>
              <h3 className="text-xl font-bold text-primary-text mb-2">
                {i18n.language === 'ig' && redeemingReward.name_igbo
                  ? redeemingReward.name_igbo
                  : redeemingReward.name}
              </h3>
              <p className="text-secondary-text mb-4">
                {i18n.language === 'ig' && redeemingReward.description_igbo
                  ? redeemingReward.description_igbo
                  : redeemingReward.description}
              </p>
              <p className="text-lg font-semibold text-olive-green mb-6">
                {t('rewards.pointsRequired')}: {redeemingReward.points_cost}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setRedeemingReward(null)}
                  className="flex-1 py-2 border border-soft-gray rounded-md hover:bg-light-lavender"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={() => handleRedeem(redeemingReward)}
                  className="flex-1 py-2 bg-olive-green text-white rounded-md hover:bg-opacity-90"
                >
                  {t('common.confirm')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsPanel;
