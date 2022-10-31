<script lang="ts">

	// Imports:
	import { fade, slide } from 'svelte/transition';
	import { apiTiers, initKeyManager } from '$lib/functions';
	import weaver from 'weaverfi';

	// Type Imports:
	import { ethers } from 'ethers';
	import type { Token, KeyInfo } from '3pi/dist/types';
	import type { Chain, Address, Hash } from 'weaverfi/dist/types';

	// Initializations:
	export let key: KeyInfo & { chain: Chain, hash: Hash };
  export let chain: Chain;
	export let address: Address;
  export let signer: ethers.providers.JsonRpcSigner;
	export let displayExpired: boolean = true;
	const timeNow = Date.now() / 1000;
	const secondsInAMonth: number = 2_628_000;
	let token: Token | undefined = undefined;
	let isCollapsed: boolean = true;
	let remainingBalance: number = 0;
	let fetchingBalance: boolean = false;

	// Reactive Key Manager Info:
	$: keyManager = initKeyManager(chain);
	$: keyManager, fetchToken();

	// Reactive Key Status:
	$: keyActive = key.expiryTime > timeNow;

	// Reactive Remaining Balance:
	$: token, getRemainingBalance();

	// Function to fetch token being used in the key manager contract:
	const fetchToken = async () => {
		token = keyManager ? await keyManager.contractToken : undefined;
	}

	// Function to update remaining balance:
	const getRemainingBalance = async () => {
		if(keyManager && token) {
			if(keyActive) {
				fetchingBalance = true;
				const rawRemainingBalance = await keyManager.getRemainingBalance(key.hash);
				remainingBalance = parseFloat(ethers.utils.formatUnits(rawRemainingBalance, token.decimals));
				fetchingBalance = false;
			} else {
				remainingBalance = 0;
			}
		}
	}

	// <TODO> add refresh remaining balance button

</script>

<!-- #################################################################################################### -->

{#if displayExpired || keyActive}
	<div class="keyWrapper" class:active={keyActive} transition:fade|local={{ duration: 200 }}>
		<div class="top" on:click={() => isCollapsed = !isCollapsed} on:keydown={() => isCollapsed = !isCollapsed}>
			<img src="/chains/{key.chain}.svg" alt="{weaver[key.chain].getInfo().name}">
			<span class="hash" title="{key.hash}">{key.hash.slice(0, 6)}...{key.hash.slice(-4)}</span>
			<span class="status">{keyActive ? 'Active' : 'Inactive'}</span>
			<i class="icofont-rounded-{isCollapsed ? 'down' : 'up'}" />
		</div>
		{#if !isCollapsed}
			<div class="keyDetails" transition:slide|local>
				<hr>
				<span>Chain: {key.chain}</span>
				<!-- TODO - add more tier info (cost, rate limit, etc.) -->
				<span>Tier: {key.tierId}</span>
				<!-- TODO - add tooltip to let users know that if a key expires and is re-activated, start time will be updated (indicates consecutive active time) -->
				<span>Start: {key.startTime}</span>
				<span>Expiry: {key.expiryTime}</span>
				{#if token && keyActive}
					<span>Remaining Balance: {remainingBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} {token.symbol}</span>
					<!-- TODO - display when loading remaining balance -->
				{/if}
			</div>
			<!-- TODO - let user extend or deactivate key -->
		{/if}
	</div>
{/if}

<!-- #################################################################################################### -->

<style>

	div.keyWrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
		color: var(--secondaryColor);
		background-color: var(--accentColor);
		border-radius: .5em;
		box-shadow: 0 0 5px black;
	}
	
	div.keyWrapper.active span.status {
		color: green;
		font-weight: bold;
	}

	div.keyWrapper:not(.active) {
		filter: grayscale(.7);
	}

	div.top {
		display: flex;
		align-items: center;
		gap: .5em;
		padding: .5em 1em;
		cursor: pointer;
	}

	div.top > span.hash {
		flex: 1;
	}

	div.keyDetails {
		display: flex;
		flex-direction: column;
		padding: 0 1em 1em;
	}

	hr {
		border: none;
		border-top: 2px solid var(--secondaryColor);
	}
	
</style>