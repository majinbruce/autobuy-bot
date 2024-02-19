const { ethers } = require("hardhat");

async function main() {
  const totalSupply = 10000000;
  const TOKEN = await ethers.getContractFactory("TokenA");
  const token = await TOKEN.deploy(totalSupply);
  await token.deployed();

  console.log("\n token deployed at", token.address);
  //0xf229F65C7b2a4258a04597E4B4e25879F029c633 token address obtained
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
