
// Imports:
import { ethers } from 'ethers';
import { KeyManager } from '3pi';
import weaver from 'weaverfi';

// Type Imports:
import type { Cost, Tier } from '$lib/types';
import type { Token, KeyInfo } from '3pi/dist/types';
import type { Chain, Address, Hash } from 'weaverfi/dist/types';

// 3PI Contract Addresses:
export const contractAddresses: Partial<Record<Chain, Address>> = {
  op: '0xF50D1cAF40E1dE56198F262ACA4A3745De0A88dC',
  poly: '0xF50D1cAF40E1dE56198F262ACA4A3745De0A88dC'
}

// 3PI Price Tiers:
export const apiTiers: Tier[] = [
  { id: 0, name: 'Free', dailyRateLimit: 100, monthlyPrice: 0, unitPricePerSecond: 0 },
  { id: 1, name: 'Crawler', dailyRateLimit: 1000, monthlyPrice: 10, unitPricePerSecond: 4 },
  { id: 2, name: 'Weaver', dailyRateLimit: 3000, monthlyPrice: 24, unitPricePerSecond: 9 },
  { id: 3, name: 'Hunter', dailyRateLimit: 8000, monthlyPrice: 50, unitPricePerSecond: 19 }
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
  return keys.sort((a, b) => b.startTime - a.startTime);
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

/* ========================================================================================================================================================================= */

// Function to calculate key update cost:
export const calcCost = (token: Token | undefined, tierID: number, duration: number) => {
  const cost: Cost = { amount: undefined, formatted: undefined };
  if(token) {
    cost.amount = ethers.BigNumber.from(apiTiers[tierID].unitPricePerSecond).mul(duration);
    cost.formatted = parseFloat(ethers.utils.formatUnits(cost.amount, token.decimals));
  }
  return cost;
}

/* ========================================================================================================================================================================= */

// Function to format new date string from timestamp:
export const formatDate = (timestampInSeconds: number) => {
  const date = new Date(timestampInSeconds * 1000);
  const formattedDate = date.toLocaleString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  return formattedDate;
}