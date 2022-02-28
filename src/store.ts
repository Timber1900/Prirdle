import { writable } from 'svelte/store';

export const show = writable(false);
export const curBoard = writable<App.boardState>();
export const stats = writable<App.Stats>();
export const infos = writable<string[]>([]);
export const showSettings = writable<boolean>(false)
