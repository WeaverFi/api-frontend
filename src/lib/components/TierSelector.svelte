<script lang="ts">

	// Imports:
	import { apiTiers } from '$lib/functions';

	// Initializations:
	export let selectedTier: number;

</script>

<!-- #################################################################################################### -->

<select name="tierSelector" bind:value={selectedTier}>
	{#each apiTiers as tier}
		<option value="{tier.id}">{tier.name}: &nbsp; ${tier.monthlyPrice} /month</option>
	{/each}
</select>

<!-- #################################################################################################### -->

<style>

	select {
		padding: .3em 1em;
		font: inherit;
		background-color: var(--secondaryColor);
		border: none;
		border-radius: 1em;
	}

	select:focus {
		outline: none;
		border-radius: 1em 1em 0 0;
	}
	
</style>