'use client';

import React, { useState, useEffect } from 'react';
import { Award, ShoppingBag, Trophy, ArrowUpRight, CheckCircle2, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { redeemEcoReward } from '@/actions/rewards';
import { ActiveUser } from '../ui/RoleSwitcher';

export interface RewardItem {
  id: string;
  title: string;
  category: string;
  cost: number;
  icon: string;
  description: string;
  stock: number;
}

const REWARDS_CATALOG: RewardItem[] = [
  {
    id: 'rew-1',
    title: '$10 Public Transit Voucher',
    category: 'TRANSIT',
    cost: 100,
    icon: '🚌',
    description: 'Valid for subway, bus, and light rail rides across the metro region.',
    stock: 50,
  },
  {
    id: 'rew-2',
    title: '$15 Organic Coffee & Bakery Pass',
    category: 'DINING',
    cost: 150,
    icon: '☕',
    description: 'Redeemable at participating zero-waste artisan cafes.',
    stock: 35,
  },
  {
    id: 'rew-3',
    title: 'Solar LED Portable Lamp',
    category: 'ECO_MERCH',
    cost: 300,
    icon: '☀️',
    description: 'Ultra-bright rechargeable solar light for camping or home emergency.',
    stock: 12,
  },
  {
    id: 'rew-4',
    title: '1-Month Unlimited Metro Pass',
    category: 'TRANSIT',
    cost: 500,
    icon: '🚇',
    description: 'Full 30-day citywide transit access badge.',
    stock: 8,
  },
];

interface LeaderboardUser {
  id: string;
  name: string;
  avatarUrl?: string | null;
  ecoPoints: number;
  _count: { reports: number };
}

interface TransactionItem {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string | Date;
}

interface RewardsCatalogProps {
  user: ActiveUser;
  leaderboard: LeaderboardUser[];
  transactions: TransactionItem[];
  onPointsUpdate?: (newPoints: number) => void;
}

export function RewardsCatalog({ user, leaderboard, transactions, onPointsUpdate }: RewardsCatalogProps) {
  const [activeTab, setActiveTab] = useState<'CATALOG' | 'LEADERBOARD' | 'HISTORY'>('CATALOG');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentPoints, setCurrentPoints] = useState(user.ecoPoints);

  // Re-sync from prop when points change externally (admin validation, etc.)
  useEffect(() => {
    setCurrentPoints(user.ecoPoints);
  }, [user.ecoPoints]);

  const handleRedeem = async (reward: RewardItem) => {
    if (currentPoints < reward.cost) {
      setMessage({ type: 'error', text: `Insufficient Eco-Points. Need ${reward.cost} PTS.` });
      return;
    }

    setLoadingId(reward.id);
    setMessage(null);

    const res = await redeemEcoReward(reward.cost, reward.title);
    setLoadingId(null);

    if (res.success) {
      const updatedPts = res.newPoints ?? currentPoints - reward.cost;
      setCurrentPoints(updatedPts);
      if (onPointsUpdate) onPointsUpdate(updatedPts);
      setMessage({
        type: 'success',
        text: `Successfully redeemed "${reward.title}"! Voucher code sent to ${user.email}.`,
      });
    } else {
      setMessage({ type: 'error', text: res.error || 'Redemption failed' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="glass-card p-6 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-xl shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl">
              🏆
            </div>
          </div>
          <div>
            <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-0.5">
              Eco-Points & Gamification
            </div>
            <h2 className="text-2xl font-extrabold text-slate-100">Reward Marketplace</h2>
            <p className="text-xs text-slate-400">Earn points for waste reports & drop-offs. Redeem for eco-vouchers!</p>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-slate-950/80 px-6 py-3.5 rounded-2xl border border-slate-800 shadow-inner">
          <div className="text-center">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Available Balance</div>
            <div className="text-2xl font-extrabold text-amber-400 tracking-tight flex items-center gap-1 justify-center">
              <span>{currentPoints}</span>
              <span className="text-xs text-amber-300 font-normal">PTS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('CATALOG')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'CATALOG'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Redeem Marketplace
        </button>

        <button
          onClick={() => setActiveTab('LEADERBOARD')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'LEADERBOARD'
              ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Leaderboard
        </button>

        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'HISTORY'
              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          Points History
        </button>
      </div>

      {/* Notification Toast */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-3 border ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tab Content: CATALOG */}
      {activeTab === 'CATALOG' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {REWARDS_CATALOG.map((reward) => {
            const canAfford = currentPoints >= reward.cost;
            const isLoading = loadingId === reward.id;

            return (
              <div key={reward.id} className="glass-card p-5 flex flex-col justify-between hover:border-amber-500/40 transition-all">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-3xl">{reward.icon}</span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {reward.cost} PTS
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-100 mb-1">{reward.title}</h3>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">{reward.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || isLoading}
                    className={`w-full text-xs py-2.5 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                      canAfford
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                    ) : canAfford ? (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Redeem Reward</span>
                      </>
                    ) : (
                      <span>Needs {reward.cost - currentPoints} More PTS</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab Content: LEADERBOARD */}
      {activeTab === 'LEADERBOARD' && (
        <div className="glass-card p-6">
          <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Top Eco-Citizens Leaderboard
          </h3>

          <div className="space-y-3">
            {leaderboard.map((item, index) => {
              const rank = index + 1;
              let badge = `#${rank}`;
              let rankStyle = 'text-slate-400 bg-slate-800';

              if (rank === 1) {
                badge = '🥇 1st';
                rankStyle = 'text-amber-300 bg-amber-500/20 border-amber-500/40';
              } else if (rank === 2) {
                badge = '🥈 2nd';
                rankStyle = 'text-slate-200 bg-slate-400/20 border-slate-400/40';
              } else if (rank === 3) {
                badge = '🥉 3rd';
                rankStyle = 'text-amber-600 bg-amber-700/20 border-amber-700/40';
              }

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${rankStyle}`}>
                      {badge}
                    </span>

                    <img
                      src={item.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                      alt={item.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />

                    <div>
                      <div className="text-sm font-bold text-slate-100">{item.name}</div>
                      <div className="text-xs text-slate-400">{item._count?.reports || 0} Waste Reports Validated</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-extrabold text-amber-400">{item.ecoPoints} PTS</div>
                    <div className="text-[10px] text-emerald-400 font-medium">Eco Guardian</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content: HISTORY */}
      {activeTab === 'HISTORY' && (
        <div className="glass-card p-6">
          <h3 className="text-base font-bold text-slate-100 mb-4">Points Activity History</h3>

          {transactions.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No transaction records found yet.</p>
          ) : (
            <div className="space-y-2.5">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-200">{tx.description}</div>
                    <div className="text-[11px] text-slate-500">{new Date(tx.createdAt).toLocaleDateString()}</div>
                  </div>

                  <div
                    className={`font-mono font-bold text-sm ${
                      tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount} PTS
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
