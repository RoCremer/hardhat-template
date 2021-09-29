import { deployments, getNamedAccounts } from "hardhat";

async function main() {
  const { deployer } = await getNamedAccounts();

  await deployments.execute(
    "Greeter",
    { from: deployer, log: true },
    "setGreeting",
    "Gm"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
