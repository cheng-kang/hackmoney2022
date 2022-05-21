const { task } = require("hardhat/config");

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");
require("hardhat-deploy-ethers");

const owner = [process.env.OWNER_PRIVATE_KEY];
const signers = process.env.SIGNERS.split(";;");
const gatewayUrls = (process.env.GATEWAY_URL || "").split(";;").map((url) => `${url}/{sender}/{data}.json`);

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  solidity: "0.8.10",
  networks: {
    hardhat: {
      throwOnCallFailures: false,
      signers,
      gatewayUrls,
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`,
      tags: ["test", "demo"],
      chainId: 3,
      accounts: owner,
      signers,
      gatewayUrls,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`,
      tags: ["test", "demo"],
      chainId: 4,
      accounts: owner,
      signers,
      gatewayUrls,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_ID}`,
      tags: ["test", "demo"],
      chainId: 5,
      accounts: owner,
      signers,
      gatewayUrls,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`,
      tags: ["demo"],
      chainId: 1,
      accounts: owner,
      signers,
      gatewayUrls,
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    owner: {
      default: 0,
    },
    deployer: {
      default: 1,
    },
  },
};
