
// Imports:
import { KeyManager } from '3pi';
import weaver from 'weaverfi';

// Type Imports:
import type { KeyInfo } from '3pi/dist/types';
import type { Chain, Address } from 'weaverfi/dist/types';

// 3PI Contract Addresses:
export const contractAddresses: Partial<Record<Chain, Address>> = {
  // <TODO> add contract addresses
}

// 3PI Price Tiers:
export const apiTiers: { rateLimit: number, price: number }[] = [
  { rateLimit: 50, price: 0 },
  { rateLimit: 500, price: 10 },
  { rateLimit: 1500, price: 25 },
  { rateLimit: 4000, price: 50 }
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
  } else {
    return undefined;
  }
}

/* ========================================================================================================================================================================= */

// Function to get an address's keys:
export const getKeys = async (address: Address | undefined) => {
  const keys: (KeyInfo & { chain: Chain })[] = [];
  if(address) {
    for(const stringChain of Object.keys(contractAddresses)) {
      const chain = stringChain as Chain;
      const keyManager = initKeyManager(chain);
      if(keyManager) {
        const userKeys = await keyManager.getUserKeys(address);
        for(const keyHash of userKeys) {
          const keyInfo = await keyManager.getKeyInfo(keyHash);
          keys.push({ ...keyInfo, chain });
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