<script lang="ts">

	// Imports:
	import { contractAddresses } from '$lib/functions';
	import weaver from 'weaverfi';

	// Type Imports:
	import type { Chain } from 'weaverfi';

	// Initializations:
	export let selectedChain: Chain;
	const chains = Object.keys(contractAddresses) as Chain[];

</script>

<!-- #################################################################################################### -->

<div class="chainSelector">
	{#each chains as chain}
		<span class="chain {chain}" class:selected={selectedChain === chain} on:click={() => selectedChain = chain} on:keydown={() => selectedChain = chain}>
			<img src="/chains/{chain}.svg" title="{weaver[chain].getInfo().name}" alt="{weaver[chain].getInfo().name}">
		</span>
	{/each}
</div>

<!-- #################################################################################################### -->

<style>

	div.chainSelector {
		display: inline-flex;
		background-color: var(--secondaryColor);
		border: 2px solid var(--secondaryColor);
		border-radius: 1em;
		overflow: hidden;
	}

	span.chain {
		display: flex;
		gap: .5em;
		padding: .5em 1em;
		cursor: pointer;
	}

	span.eth.chain.selected {
		background-color: #627eea;
	}

	span.bsc.chain.selected {
		background-color: #F0B90B;
	}

	span.poly.chain.selected {
		background-color: #7b3fe4;
	}

	span.ftm.chain.selected {
		background-color: #13b5ec;
	}

	span.avax.chain.selected {
		background-color: #e84142;
	}

	span.cronos.chain.selected {
		background-color: #1f214b;
	}

	span.op.chain.selected {
		background-color: #ff0420;
	}

	span.arb.chain.selected {
		background-color: #2d374b;
	}

	img {
		height: 1.2em;
		width: 1.2em;
	}
	
</style>