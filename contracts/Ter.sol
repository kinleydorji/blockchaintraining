// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Ter is ERC20, Ownable{
    constructor() ERC20("Royal Monetary Authority", "Ter") Ownable(msg.sender){
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    function mint(uint256 amount)public onlyOwner{
        _mint(msg.sender, amount);
    }

    function burn(uint256 amount) public onlyOwner{
        _burn(msg.sender, amount);
    }
}