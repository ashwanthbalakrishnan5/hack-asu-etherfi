// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockWeETH
 * @notice Mock weETH token for testing purposes on Sepolia testnet
 * @dev This is a simplified version for demo purposes only
 */
contract MockWeETH is ERC20, Ownable {
    uint8 private _decimals;

    constructor() ERC20("Wrapped Ether.fi ETH", "weETH") Ownable(msg.sender) {
        _decimals = 18;
        // Mint initial supply to deployer for testing
        _mint(msg.sender, 10000 * 10 ** decimals());
    }

    /**
     * @notice Mint tokens to an address (for testing)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @notice Faucet function for users to get test tokens
     * @dev Mints 10 weETH to the caller
     */
    function faucet() external {
        _mint(msg.sender, 10 * 10 ** decimals());
    }

    /**
     * @notice Override decimals
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}
