<script lang="ts">

	// Imports:
	import { apiTiers } from "$lib/functions";

	// Initializations:
	const tokenDecimals: number = 6;
	let timeSelection: 'weekly' | 'monthly' = 'monthly';

</script>

<!-- #################################################################################################### -->

<section id="pricing">

	<!-- Top Bar -->
	<div class="top">
		<h2>API Key Tiers</h2>
		<div class="timeToggle">
			<span on:click={() => timeSelection = 'weekly'} on:keydown={() => timeSelection = 'weekly'} class:selected={timeSelection === 'weekly'}>Weekly</span>
			<span on:click={() => timeSelection = 'monthly'} on:keydown={() => timeSelection = 'monthly'} class:selected={timeSelection === 'monthly'}>Monthly</span>
		</div>
	</div>
	<div class="tiers">
		{#each apiTiers as tier, i}
			<div class="tier" style:background-color="hsl(264, 45%, {20 + i * 10}%)">
				<span class="name">{tier.name}</span>
				<div class="prices">
					<span class="price">
						{#if tier.monthlyPrice === 0}
							-
						{:else if timeSelection === 'weekly'}
							~${(tier.monthlyPrice * 12 / 52).toLocaleString(undefined, { maximumFractionDigits: 2 })}
						{:else if timeSelection === 'monthly'}
							~${tier.monthlyPrice}
						{/if}
					</span>
					{#if tier.monthlyPrice}
						<span class="small">${(tier.unitPricePerSecond * 60 * 60 * 24 / (10 ** tokenDecimals)).toLocaleString(undefined, { maximumFractionDigits: 2 })} /day</span>
					{/if}
				</div>
				<div class="rateLimits">
					<span class="rateLimit">
						{#if timeSelection === 'weekly'}
							{tier.dailyRateLimit * 7 > 1000 ? `${(tier.dailyRateLimit * 7 / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}k` : (tier.dailyRateLimit * 7).toLocaleString(undefined, { maximumFractionDigits: 0 })} requests
						{:else if timeSelection === 'monthly'}
							{(tier.dailyRateLimit * 365 / 12 / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}k requests
						{/if}
					</span>
					<span class="small">{tier.dailyRateLimit} /day</span>
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
		filter: brightness(1.2);
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

	span.name {
		font-size: 1.2em;
		font-weight: bold;
	}

	span.price {
		font-size: 1.2em;
	}

	.small {
		color: var(--secondaryFontColor);
		font-size: .9em;
	}

	@media screen and (max-width: 450px) {
		div.tiers {
			flex-direction: column;
			align-items: center;
		}
		div.tier {
			gap: .5em;
			width: min(20em, 100%);
		}
		div.tier:first-of-type {
			border-radius: 1em 1em 0 0;
		}

		div.tier:last-of-type {
			border-radius: 0 0 1em 1em;
		}
		div.tier:not(:last-of-type) {
			border: none;
			border-bottom: 2px solid var(--secondaryFontColor);
		}
	}
	
</style>