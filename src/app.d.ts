// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

// SvelteKit 3 non genera più i tipi per $app/*: dichiariamo solo ciò che usiamo.
declare module '$app/paths' {
	export const base: string;
	export function resolve(path: string): string;
}
