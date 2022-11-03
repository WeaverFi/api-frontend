<script lang="ts">

	// Imports:
	import { getKeys } from '$lib/functions';
	import Key from '$lib/components/Key.svelte';
	import NewKey from '$lib/components/NewKey.svelte';
	import Wallet from '$lib/components/Wallet.svelte';

	// Type Imports:
  import type { Address } from 'weaverfi/dist/types';
  import type { ExtendedKeyInfo, WalletConnection } from '$lib/types';

	// Initializations:
	let wallet: WalletConnection | undefined;
	let keys: ExtendedKeyInfo[] = [];
	let fetching: boolean = false;
	let displayExpired: boolean = true;
	let loadedWalletAddress: Address | undefined = undefined;

	// Reactive Wallet Info:
	$: wallet, getWalletInfo();

	// Function to get wallet info:
	const getWalletInfo = async (options?: { force?: boolean, reset?: boolean }) => {
		if(wallet) {
			if(wallet.address !== loadedWalletAddress || options?.force) {
				if(wallet.address !== loadedWalletAddress || options?.reset) {
					fetching = true;
					keys = [];
				}
				loadedWalletAddress = wallet.address;
				keys = await getKeys(wallet.address);
				fetching = false;
			}
		}
	}

</script>

<!-- #################################################################################################### -->

<section id="keys">

	<!-- Top Bar -->
	<div class="top">
		<h2>Manage your keys</h2>
		<Wallet bind:wallet onChangeAddress={() => getWalletInfo()} />
	</div>

	<!-- Keys Display -->
	<div class="keys">
		{#if wallet}
			{#if wallet.address}
				{#if wallet.chain && wallet.signer}
					{#if !fetching && keys.length === 0}
						<span class="small muted">You don't seem to have activated any API keys yet.</span>
					{:else if fetching}
						<span class="loading">Loading keys...</span>
					{:else}
						{#each [...keys].reverse() as key}
							<Key {key} chain={wallet.chain} address={wallet.address} signer={wallet.signer} {displayExpired} onKeyUpdated={async () => getWalletInfo({ force: true })} />
						{/each}
					{/if}
					<NewKey chain={wallet.chain} address={wallet.address} signer={wallet.signer} onKeyCreated={async () => getWalletInfo({ force: true, reset: true })} />
					{#if !fetching && keys.length > 0}
						<input type="checkbox" id="displayExpiredKeys" bind:checked={displayExpired} >
						<label class="toggleDisplayedExpiredKeys small" class:muted={!displayExpired} for="displayExpiredKeys">{displayExpired ? 'Displaying' : 'Hiding'} inactive keys <i class="icofont-eye{displayExpired ? '' : '-blocked'}" /></label>
					{/if}
				{/if}
			{:else}
				<span class="small muted">Connect your wallet to check on and manage your keys!</span>
			{/if}
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