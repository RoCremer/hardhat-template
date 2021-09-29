import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  await deployments.deploy("Greeter", {
    from: deployer,
    args: ["Hello, world!"],
    log: true,
  });
};
export default func;

func.tags = ["Greeter"];
