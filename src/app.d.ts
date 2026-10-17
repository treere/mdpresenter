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

// SvelteKit 3 no longer generates types for $app/*: declare only what we use.
declare module '$app/paths' {
	export const base: string;
	export function resolve(path: string): string;
}
