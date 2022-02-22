import { writable } from 'svelte/store';

export const show = writable(false);
export const curBoard = writable<App.boardState>();
export const stats = writable<App.Stats>()
