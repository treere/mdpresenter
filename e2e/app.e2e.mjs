import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { startServer } from './static-server.mjs';

// La build end-to-end ha il base path di Pages; il browser è quello di Playwright,
// oppure quello indicato da CHROMIUM_PATH quando l'ambiente ne ha già uno.
const BUILD = fileURLToPath(new URL('../build-e2e', import.meta.url));
const REPORT = fileURLToPath(new URL('./report/', import.meta.url));

let site;
let server;
let browser;

before(async () => {
	await mkdir(REPORT, { recursive: true });
	server = await startServer({ root: BUILD, mount: '/mdpresenter' });
	site = server.url;
	browser = await chromium.launch({
		executablePath: process.env.CHROMIUM_PATH,
		args: ['--no-sandbox']
	});
});

after(async () => {
	await browser?.close();
	await server?.close();
});

/** Apre una pagina nuova (contesto isolato: la libreria non passa da un test all'altro). */
async function open(path) {
	const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
	const page = await context.newPage();
	const problems = [];
	page.on('response', (response) => {
		if (response.status() >= 400) problems.push(`${response.status()} ${response.url()}`);
	});
	page.on('requestfailed', (request) => problems.push(`richiesta fallita ${request.url()}`));
	page.on('pageerror', (error) => problems.push(`errore in pagina ${error.message}`));
	await page.goto(`${site}${path}`);
	return { page, problems, close: () => context.close() };
}

/** Esegue il corpo del test e, se fallisce, lascia uno screenshot in `e2e/report/`. */
async function withPage(label, path, body) {
	const { page, problems, close } = await open(path);
	try {
		await body(page, problems);
		assert.deepEqual(problems, [], `richieste o errori in pagina: ${problems.join(' | ')}`);
	} catch (error) {
		await page.screenshot({ path: join(REPORT, `${label}.png`) }).catch(() => {});
		throw error;
	} finally {
		await close();
	}
}

/** Contatore delle slide, che si aggiorna dopo un tick: si attende il valore atteso. */
async function counter(page) {
	return (await page.locator('.counter').innerText()).trim();
}

/** Link condiviso per un testo: prefisso `0` = base64url non compresso. */
function shareParam(text) {
	return `0${Buffer.from(text).toString('base64url')}`;
}

test('il base path di Pages serve tutte le pagine senza richieste fallite', async () => {
	for (const path of ['/', '/examples.html', '/about.html', '/v.html']) {
		await withPage(`base-paths${path.replaceAll('/', '-')}`, path, async (page) => {
			await page.locator('.site').waitFor();
		});
	}
});

test('il visualizzatore naviga le slide con la tastiera', async () => {
	await withPage('tastiera', '/v.html', async (page) => {
		await page.locator('.counter').waitFor();
		assert.match(await counter(page), /^1\/3/);
		await page.keyboard.press('ArrowRight');
		await page.waitForFunction(() => document.querySelector('.counter')?.textContent?.trim().startsWith('2/3'));
		await page.keyboard.press('ArrowLeft');
		await page.waitForFunction(() => document.querySelector('.counter')?.textContent?.trim().startsWith('1/3'));
	});
});

test('i passi di una slide compaiono uno alla volta', async () => {
	const text = '# Passi\n\nIntroduzione\n\n::: step\n\n- primo\n\n::: end\n\n::: step\n\n- secondo\n\n::: end';
	// Con contenuto prima del primo passo la slide si apre sull'introduzione
	// (`initialRevealed` = 0): i passi arrivano uno alla volta e restano visibili.
	await withPage('passi', `/v.html?t=${shareParam(text)}`, async (page) => {
		await page.locator('.counter').waitFor();
		assert.match(await counter(page), /^1\/1\s*·\s*0\/2/);
		assert.equal(await page.locator('.step.is-hidden').count(), 2);

		await page.keyboard.press('ArrowRight');
		await page.waitForFunction(() => (document.querySelectorAll('.step.is-hidden').length ?? 0) === 1);
		assert.match(await counter(page), /^1\/1\s*·\s*1\/2/);

		await page.keyboard.press('ArrowRight');
		await page.waitForFunction(() => document.querySelectorAll('.step.is-hidden').length === 0);
		assert.match(await counter(page), /^1\/1\s*·\s*2\/2/);
	});
});

test('la stampa dà una pagina per slide, senza interfaccia', async () => {
	await withPage('stampa', '/v.html', async (page) => {
		// Le pagine di stampa sono riempite dopo il primo render: si attende che ci siano.
		await page.waitForFunction(() => document.querySelectorAll('.print-page').length > 0);
		const slides = await page.locator('.print-page').count();
		assert.equal(slides, 3, 'una .print-page per slide');

		await page.emulateMedia({ media: 'print' });
		assert.equal(await page.locator('.toolbar').isVisible(), false, 'la toolbar non finisce in stampa');

		const pdf = await page.pdf({ format: 'A4', printBackground: true });
		// Ogni pagina del PDF è un dizionario `/Type /Page` non compresso.
		const pages = [...pdf.toString('latin1').matchAll(/\/Type\s*\/Page[^s]/g)].length;
		assert.equal(pages, slides, 'una pagina di PDF per slide');
	});
});

test('la libreria ritrova il testo dopo il ricaricamento', async () => {
	await withPage('libreria', '/', async (page) => {
		const editor = page.locator('textarea.editor');
		await editor.waitFor();
		await editor.fill('# Prova e2e\n\nautosalvataggio');
		await page.waitForFunction(() => (localStorage.getItem('mdpresenter-library') ?? '').includes('autosalvataggio'));
		await page.reload();
		await editor.waitFor();
		assert.match(await editor.inputValue(), /autosalvataggio/);
	});
});

test('il link condiviso riapre lo stesso testo', async () => {
	let search = '';
	await withPage('link', '/', async (page) => {
		const editor = page.locator('textarea.editor');
		await editor.waitFor();
		await editor.fill('# Condivisa\n\nquesto testo viaggia nel link');
		await page.waitForFunction(() => new URL(location.href).searchParams.has('t'));
		search = new URL(page.url()).search;
	});

	await withPage('link-riaperto', `/v.html${search}`, async (page) => {
		await page.locator('.slide h1').waitFor();
		assert.equal((await page.locator('.slide h1').innerText()).trim(), 'Condivisa');
	});
});

test('un blocco mermaid diventa un diagramma, non codice', async () => {
	await withPage('mermaid', '/', async (page) => {
		const editor = page.locator('textarea.editor');
		await editor.waitFor();
		await editor.fill('# Diagramma\n\n```mermaid\ngraph TD\nA[Idea] --> B[Codice]\n```');
		await page.locator('.slide .mermaid-block svg').waitFor({ timeout: 20_000 });
	});
});
