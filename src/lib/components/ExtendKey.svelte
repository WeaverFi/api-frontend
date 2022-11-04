<script lang="ts">

	// Imports:
	import { ethers } from 'ethers';
	import { apiTiers, calcCost } from '$lib/functions';
	import weaver from 'weaverfi';
	import DurationSelector from '$lib/components/DurationSelector.svelte';
	
	// Type Imports:
  import type { KeyManager } from '3pi';
	import type { Token } from '3pi/dist/types';
  import type { ExtendedKeyInfo } from '$lib/types';
	import type { Chain, Address } from 'weaverfi/dist/types';

	// Initializations:
	export let key: ExtendedKeyInfo;
  export let chain: Chain;
	export let address: Address;
  export let signer: ethers.providers.JsonRpcSigner;
	export let keyManager: KeyManager;
	export let token: Token;
	export let onReturn: Function;
	export let onKeyExtended: Function;
	const secondsInAMonth: number = 2_628_000;
	let balance: number = 0;
	let allowance: number = 0;
	let infiniteApproval: boolean = false;
	let approvalInProgress: boolean = false;
	let extensionInProgress: boolean = false;
	let extensionDuration: number = secondsInAMonth;

	// Reactive Wallet Info:
	$: address, fetchBalance();
	$: address, fetchAllowance();

	// Reactive Key Tier:
	$: tier = apiTiers[key.tierId];

	// Reactive Extension Cost:
	$: extensionCost = calcCost(token, key.tierId, extensionDuration);

	// Function to extend key's duration:
	const extendKeyDuration = async () => {
		try {
			extensionInProgress = true;
			await keyManager.extendKey(key.hash, extensionDuration, signer);
			fetchBalance();
			fetchAllowance();
			onKeyExtended();
		} finally {
			extensionInProgress = false;
		}
	}

	// Function to fetch current wallet balance:
	const fetchBalance = async () => {
		balance = await keyManager.getWalletBalance(address);
	}

	// Function to fetch current wallet allowance value:
	const fetchAllowance = async () => {
		allowance = await keyManager.getWalletAllowance(address);
	}

	// Function to update approval amount:
	const updateApproval = async () => {
		if(extensionCost.wei) {
			try {
				approvalInProgress = true;
				if(infiniteApproval) {
					await keyManager.approve(ethers.constants.MaxUint256, signer);
				} else {
					await keyManager.approve(extensionCost.wei, signer);
				}
			} finally {
				approvalInProgress = false;
				fetchAllowance();
			}
		}
	}

</script>

<!-- #################################################################################################### -->

<div class="extendKey">
	<span class="back" on:click={() => onReturn()} on:keydown={() => onReturn()}><i class="icofont-arrow-left" /> Back</span>
	<h3>Extending API Key</h3>
	<div class="selections">
		<span class="chain"><strong>Chain:</strong> <img src="/chains/{chain}.svg" title="{weaver[chain].getInfo().name}" alt="{weaver[chain].getInfo().name}"></span>
		<span><strong>Tier:</strong> {tier.name}: &nbsp; ${tier.monthlyPrice} /month</span>
		<span><strong>Extend Duration By:</strong> <DurationSelector bind:selectedDuration={extensionDuration} /></span>
	</div>
	<hr>
	{#if extensionCost.tokens !== undefined}
		<div class="results">
			<span class="cost"><strong>Key Extension Cost:</strong> {extensionCost.tokens?.toLocaleString(undefined, { maximumFractionDigits: 2 })} {token.symbol} <img src="{weaver[key.chain].getTokenLogo(token.symbol)}" alt="{token.symbol}"></span>
			{#if chain === key.chain}
				{#if extensionCost.tokens > balance}
					<span class="error">Insufficient {token.symbol} balance in wallet.</span>
				{:else if extensionDuration <= 0}
					<span class="error">Invalid duration selected.</span>
				{:else if allowance >= extensionCost.tokens}
					{#if extensionInProgress}
						<span class="extendKeyDuration inProgress">Extending Key...</span>
					{:else}
						<span class="extendKeyDuration" on:click={extendKeyDuration} on:keydown={extendKeyDuration}>Extend Key Duration</span>
					{/if}
				{:else}
					<span class="approvalInfo">
						{#if approvalInProgress}
							<span class="approve inProgress">Approving {token.symbol}...</span>
						{:else}
							<input type="checkbox" id="infiniteApproval" bind:checked={infiniteApproval} >
							<label class="enableInfiniteApproval" for="infiniteApproval">Infinite Approval? <i class="icofont-ui-{infiniteApproval ? 'check' : 'close'}" /></label>
							<span class="approve" on:click={updateApproval} on:keydown={updateApproval}>Approve {token.symbol}</span>
						{/if}
					</span>
				{/if}
			{:else}
				<span class="error">Please connect to the {weaver[key.chain].getInfo().name} network.</span>
			{/if}
		</div>
	{/if}
</div>

<!-- #################################################################################################### -->

<style>

	div.extendKey {
		display: flex;
		flex-direction: column;
		gap: 1em;
		width: 100%;
	}

	span.back {
		margin-top: .5em;
		font-weight: bold;
		cursor: pointer;
	}

	hr {
		border: none;
		border-top: 2px solid var(--secondaryColor);
	}

	div.selections {
		display: flex;
		gap: 1em;
		flex-wrap: wrap;
	}

	div.selections > span {
		display: flex;
		align-items: center;
		gap: 1em;
		margin-right: 1em;
	}

	div.selections > span.chain > img {
		height: 1.5em;
		width: 1.5em;
	}

	div.results {
		display: flex;
		align-items: center;
		gap: 1em;
		flex-wrap: wrap;
		white-space: nowrap;
	}

	span.cost {
		display: flex;
		align-items: center;
		gap: .2em;
		padding: 1em 0;
	}

	span.cost > strong {
		margin-right: 1em;
	}

	span.cost > img {
		height: 1.2em;
		width: 1.2em;
	}

	span.extendKeyDuration, span.error, span.approvalInfo {
		margin-left: auto;
	}

	span.extendKeyDuration, span.approve {
		padding: .2em 1em;
		color: var(--fontColor);
		background-color: var(--secondaryColor);
		border-radius: .5em;
		cursor: pointer;
		user-select: none;
	}

	span.inProgress {
		cursor: wait;
	}

	span.error {
		color: darkred;
	}

	span.approvalInfo {
		display: flex;
		align-items: center;
		gap: 1em;
	}

	input#infiniteApproval {
		display: none;
	}

	label.enableInfiniteApproval {
		margin-top: .2em;
		font-size: .8em;
		cursor: pointer;
		user-select: none;
	}
	
</style>