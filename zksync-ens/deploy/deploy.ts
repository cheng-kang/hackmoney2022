import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

const USDC_ADDRESS = "0xd35cceead182dcee0f148ebac9447da2c4d449c4";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the L2ENSRegistry contract`);

  // Initialize the wallet.
  const wallet = new Wallet("0xe149168fbfeb2dbe7dafbca0ae32c2f56e1a41f1d5f619ac496c45d4018e9e2a");

  // Create deployer object and load the artifact of the contract we want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("L2ENSRegistry");

  // Deposit some funds to L2 in order to be able to perform L2 transactions.
  // const depositAmount = ethers.utils.parseEther("0.001");
  // const depositHandle = await deployer.zkWallet.deposit({
  //   to: deployer.zkWallet.address,
  //   token: utils.ETH_ADDRESS,
  //   amount: depositAmount,
  // });
  // Wait until the deposit is processed on zkSync
  // await depositHandle.wait();

  // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
  const L2ENSRegistryContract = await deployer.deploy(artifact, [], USDC_ADDRESS);

  // Show the contract info.
  const contractAddress = L2ENSRegistryContract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);


  const artifactResolver = await deployer.loadArtifact("L2PublicResolver");
  const L2PublicResolverContract = await deployer.deploy(artifactResolver, [`${contractAddress}`], USDC_ADDRESS);

  // Show the contract info.
  const contractAddressResolver = L2PublicResolverContract.address;
  console.log(`${artifactResolver.contractName} was deployed to ${contractAddressResolver}`);
}