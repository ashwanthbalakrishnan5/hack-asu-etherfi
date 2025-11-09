const hre = require("hardhat");

async function main() {
  const weETHAddress = "0xE3001B68a6D1Cb7099155a4CfFcdeC386f85452c";

  // Get the signer
  const [signer] = await hre.ethers.getSigners();
  console.log("Minting weETH to:", signer.address);

  // Get the contract
  const MockWeETH = await hre.ethers.getContractFactory("MockWeETH");
  const weETH = MockWeETH.attach(weETHAddress);

  // Call the faucet function
  console.log("\nCalling faucet() to mint 10 weETH...");
  const tx = await weETH.faucet();
  console.log("Transaction hash:", tx.hash);

  console.log("Waiting for transaction confirmation...");
  await tx.wait();

  // Check balance
  const balance = await weETH.balanceOf(signer.address);
  console.log("\nYour weETH balance:", hre.ethers.formatEther(balance), "weETH");

  console.log("\n✅ Success! You now have weETH tokens.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
