<script lang="ts">
	
	// Initializations:
	export let text: string;
	let tooltipOpen: boolean = false;

</script>

<!-- #################################################################################################### -->

<span class="tooltip">
	<i class="icofont-info-circle" on:mouseenter={() => tooltipOpen = true} on:mouseleave={() => tooltipOpen = false} />
	{#if tooltipOpen}
		<span class="tooltipText">{text}</span>
	{/if}
</span>

<!-- #################################################################################################### -->

<style>

	span.tooltip {
		position: relative;
	}

	span.tooltipText {
		position: absolute;
		left: -12.5em;
		display: block;
		width: min(25em, 90vw);
		padding: .5em 1em;
		font-size: .8em;
		color: var(--fontColor);
		background-color: var(--secondaryColor);
		border: 2px solid var(--fontColor);
		border-radius: .5em;
		box-shadow: 2px 2px 12px #0004;
		z-index: 1;
	}
	
</style>