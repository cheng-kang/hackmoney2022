module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deploy } = deployments;
  const { owner } = await getNamedAccounts();
  if(!network.config.gatewayUrls){
      throw("gatewayUrls is missing on hardhat.config.js");
  }
  if(!network.config.signers){
      throw("signers is missing on hardhat.config.js");
  }

  try {
    const res = await deploy("OffchainResolver", {
      from: owner,
      args: [
        network.config.gatewayUrls,
        network.config.signers,
      ],
      log: true,
    });
    console.log(res);
  } catch (error) {
    console.error(error);
  }
};
module.exports.tags = ["test", "demo"];
