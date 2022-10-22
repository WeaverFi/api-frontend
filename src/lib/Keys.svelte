<script lang="ts">

	// Imports:
	import { getKeys } from '$lib/functions';
	import Wallet from '$lib/Wallet.svelte';

	// Type Imports:
	import type { ethers } from 'ethers';
	import type { KeyInfo } from '3pi/dist/types';
	import type { Chain, Address, ENSDomain } from 'weaverfi/dist/types';

	// Initializations:
	let provider: ethers.providers.JsonRpcProvider | undefined;
  let signer: ethers.providers.JsonRpcSigner | undefined;
  let chainID: number | undefined;
	let address: Address | undefined;
	let ens: ENSDomain | undefined;
	let keys: (KeyInfo & { chain: Chain })[] = [];
	let fetching: boolean = false;

	// Reactive Updates:
	$: address, getWalletInfo();

	// Function to get wallet info:
	const getWalletInfo = async () => {
		fetching = true;
		keys = await getKeys(address);
		fetching = false;
	}

</script>

<!-- #################################################################################################### -->

<section>

	<!-- Top Bar -->
	<div class="top">
		<h2>Manage your keys</h2>
		<Wallet bind:provider bind:signer bind:chainID bind:address bind:ens />
	</div>

	<!-- Keys Display -->
	<div class="keys">
		{#if keys && keys.length > 0}
			<!-- TODO - display all keys -->
		{:else if address}
			<!-- TODO - new key -->
		{:else}
			<span>Connect your wallet to check on and manage your keys!</span>
		{/if}
	</div>
</section>

<!-- #################################################################################################### -->

<style>

	section {
		background-color: var(--terciaryColor);
	}

	div.top {
		display: flex;
		justify-content: space-between;
	}
	
</style>
