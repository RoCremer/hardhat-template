import { deployments } from "hardhat";
import { expect } from "chai";

const runDefaultFixture = deployments.createFixture(
  async ({ getNamedAccounts, ethers }) => {
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
  }
);

describe("Greeter.sol", () => {
  const fixture = runDefaultFixture;
  describe("A standard deployment", () => {
    it("should deploy", async () => {
      const { deployer } = await fixture();
      expect(deployer.greeter.address).to.contain("0x");
      expect(await deployer.greeter.greet()).to.equal("Hello, world!");
    });

    it("should allow changing the greet", async () => {
      const { deployer } = await fixture();
      type ContractParams = Parameters<typeof deployer.greeter.setGreeting>;

      const validParams = ["Hola, mundo!"] as ContractParams;

      await deployer.greeter.setGreeting(...validParams);
      expect(await deployer.greeter.greet()).to.equal("Hola, mundo!");
    });
  });
});
