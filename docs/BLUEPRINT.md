# PetSupplyHub technical blueprint

Static Node build: public/ → dist/. Node 24; no production dependencies, backend, API key or database. Test-only Playwright/axe dependencies are locked.

- public/catalog.js: six bilingual reference groups, specs and cautions.
- public/site.js: identity, localized metadata, language preference key, export filename and image/placeholder text.
- public/app.js: search/filter, bilingual UI, allowlisted selection, native + trimmed required validation and local brief exports.
- public/styles.css and assets/: responsive layout and original local SVGs.
- scripts/build.mjs: reproducible static copy and build-info.json containing the supplied Git commit.
- scripts/serve.mjs: project-owned local HTTP server; use a distinct PORT beside other sites.
- .openai/hosting.json: persisted private Sites identity appgprj_6ae3685e03bc8191899ce084690122f7, static directory dist.

Inputs remain in document memory; only language preference is stored. All user text reaches the output via textContent, not HTML insertion. Editing inputs invalidates existing exports. Clipboard errors select the brief for manual copy. Downloads include UTF-8 BOM. No automatic email or submission.

CSP disallows network connections and form submissions; no remote fonts/media. Hosting services may process normal request metadata. Actual hosted headers still need inspection. Draft robots/noindex remains enabled. Native Sites owns private access; do not broaden sharing to solve access errors.

GitHub is canonical. Sites mirrors the exact reviewed pushed commit using a repo-scoped ephemeral credential; do not replace GitHub origin, persist tokens or print credentials. A Sites saved version/deployment is recorded only from returned IDs and verified state.
