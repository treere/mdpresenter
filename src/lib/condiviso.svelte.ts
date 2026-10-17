import type { Lingua, Tema } from './i18n';

/** Preferenze condivise tra layout e pagine (tema, lingua). */
export const preferenze = $state<{ tema: Tema; lingua: Lingua }>({
	tema: 'chiaro',
	lingua: 'it'
});

/** Testo da caricare nell'editor (dalla pagina esempi). */
export const appoggio = $state<{ testoDaAprire: string | null }>({
	testoDaAprire: null
});
