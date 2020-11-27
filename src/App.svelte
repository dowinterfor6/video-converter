<script>
	import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
	import { fade } from 'svelte/transition';
	import Input from './Input.svelte';

	// TODO: Validate file
	// TODO: Encoding/output types
	// TODO: Max file size 2gb
	// TODO: Drag and drop upload
	// TODO: Multiple file download
	// TODO: Reset state on input change

	let output, isConverting;
	let video = {}
	let downloadLink;
	let percentDone = 0;

	const ffmpeg = createFFmpeg({
		log: true, 
		progress: ({ ratio }) => {
			percentDone = (ratio * 100.0).toFixed(2);
		}
	});

	const convert = async () => {
		// TODO: Check max file size here and prevent running if file too large
		const { name, size } = video;
		console.log(`${name}, ${size / 1024} kb`);

		isConverting = true;

		if (!ffmpeg.isLoaded()) {
			await ffmpeg.load();
		}

		ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(video));

		await ffmpeg.run('-i', 'input.mp4', '-f', 'mp4', 'out.mp4');

		const data = ffmpeg.FS('readFile', 'out.mp4');
		const url = URL.createObjectURL(new Blob([data.buffer]), { type: 'video/mp4' });

		output = url;
		isConverting = false;
	}
</script>

<main>
	<h1>Video Converter</h1>

	<Input bind:video/>
	{#if video}
		<button transition:fade="{{ duration: 300}}" on:click="{convert}">Convert</button>
	{/if}
	{#if isConverting}
		<span>{percentDone}%</span>
	{/if}
	<!-- {#if output} -->
		<a bind:this={downloadLink} href={output} download="download.mp4">Download</a>
	<!-- {/if} -->
</main>

<style>
	:global(body) {
		height: 100vh;
		padding: 0;
	}

	:global(*) {
		box-sizing: border-box;
	}

	main {
		height: 100%;
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	a {
		/* display: none; */
	}
</style>