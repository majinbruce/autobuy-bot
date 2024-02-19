// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenA is ERC20, Ownable {
    constructor(uint256 totalSupply) ERC20("TokenA", "MTKN") {
        _mint(msg.sender, totalSupply);
    }
}
