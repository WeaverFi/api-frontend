<script lang="ts">

	// Imports:
	import { ethers } from 'ethers';
	import { fade, slide } from 'svelte/transition';
	import { initKeyManager } from '$lib/functions';
	import weaver from 'weaverfi';
	import Withdraw from '$lib/components/Withdraw.svelte';
	import ExtendKey from '$lib/components/ExtendKey.svelte';
	import KeyDetails from '$lib/components/KeyDetails.svelte';
	import KeyActions from '$lib/components/KeyActions.svelte';

	// Type Imports:
	import type { Token } from '3pi';
	import type { Chain, Address } from 'weaverfi';
	import type { ExtendedKeyInfo } from '$lib/types';

	// Initializations:
	export let key: ExtendedKeyInfo;
  export let chain: Chain;
	export let address: Address;
  export let signer: ethers.providers.JsonRpcSigner;
	export let displayExpired: boolean = true;
	export let onKeyUpdated: Function;
	let timeNow = Date.now() / 1000;
	let keyActive = key.expiryTime > timeNow;
	let token: Token | undefined = undefined;
	let isCollapsed: boolean = true;
	let remainingBalance: number = 0;
	let fetchingBalance: boolean = false;
	let extendingKey: boolean = false;
	let withdrawing: boolean = false;

	// Reactive Key Manager Info:
	$: keyManager = initKeyManager(key.chain);
	$: keyManager, fetchToken();

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

	// Function to update key details post-transactions:
	const updateKeyDetails = async () => {
		await onKeyUpdated();
		timeNow = Date.now() / 1000;
		keyActive = key.expiryTime > timeNow;
		extendingKey = false;
		withdrawing = false;
		getRemainingBalance();
	}

</script>

<!-- #################################################################################################### -->

{#if displayExpired || keyActive}
	<div class="keyWrapper" class:active={keyActive} transition:fade|local={{ duration: 200 }}>
		<div class="top" on:click={() => isCollapsed = !isCollapsed} on:keydown={() => isCollapsed = !isCollapsed}>
			<img class="chainIcon" src="/chains/{key.chain}.svg" alt="{weaver[key.chain].getInfo().name}">
			<span class="hash" title="{key.hash}">{key.hash.slice(0, 6)}...{key.hash.slice(-4)}</span>
			<span class="status">{keyActive ? 'Active' : 'Inactive'}</span>
			<i class="icofont-rounded-{isCollapsed ? 'down' : 'up'}" />
		</div>
		{#if !isCollapsed}
			<div class="keyInfo" transition:slide|local>
				<hr>
				{#if extendingKey}
					{#if keyManager && token}
						<ExtendKey {key} {chain} {address} {signer} {keyManager} {token} onReturn={() => extendingKey = false} onKeyExtended={updateKeyDetails} />
					{/if}
				{:else if withdrawing}
					{#if keyManager && token}
						<Withdraw {key} {chain} {signer} {keyManager} {token} onReturn={() => withdrawing = false} onWithdrawal={updateKeyDetails} />
					{/if}
				{:else}
					<KeyDetails {key} {keyActive} onClickReActivate={() => extendingKey = true} />
					{#if token && keyActive}
						<KeyActions {key} {token} {remainingBalance} {fetchingBalance} onClickExtendKey={() => extendingKey = true} onClickWithdraw={() => withdrawing = true} />
					{/if}
				{/if}
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
		background-color: #eee;
		background: linear-gradient(135deg, white -20%, var(--primaryColor) 150%);
		border-radius: .5em;
		box-shadow: 0 0 5px black;
	}
	
	div.keyWrapper.active span.status {
		color: var(--primaryColor);
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
		user-select: none;
	}

	div.top > span.hash {
		flex: 1;
	}

	div.top > img.chainIcon {
		width: 1.8em;
		height: 1.8em;
	}

	div.keyInfo {
		display: flex;
		gap: 1em;
		flex-wrap: wrap;
		padding: 0 1em 1em;
	}

	hr {
		width: 100%;
		border: none;
		border-top: 2px solid var(--secondaryColor);
	}

	@media screen and (max-width: 300px) {
		span.status {
			display: none;
		}
	}
	
</style>