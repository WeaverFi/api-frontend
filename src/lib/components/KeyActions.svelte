<script lang="ts">

	// Imports:
	import weaver from 'weaverfi';

	// Type Imports:
	import type { Token } from '3pi';
  import type { ExtendedKeyInfo } from '$lib/types';

	// Initializations:
	export let key: ExtendedKeyInfo;
	export let token: Token;
	export let remainingBalance: number;
	export let fetchingBalance: boolean;
	export let onClickExtendKey: Function;
	export let onClickWithdraw: Function;

</script>

<!-- #################################################################################################### -->

<div class="keyActions">
	{#if fetchingBalance}
		<span class="loading">Loading remaining {token.symbol} balance...</span>
	{:else}
		<span><strong>Remaining Balance:</strong></span>
		<span class="remainingBalance">{remainingBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} {token.symbol} <img src="{weaver[key.chain].getTokenLogo(token.symbol)}" alt="{token.symbol}"></span>
		<div class="buttons">
			<span class="extendKey" on:click={() => onClickExtendKey()} on:keydown={() => onClickExtendKey()}>Extend</span>
			<span class="withdraw" on:click={() => onClickWithdraw()} on:keydown={() => onClickWithdraw()}>Withdraw</span>
		</div>
	{/if}
</div>

<!-- #################################################################################################### -->

<style>

	div.keyActions {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 1em 0 3em;
	}

	span.remainingBalance {
		display: flex;
		align-items: center;
		gap: .2em;
		margin: .2em 0 .5em;
		font-size: 1.4em;
	}

	span.remainingBalance > img {
		height: 1.2em;
		width: 1.2em;
	}

	div.buttons {
		display: flex;
		gap: 1em;
	}

	div.buttons > span {
		width: 7em;
		padding: .5em 0;
		text-align: center;
		color: var(--fontColor);
		background-color: var(--secondaryColor);
		border-radius: 1em;
		cursor: pointer;
		user-select: none;
	}
	
</style>