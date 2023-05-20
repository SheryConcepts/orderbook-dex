import { ethers } from "hardhat";

async function deploy() {
  const token2 = await ethers.getContractFactory("Token2");
  const tokenContract = await token2.deploy(ethers.utils.parseEther("1"));
  return await tokenContract.deployed();
}

deploy()
  .then((t2) => console.log(t2))
  .catch((e) => {
    console.log(e);
    process.exitCode = 1;
  });
