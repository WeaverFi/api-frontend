<script lang="ts">

	// Initializations:
	export let selectedDuration: number;
	const secondsInAWeek: number = 606_462;
	const secondsInAMonth: number = 2_628_000;
	let number: number = 1;
	let timeScale: 'weeks' | 'months' = 'months';

	// Reactive Duration;
	$: number, timeScale, setDuration();

	// Function to set duration in seconds based on selections:
	const setDuration = () => {
		if(timeScale === 'weeks') {
			selectedDuration = Math.ceil(number * secondsInAWeek);
		} else if(timeScale === 'months') {
			selectedDuration = Math.ceil(number * secondsInAMonth);
		}
	}

</script>

<!-- #################################################################################################### -->

<div class="durationSelector">
	<input type="number" min="0" step="1" bind:value={number}>
	<span class="scale">
		<span class:selected={timeScale === 'months'} on:click={() => timeScale = 'months'} on:keydown={() => timeScale = 'months'}>Month{number !== 1 ? 's' : ''}</span>
		<span class:selected={timeScale === 'weeks'} on:click={() => timeScale = 'weeks'} on:keydown={() => timeScale = 'weeks'}>Week{number !== 1 ? 's' : ''}</span>
	</span>
</div>

<!-- #################################################################################################### -->

<style>

	div.durationSelector {
		display: inline-flex;
		gap: .5em;
	}

	input {
		width: 5em;
		padding: .3em 1em;
		font: inherit;
		text-align: center;
		background-color: var(--secondaryColor);
		border: none;
		border-radius: 1em;
	}

	input:focus {
		outline: none;
	}

	span.scale {
		display: inline-flex;
		color: var(--fontColor);
		background-color: var(--secondaryColor);
		border: 2px solid var(--secondaryColor);
		border-radius: 1em;
		overflow: hidden;
	}

	span.scale > span {
		padding: .2em 1em;
		cursor: pointer;
	}

	span.scale > span:not(.selected) {
		color: var(--secondaryColor);
		background-color: var(--accentColor);
	}
	
</style>