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
	<table>
		<tr>
			<th>Chain:</th>
			<td>{weaver[key.chain].getInfo().name}</td>
		</tr>
		<tr class="keyHash">
			<th>Public Hash:</th>
			<td>
				<span class="address" on:click={copyHash} on:keydown={copyHash} class:copied={copiedHash}>
					{key.hash.slice(0, 8)}...{key.hash.slice(-6)}
					<i class="icofont-ui-copy" />
				</span>
			</td>
		</tr>
		<tr>
			<th>Tier:</th>
			<td>{tier.name} (${tier.monthlyPrice} /month)</td>
		</tr>
		<tr>
			<th>Daily Rate Limit:</th>
			<td>{tier.dailyRateLimit} Requests</td>
		</tr>
		{#if keyActive && timeNow < (key.startTime + secondsInADay)}
			<tr>
				<td colspan="2" class="rateLimitWarning">This key was activated less than 24 hours ago, so its rate limit is still ramping up.</td>
			</tr>
		{/if}
	</table>
	<span class="expiry">
		{#if keyActive}
			<strong>Key valid until {formatDate(key.expiryTime)}.</strong>
		{:else}
			<span>Key expired on {formatDate(key.expiryTime)}.</span>
			<span class="reactivateKey" on:click={() => onClickReActivate()} on:keydown={() => onClickReActivate()}>Click here to extend key's duration.</span>
		{/if}
	</span>
</div>

<!-- #################################################################################################### -->

<style>

	div.keyDetails {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 1em;
		white-space: nowrap;
	}

	div.keyDetails > span:last-of-type {
		margin-top: 1em;
	}

	table {
		width: fit-content;
		text-align: left;
	}

	table td, table th {
		padding: 0.5em 1em;
		border-bottom: 1px dashed #888;
	}

	.keyHash .address {
		position: relative;
		cursor: copy;
	}

	.keyHash .address.copied::after {
		content: "Copied!";
		position: absolute;
		inset: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		color: var(--fontColor);
		background-color: var(--primaryColor);
		border-radius: 5px;
	}

	td.rateLimitWarning {
		margin: 0.5em 0 0 1em;
		color: var(--tertiaryColor);
		font-size: .9em;
		white-space: normal;
	}

	span.expiry {
		display: flex;
		gap: .5em;
		flex-wrap: wrap;
		margin-bottom: 1em;
	}

	span.reactivateKey {
		font-weight: bold;
		cursor: pointer;
	}

	span.reactivateKey:hover {
		text-decoration: underline;
	}
	
</style>