// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PaceToken
 * @dev $PACE ERC-20 token for the PACE DAO ecosystem
 * 
 * Features:
 * - Fixed initial supply (can be adjusted)
 * - Burnable (for token buybacks)
 * - Ownable (for controlled minting during initial phase)
 * - No transfer restrictions (fully liquid)
 */
contract PaceToken is ERC20, ERC20Burnable, Ownable {
    // Initial supply: 1 billion PACE tokens (18 decimals)
    uint256 public constant INITIAL_SUPPLY = 1_000_000_000 * 10**18;
    
    // Maximum supply cap (if minting is enabled)
    uint256 public constant MAX_SUPPLY = 10_000_000_000 * 10**18;
    
    event TokensMinted(address indexed to, uint256 amount, string reason);
    
    constructor() ERC20("PACE Token", "PACE") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    /**
     * @dev Mint new tokens (only owner, up to MAX_SUPPLY)
     * Used for: Treasury allocation, rewards distribution, partnerships
     */
    function mint(address to, uint256 amount, string calldata reason) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "PaceToken: exceeds max supply");
        _mint(to, amount);
        emit TokensMinted(to, amount, reason);
    }
    
    /**
     * @dev Returns the number of decimals (18, standard for ERC20)
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
