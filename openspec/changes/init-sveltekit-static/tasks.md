# Tasks

## 1. Scaffolding

- [x] 1.1 Scaffolding SvelteKit minimal (TS strict, npm) e installazione dipendenze — verifica: `package.json` contiene `@sveltejs/kit` e `node_modules` esiste
- [x] 1.2 Sostituzione adapter con `adapter-static`, `paths.base` da `BASE_PATH`, pagina con scritta centrata e `+layout.ts` con prerender — verifica: `BASE_PATH=/mdpresenter npm run build` crea `build/index.html` contenente `mdpresenter`
- [x] 1.3 `.nvmrc` con 22, README di progetto e workflow Pages — verifica: `npm run check` con 0 errori e `npm run build` verde

## 2. Pubblicazione

- [ ] 2.1 Commit e push su `main` — verifica: `git log origin/main` contiene il commit
- [ ] 2.2 Attivazione Pages con sorgente GitHub Actions e verifica URL — verifica: `https://treere.github.io/mdpresenter/` mostra `mdpresenter` (nota: il push del workflow richiede token con scope `workflow`)
