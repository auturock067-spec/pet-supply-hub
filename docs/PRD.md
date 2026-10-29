# PetSupplyHub V0.1 requirements

Updated 2026-10-29. Home Laptop only; independent repo pet-supply-hub. Audience: independent pet brands, retailers and importers. Outcome: compare sourcing details and create a usable bilingual brief before contacting a real supplier.

## Scope

Six groups: collars/leashes, beds, feeding bowls, rope toys, grooming brushes and carriers. English-first with Chinese toggle and explicit ?lang=en/zh; bilingual search, category filter and empty state; original illustrations; buyer guidance and official quality/market references; local RFQ validation, copying and UTF-8 TXT download; privacy explanation and noindex review state. No inventory, supplier matching, certification, payment or order service.

## Buyer journey

1. Understand the reference-site proposition on Home.
2. Search by English/Chinese term or category and compare specification prompts.
3. Read the sample, material and evidence questions.
4. Pick a reference into RFQ, specify intended use/construction/quantity/market plus packaging, delivery, optional email and notes.
5. Generate a bilingual plain-text brief. Correct invalid fields; regenerate after edits.
6. Copy or download and independently share with a chosen supplier. The site sends nothing.

## Release boundary

V0.1 is a draft buyer reference. A private online review edition may be hosted through Sites; this is technically a private production deployment, not a Cloudflare Preview or a public commercial launch. Preserve noindex and the current Draft PR. Public indexing, custom domains, actual RFQ intake or commercial supplier claims require separate acceptance and scope. No paid APIs or database. Other sites and PENG Nexus are outside this task.

## Risks

Unsupported material/safety/origin claims, stale exports, sample/bulk mismatch, destination-specific obligations, inaccessible text, data leakage and unproven brand availability. Mitigations: exact-model evidence prompts, input validation and stale-export invalidation, official links/review date, automated/browser checks and no transmission.
