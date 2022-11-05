
// Type Imports:
import type { ethers } from 'ethers';
import type { KeyInfo } from '3pi/dist/types';
import type { Chain, Address, Hash, ENSDomain } from 'weaverfi/dist/types';

/* ========================================================================================================================================================================= */

// Extended Key Info Interface:
export interface ExtendedKeyInfo extends KeyInfo {
  chain: Chain
  hash: Hash
}

// Cost Interface:
export interface Cost {
  amount: ethers.BigNumber | undefined
  formatted: number | undefined
}

// Wallet Connection Interface:
export interface WalletConnection {
  signer: ethers.providers.JsonRpcSigner | undefined
  chainID: number | undefined
  chain: Chain | undefined
  address: Address | undefined
  ens: ENSDomain | undefined
}

// API Tier Interface:
export interface Tier {
  id: number
  name: string
  dailyRateLimit: number
  monthlyPrice: number
  unitPricePerSecond: number
}