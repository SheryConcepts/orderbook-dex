import { ethers } from "hardhat";

async function deploy() {
  const token1 = await ethers.getContractFactory("Token1");
  const token1Contract = await token1.deploy(ethers.utils.parseEther("1"));
  console.log("Deploying token1")
  await token1Contract.deployed();
  console.log("Deployed token1")
  return token1Contract
}

deploy()
  .then((t1) => console.log(t1))
  .catch((e) => {
    console.log(e);
    process.exitCode = 1;
  });
