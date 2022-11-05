<section id="info">
	<h2>About our API keys</h2>
	<p>Our API key management contracts use a completely trustless subscription model where your deposited balances are used to pay per second to keep your keys active. Any unused balances remain completely in your control and can be withdrawn at any time to terminate your subscription.</p>
	<p>During the first 24 hours of activating a new key, your rate limit will linearly increase towards your tier's allowed query limit:</p>
	<img src="/rateLimitsChart.svg" alt="Rate Limits Chart">
	<p>In order to change key tiers, simply cancel your previous key and create a new one with your desired tier. This will return to you all unspent balances from the previous key, allowing you to re-deposit towards your new key.</p>
</section>

<!-- #################################################################################################### -->

<style>

	section {
		background-color: var(--tertiaryColor);
	}

	img {
		width: min(40em, 90%);
		margin: 0 auto;
	}
	
</style>