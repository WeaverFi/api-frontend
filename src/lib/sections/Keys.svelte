<script lang="ts">

	// Imports:
	import { getKeys } from '$lib/functions';
	import Key from '$lib/components/Key.svelte';
	import NewKey from '$lib/components/NewKey.svelte';
	import Wallet from '$lib/components/Wallet.svelte';

	// Type Imports:
	import type { ethers } from 'ethers';
	import type { KeyInfo } from '3pi/dist/types';
	import type { Chain, Address, Hash } from 'weaverfi/dist/types';

	// Initializations:
  let signer: ethers.providers.JsonRpcSigner | undefined;
  let chain: Chain | undefined;
	let address: Address | undefined;
	let keys: (KeyInfo & { chain: Chain, hash: Hash })[] = [];
	let fetching: boolean = false;
	let displayExpired: boolean = true;

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
		<Wallet bind:signer bind:chain bind:address />
	</div>

	<!-- Keys Display -->
	<div class="keys">
		{#if address}
			{#if chain && signer}
				{#if !fetching && keys.length === 0}
					<span class="small muted">You don't seem to have activated any API keys yet.</span>
				{:else if fetching}
					<span class="loading">Loading Keys...</span>
				{/if}
				{#each keys as key}
					<Key {key} {chain} {address} {signer} {displayExpired} />
				{/each}
				<NewKey {chain} {address} {signer} />
				{#if !fetching && keys.length > 0}
					<input type="checkbox" id="displayExpiredKeys" bind:checked={displayExpired} >
					<label class="toggleDisplayedExpiredKeys small" class:muted={!displayExpired} for="displayExpiredKeys">{displayExpired ? 'Displaying' : 'Hiding'} expired keys <i class="icofont-eye{displayExpired ? '' : '-blocked'}" /></label>
				{/if}
			{/if}
		{:else}
			<span class="small muted">Connect your wallet to check on and manage your keys!</span>
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
	}

	.small {
		font-size: .9em;
	}

	.muted {
		color: var(--secondaryFontColor);
	}

	input#displayExpiredKeys {
		display: none;
	}

	label.toggleDisplayedExpiredKeys {
		display: flex;
		align-items: center;
		justify-content: end;
		gap: .5em;
		width: 100%;
		margin-top: -.2em;
		cursor: pointer;
	}
	
</style>