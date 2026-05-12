import type { RewardChallenge, RewardRedemption, RewardTier, RewardTransaction } from '@/types';
import { HP_TRANSACTIONS, REWARD_CHALLENGES, REWARD_REDEMPTIONS, REWARD_TIERS } from '@/services/mocks/platform';

export interface RewardsSnapshot {
  balance: number;
  tier: RewardTier;
  tiers: RewardTier[];
  redemptions: RewardRedemption[];
  challenges: RewardChallenge[];
  transactions: RewardTransaction[];
}

export async function getRewardsSnapshot(): Promise<RewardsSnapshot> {
  // TODO: Replace mock implementation with backend endpoint.
  // Expected endpoint: GET /api/rewards
  return Promise.resolve({
    balance: 248,
    tier: REWARD_TIERS[2],
    tiers: REWARD_TIERS,
    redemptions: REWARD_REDEMPTIONS,
    challenges: REWARD_CHALLENGES,
    transactions: HP_TRANSACTIONS,
  });
}
