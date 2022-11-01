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
	const secondsInADay: number = 86_400;
	const secondsInAMonth: number = 2_628_000;
	let timeNow = Date.now() / 1000;
	let token: Token | undefined = undefined;
	let isCollapsed: boolean = true;
	let remainingBalance: number = 0;
	let fetchingBalance: boolean = false;

	// Reactive Key Manager Info:
	$: keyManager = initKeyManager(key.chain);
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

	// <TODO> extend functionality
	// <TODO> withdraw functionality

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
				<div class="keyInfo">
					<span><strong>Chain:</strong> {weaver[key.chain].getInfo().name}</span>
					<span><strong>Tier:</strong> {apiTiers[key.tierId].name}</span>
					<span><strong>Daily Rate Limit:</strong> {apiTiers[key.tierId].dailyRateLimit}</span>
					{#if timeNow < (key.startTime + secondsInADay)}
						<span class="info">This key was activated less than 24 hours ago, so its rate limit is still ramping up.</span>
					{/if}
					<span>Tier Name: {apiTiers[key.tierId].name}</span>
					<span>Tier Monthly Cost: {apiTiers[key.tierId].monthlyPrice}</span>
					<span>Tier Daily Rate Limit: {apiTiers[key.tierId].dailyRateLimit}</span>
					<!-- TODO - add tooltip to let users know that if a key expires and is re-activated, start time will be updated (indicates consecutive active time) -->
					<span>Start: {key.startTime}</span>
					<span>Expiry: {key.expiryTime}</span>
				</div>
				<div class="keyActions">
					{#if token && keyActive}
						{#if fetchingBalance}
							<span class="loading">Loading remaining {token.symbol} balance...</span>
						{:else}
							<span>Remaining Balance:</span>
							<span>{remainingBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} {token.symbol}</span>
							<i class="icofont-refresh clickable" on:click={getRemainingBalance} on:keydown={getRemainingBalance} />
							<div class="buttons">
								<span class="extendKey">Extend</span>
								<span class="deactivate">Withdraw</span>
							</div>
						{/if}
					{/if}
				</div>
			</div>
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
		flex-wrap: wrap;
		padding: 0 1em 1em;
	}

	div.keyDetails > div {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding-top: 1em;
	}

	hr {
		width: 100%;
		border: none;
		border-top: 2px solid var(--secondaryColor);
	}

	div.keyActions {
		align-items: center;
	}

	span.info {
		color: var(--terciaryColor);
		font-size: .9em;
	}

	.clickable {
		cursor: pointer;
	}
	
</style>