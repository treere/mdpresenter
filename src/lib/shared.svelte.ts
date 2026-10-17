import type { Language, Theme } from './i18n';

/** Preferences shared between layout and pages. */
export const preferences = $state<{ theme: Theme; language: Language }>({
	theme: 'light',
	language: 'it'
});

/** Text to load in the editor (from the examples page). */
export const pending = $state<{ textToOpen: string | null }>({
	textToOpen: null
});
