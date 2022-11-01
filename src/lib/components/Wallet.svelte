<script lang="ts">

  // Imports:
  import { ethers } from 'ethers';
  import { onMount } from 'svelte';
  import { getChain } from '$lib/functions';
  import weaver from 'weaverfi';

  // Type Imports:
  import type { WalletConnection } from '$lib/types';
  import type { Address, ENSDomain } from 'weaverfi/dist/types';

  // Initializations:
  export let wallet: Partial<WalletConnection> = {};
  export let onChangeAddress: Function = () => {};
  let chainName: string = '';

  // Function to check wallet chain ID:
  const checkChainID = async () => {
    try {
      const hexChainID: string = await (window as any).ethereum.request({ method: 'eth_chainId' });
      wallet.chainID = parseInt(hexChainID, 16);
      wallet.chain = wallet.chainID ? getChain(wallet.chainID) : undefined;
      chainName = wallet.chain ? weaver[wallet.chain].getInfo().name : '';
    } catch {
      console.error('Something went wrong while checking chain ID.');
    }
  }

  // Function to check wallet address:
  const checkAddress = async () => {
    try {
      const accounts: string[] = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      if(accounts.length > 0) {
        wallet.address = accounts[0] as Address;
        onChangeAddress();
        await checkENS();
      } else {
        wallet.address = undefined;
      }
    } catch(err: any) {
      wallet.address = undefined;
      if(err.code === 4001) {
        console.error('Wallet connection rejected.');
      } else {
        console.error('Something went wrong while connecting to wallet.');
      }
    }
  }

  // Function to check wallet signer:
  const checkSigner = async () => {
    try {
      const browserProvider = new ethers.providers.Web3Provider((window as any).ethereum, 'any');
      wallet.signer = browserProvider.getSigner();
    } catch {
      console.error('Something went wrong while checking wallet\'s signer.');
    }
  }

  // Function to check ENS domain for a given wallet address:
  const checkENS = async () => {
    try {
      if(wallet.address) {
        const ethProvider = new ethers.providers.JsonRpcProvider(weaver.eth.getInfo().rpcs[0]);
        const name = await ethProvider.lookupAddress(wallet.address);
        wallet.ens = name as ENSDomain ?? undefined;
      } else {
        wallet.ens = undefined;
      }
    } catch {
      console.error('Something went wrong while resolving wallet\'s ENS.');
    }
  }

  // Function to connect to wallet:
  const connect = async () => {
    await checkChainID();
    await checkSigner();
    await checkAddress();
  }

  onMount(async () => {

    // Event handlers:
    if(typeof (window as any).ethereum !== 'undefined') {
      (window as any).ethereum.on('chainChanged', async () => { await checkChainID(); await checkSigner(); });
      (window as any).ethereum.on('accountsChanged', async () => { await checkSigner(); await checkAddress(); });
    }

  });
	
</script>

<!-- #################################################################################################### -->

<div id="wallet">
  {#if wallet.address}
    {#if wallet.chain}
      <img src="/chains/{wallet.chain}.svg" title="{chainName}" alt="{chainName}">
    {/if}
    {#if wallet.ens}
      <span title="{wallet.address}">{wallet.ens}</span>
    {:else}
      <span title="{wallet.address}">{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</span>
    {/if}
  {:else}
    <button on:click={connect}>Connect Wallet</button>
  {/if}
</div>

<!-- #################################################################################################### -->

<style>

  #wallet {
    display: flex;
    align-items: center;
    gap: .5em;
  }

  img {
    height: 1.8em;
    width: 1.8em;
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