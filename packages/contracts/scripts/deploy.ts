import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🚀 Deploying PACE DAO contracts to Ethereum Sepolia...\n");

  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Network:", network.name, `(Chain ID: ${network.chainId})`);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy PaceToken
  console.log("📝 Deploying PaceToken...");
  const PaceToken = await ethers.getContractFactory("PaceToken");
  const paceToken = await PaceToken.deploy();
  await paceToken.waitForDeployment();
  const paceTokenAddress = await paceToken.getAddress();
  console.log("✅ PaceToken deployed to:", paceTokenAddress);
  console.log("   Initial supply:", ethers.formatEther(await paceToken.totalSupply()), "PACE\n");

  // Deploy PaceRewards
  console.log("📝 Deploying PaceRewards...");
  const PaceRewards = await ethers.getContractFactory("PaceRewards");
  const paceRewards = await PaceRewards.deploy(paceTokenAddress);
  await paceRewards.waitForDeployment();
  const paceRewardsAddress = await paceRewards.getAddress();
  console.log("✅ PaceRewards deployed to:", paceRewardsAddress);
  console.log("   Reward rate:", ethers.formatEther(await paceRewards.pacePerKm()), "PACE/km\n");

  // Fund the rewards contract with 100M PACE (10% of supply)
  console.log("💰 Funding PaceRewards contract with 100M PACE...");
  const fundAmount = ethers.parseEther("100000000"); // 100M PACE
  
  // Approve
  const approveTx = await paceToken.approve(paceRewardsAddress, fundAmount);
  await approveTx.wait();
  console.log("   Approved PaceRewards to spend PACE");
  
  // Fund
  const fundTx = await paceRewards.fundRewards(fundAmount);
  await fundTx.wait();
  console.log("   Funded with:", ethers.formatEther(fundAmount), "PACE\n");

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: Number(network.chainId),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      PaceToken: {
        address: paceTokenAddress,
        initialSupply: ethers.formatEther(await paceToken.totalSupply()),
      },
      PaceRewards: {
        address: paceRewardsAddress,
        pacePerKm: ethers.formatEther(await paceRewards.pacePerKm()),
        fundedAmount: ethers.formatEther(fundAmount),
      },
    },
  };

  // Save to shared package for mobile app
  const sharedDir = path.join(__dirname, "../../shared/src");
  const deploymentsFile = path.join(sharedDir, "deployments.json");
  
  fs.writeFileSync(deploymentsFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("📄 Deployment info saved to:", deploymentsFile);

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log("\n📋 Contract Addresses:");
  console.log("   PaceToken:", paceTokenAddress);
  console.log("   PaceRewards:", paceRewardsAddress);
  console.log("\n🔗 View on Etherscan:");
  console.log("   https://sepolia.etherscan.io/address/" + paceTokenAddress);
  console.log("   https://sepolia.etherscan.io/address/" + paceRewardsAddress);
  console.log("\n💡 Next Steps:");
  console.log("   1. Update .env with contract addresses");
  console.log("   2. Verify contracts on BaseScan (optional)");
  console.log("   3. Test reward distribution");
  console.log("=".repeat(60) + "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
