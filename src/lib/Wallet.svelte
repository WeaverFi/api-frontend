<script lang="ts">

  // Imports:
  import { ethers } from 'ethers';
  import { onMount } from 'svelte';
  import { getChain } from '$lib/functions';
  import weaver from 'weaverfi';

  // Type Imports:
  import type { Address, ENSDomain } from 'weaverfi/dist/types';

  // Initializations:
  export let provider: ethers.providers.JsonRpcProvider | undefined;
  export let signer: ethers.providers.JsonRpcSigner | undefined;
  export let chainID: number | undefined;
  export let address: Address | undefined;
  export let ens: ENSDomain | undefined;

  // Function to check wallet chain ID:
  const checkChainID = async () => {
    try {
      const hexChainID: string = await (window as any).ethereum.request({ method: 'eth_chainId' });
      chainID = parseInt(hexChainID, 16);
    } catch {
      console.error('Something went wrong while checking chain ID.');
    }
  }

  // Function to check wallet address:
  const checkAddress = async () => {
    try {
      const accounts: string[] = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      if(accounts.length > 0) {
        address = accounts[0] as Address;
        if(chainID) {
          const chain = getChain(chainID);
          if(chain) {
            provider = new ethers.providers.JsonRpcProvider(weaver[chain].getInfo().rpcs[0]);
            signer = provider.getSigner();
          } else {
            provider = undefined;
            signer = undefined;
          }
        } else {
          provider = undefined;
          signer = undefined;
        }
        await checkENS();
      } else {
        address = undefined;
      }
    } catch(err: any) {
      address = undefined;
      if(err.code === 4001) {
        console.error('Wallet connection rejected.');
      } else {
        console.error('Something went wrong while connecting to wallet.');
      }
    }
  }

  // Function to check ENS domain for a given wallet address:
  const checkENS = async () => {
    try {
      if(address && provider) {
        const name = await provider.lookupAddress(address);
        ens = name as ENSDomain ?? undefined;
      } else {
        ens = undefined;
      }
    } catch {
      console.error('Something went wrong while resolving wallet\'s ENS.');
    }
  }

  // Function to connect to wallet:
  const connect = async () => {
    await checkChainID();
    await checkAddress();
  }

  onMount(async () => {

    // Event handlers:
    if(typeof (window as any).ethereum !== 'undefined') {
      (window as any).ethereum.on('chainChanged', checkChainID);
      (window as any).ethereum.on('accountsChanged', checkAddress);
    }

  });
	
</script>

<!-- #################################################################################################### -->

<div id="wallet">
  {#if ens}
    <span>{ens}</span>
  {:else if address}
    <span>{address.slice(0, 6)}...{address.slice(-4)}</span>
  {:else}
    <button on:click={connect}>Connect Wallet</button>
  {/if}
</div>

<!-- #################################################################################################### -->

<style>

  #wallet {
    display: flex;
    align-items: center;
  }

  button {
		padding: .8em;
		text-align: center;
		font-weight: bold;
		color: var(--secondaryColor);
		background-color: var(--accentColor);
		border: 3px solid var(--accentColor);
		border-radius: 2em;
		cursor: pointer;
		transition: all .3s ease-out;
	}

	button:hover {
		color: var(--fontColor);
		background-color: var(--primaryColor);
	}
	
</style>