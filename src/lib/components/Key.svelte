<script lang="ts">

	// Imports:
	import { apiTiers, initKeyManager } from '$lib/functions';

	// Type Imports:
	import type { ethers } from 'ethers';
	import type { KeyInfo } from '3pi/dist/types';
	import type { Chain, Address } from 'weaverfi/dist/types';

	// Initializations:
	export let key: KeyInfo & { chain: Chain };
  export let chain: Chain | undefined;
	export let address: Address | undefined;
  export let signer: ethers.providers.JsonRpcSigner | undefined;
	const secondsInAMonth: number = 2_628_000;
	let isCollapsed: boolean = true;

	// Reactive Key Manager:
	$: keyManager = chain ? initKeyManager(chain) : undefined;

</script>

<!-- #################################################################################################### -->

<div class="keyWrapper">
	<div class="top" on:click={() => isCollapsed = !isCollapsed} on:keydown={() => isCollapsed = !isCollapsed}>
		<span>TODO</span>
		<!-- TODO - top part with arrow for expansion -->
	</div>
	{#if !isCollapsed}
		<!-- TODO - display key info -->
		<span>Chain: {key.chain}</span>
		<span>Expiry: {key.expiryTime}</span>
		<span>Owner: {key.owner}</span>
		<span>Realization: {key.realizationTime}</span>
		<span>Start: {key.startTime}</span>
		<span>Tier ID: {key.tierId}</span>
		<span>Daily Rate Limit: {apiTiers[key.tierId].dailyRateLimit}</span>
		<span>Monthly Price: {apiTiers[key.tierId].monthlyPrice}</span>
		<span>Wei Price /s: {apiTiers[key.tierId].weiPricePerSecond}</span>
		<!-- TODO - let user extend or deactivate key -->
	{/if}
</div>

<!-- #################################################################################################### -->

<style>

	div.keyWrapper {
		display: flex;
		flex-direction: column;
		gap: .5em;
		width: 100%;
		color: var(--secondaryColor);
		background-color: var(--accentColor);
		border-radius: .5em;
		box-shadow: 0 0 5px black;
	}
	
</style>