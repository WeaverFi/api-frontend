<script lang="ts">

	// Imports:
	// import { ethers } from 'ethers';
	import weaver from 'weaverfi';
	
	// Type Imports:
	import type { ethers } from 'ethers';
  import type { KeyManager } from '3pi';
	import type { Token, KeyInfo } from '3pi/dist/types';
	import type { Chain, Address, Hash } from 'weaverfi/dist/types';

	// Initializations:
	export let key: KeyInfo & { chain: Chain, hash: Hash };
	export let keyActive: boolean;
  export let chain: Chain;
	export let address: Address;
  export let signer: ethers.providers.JsonRpcSigner;
	export let keyManager: KeyManager;
	export let token: Token;
	export let onReturn: Function;
	const secondsInAMonth: number = 2_628_000;

</script>

<!-- #################################################################################################### -->

<div class="extendKey">
	<span class="back" on:click={() => onReturn()} on:keydown={() => onReturn()}><i class="icofont-arrow-left" /> Back</span>
	<!-- TODO -->
</div>

<!-- #################################################################################################### -->

<style>

	span.back {
		font-weight: bold;
		cursor: pointer;
	}
	
</style>