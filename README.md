# PetSupplyHub — PENG Nexus

An independent, English-first, bilingual (English / 简体中文) procurement reference for overseas pet-accessory buyers. **V0.1 is a development preview**, not a storefront, supplier directory, certification service, or production launch.

## What works

- Six representative pet-accessory categories: collars/leashes, washable beds, feeding bowls, rope toys, grooming brushes and soft-sided carriers.
- Six distinct original SVG product illustrations, plus illustrated homepage and three buyer-guide cards. Artwork is illustrative, **not photos of a supplier's real inventory**.
- Live bilingual search across English/Chinese product names, categories and specifications; category filter and localized empty states.
- Fully browser-local RFQ brief: required fields, quantity checks, English/Chinese formatted text, clipboard and UTF-8 TXT export. Nothing transmitted to a backend.
- Responsive mobile/desktop and keyboard-focus styling. English fallback in HTML with explicit URL language `?lang=zh` or `?lang=en`; language switch remembers preference locally.
- Static prototype with `noindex,nofollow`, `robots.txt` blocking indexing, CSP, no paid APIs, and no external image or font requests.

## Home Laptop development

```powershell
# On the Home Laptop only, after your local work is clean and backed up:
git clone https://github.com/auturock067-spec/pet-supply-hub.git
cd pet-supply-hub
git switch feat/v0.1
npm run build
npm test
npm run dev
```

Then open `http://127.0.0.1:4173/?lang=zh`. For Chromium integration tests, run `npm ci`, `npx playwright install chromium`, then `npm run test:browser`. Playwright 1.58.2 and axe 4.11.1 are pinned in the lockfile. Set PLAYWRIGHT_BROWSERS_PATH to D:\AgentForge\cache\playwright on the Home Laptop. Node 24 is used in CI.

## Build & Cloudflare

`npm run build` copies reviewed static assets from `public/` to `dist/`. Planned Cloudflare Pages setup **after user acceptance**: repo `auturock067-spec/pet-supply-hub`, production branch `main`, build command `npm run build`, output `dist`, Node 24. Do not activate production, connect a live domain, remove `noindex`, or publish a verified-supplier claim without a separate review. **No Cloudflare deployment is claimed here.**

## Acceptance evidence

`npm test` checks six products, local SVGs, bilingual form, indexing/HTTPS safety and lack of RFQ transmission. GitHub CI runs static checks plus four Chromium widths (320/390/768/1440) for images, searching/filtering, English/Chinese switching and RFQ downloads. Actual production hostname tests and physical-device checks are not covered by CI.

## Product boundaries

Pet food, medication and veterinary medical devices are excluded. No medical/legal/compliance guarantee is made; buyer must verify exact manufacturer models, test scope, physical fit and applicable market/transport requirements. No live supplier listings, inventory, purchase orders, accounts, contact capture or payment.

Source of truth is **GitHub**. This is the Home Laptop project; do not modify the three Work Computer industry sites as part of its development.

## Owner-private online review

The separate Sites review edition preserves owner-private access and noindex. See docs/DEPLOYMENT.md for the persisted project identity, exact-source publishing and update/rollback procedure. It does not complete Cloudflare Git authorization. Local acceptance: 4 structural and 12 browser tests passed; 320/390/768/1440, English/Chinese, two axe scans. Hosting and CI results are recorded separately after actual verification.
