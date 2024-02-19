const { ethers } = require("hardhat");

async function main() {
  const PancakeSwapper = await ethers.getContractFactory("PancakeSwapper");
  const PancakeSwapperInstance = await PancakeSwapper.deploy();
  await PancakeSwapperInstance.deployed();

  console.log("\n PancakeSwapper deployed at", PancakeSwapperInstance.address);
  //0xf229F65C7b2a4258a04597E4B4e25879F029c633 token address obtained
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
