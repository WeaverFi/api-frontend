
// Imports:
import { KeyManager } from '3pi';
import weaver from 'weaverfi';

// Type Imports:
import type { KeyInfo } from '3pi/dist/types';
import type { Chain, Address, Hash } from 'weaverfi/dist/types';

// API Tier Interface:
interface Tier {
  id: number
  name: string
  dailyRateLimit: number
  monthlyPrice: number
  weiPricePerSecond: number
}

// 3PI Contract Addresses:
export const contractAddresses: Partial<Record<Chain, Address>> = {
  mumbai: '0xF50D1cAF40E1dE56198F262ACA4A3745De0A88dC' // <TODO> REMOVE
}

// 3PI Price Tiers:
export const apiTiers: Tier[] = [
  { id: 0, name: 'Free', dailyRateLimit: 50, monthlyPrice: 0, weiPricePerSecond: 0 },
  { id: 1, name: 'Crawler', dailyRateLimit: 500, monthlyPrice: 10, weiPricePerSecond: 3_805_175_038_052 }, // <TODO> input appropriate prices in USDC from actual contract
  { id: 2, name: 'Weaver', dailyRateLimit: 1500, monthlyPrice: 25, weiPricePerSecond: 9_512_937_595_130 }, // <TODO> input appropriate prices in USDC from actual contract
  { id: 3, name: 'Hunter', dailyRateLimit: 4000, monthlyPrice: 50, weiPricePerSecond: 19_025_875_190_259 } // <TODO> input appropriate prices in USDC from actual contract
];

/* ========================================================================================================================================================================= */

// Function to get chain from chain ID:
export const getChain = (chainID: number): Chain | undefined => {
  if(chainID === 1) {
    return 'eth';
  } else if(chainID === 56) {
    return 'bsc';
  } else if(chainID === 137) {
    return 'poly';
  } else if(chainID === 250) {
    return 'ftm';
  } else if(chainID === 43114) {
    return 'avax';
  } else if(chainID === 25) {
    return 'cronos';
  } else if(chainID === 10) {
    return 'op';
  } else if(chainID === 42161) {
    return 'arb';
  } else if(chainID === 80001) { // <TODO> REMOVE
    return 'mumbai';
  } else {
    return undefined;
  }
}

/* ========================================================================================================================================================================= */

// Function to get an address's keys:
export const getKeys = async (address: Address | undefined) => {
  const keys: (KeyInfo & { chain: Chain, hash: Hash })[] = [];
  if(address) {
    for(const stringChain of Object.keys(contractAddresses)) {
      const chain = stringChain as Chain;
      const keyManager = initKeyManager(chain);
      if(keyManager) {
        const userKeys = await keyManager.getUserKeys(address);
        for(const hash of userKeys) {
          const keyInfo = await keyManager.getKeyInfo(hash);
          keys.push({ ...keyInfo, chain, hash });
        }
      }
    }
  }
  return keys;
}

/* ========================================================================================================================================================================= */

// Function to initialize key manager for a given chain:
export const initKeyManager = (chain: Chain) => {
  const contractAddress = contractAddresses[chain];
  if(contractAddress) {
    const rpcs = weaver[chain].getInfo().rpcs;
    const keyManager = new KeyManager(contractAddress, rpcs);
    return keyManager;
  } else {
    console.error(`No contract address set for ${chain} chain.`);
    return undefined;
  }
}