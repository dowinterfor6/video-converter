# Video Converter

A simple video converter website designed to convert video files to different formats. Works straight from the browser, no download necessary.

## About

Created with [Svelte](https://github.com/sveltejs/svelte) and conversion is made possible with [ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm).

## Known issues:

Input background flashes sometimes when dragging over

- Not really worth LOE
- `Pointer events: none` doesn't work

Does not work on mobile

- Limitation of ffmpeg wasm, memory limit on mobile devices

Does not work offline

- Limitation of ffmpeg wasm implementation, requires api call to fetch core
