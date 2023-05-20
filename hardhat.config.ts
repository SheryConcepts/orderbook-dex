import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import {config as dotenvConfig} from "dotenv";

// imjort env variables from env to node process
dotenvConfig();

const config: HardhatUserConfig = {
  solidity: "0.8.15",
  networks: {
    // local: {
    //   url:  "http://localhost:8545",
    //   chainId: 1337
    // }   
  }
};

export default config;
