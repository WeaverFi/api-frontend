<script lang="ts">

	// Imports:
	import { apiTiers, formatDate } from '$lib/functions';
	import weaver from 'weaverfi';

	// Type Imports:
  import type { ExtendedKeyInfo } from '$lib/types';

	// Initializations:
	export let key: ExtendedKeyInfo;
	export let keyActive: boolean;
	export let onClickReActivate: Function;
	const secondsInADay: number = 86_400;
	let timeNow = Date.now() / 1000;
	let copiedHash: boolean = false;

	// Reactive Key Tier:
	$: tier = apiTiers[key.tierId];

	// Function to copy public key hash to clipboard:
	const copyHash = () => {
    navigator.clipboard.writeText(key.hash);
    copiedHash = true;
    setTimeout(() => copiedHash = false, 3000);
  }

</script>

<!-- #################################################################################################### -->

<div class="keyDetails">
	<span><strong>Chain:</strong> {weaver[key.chain].getInfo().name}</span>
	<span class="keyHash">
		<strong>Public Hash:</strong> {key.hash.slice(0, 8)}...{key.hash.slice(-6)}
		{#if copiedHash}
			Copied!
		{:else}
			<i class="icofont-ui-copy" on:click={copyHash} on:keydown={copyHash} />
		{/if}
	</span>
	<span><strong>Tier:</strong> {tier.name} (${tier.monthlyPrice} /month)</span>
	<span><strong>Daily Rate Limit:</strong> {tier.dailyRateLimit} Requests</span>
	{#if timeNow < (key.startTime + secondsInADay)}
		<span class="rateLimitWarning">This key was activated less than 24 hours ago, so its rate limit is still ramping up.</span>
	{/if}
	<!-- TODO - add tooltip to let users know that if a key expires and is re-activated, start time will be updated (indicates consecutive active time) -->
	{#if keyActive}
		<span><strong>Key valid until {formatDate(key.expiryTime)}.</strong></span>
	{:else}
		<span>Key expired on {formatDate(key.expiryTime)}. <span class="reactivateKey" on:click={() => onClickReActivate()} on:keydown={() => onClickReActivate()}>Click here to extend key's duration.</span></span>
	{/if}
</div>

<!-- #################################################################################################### -->

<style>

	div.keyDetails {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding-top: 1em;
	}

	div.keyDetails > span:last-of-type {
		margin-top: 1em;
	}

	span.keyHash > i {
		cursor: pointer;
	}

	span.rateLimitWarning {
		margin-left: 1em;
		color: var(--terciaryColor);
		font-size: .9em;
	}

	span.reactivateKey {
		margin-left: .5em;
		font-weight: bold;
		cursor: pointer;
	}

	span.reactivateKey:hover {
		text-decoration: underline;
	}
	
</style>