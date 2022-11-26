<script lang="ts">

	// Imports:
	import { ethers } from 'ethers';
	import { initKeyManager, calcCost } from '$lib/functions';
	import weaver from 'weaverfi';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import TierSelector from '$lib/components/TierSelector.svelte';
	import ChainSelector from '$lib/components/ChainSelector.svelte';
	import DurationSelector from '$lib/components/DurationSelector.svelte';

	// Type Imports:
  import type { Token } from '3pi';
	import type { Chain, Address } from 'weaverfi';

	// Initializations:
  export let chain: Chain;
	export let address: Address;
  export let signer: ethers.providers.JsonRpcSigner;
	export let onKeyCreated: Function;
	const secondsInAMonth: number = 2_628_000;
	const tooltips = {
		chain: 'This defines where your key is paid for and validated - the API will be usable to fetch data from all chains regardless of this selection.',
		tier: 'Your key\'s tier determines its cost as well as how many daily API queries you can make.',
		duration: 'You may extend this duration further or cancel your key at any time.'
	}
	let token: Token | undefined = undefined;
	let isCollapsed: boolean = true;
	let balance: number = 0;
	let allowance: number = 0;
	let infiniteApproval: boolean = false;
	let approvalInProgress: boolean = false;
	let activationInProgress: boolean = false;
	let displayingNewKey: boolean = false;
	let fetchingBalance: boolean = false;
	let fetchingAllowance: boolean = false;

	// New Key Info:
	let keyChain: Chain = 'op';
	let keyDuration: number = secondsInAMonth;
	let keyTierID: number = 1;
	let apiKeyGenerated: string | undefined = undefined;

	// Reactive Key Manager Info:
	$: keyManager = initKeyManager(keyChain);
	$: keyManager, fetchToken();
	$: keyManager, address, fetchBalance();
	$: keyManager, address, fetchAllowance();

	// Reactive Activation Cost:
	$: activationCost = calcCost(token, keyTierID, keyDuration);

	// Function to create and activate new key:
	const createNewKey = async () => {
		if(keyManager) {
			try {
				activationInProgress = true;
				apiKeyGenerated = keyManager.generateNewKey({ append: keyChain.slice(0, 2) });
				const keyHash = keyManager.getPublicHash(apiKeyGenerated);
				await keyManager.activateKey(keyHash, keyDuration, keyTierID, signer);
				fetchBalance();
				fetchAllowance();
				onKeyCreated();
				displayingNewKey = true;
			} finally {
				activationInProgress = false;
			}
		}
	}

	// Function to fetch token being used in the key manager contract:
	const fetchToken = async () => {
		token = keyManager ? await keyManager.contractToken : undefined;
	}

	// Function to fetch current wallet balance:
	const fetchBalance = async () => {
		if(keyManager) {
			fetchingBalance = true;
			balance = 0;
			balance = await keyManager.getWalletBalance(address);
			fetchingBalance = false;
		}
	}

	// Function to fetch current wallet allowance value:
	const fetchAllowance = async () => {
		if(keyManager) {
			fetchingAllowance = true;
			allowance = 0;
			allowance = await keyManager.getWalletAllowance(address);
			fetchingAllowance = false;
		}
	}

	// Function to update approval amount:
	const updateApproval = async () => {
		if(keyManager && activationCost.amount) {
			try {
				approvalInProgress = true;
				if(infiniteApproval) {
					await keyManager.approve(ethers.constants.MaxUint256, signer);
				} else {
					await keyManager.approve(activationCost.amount, signer);
				}
			} finally {
				approvalInProgress = false;
				fetchAllowance();
			}
		}
	}

</script>

<!-- #################################################################################################### -->

<div class="newKeyWrapper">
	{#if isCollapsed}
		<span class="newKey" on:click={() => isCollapsed = false} on:keydown={() => isCollapsed = false}>
			<strong>New API Key</strong>
			<i class="icofont-plus" />
		</span>
	{:else}
		{#if displayingNewKey}
			<div class="newKeyDisplay">
				<i class="icofont-ui-close close" on:click={() => { displayingNewKey = false; isCollapsed = true }} on:keydown={() => { displayingNewKey = false; isCollapsed = true }} />
				<h3>Your New API Key:</h3>
				<span class="apiKey">{apiKeyGenerated}</span>
				<span><strong>Copy this key and save it somewhere safe!</strong></span>
				<span><strong>If you lose it, you'll have to disable your key and create a new one.</strong></span>
			</div>
		{:else}
			<div class="newKeySettings">
				<i class="icofont-ui-close close" on:click={() => isCollapsed = true} on:keydown={() => isCollapsed = true} />
				<h3>New API Key Settings</h3>
				<hr>
				<div class="selections">
					<span class="chainSelection"><strong>Chain:</strong> <ChainSelector bind:selectedChain={keyChain} /> <Tooltip text={tooltips.chain} /></span>
					<span class="tierSelection"><strong>Tier:</strong> <TierSelector bind:selectedTier={keyTierID} /> <Tooltip text={tooltips.tier} /></span>
					<span class="durationSelection"><strong>Duration:</strong> <DurationSelector bind:selectedDuration={keyDuration} /> <Tooltip text={tooltips.duration} /></span>
				</div>
				<hr>
				{#if token && activationCost.formatted !== undefined}
					<div class="results">
						<span class="cost"><strong>Key Activation Cost:</strong> {activationCost.formatted?.toLocaleString(undefined, { maximumFractionDigits: 2 })} {token.symbol} <img src="{weaver[keyChain].getTokenLogo(token.symbol)}" alt="{token.symbol}"></span>
						{#if chain === keyChain}
							{#if !fetchingBalance && !fetchingAllowance}
								{#if activationCost.formatted > balance}
									<span class="error">Insufficient {token.symbol} balance in wallet.</span>
								{:else if keyDuration <= 0}
									<span class="error">Invalid duration selected.</span>
								{:else if allowance >= activationCost.formatted}
									{#if activationInProgress}
										<span class="createNewKey inProgress">Creating New Key...</span>
									{:else}
										<span class="createNewKey" on:click={createNewKey} on:keydown={createNewKey}>Create New Key</span>
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
							{/if}
						{:else}
							<span class="error">Please connect to the {weaver[keyChain].getInfo().name} network.</span>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
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
		background-color: var(--lightPrimaryColor);
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

	div.newKeyDisplay {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: .5em;
		padding: 2em 1em;
		text-align: center;
	}

	span.apiKey {
		font-size: 1.2em;
	}

	div.newKeySettings {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 1em;
		padding: 1em;
		text-align: left;
	}

	i.close {
		position: absolute;
		inset: 1em 1em auto auto;
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

	span.createNewKey, span.error, span.approvalInfo {
		margin-left: auto;
	}

	span.createNewKey, span.approve {
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

	@media screen and (max-width: 450px) {
		span.apiKey {
			font-size: 1em;
		}
	}

	@media screen and (max-width: 350px) {
		span.apiKey {
			font-size: .9em;
		}
	}

	@media screen and (max-width: 300px) {
		span.apiKey {
			font-size: .8em;
		}
	}
	
</style>