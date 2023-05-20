import { ethers } from "hardhat";

const feeAddress = process.env.FEE_ADDRESS;

async function deploy() {
  if (!feeAddress) throw "Fee Address is not provided";
 // deploy token1 
  const token1 = await ethers.getContractFactory("Token1");
  const token1Contract = await token1.deploy(ethers.utils.parseEther("10"));
  console.log("Deploying token1")
  await token1Contract.deployed();
  console.log("Deployed token1")
 // deploy token2 
  const token2 = await ethers.getContractFactory("Token2");
  const token2Contract = await token2.deploy(ethers.utils.parseEther("10"));
  console.log("Deploying token2")
  await token2Contract.deployed();
  console.log("Deployed token2");
  
  // deploy Matching engine with token1, token2, feeAddress, makerFee and takerFee
  const MatchingEngine = await ethers.getContractFactory("MatchingEngine");
  const MatchingEngineContract = await MatchingEngine.deploy(
    token1Contract.address,
    token2Contract.address,
    feeAddress!,
    10,
    10
  );
  console.log("deploying matching engine");
  await MatchingEngineContract.deployed();
  console.log("deployed mathing engine");
  
  return {
    MatchingEnineAddress: MatchingEngineContract.address,
    token1Address: token1Contract.address,
    token2Address: token2Contract.address,
    feeAddress
  }; 
}

deploy()
  .then((t1) => console.log(t1))
  .catch((e) => {
    console.log(e);
    process.exitCode = 1;
  });
