<script lang="ts">

	// Imports:
	import { getKeys } from '$lib/functions';
	import Key from '$lib/Key.svelte';
	import NewKey from '$lib/NewKey.svelte';
	import Wallet from '$lib/Wallet.svelte';

	// Type Imports:
	import type { ethers } from 'ethers';
	import type { KeyInfo } from '3pi/dist/types';
	import type { Chain, Address } from 'weaverfi/dist/types';

	// Initializations:
	let provider: ethers.providers.JsonRpcProvider | undefined;
  let signer: ethers.providers.JsonRpcSigner | undefined;
  let chain: Chain | undefined;
	let address: Address | undefined;
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
		<Wallet bind:provider bind:signer bind:chain bind:address />
	</div>

	<!-- Keys Display -->
	<div class="keys">
		{#if address}
			{#each keys as key}
				<Key {key} {chain} {address} {signer} />
			{/each}
			<NewKey {chain} {address} {signer} />
		{:else}
			<span class="info">Connect your wallet to check on and manage your keys!</span>
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

	div.keys {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1em;
		margin-top: 2em;
		text-align: center;
	}

	span.info {
		color: var(--secondaryFontColor);
		font-size: .9em;
	}
	
</style>