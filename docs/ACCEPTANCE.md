# PetSupplyHub V0.1 acceptance

Updated 2026-10-29. Structural checks: 4/4 PASS. Chromium: 12/12 PASS, 0 failures (2026-10-29T15:44:03.302Z); eight bilingual viewport cases, three regression groups and the parent acceptance case. Two axe scans passed. CI/hosted verification is pending and will be recorded separately.

Required checks: both English/Chinese at 320/390/768/1440; six decoded local illustrations; all internal anchors/assets; bilingual live search/filter/empty state; each product preselection; invalid required/quantity/email/whitespace handling; literal hostile input; complete bilingual brief; clipboard/TXT current content; stale-export invalidation; denied-clipboard fallback; language change preserves fields; no unexpected HTTP requests, uncaught JS errors or RFQ storage; automatic accessibility scans and manual visual review; real hosted URL plus ownership/access and deployed commit identity.

Four viewports are real Chromium emulation on the laptop, not physical phone testing or every browser engine. Automated accessibility checks do not establish full WCAG conformance. Synthetic test contacts use example.com. No product, supplier, certification or import admission is verified.

Local reports/screenshots are saved to artifacts/ (ignored in Git). CI uploads evidence. Private URL, saved version/deployment IDs, pushed commit and actual browser review will be appended after validation. Cloudflare Git integration remains separate and requires its repository authorization; Sites access is owner-private.
