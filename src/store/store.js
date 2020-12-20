import { writable } from 'svelte/store';

export const video = writable({});
export const fileFormat = writable(".mp4");
export const fileInputError = writable("");
export const dropdownInputError = writable("");
export const isFileConverting = writable(false);
export const notificationMessage = writable("");