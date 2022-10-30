<script lang="ts">

	// Imports:
	import { ethers } from 'ethers';
	import { apiTiers, initKeyManager } from '$lib/functions';
	import weaver from 'weaverfi';
	import ChainSelector from '$lib/components/ChainSelector.svelte';

	// Type Imports:
  import type { Token } from '3pi/dist/types';
	import type { Chain, Address } from 'weaverfi/dist/types';

	// Activation Cost Type:
	interface ActivationCost {
		wei: ethers.BigNumber | undefined
		tokens: number | undefined
	}

	// Initializations:
  export let chain: Chain | undefined;
	export let address: Address | undefined;
  export let signer: ethers.providers.JsonRpcSigner | undefined;
	const secondsInAMonth: number = 2_628_000;
	const activationCost: ActivationCost = { wei: undefined, tokens: undefined };
	let token: Token | undefined = undefined;
	let isCollapsed: boolean = true;
	let balance: number = 0;
	let allowance: number = 0;
	let infiniteApproval: boolean = false;
	let approvalInProgress: boolean = false;
	let activationInProgress: boolean = false;

	 // <TODO> Input actual key defaults
	// New Key Info:
	let keyChain: Chain = 'mumbai';
	let keyDuration: number = Math.floor(secondsInAMonth / 4);
	let keyTierID: number = 1;
	let apiKeyGenerated: string | undefined = undefined;

	// Reactive Key Manager Info:
	$: keyManager = initKeyManager(keyChain);
	$: keyManager, fetchToken();
	$: keyManager, address, fetchBalance();
	$: keyManager, address, fetchAllowance();

	// Reactive Activation Cost:
	$: token, calcActivationCost(keyDuration, keyTierID);

	// Function to create and activate new key:
	const createNewKey = async () => {
		if(keyManager && signer) {
			activationInProgress = true;
			apiKeyGenerated = keyManager.generateNewKey();
			const keyHash = keyManager.getPublicHash(apiKeyGenerated);
			await keyManager.activateKey(keyHash, keyDuration, keyTierID, signer);
			activationInProgress = false;
		}
	}

	// Function to calculate new key activation cost:
	const calcActivationCost = async (duration: number, tierID: number) => {
		if(token) {
			activationCost.wei = ethers.BigNumber.from(apiTiers[tierID].weiPricePerSecond).mul(duration);
			activationCost.tokens = parseFloat(ethers.utils.formatEther(activationCost.wei));
		} else {
			activationCost.wei = undefined;
			activationCost.tokens = undefined;
		}
	}

	// Function to fetch token being used in the key manager contract:
	const fetchToken = async () => {
		token = keyManager ? await keyManager.contractToken : undefined;
	}

	// Function to fetch current wallet balance:
	const fetchBalance = async () => {
		if(keyManager && address) {
			balance = await keyManager.getWalletBalance(address);
		}
	}

	// Function to fetch current wallet allowance value:
	const fetchAllowance = async () => {
		if(keyManager && address) {
			allowance = await keyManager.getWalletAllowance(address);
		}
	}

	// Function to update approval amount:
	const updateApproval = async () => {
		if(keyManager && signer && activationCost.wei) {
			approvalInProgress = true;
			if(infiniteApproval) {
				await keyManager.approve(ethers.constants.MaxUint256, signer);
			} else {
				await keyManager.approve(activationCost.wei, signer);
			}
			approvalInProgress = false;
		}
	}

</script>

<!-- #################################################################################################### -->

<div class="newKeyWrapper">
	{#if isCollapsed}
		<span class="newKey" on:click={() => isCollapsed = !isCollapsed} on:keydown={() => isCollapsed = !isCollapsed}>
			<strong>New API Key</strong>
			<i class="icofont-plus" />
		</span>
	{:else}
		<div class="newKeySettings">
			<i class="icofont-ui-close close" on:click={() => isCollapsed = !isCollapsed} on:keydown={() => isCollapsed = !isCollapsed} />
			<h3>New API Key Settings</h3>
			<!-- TODO - need tooltip next to chain to explain that this is just for payment, API is still usable for data on all chains -->
			<span class="chainSelection"><strong>Chain:</strong> <ChainSelector bind:selectedChain={keyChain} /></span>
			<span>Duration: {keyDuration}</span>
			<span>Tier ID: {keyTierID}</span>
			<span>Balance: {balance} {token?.symbol}</span>
			<span>Allowance: {allowance} {token?.symbol}</span>
			<span>Activation Cost (Wei): {activationCost.wei}</span>
			<span>Activation Cost (Tokens): {activationCost.tokens?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
			{#if keyManager && token && chain && activationCost.tokens !== undefined}
				{#if chain === keyChain}
					{#if allowance >= activationCost.tokens}
						<span class="createNewKey" on:click={createNewKey} on:keydown={createNewKey}>Create New Key</span>
					{:else}
						<input type="checkbox" id="infiniteApproval" bind:checked={infiniteApproval} >
						<label for="infiniteApproval">Infinite Approval? <i class="icofont-ui-{infiniteApproval ? 'check' : 'close'}" /></label>
						<span class="approve" on:click={updateApproval} on:keydown={updateApproval}>Approve {token.symbol}</span>
					{/if}
				{:else}
					<span>Please connect to the {weaver[keyChain].getInfo().name} network.</span>
				{/if}
			{/if}
		</div>
	{/if}
</div>

<!-- #################################################################################################### -->

<style>

	div.newKeyWrapper {
		display: flex;
		flex-direction: column;
		gap: .5em;
		width: 100%;
		color: var(--secondaryColor);
		background-color: var(--accentColor);
		border-radius: .5em;
		box-shadow: 0 0 5px black;
	}

	span.newKey {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: .8em;
		padding: .5em 1em;
		cursor: pointer;
	}

	div.newKeySettings {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 1em;
		padding: 1em;
		text-align: left;
	}

	div.newKeySettings > i.close {
		position: absolute;
		inset: 1em 1em auto auto;
		cursor: pointer;
	}

	span.chainSelection {
		display: flex;
		align-items: center;
		gap: 1em;
	}

	span.createNewKey {
		margin-left: auto;
		padding: .2em 1em;
		color: var(--fontColor);
		background-color: var(--secondaryColor);
		border-radius: .5em;
		cursor: pointer;
	}
	
</style>