<script lang="ts">

	// Imports:
	import { apiTiers } from "$lib/functions";

	// Initializations:
	let timeSelection: 'weekly' | 'monthly' = 'monthly';

</script>

<!-- #################################################################################################### -->

<section>

	<!-- Top Bar -->
	<div class="top">
		<h2>API Key Tiers</h2>
		<div class="timeToggle">
			<span on:click={() => timeSelection = 'weekly'} on:keydown={() => timeSelection = 'weekly'} class:selected={timeSelection === 'weekly'}>Weekly</span>
			<span on:click={() => timeSelection = 'monthly'} on:keydown={() => timeSelection = 'monthly'} class:selected={timeSelection === 'monthly'}>Monthly</span>
		</div>
	</div>
	<div class="tiers">
		{#each apiTiers as tier}
			<div class="tier">
				<div class="prices">
					<span class="price">
						{#if tier.price === 0}
							Free
						{:else if timeSelection === 'weekly'}
							${(tier.price * 12 / 52).toLocaleString(undefined, { maximumFractionDigits: 2 })}
						{:else if timeSelection === 'monthly'}
							${tier.price}
						{/if}
					</span>
					{#if tier.price}
						<span class="small">${(tier.price * 12 / 365).toLocaleString(undefined, { maximumFractionDigits: 2 })} /day</span>
					{/if}
				</div>
				<div class="rateLimits">
					<span class="rateLimit">
						{#if timeSelection === 'weekly'}
							{tier.rateLimit * 7 > 1000 ? `${(tier.rateLimit * 7 / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}k` : (tier.rateLimit * 7).toLocaleString(undefined, { maximumFractionDigits: 0 })} requests
						{:else if timeSelection === 'monthly'}
							{(tier.rateLimit * 365 / 12 / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}k requests
						{/if}
					</span>
					<span class="small">{tier.rateLimit} /day</span>
				</div>
			</div>
		{/each}
	</div>
</section>

<!-- #################################################################################################### -->

<style>

	div.top {
		display: flex;
		justify-content: space-between;
	}

	div.timeToggle {
		display: flex;
		gap: 1em;
	}

	div.timeToggle > span {
		cursor: pointer;
	}

	div.timeToggle > span.selected {
		color: var(--accentColor);
		border-bottom: 2px solid var(--accentColor);
	}

	div.tiers {
		display: flex;
		margin-top: 2em;
	}

	div.tier {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1em;
		padding: 2em 0;
	}

	div.tier:hover {
		background-color: var(--terciaryColor);
	}

	div.tier:first-of-type {
		border-radius: 1em 0 0 1em;
	}

	div.tier:last-of-type {
		border-radius: 0 1em 1em 0;
	}

	div.tier:not(:last-of-type) {
		border-right: 2px solid var(--secondaryFontColor);
	}

	div.tier > div {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: .2em;
	}

	span.price {
		font-size: 1.2em;
		font-weight: bold;
	}

	.small {
		color: var(--secondaryFontColor);
		font-size: .9em;
	}
	
</style>