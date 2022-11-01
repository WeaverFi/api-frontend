<script lang="ts">

	// Imports:
	// import { ethers } from 'ethers';
	import weaver from 'weaverfi';
	
	// Type Imports:
	import type { ethers } from 'ethers';
  import type { KeyManager } from '3pi';
	import type { Token } from '3pi/dist/types';
  import type { ExtendedKeyInfo } from '$lib/types';
	import type { Chain, Address } from 'weaverfi/dist/types';

	// Initializations:
	export let key: ExtendedKeyInfo;
  export let chain: Chain;
	export let address: Address;
  export let signer: ethers.providers.JsonRpcSigner;
	export let keyManager: KeyManager;
	export let token: Token;
	export let onReturn: Function;

</script>

<!-- #################################################################################################### -->

<div class="withdraw">
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