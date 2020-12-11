<script>
	import { onMount } from 'svelte';

	let photos = [];

	let reset = () => {
		window.scrollTo(0, 0);
		location.reload()
	}

	onMount(async () => {
		const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=20`);
		photos = await res.json();
	});
</script>

<style>
	.photos {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-gap: 8px;
	}

	.bouton-holder {
		flex-flow: column wrap;
		display:flex;
		justify-content: center;
		align-items: center;
	}

	figure, img {
		width: 100%;
		margin: 0;
	}
	button {
		text-align: center;
		padding:1em 1.5em;
		background:transparent;
		border: solid 2px rgb(124, 91, 8);
		text-transform: uppercase;
		letter-spacing: 0.3rem;
		cursor:pointer;
	}
	:global(body) {
		overflow-x: hidden;
	}
	section {
		background:white;
	}
</style>
<section>
<div class="bouton-holder">
	<button style="margin:2em" on:click={reset}>Rejouer l'animation</button>
</div>

<div class="photos">
	{#each photos as photo}
		<figure>
			<img src={photo.thumbnailUrl} alt={photo.title}>
			<figcaption>{photo.title}</figcaption>
		</figure>
	{:else}
		<!-- this block renders when photos.length === 0 -->
		<p>loading...</p>
	{/each}
</div>
</section>