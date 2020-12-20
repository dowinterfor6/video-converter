import App from './App.svelte';

const app = new App({
	// TODO: Double check if this is affecting any other animations
	intro: true,
	target: document.body
});

export default app;