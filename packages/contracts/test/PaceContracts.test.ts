import { expect } from "chai";
import { ethers } from "hardhat";
import { PaceToken, PaceRewards } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("PACE DAO Smart Contracts", function () {
  let paceToken: PaceToken;
  let paceRewards: PaceRewards;
  let owner: SignerWithAddress;
  let runner1: SignerWithAddress;
  let runner2: SignerWithAddress;

  beforeEach(async function () {
    [owner, runner1, runner2] = await ethers.getSigners();

    // Deploy PaceToken
    const PaceToken = await ethers.getContractFactory("PaceToken");
    paceToken = await PaceToken.deploy();
    await paceToken.waitForDeployment();

    // Deploy PaceRewards
    const PaceRewards = await ethers.getContractFactory("PaceRewards");
    paceRewards = await PaceRewards.deploy(await paceToken.getAddress());
    await paceRewards.waitForDeployment();

    // Fund rewards contract
    const fundAmount = ethers.parseEther("100000000"); // 100M PACE
    await paceToken.approve(await paceRewards.getAddress(), fundAmount);
    await paceRewards.fundRewards(fundAmount);
  });

  describe("PaceToken", function () {
    it("Should have correct initial supply", async function () {
      const expectedSupply = ethers.parseEther("1000000000"); // 1B
      expect(await paceToken.totalSupply()).to.equal(expectedSupply);
    });

    it("Should have correct name and symbol", async function () {
      expect(await paceToken.name()).to.equal("PACE Token");
      expect(await paceToken.symbol()).to.equal("PACE");
    });

    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      await paceToken.mint(runner1.address, mintAmount, "Test mint");
      expect(await paceToken.balanceOf(runner1.address)).to.equal(mintAmount);
    });

    it("Should not allow non-owner to mint", async function () {
      const mintAmount = ethers.parseEther("1000");
      await expect(
        paceToken.connect(runner1).mint(runner1.address, mintAmount, "Test")
      ).to.be.reverted;
    });

    it("Should allow burning tokens", async function () {
      const burnAmount = ethers.parseEther("1000");
      await paceToken.transfer(runner1.address, burnAmount);
      await paceToken.connect(runner1).burn(burnAmount);
      expect(await paceToken.balanceOf(runner1.address)).to.equal(0);
    });
  });

  describe("PaceRewards", function () {
    it("Should queue rewards correctly", async function () {
      const distanceKm = ethers.parseEther("5"); // 5 km
      const streak = 0;
      const pace = 300; // 5:00 min/km

      await paceRewards.queueReward(runner1.address, distanceKm, streak, pace);

      const pendingCount = await paceRewards.getPendingRewardCount(runner1.address);
      expect(pendingCount).to.equal(1);

      const pendingAmount = await paceRewards.getPendingRewardAmount(runner1.address);
      const expectedReward = ethers.parseEther("50"); // 5 km * 10 PACE/km
      expect(pendingAmount).to.equal(expectedReward);
    });

    it("Should apply streak bonus correctly", async function () {
      const distanceKm = ethers.parseEther("10"); // 10 km
      const streak = 5; // 5 day streak
      const pace = 300;

      await paceRewards.queueReward(runner1.address, distanceKm, streak, pace);

      const pendingAmount = await paceRewards.getPendingRewardAmount(runner1.address);
      // Base: 10 km * 10 PACE = 100 PACE
      // Streak bonus: 5 days * 10% = 50% bonus
      // Total: 100 * 1.5 = 150 PACE
      const expectedReward = ethers.parseEther("150");
      expect(pendingAmount).to.equal(expectedReward);
    });

    it("Should cap streak bonus at max days", async function () {
      const distanceKm = ethers.parseEther("10"); // 10 km
      const streak = 20; // 20 day streak (should cap at 7)
      const pace = 300;

      await paceRewards.queueReward(runner1.address, distanceKm, streak, pace);

      const pendingAmount = await paceRewards.getPendingRewardAmount(runner1.address);
      // Base: 100 PACE
      // Streak bonus capped at 7 days: 7 * 10% = 70% bonus
      // Total: 100 * 1.7 = 170 PACE
      const expectedReward = ethers.parseEther("170");
      expect(pendingAmount).to.equal(expectedReward);
    });

    it("Should reject pace that's too fast (anti-cheat)", async function () {
      const distanceKm = ethers.parseEther("5");
      const streak = 0;
      const pace = 120; // 2:00 min/km (too fast, likely cheating)

      await expect(
        paceRewards.queueReward(runner1.address, distanceKm, streak, pace)
      ).to.be.revertedWith("PaceRewards: pace too fast (possible cheating)");
    });

    it("Should allow claiming rewards", async function () {
      const distanceKm = ethers.parseEther("5");
      const streak = 0;
      const pace = 300;

      await paceRewards.queueReward(runner1.address, distanceKm, streak, pace);

      const initialBalance = await paceToken.balanceOf(runner1.address);
      await paceRewards.connect(runner1).claimRewards();
      const finalBalance = await paceToken.balanceOf(runner1.address);

      const expectedReward = ethers.parseEther("50");
      expect(finalBalance - initialBalance).to.equal(expectedReward);

      // Pending rewards should be cleared
      const pendingCount = await paceRewards.getPendingRewardCount(runner1.address);
      expect(pendingCount).to.equal(0);
    });

    it("Should track total earned and claimed", async function () {
      const distanceKm = ethers.parseEther("5");
      const streak = 0;
      const pace = 300;

      await paceRewards.queueReward(runner1.address, distanceKm, streak, pace);
      await paceRewards.connect(runner1).claimRewards();

      const expectedAmount = ethers.parseEther("50");
      expect(await paceRewards.totalEarned(runner1.address)).to.equal(expectedAmount);
      expect(await paceRewards.totalClaimed(runner1.address)).to.equal(expectedAmount);
    });

    it("Should allow owner to update reward parameters", async function () {
      const newPacePerKm = ethers.parseEther("20"); // 20 PACE/km
      const newStreakBonus = 15; // 15% per day
      const newMaxStreak = 10;
      const newMinPace = 200;

      await paceRewards.updateRewardParameters(
        newPacePerKm,
        newStreakBonus,
        newMaxStreak,
        newMinPace
      );

      expect(await paceRewards.pacePerKm()).to.equal(newPacePerKm);
      expect(await paceRewards.streakBonusPercent()).to.equal(newStreakBonus);
      expect(await paceRewards.maxStreakDays()).to.equal(newMaxStreak);
      expect(await paceRewards.minPaceSecondsPerKm()).to.equal(newMinPace);
    });
  });
});
