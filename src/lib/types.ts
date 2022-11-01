
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
  wei: ethers.BigNumber | undefined
  tokens: number | undefined
}

// Wallet Connection Interface:
export interface WalletConnection {
  signer: ethers.providers.JsonRpcSigner | undefined
  chainID: number | undefined
  chain: Chain | undefined
  address: Address | undefined
  ens: ENSDomain | undefined
}