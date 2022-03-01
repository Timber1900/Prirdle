/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/typescript
// for information about these interfaces
declare namespace App {
	interface Stats {
		played: number,
		wins: number,
		streak: number,
		maxStreak: number,
		guesses: {
			1: number,
			2: number,
			3: number,
			4: number,
			5: number,
			6: number,
			7: number,
			fail: number
		},
		lastDayAdded: number
	}

	interface boardState {
		boardState: string[],
		hasGuessed: boolean,
		solution: string,
		date: number,
		colors: number[],
		expertStrikes: number,
		lines: number
	}
}
