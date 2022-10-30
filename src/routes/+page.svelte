<script lang="ts">

	// Imports:
	import Keys from '$lib/sections/Keys.svelte';
	import Info from '$lib/sections/Info.svelte';
	import Navbar from '$lib/sections/Navbar.svelte';
	import Header from '$lib/sections/Header.svelte';
	import Footer from '$lib/sections/Footer.svelte';
	import Pricing from '$lib/sections/Pricing.svelte';

	// Links:
	const links = {
		app: 'https://app.weaver.fi',
		github: 'https://github.com/WeaverFi',
		twitter: 'https://twitter.com/weaver_fi',
		discord: 'https://discord.com/invite/DzADcq7y75',
		sdk: 'https://github.com/WeaverFi/weaverfi',
		contribute: 'https://github.com/WeaverFi/weaverfi/blob/main/CONTRIBUTING.md',
		gitcoin: 'https://gitcoin.co/grants/5854/weaverfi-the-open-source-defi-portfolio-tracker',
		docs: 'https://api.weaver.fi/docs'
	}

	// Initializations:
	let scrollY = 0;
	
</script>

<!-- #################################################################################################### -->

<!-- SvelteKit Dynamic Header -->
<svelte:head>
	<title>WeaverFi API</title>
	<meta name="description" content="The open-source, multi-chain DeFi portfolio tracker's very own API." />
</svelte:head>

<!-- Window Bindings -->
<svelte:window bind:scrollY />

<!-- Navbar -->
<Navbar bind:scrollY twitterLink={links.twitter} discordLink={links.discord} githubLink={links.github} />

<!-- Header Section -->
<Header docsLink={links.docs} />

<!-- Key Management Section -->
<Keys />

<!-- Pricing Section -->
<Pricing />

<!-- Info Section -->
<Info />

<!-- Footer -->
<Footer {links} />