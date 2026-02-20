// Contract ABIs and addresses for PACE DAO

import PaceTokenABI from './PaceToken.json';
import PaceRewardsABI from './PaceRewards.json';
import deployments from './deployments.json';

// Export ABIs
export const PACE_TOKEN_ABI = PaceTokenABI.abi;
export const PACE_REWARDS_ABI = PaceRewardsABI.abi;

// Export contract addresses (from deployment)
export const PACE_TOKEN_ADDRESS = deployments.contracts.PaceToken.address as `0x${string}`;
export const PACE_REWARDS_ADDRESS = deployments.contracts.PaceRewards.address as `0x${string}`;

// Export deployment info
export const DEPLOYMENT_INFO = deployments;

// Chain configuration
export const CHAIN_CONFIG = {
  chainId: deployments.chainId,
  name: deployments.network,
  rpcUrl: process.env.EXPO_PUBLIC_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com',
  blockExplorer: process.env.EXPO_PUBLIC_BLOCK_EXPLORER || 'https://sepolia.etherscan.io',
} as const;
