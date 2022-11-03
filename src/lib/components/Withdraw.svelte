<script lang="ts">

	// Imports:
	import weaver from 'weaverfi';
	
	// Type Imports:
	import type { ethers } from 'ethers';
  import type { KeyManager } from '3pi';
	import type { Token } from '3pi/dist/types';
	import type { Chain } from 'weaverfi/dist/types';
  import type { ExtendedKeyInfo } from '$lib/types';

	// Initializations:
	export let key: ExtendedKeyInfo;
  export let chain: Chain;
  export let signer: ethers.providers.JsonRpcSigner;
	export let keyManager: KeyManager;
	export let token: Token;
	export let onReturn: Function;
	export let onWithdrawal: Function;
	let withdrawalInProgress: boolean = false;

	// Function to withdraw key's remaining balance:
	const withdrawKeyBalance = async () => {
		try {
			withdrawalInProgress = true;
			await keyManager.deactivateKey(key.hash, signer);
		} finally {
			withdrawalInProgress = false;
			onWithdrawal();
		}
	}

</script>

<!-- #################################################################################################### -->

<div class="withdraw">
	<span class="back" on:click={() => onReturn()} on:keydown={() => onReturn()}><i class="icofont-arrow-left" /> Back</span>
	<div class="withdrawalInfo">
		<h3>Are you sure you want to withdraw?</h3>
		<p>This action will return this key's remaining {token.symbol} balance to your wallet, and you will no longer be able to use it for any API queries.</p>
		{#if chain === key.chain}
			{#if withdrawalInProgress}
				<span class="withdrawKeyBalance inProgress">Withdrawing...</span>
			{:else}
				<span class="withdrawKeyBalance" on:click={withdrawKeyBalance} on:keydown={withdrawKeyBalance}>Confirm Withdrawal</span>
			{/if}
		{:else}
			<span class="error">Please connect to the {weaver[key.chain].getInfo().name} network.</span>
		{/if}
	</div>
</div>

<!-- #################################################################################################### -->

<style>

	div.withdraw {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	span.back {
		margin-top: .5em;
		font-weight: bold;
		cursor: pointer;
	}

	div.withdrawalInfo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: .5em;
		text-align: center;
	}

	div.withdrawalInfo > p {
		margin-bottom: .5em;
	}

	span.withdrawKeyBalance {
		padding: .5em 1em;
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
	
</style>