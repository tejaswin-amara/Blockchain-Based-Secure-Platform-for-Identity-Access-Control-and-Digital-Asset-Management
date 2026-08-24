# SIH 2026 Idea Presentation Content

## Design instruction

Reproduce the supplied SIH 2026 template’s formal white-and-blue visual language. Use a white canvas; restrained medium/dark-blue header bars, dividers, and icons; sparse red only for a limitation warning; Times New Roman for headings and Arial for body copy. Keep content left-aligned, spacious, and concise. Use 16:9 layout. Keep a small footer on every content slide: “Synthetic/local demonstration only — not a deployed government, BEL, legal-title, or production system.”

## Slide 1 — SMART INDIA HACKATHON 2026

**Title:** Evidence-Gated Blockchain Platform for Secure Identity, Asset Lifecycle, and Auditable Access

**Subtitle:** SIH 2026 — Problem Statement 26125

**Details:**
- Team: `[Verified Team Name]`
- Institute: `[Verified College / University]`
- Theme: Secure Digital Identity, Access Control, and Digital Asset Management
- Replace all bracketed fields only through SPOC-verified data.

**Visual:** Formal SIH-style cover with blue accent stripe and a thin evidence/verification motif. Do not show unverified partner logos.

## Slide 2 — IDEA TITLE

**Headline:** Trust facts, not application screens.

**Core message:** Organizations need a way to prove who may create, allocate, access, transfer, suspend, restore, and verify sensitive asset records without exposing private metadata.

**Three problem statements:**
- Fragmented identity, database, document, and log records make audit reconciliation difficult.
- Unauthorized or stale operational views can lead to unsupported asset actions.
- Verifiers need evidence without direct access to sensitive organizational data.

**Value proposition:** A privacy-aware platform where contract-owned lifecycle facts are independently verifiable and operational uncertainty fails closed.

**Visual:** Left-aligned user/problem flow with three user roles: manager, auditor, verifier.

## Slide 3 — TECHNICAL APPROACH

**Headline:** Layered authority with explicit trust boundaries.

**Architecture flow:**
1. Approved organizational identity adapter → opaque identity reference.
2. Canonical Solidity/OpenZeppelin contract → role and lifecycle rules for unique asset references.
3. Fail-closed FastAPI transaction/audit boundary → explicit intent and safe errors.
4. Rebuildable PostgreSQL/indexer projection → raw logs, reconciliation, uncertainty visibility.
5. Encrypted metadata boundary → commitments on-chain; payload/key access off-chain and approval-gated.
6. Evidence Ledger + direct-RPC verifier → operator visibility and independent verification.

**Existing evidence callouts:** lifecycle/negative tests, fuzz/static analysis, PostgreSQL race/replay coverage, verifier E2E, accessibility/browser checks.

**Visual:** One horizontal authority diagram with blue blocks and arrows. Highlight “canonical contract” in dark blue; mark external approval-gated boundaries with dashed outlines.

## Slide 4 — FEASIBILITY AND VIABILITY

**Headline:** Build on a tested baseline; deploy only through approved gates.

**Implemented today:**
- Canonical ERC-721 lifecycle and RBAC contract baseline.
- Fail-closed audit and transaction-intent services.
- Durable persistence, reconciliation primitives, and direct-RPC verification.
- Accessible Evidence Ledger and reproducible local validation evidence.

**Phased adoption:**
- SIH prototype: synthetic local/disposable-chain demonstration.
- Controlled evaluation: approved identity, storage/KMS, and staging evidence.
- Testnet/pilot: approved network, custody, finality, operations, and security controls.

**Risk control:** No personal data on-chain; no browser key custody; no production claims without accountable approvals.

**Visual:** Three-stage timeline with blue progressing arrows; final two stages visually labelled “approval-gated.”

## Slide 5 — IMPACT AND BENEFITS

**Headline:** Transparent lifecycle evidence with privacy-aware verification.

**Benefits:**
- Reduces unsupported asset-operation assertions through enforced role and lifecycle checks.
- Creates tamper-evident event evidence for audit and reconciliation.
- Enables independent verification without trusting cached UI or revealing sensitive payloads.
- Makes uncertainty visible: stale, denied, paused, or mismatched states do not appear as success.

**Evaluation metrics:**
- Verifier agreement with canonical contract reads.
- Unauthorized operation attempts rejected.
- Reconciliation findings detected and resolved.
- Accessibility defects found and fixed before release.

**Impact boundary:** Field impact will be measured only in an approved pilot using approved data.

**Visual:** Four benefit pillars with shield-check, file-text, search, and eye icons; a narrow red “evidence not assumption” divider.

## Slide 6 — RESEARCH AND REFERENCES

**Headline:** Standards, secure components, and traceable provenance.

**References:**
- Smart India Hackathon 2026 Guidelines and official project-implementation guidance.
- W3C DID Core for decentralized-identifier concepts.
- EIP-721 and OpenZeppelin Contracts for unique-asset and access-control primitives.
- OWASP ASVS for security-verification controls.
- Curated reference ledger covering identity, storage, governance, accessibility, testing, and operations lessons.

**Provenance statement:** Sources are used as governed design/test inputs, not copied blindly. Runtime adoption requires license, security, and evidence review.

**Visual:** Clean reading list with small document/book icons, blue rules, and a footnote pointing to full references appendix.

## Slide 7 — ROADMAP AND CLOSING

**Headline:** From SIH prototype to accountable deployment.

**Today through SIH submission:**
- Template-aligned idea package, synthetic demonstration, provenance pack, and review evidence.

**Post-selection six-to-twelve-month roadmap:**
- Discovery/ADRs → core hardening → approved integrations → staging/resilience → controlled testnet → pilot decision.

**What we need from partners:**
- SPOC/institutional authorization and mentorship.
- Cybersecurity, identity, custody, KMS/storage, privacy/legal, and operations decision owners.
- Real non-author code review and independent assurance before external release.

**Closing line:** Build verifiable trust through evidence, bounded authority, and accountable adoption.

**Visual:** A road map rising from “SIH submission-ready” to “controlled evaluation” to “approved deployment decision,” with the final stage clearly labelled as conditional.
