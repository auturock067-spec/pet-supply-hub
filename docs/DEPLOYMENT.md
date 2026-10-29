# PetSupplyHub deployment and maintenance

Canonical repo: https://github.com/auturock067-spec/pet-supply-hub. Local: D:\AgentForge\pet-supply-hub. Before work on any device: fetch origin, inspect status and divergence, preserve changes, fast-forward only when safe. Never force-push or overwrite another device's work. Keep current feature/Draft PR; no changes to other sites.

Build: Node24; npm ci; npm run build; npm test; npm run test:browser. For laptop browser cache use PLAYWRIGHT_BROWSERS_PATH=D:\AgentForge\cache\playwright. Tests use an ephemeral port. Local review uses a project-specific PORT (pet 4174, hair 4175).

## Private Sites review edition

Persisted ID: appgprj_6ae3685e03bc8191899ce084690122f7. Expected origin: https://peng-pet-supply-review.auturock067.chatgpt.site — this is NOT deployment evidence until a successful deployment returns it. Existing audience is owner-private; preserve it. Sites URLs are technically production deployments even when used as a private review edition. Keep noindex; do not describe it as Cloudflare Pages.

Push the validated source to GitHub first. Use the Sites source helper with the ephemeral credential through hidden stdin only; package dist with .openai/hosting.json from that exact pushed commit. The helper pushes a mirror without replacing GitHub origin. Save/deploy owner-private; if a non-terminal status is returned, follow its deployment ID to completion. Record exact version, commit and URL. Do not create another Site after any failure. No credential file or secret belongs in Git or artifacts.

## Cloudflare option / outstanding account gate

Pages Git project would use the exact repo, accepted branch, npm run build, dist and Node24. GitHub App repository access must be explicitly authorized; previous owner verification was unavailable. Do not silently claim that private Sites hosting completes Cloudflare Git integration. No custom domain purchase or paid service.

## Update and recovery

Change via feature branch and CI, then mirror/package the exact pushed source for a new private saved version. Verify returned deployment URL and build-info identity after an update. Recovery: redeploy the prior known-good saved version using its exact returned version ID; verify the served commit. At the first deployment there is no earlier production target. Document any unperformed rollback drill honestly. Do not delete a Site or change its audience as a recovery tactic.

Runtime application has no secrets. Maintain original illustrations/provenance, monthly official-source checks and quarterly bilingual review. Real RFQ intake, analytics, supplier claims or public release require a scoped privacy/content review.
