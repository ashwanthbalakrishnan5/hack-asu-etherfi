const hre = require("hardhat");

async function main() {
  const weETHAddress = "0xE3001B68a6D1Cb7099155a4CfFcdeC386f85452c";

  // Get the signer (you)
  const [signer] = await hre.ethers.getSigners();
  console.log("Sending from:", signer.address);

  // Get the contract
  const MockWeETH = await hre.ethers.getContractFactory("MockWeETH");
  const weETH = MockWeETH.attach(weETHAddress);

  // Recipient address (change this to the demo wallet address)
  const recipientAddress = process.env.RECIPIENT_ADDRESS || "0xYOUR_DEMO_WALLET_ADDRESS";
  const amount = process.env.AMOUNT || "10"; // 10 weETH by default

  console.log(`\nSending ${amount} weETH to ${recipientAddress}...`);

  const tx = await weETH.transfer(recipientAddress, hre.ethers.parseEther(amount));
  console.log("Transaction hash:", tx.hash);

  console.log("Waiting for transaction confirmation...");
  await tx.wait();

  // Check balances
  const yourBalance = await weETH.balanceOf(signer.address);
  const recipientBalance = await weETH.balanceOf(recipientAddress);

  console.log("\n=== Balances ===");
  console.log("Your balance:", hre.ethers.formatEther(yourBalance), "weETH");
  console.log("Recipient balance:", hre.ethers.formatEther(recipientBalance), "weETH");
  console.log("\n✅ Transfer successful!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
