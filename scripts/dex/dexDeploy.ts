import { ethers } from "hardhat";

const token1Address = process.env.TOKEN1_ADDRESS;
const token2Address = process.env.TOKEN2_ADDRESS;
const feeAddress = process.env.FEE_ADDRESS;
console.log(token1Address, "\n", token2Address);

async function deploy() {
  if (!token1Address || !token2Address) throw "address not available";
  const MatchingEngine = await ethers.getContractFactory("MatchingEngine");
  const MatchingEngineContract = await MatchingEngine.deploy(
    token1Address!,
    token2Address!,
    feeAddress!,
    10,
    10
  );
  console.log("deploying matching engine");
  await MatchingEngineContract.deployed();
  console.log("deployed mathing engine");
  return MatchingEngineContract
  
}

deploy()
  .then(/* (t1) => console.log(t1) */)
  .catch((e) => {
    console.log(e);
    process.exitCode = 1;
  });
