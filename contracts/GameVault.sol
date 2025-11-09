// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GameVault
 * @notice Minimal vault for holding weETH principal in the no-loss prediction game
 * @dev Principal is safe and withdrawable. YC balances are managed off-chain.
 */
contract GameVault is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;

    // weETH token address
    IERC20 public immutable weETH;

    // Mapping of user address to their deposited principal balance
    mapping(address => uint256) public principalBalances;

    // Total principal deposited in the vault
    uint256 public totalPrincipal;

    // Events
    event Deposited(address indexed user, uint256 amount, uint256 newBalance);
    event Withdrawn(address indexed user, uint256 amount, uint256 newBalance);
    event EmergencyWithdraw(address indexed user, uint256 amount);

    /**
     * @notice Constructor
     * @param _weETH Address of the weETH token contract
     */
    constructor(address _weETH) Ownable(msg.sender) {
        require(_weETH != address(0), "GameVault: Invalid weETH address");
        weETH = IERC20(_weETH);
    }

    /**
     * @notice Deposit weETH into the vault
     * @param amount Amount of weETH to deposit
     */
    function deposit(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "GameVault: Amount must be greater than 0");

        // Transfer weETH from user to vault
        weETH.safeTransferFrom(msg.sender, address(this), amount);

        // Update balances
        principalBalances[msg.sender] += amount;
        totalPrincipal += amount;

        emit Deposited(msg.sender, amount, principalBalances[msg.sender]);
    }

    /**
     * @notice Withdraw weETH principal from the vault
     * @param amount Amount of weETH to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "GameVault: Amount must be greater than 0");
        require(
            principalBalances[msg.sender] >= amount,
            "GameVault: Insufficient balance"
        );

        // Update balances
        principalBalances[msg.sender] -= amount;
        totalPrincipal -= amount;

        // Transfer weETH to user
        weETH.safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount, principalBalances[msg.sender]);
    }

    /**
     * @notice Get the principal balance of a user
     * @param user Address of the user
     * @return The principal balance
     */
    function getPrincipalBalance(address user) external view returns (uint256) {
        return principalBalances[user];
    }

    /**
     * @notice Emergency pause function (owner only)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause the contract (owner only)
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Emergency withdrawal function when paused
     * @dev Allows users to withdraw even when contract is paused
     */
    function emergencyWithdraw() external nonReentrant whenPaused {
        uint256 balance = principalBalances[msg.sender];
        require(balance > 0, "GameVault: No balance to withdraw");

        // Update balances
        principalBalances[msg.sender] = 0;
        totalPrincipal -= balance;

        // Transfer weETH to user
        weETH.safeTransfer(msg.sender, balance);

        emit EmergencyWithdraw(msg.sender, balance);
    }
}
