
// Type Imports:
import type { KeyInfo } from '3pi';
import type { ethers } from 'ethers';
import type { Chain, Address, Hash, ENSDomain } from 'weaverfi';

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
  signer: ethers.providers.JsonRpcSigner
  chainID: number
  chain: Chain
  address: Address
  ens: ENSDomain
}

// API Tier Interface:
export interface Tier {
  id: number
  name: string
  dailyRateLimit: number
  monthlyPrice: number
  unitPricePerSecond: number
}