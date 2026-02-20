// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./PaceToken.sol";

/**
 * @title PaceRewards
 * @dev Manages $PACE token rewards for run activities (Vibe Mining)
 * 
 * How it works:
 * 1. Backend verifies GPS run data (distance, pace, etc.)
 * 2. Backend calls queueReward() with user address, distance, and XP
 * 3. User can claim their pending rewards at any time
 * 4. Rewards include streak bonuses and anti-gaming measures
 */
contract PaceRewards is Ownable, ReentrancyGuard {
    PaceToken public paceToken;
    
    // Reward parameters (adjustable by owner)
    uint256 public pacePerKm = 10 * 10**18; // 10 PACE per km
    uint256 public streakBonusPercent = 10; // 10% bonus per day of streak (max 7 days)
    uint256 public maxStreakDays = 7;
    
    // Anti-gaming: minimum pace (max speed) to prevent car cheating
    uint256 public minPaceSecondsPerKm = 180; // 3:00 min/km (very fast, but possible)
    
    // Reward tracking
    struct PendingReward {
        uint256 amount;
        uint256 timestamp;
        uint256 distanceKm; // in wei precision (1 km = 10**18)
        uint256 streak;
    }
    
    mapping(address => PendingReward[]) public pendingRewards;
    mapping(address => uint256) public totalClaimed;
    mapping(address => uint256) public totalEarned;
    
    // Events
    event RewardQueued(
        address indexed user,
        uint256 amount,
        uint256 distanceKm,
        uint256 streak,
        uint256 timestamp
    );
    event RewardClaimed(address indexed user, uint256 amount, uint256 count);
    event RewardParametersUpdated(
        uint256 pacePerKm,
        uint256 streakBonusPercent,
        uint256 maxStreakDays,
        uint256 minPaceSecondsPerKm
    );
    
    constructor(address _paceToken) Ownable(msg.sender) {
        paceToken = PaceToken(_paceToken);
    }
    
    /**
     * @dev Queue a reward for a user (called by backend after GPS verification)
     * @param user The runner's address
     * @param distanceKm Distance in km (with 18 decimals precision, e.g., 5.5km = 5.5 * 10**18)
     * @param streak Current streak in days
     * @param paceSecondsPerKm Average pace in seconds per km
     */
    function queueReward(
        address user,
        uint256 distanceKm,
        uint256 streak,
        uint256 paceSecondsPerKm
    ) external onlyOwner {
        require(user != address(0), "PaceRewards: invalid user");
        require(distanceKm > 0, "PaceRewards: distance must be > 0");
        require(paceSecondsPerKm >= minPaceSecondsPerKm, "PaceRewards: pace too fast (possible cheating)");
        
        // Calculate base reward
        uint256 baseReward = (distanceKm * pacePerKm) / 10**18;
        
        // Apply streak bonus (capped at maxStreakDays)
        uint256 effectiveStreak = streak > maxStreakDays ? maxStreakDays : streak;
        uint256 streakMultiplier = 100 + (effectiveStreak * streakBonusPercent);
        uint256 finalReward = (baseReward * streakMultiplier) / 100;
        
        // Queue reward
        pendingRewards[user].push(PendingReward({
            amount: finalReward,
            timestamp: block.timestamp,
            distanceKm: distanceKm,
            streak: streak
        }));
        
        totalEarned[user] += finalReward;
        
        emit RewardQueued(user, finalReward, distanceKm, streak, block.timestamp);
    }
    
    /**
     * @dev Claim all pending rewards
     */
    function claimRewards() external nonReentrant {
        PendingReward[] storage rewards = pendingRewards[msg.sender];
        require(rewards.length > 0, "PaceRewards: no pending rewards");
        
        uint256 totalAmount = 0;
        uint256 count = rewards.length;
        
        for (uint256 i = 0; i < count; i++) {
            totalAmount += rewards[i].amount;
        }
        
        require(totalAmount > 0, "PaceRewards: no rewards to claim");
        
        // Clear pending rewards
        delete pendingRewards[msg.sender];
        
        // Update total claimed
        totalClaimed[msg.sender] += totalAmount;
        
        // Transfer tokens
        require(
            paceToken.transfer(msg.sender, totalAmount),
            "PaceRewards: transfer failed"
        );
        
        emit RewardClaimed(msg.sender, totalAmount, count);
    }
    
    /**
     * @dev Get pending reward count for a user
     */
    function getPendingRewardCount(address user) external view returns (uint256) {
        return pendingRewards[user].length;
    }
    
    /**
     * @dev Get total pending reward amount for a user
     */
    function getPendingRewardAmount(address user) external view returns (uint256) {
        PendingReward[] storage rewards = pendingRewards[user];
        uint256 total = 0;
        for (uint256 i = 0; i < rewards.length; i++) {
            total += rewards[i].amount;
        }
        return total;
    }
    
    /**
     * @dev Update reward parameters (owner only)
     */
    function updateRewardParameters(
        uint256 _pacePerKm,
        uint256 _streakBonusPercent,
        uint256 _maxStreakDays,
        uint256 _minPaceSecondsPerKm
    ) external onlyOwner {
        pacePerKm = _pacePerKm;
        streakBonusPercent = _streakBonusPercent;
        maxStreakDays = _maxStreakDays;
        minPaceSecondsPerKm = _minPaceSecondsPerKm;
        
        emit RewardParametersUpdated(
            _pacePerKm,
            _streakBonusPercent,
            _maxStreakDays,
            _minPaceSecondsPerKm
        );
    }
    
    /**
     * @dev Withdraw tokens from contract (emergency only)
     */
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(
            paceToken.transfer(owner(), amount),
            "PaceRewards: withdrawal failed"
        );
    }
    
    /**
     * @dev Fund the rewards contract with PACE tokens
     */
    function fundRewards(uint256 amount) external onlyOwner {
        require(
            paceToken.transferFrom(msg.sender, address(this), amount),
            "PaceRewards: funding failed"
        );
    }
}
