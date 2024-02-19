/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: "../.env" });
require("@nomiclabs/hardhat-etherscan");

const { RINKEBY_PRIVATE_KEY, ALCHEMY_API_KEY, ETHERSCAN_API_KEY } = process.env;

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    bsc: {
      url: ALCHEMY_API_KEY,
      accounts: [`0x${RINKEBY_PRIVATE_KEY}`],
    },
  },

  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
