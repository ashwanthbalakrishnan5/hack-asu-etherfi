const hre = require("hardhat");

async function main() {
  console.log("Starting deployment...");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy MockWeETH
  console.log("\nDeploying MockWeETH...");
  const MockWeETH = await hre.ethers.getContractFactory("MockWeETH");
  const mockWeETH = await MockWeETH.deploy();
  await mockWeETH.waitForDeployment();
  const weETHAddress = await mockWeETH.getAddress();
  console.log("MockWeETH deployed to:", weETHAddress);

  // Deploy GameVault
  console.log("\nDeploying GameVault...");
  const GameVault = await hre.ethers.getContractFactory("GameVault");
  const gameVault = await GameVault.deploy(weETHAddress);
  await gameVault.waitForDeployment();
  const vaultAddress = await gameVault.getAddress();
  console.log("GameVault deployed to:", vaultAddress);

  // Output deployment info
  console.log("\n=== Deployment Summary ===");
  console.log("Network:", (await hre.ethers.provider.getNetwork()).name);
  console.log("MockWeETH:", weETHAddress);
  console.log("GameVault:", vaultAddress);
  console.log("\nAdd these to your .env.local:");
  console.log(`NEXT_PUBLIC_WEETH_ADDRESS=${weETHAddress}`);
  console.log(`NEXT_PUBLIC_VAULT_ADDRESS=${vaultAddress}`);

  // Mint some test tokens to deployer
  console.log("\nMinting test tokens to deployer...");
  const mintTx = await mockWeETH.mint(deployer.address, hre.ethers.parseEther("100"));
  await mintTx.wait();
  console.log("Minted 100 weETH to deployer");

  console.log("\nDeployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
