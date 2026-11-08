import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.ico': 'image/x-icon',
	'.woff2': 'font/woff2',
	'.txt': 'text/plain; charset=utf-8'
};

/**
 * Serves a static build under a mount prefix, the way GitHub Pages serves it under
 * `/mdpresenter`. `adapter-static` writes `<route>.html`, so a path without extension
 * falls back to `<path>.html` and then to `index.html`.
 *
 * Restituisce `{ url, close }` con la porta già assegnata dal sistema.
 */
export function startServer({ root, mount = '' }) {
	const base = mount.replace(/\/$/, '');
	const rootDir = normalize(root);

	const server = createServer((request, response) => {
		void handle(request, response);
	});

	async function handle(request, response) {
		const { pathname } = new URL(request.url ?? '/', 'http://localhost');
		let relative = decodeURIComponent(pathname);

		if (base !== '') {
			if (relative !== base && !relative.startsWith(`${base}/`)) {
				response.writeHead(404, { 'content-type': 'text/plain' }).end('fuori dal base path');
				return;
			}
			relative = relative.slice(base.length);
		}
		if (relative === '' || relative.endsWith('/')) relative += 'index.html';

		const file = normalize(join(rootDir, relative));
		if (!file.startsWith(rootDir)) {
			response.writeHead(403, { 'content-type': 'text/plain' }).end('percorso non valido');
			return;
		}

		for (const candidate of [file, `${file}.html`]) {
			try {
				const body = await readFile(candidate);
				response.writeHead(200, { 'content-type': TYPES[extname(candidate)] ?? 'application/octet-stream' });
				response.end(body);
				return;
			} catch {
				// file assente: si prova il candidato successivo
			}
		}
		response.writeHead(404, { 'content-type': 'text/plain' }).end(`non trovato: ${relative}`);
	}

	return new Promise((resolve, reject) => {
		server.once('error', reject);
		server.listen(0, '127.0.0.1', () => {
			const address = server.address();
			const port = typeof address === 'object' && address !== null ? address.port : 0;
			resolve({
				url: `http://127.0.0.1:${port}${base}`,
				close: () => new Promise((done) => server.close(() => done()))
			});
		});
	});
}
