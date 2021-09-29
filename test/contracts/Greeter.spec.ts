import { deployments, getNamedAccounts, ethers } from "hardhat";
import { expect } from "chai";

const runDefaultFixture = deployments.createFixture(async () => {
  await deployments.fixture(["Greeter"]);
  const { deployer } = await getNamedAccounts();
  const greeterFactory = await ethers.getContractFactory("Greeter");
  const greeterDeployment = await greeterFactory.deploy("Hello, world!");

  await ethers.provider.send("hardhat_impersonateAccount", [
    greeterDeployment.address,
  ]);

  return {
    deployer: {
      address: deployer,
      greeter: greeterDeployment,
    },
  };
});

describe("Greeter.sol", () => {
  describe("A standard deployment", () => {
    it("should deploy", async () => {
      const { deployer } = await runDefaultFixture();
      expect(deployer.greeter.address).to.contain("0x");
      expect(await deployer.greeter.greet()).to.equal("Hello, world!");
    });

    it("should allow changing the greet", async () => {
      const { deployer } = await runDefaultFixture();
      type ContractParams = Parameters<typeof deployer.greeter.setGreeting>;

      const validParams = ["Hola, mundo!"] as ContractParams;

      await deployer.greeter.setGreeting(...validParams);
      expect(await deployer.greeter.greet()).to.equal("Hola, mundo!");
    });
  });
});
