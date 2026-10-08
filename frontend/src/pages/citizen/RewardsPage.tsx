import React, { useEffect, useState } from 'react';
import { CitizenLayout } from '../../layouts/CitizenLayout';
import { rewardService } from '../../services/rewardService';
import { Reward, UserReward } from '../../types';
import { Award, Gift, CheckCircle2, AlertCircle, ShoppingBag, Clock } from 'lucide-react';

export const RewardsPage: React.FC = () => {
  const [points, setPoints] = useState<number>(0);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [myRedemptions, setMyRedemptions] = useState<UserReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [ptsData, rewardsData, historyData] = await Promise.all([
        rewardService.getUserPoints(),
        rewardService.getAvailableRewards(),
        rewardService.getMyRedemptions(),
      ]);
      setPoints(ptsData.points);
      setRewards(rewardsData);
      setMyRedemptions(historyData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load eco-rewards.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRedeem = async (rewardId: string, cost: number) => {
    if (points < cost) {
      alert('Insufficient Eco-Points for this reward.');
      return;
    }
    if (!window.confirm('Confirm point redemption for this reward voucher?')) return;

    try {
      setRedeemingId(rewardId);
      setError(null);
      const result = await rewardService.redeemReward(rewardId);
      setSuccess(`Reward redeemed! Code: ${result.redemptionCode || 'ECO-' + Math.floor(Math.random()*900000 + 100000)}`);
      fetchData();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to redeem reward.');
    } finally {
      setRedeemingId(null);
    }
  };

  return (
    <CitizenLayout title="Eco-Points & Rewards">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Points Banner */}
        <div className="bg-gradient-to-r from-emerald-900/80 via-teal-900/80 to-slate-900 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Addis Green Citizen Rewards
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Your Current Balance
            </h2>
            <p className="text-slate-300 text-sm max-w-md">
              Earn Eco-Points by reporting verified waste sites and scheduling recyclable pickups.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-emerald-500/40 rounded-2xl p-6 text-center shadow-inner min-w-[200px]">
            <div className="flex items-center justify-center gap-2 text-amber-400 mb-1">
              <Award className="w-8 h-8" />
            </div>
            <div className="text-4xl font-black text-white">{points}</div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mt-1">
              Eco-Points
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Available Rewards Marketplace */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-emerald-400" /> Available Rewards & Vouchers
          </h3>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
            </div>
          ) : rewards.length === 0 ? (
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-8 text-center text-slate-400 text-sm">
              No rewards available at this moment. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="bg-slate-800/80 border border-slate-700/60 hover:border-emerald-500/40 rounded-2xl p-6 shadow-lg flex flex-col justify-between transition"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {reward.pointsRequired} Points
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-lg mb-2">{reward.title}</h4>
                    <p className="text-slate-400 text-xs mb-4">{reward.description}</p>
                  </div>

                  <button
                    onClick={() => handleRedeem(reward.id, reward.pointsRequired)}
                    disabled={points < reward.pointsRequired || redeemingId === reward.id}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-slate-950 font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {redeemingId === reward.id ? 'Redeeming...' : points < reward.pointsRequired ? 'Insufficient Points' : 'Redeem Voucher'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Redemption History */}
        {myRedemptions.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-400" /> Your Redemption History
            </h3>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 divide-y divide-slate-700/60">
              {myRedemptions.map((red) => (
                <div key={red.id} className="py-3 px-2 flex items-center justify-between text-sm">
                  <div>
                    <span className="font-bold text-white">{red.reward?.title || 'Eco Reward Voucher'}</span>
                    <span className="block text-xs text-slate-400 mt-0.5">Code: {red.redemptionCode}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-400 font-bold">{red.reward?.pointsRequired || 0} Points</span>
                    <span className="block text-[11px] text-slate-500 mt-0.5">
                      {new Date(red.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CitizenLayout>
  );
};
