import { ethers, } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import {ContractReceipt} from "ethers";

const feeAddress = process.env.FEE_ADDRESS;

function getEventArguments(receipt: ContractReceipt, eventName: string) {
  // Filter events based on event name
  const filteredEvents = receipt.events!.filter((event) => event.event === eventName);

  // Extract and return the event arguments
  const eventArguments = filteredEvents.map((event) => event.args);

  return eventArguments;
}

async function deployDexFixture() {
  if (!feeAddress) throw "Fee Address is not provided";
  const signers = await ethers.getSigners();
  // deploy token1
  const token1 = await ethers.getContractFactory("Token1");
  const token1Contract = await token1.deploy(ethers.utils.parseEther("10"));
  // console.log("Deploying token1")
  await token1Contract.deployed();
  // console.log("Deployed token1")

  // deploy token2
  const token2 = await ethers.getContractFactory("Token2");
  const token2Contract = await token2.deploy(ethers.utils.parseEther("10"));
  // console.log("Deploying token2")
  await token2Contract.deployed();
  // console.log("Deployed token2");

  // deploy Matching engine with token1, token2, feeAddress, makerFee and takerFee
  const MatchingEngine = await ethers.getContractFactory("MatchingEngine");
  const MatchingEngineContract = await MatchingEngine.deploy(
    token1Contract.address,
    token2Contract.address,
    feeAddress!,
    10,
    10
  );
  // console.log("deploying matching engine");
  await MatchingEngineContract.deployed();
  // console.log("deployed mathing engine");

  // Mint tokens for signer[1] and signer[2], signer[0] is the deployer/owner
  const signedToken1Contract = token1Contract.connect(signers[0]);
  const signedToken2Contract = token2Contract.connect(signers[0]);

  await signedToken1Contract.mint(
    signers[1].address,
    ethers.utils.parseEther("10000")
  );
  await signedToken2Contract.mint(
    signers[1].address,
    ethers.utils.parseEther("10000000")
  );

  await signedToken1Contract.mint(
    signers[2].address,
    ethers.utils.parseEther("10000")
  );
  await signedToken2Contract.mint(
    signers[2].address,
    ethers.utils.parseEther("10000000")
  );

  return {
    MatchingEngineContract,
    token1Contract,
    token2Contract,
    feeAddress,
    signers,
  };
}

describe("Matching Engine Deployement", async function() {
  it("Should return proper balances for token1", async function() {
    const { token1Contract, signers } = await loadFixture(deployDexFixture);
    expect(await token1Contract.balanceOf(signers[1].address)).to.equal(
      ethers.utils.parseEther("10000")
    );
    expect(await token1Contract.balanceOf(signers[2].address)).to.equal(
      ethers.utils.parseEther("10000")
    );
  });

  it("Should return proper balances for token1", async function() {
    const { token2Contract, signers } = await loadFixture(deployDexFixture);
    expect(await token2Contract.balanceOf(signers[1].address)).to.equal(
      ethers.utils.parseEther("10000000")
    );
    expect(await token2Contract.balanceOf(signers[2].address)).to.equal(
      ethers.utils.parseEther("10000000")
    );
  });

  it("should properly deploy the Mathcing Engine", async function() {
    const { MatchingEngineContract } = await loadFixture(deployDexFixture);
    expect(MatchingEngineContract.address).to.not.be.null;
    expect(MatchingEngineContract.address).to.not.undefined;
    expect(MatchingEngineContract.address).to.be.properAddress;
  });

  // it("should return empty Orders List", async function() {
  //   const {  MatchingEngineContract } = await loadFixture(deployDexFixture);
  //   const orders = await MatchingEngineContract.orders;
  //   expect((awaitMatchingEngineContract.orders(1)).to.exist;
  //   console.log((await MatchingEngineContract.orders(0)).length);
  //   expect(MatchingEngineContract.orders(1)).to.be.empty;
  //
  // })
  //

  // it("Should create an ask order (selling token1, buying token2)", async function() {
  //   const {  MatchingEngineContract } = await loadFixture(deployDexFixture);
  //
  // })

  it("Should get token pair", async function() {
    const { MatchingEngineContract, token1Contract, token2Contract } =
      await loadFixture(deployDexFixture);
    const tokenPair = await MatchingEngineContract.getTokenPair();
    expect(tokenPair).to.exist;
  });

  it("Should confirm correct token pair", async function() {
    const { MatchingEngineContract, token1Contract, token2Contract } =
      await loadFixture(deployDexFixture);
    const tokenPair = await MatchingEngineContract.getTokenPair();
    expect(tokenPair).to.exist;
    expect(tokenPair[0]).to.equal(token1Contract.address);
    expect(tokenPair[1]).to.equal(token2Contract.address);
  });

  it("Should get token1 balance ");

  it("Should place an ask (orders which are selling token1 and buying token2)", async function() {
    const { MatchingEngineContract, token1Contract, token2Contract, signers } =
      await loadFixture(deployDexFixture);

    // approve dex to transfer funds on the behalf of user
    await token1Contract
      .connect(signers[1])
      .approve(MatchingEngineContract.address, ethers.utils.parseEther("1"));
    const connectedMatchingEngineContract = MatchingEngineContract.connect(
      signers[1]
    );

    const tx = await connectedMatchingEngineContract.makerOrder(
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1000"),
      1,
      0
    );
    
    const events = (await tx.wait()).events;
    const {args} = events![events!.length - 1]
    const order = await connectedMatchingEngineContract.orders(args!.id);
    expect(order.sellingToken1).to.equal(1);
    expect(order.sellingTokenAmt).to.equal(ethers.utils.parseEther("1"));
    expect(order.buyingTokenAmt).to.equal(ethers.utils.parseEther("1000"));
  });
  
  

  // it("Should return orders", async function() {
  //   const { MatchingEngineContract, token1Contract, token2Contract } =
  //     await loadFixture(deployDexFixture);
  //   const orders = await MatchingEngineContract.orders(9);
  //   expect(orders).to.exist;
  // });
});
