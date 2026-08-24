# SIH 2026 Compliance and Completion Plan

## Blockchain-Based Secure Platform for Identity, Access Control, and Digital Asset Management

**Planning date:** 24 August 2026  
**Submission horizon in supplied SIH 2026 guidelines:** 20 September 2026  
**Planning window:** 27 calendar days  
**Current maturity:** Submission-ready engineering baseline; **not** testnet, pilot, production, legal-title, BEL-endorsed, independently audited, or organizationally approved.

## 1. Executive decision

This plan turns the current repository into an **SIH-compliant idea submission and demonstrable final-project baseline** for Problem Statement 26125. The immediate objective is to submit a clear, feasible, evidence-backed idea package before the supplied deadline, then execute a six-to-twelve-month post-hackathon implementation path if the team is selected and the accountable ministry, institution, security, identity, custody, privacy, and operations authorities provide the required decisions.

> The official project-implementation guidance explicitly treats hackathon projects as feasibility work rather than automatically deployment-ready systems. It calls for a detailed implementation plan, expert support, cybersecurity involvement for software, regular monitoring, and quarterly reporting.[1]

The plan therefore separates three things that must never be conflated:

| Maturity level | Permitted claim | Evidence required |
|---|---|---|
| **SIH idea submission** | A novel, feasible, clearly described solution proposal with a prototype/demonstration strategy. | SIH-format idea PDF, correct team/SPOC/authorization records, problem-statement fit, references, and truthful scope statement. |
| **Evaluation-ready final project** | A reproducible, synthetic-data demonstration of the selected contract, API, persistence, indexer, verifier, and read-only console boundaries. | Protected repository evidence, unit/integration/E2E/accessibility/static/fuzz checks, traceability, demo script, and known limitations. |
| **Controlled testnet/pilot/production** | No claim is allowed until the applicable external gates are completed. | Actual identity, network/custody, KMS/storage, privacy/legal, hosting/operations, assurance, review, and release authority evidence. |

## 2. SIH 2026 compliance baseline

The supplied SIH 2026 guidelines require a college-mediated process: a SPOC, internal-hackathon selection, a six-student same-college team including at least one female member, complete nomination data, and an idea presentation PDF. They state a 20 September 2026 nomination/idea-submission deadline, with each team limited to two problem statements and an individual problem statement potentially closing after 500 ideas.[2]

| SIH requirement | Required action | Owner | Evidence / deadline |
|---|---|---|---|
| College SPOC process | Confirm that the college SPOC is registered and has access to the SIH portal. Students do not self-register. | College SPOC | Portal confirmation; immediately. |
| Internal-hackathon eligibility | Ensure the team was selected through the institution’s internal hackathon and that the SPOC has the report, participation data, jury information, and nominated-team record required by SIH. | SPOC and faculty coordinator | Internal-hackathon dossier; before nomination. |
| Team composition | Confirm exactly six student members from the same college, one designated leader, and at least one female member. | Team leader and SPOC | Annexure/team record; before portal entry. |
| Nomination record | Use the prescribed format; keep team name unique and free of the institute name; include up to two mentors only if accurate. | SPOC | Signed authorization letter on institutional letterhead, with seal and authorized signatory. |
| Idea submission | Verify team details, choose the problem statement, enter title/description, and upload the SIH-format idea presentation PDF. | Team leader, validated by SPOC | Portal record and PDF; target completion by 15 September 2026 to retain contingency. |
| Originality/IP | Confirm that the proposal is new, was not submitted/presented in a prior programme, and that all source material is properly licensed and acknowledged. | Team, faculty/IP reviewer | Signed originality/provenance declaration; prior to submission. |
| Presentation criteria | Address novelty, complexity, clarity/detail, feasibility, practicability, sustainability, impact scale, UX, and future-work potential. | Product, technical, and presentation leads | Rubric-backed PDF and rehearsal. |
| Mentoring | Identify up to two truthful mentors only after shortlisting or where permitted by the college process. The supplied guidelines describe five years of relevant experience as the mentor expectation. | Faculty/SPOC/team | Mentor CV/consent; no invented affiliations. |

### Submission timing control

The supplied deadline leaves **27 days** from 24 August to 20 September 2026. Because a problem statement can close early at 500 ideas, the team should treat **15 September 2026** as the internal portal-submission target and retain 16–20 September only for correction/contingency, not for primary production.

## 3. Problem-statement alignment and honest solution narrative

The repository traceability record maps SIH 2026 Problem Statement 26125 to decentralized identity references, NFT-based digital-asset ownership, RBAC, immutable events, privacy-aware auditability, physical-asset commitments, offboarding, and governance. The current source baseline already demonstrates important safe boundaries: a Solidity/OpenZeppelin contract baseline, fail-closed FastAPI boundaries, PostgreSQL durability evidence, strict indexer/reconciliation primitives, a direct-RPC verifier, AES-GCM reference controls, and an accessible read-only Evidence Ledger console.

The submission must **not** claim that the current prototype is a deployed government/BEL system. The following positioning is accurate:

> **Proposed solution:** an evidence-gated, blockchain-backed platform that creates cryptographically verifiable organizational identity references, controls asset operations through role and lifecycle rules, records tamper-evident asset/audit events, and provides independent verification without exposing sensitive personal or asset data on-chain.

| Requirement theme | Demonstrable prototype evidence | Submission gap to frame as planned work |
|---|---|---|
| Decentralized identity | Opaque DID-hash identity registry, lifecycle controls, replacement-key/offboarding tests. | Select and approve a DID/VC or OIDC/PKI profile, resolver, assurance model, and organizational trust owner. |
| Digital assets and access control | ERC-721 asset model; Admin/Manager/Auditor/User roles; active identity checks, pause, transfer, and denial tests. | Approved multisig/custody, tenant/asset scope, organization-specific role governance, and independent contract review. |
| Tamper-evident auditability | Contract events, strict ABI decoder, raw-log retention, confirmed/reorg-aware projection references, sanitized audit route. | Approved finality policy, durable worker execution, operational backfill/export, monitoring, and incident process. |
| Metadata and privacy | Content commitments plus envelope-encryption/classification/key-release reference boundaries. | Approved KMS/HSM, object-store/data-residency choice, malware/DLP, retention/erasure/legal-hold, and recovery drill. |
| Transparent verification | Direct-RPC verifier with disposable deployment E2E and code-hash mismatch rejection. | Approved deployment inputs, QR/NFC/physical-binding process, legal/title language, and field-verification workflow. |
| User experience | Read-only Evidence Ledger with unavailable/error states, responsive checks, browser E2E, and automated accessibility coverage. | Approved identity integration, localized content, manual screen-reader/zoom/cross-browser review, and user research. |

## 4. “Use all resources to the fullest” operating rule

The supplied `CLAUDE.md`, full-stack resource catalogue, original 15 blockchain/identity references, and current 96-record ledger are used as a **controlled decision system**, not as a dependency shopping list. The repository already follows this principle: only OpenZeppelin is a runtime dependency among the original curated blockchain sources; the rest inform architecture, tests, threat models, comparisons, training, or explicit non-adoption decisions.

| Resource family | Full-value use in this plan | Default / boundary |
|---|---|---|
| Identity and VC/DID references | Compare standards, issuer trust, revocation, recovery, and organizational assurance profiles. | Adopt an adapter only after the owner approves a profile; never treat a wallet address as sufficient organizational identity. |
| OpenZeppelin, EVM, NFT sources | Retain canonical contract, role, pause, lifecycle, event, and negative/fuzz/static assurance patterns. | Pin, test, scan, and review upgrades; no unreviewed deployment. |
| FastAPI, React, PostgreSQL, Docker references | Improve the existing Python/React/PostgreSQL architecture rather than replacing it with a second backend/ORM stack. | Existing FastAPI/SQLAlchemy/Alembic direction remains primary; Prisma/Better Auth/T3 are comparison references unless a documented ADR proves need. |
| UX and accessibility resources | Apply project-owned components, axe automation, manual review, responsive failure states, and SIH demo clarity. | No generic dashboard claims; UX must explain ownership versus legal title and access versus decryption. |
| Security and supply-chain resources | Map OWASP controls to negative tests; use CodeQL, Slither, Echidna, audit, SBOM/provenance, dependency/license review, and secret scanning. | Evidence is retained; alerts are not dismissed without a real resolution. |
| Jobs, storage, realtime, search, AI, analytics | Evaluate only after a measured need is documented. | None may become identity, authorization, custody, ownership, canonical-chain, or key-release authority. |
| Infrastructure and operations resources | Use Compose for local demos; compare OpenTofu/Pulumi and hosting options only after real account, region, RTO/RPO, and owner decisions exist. | No provider or paid resource is selected by assumption. |
| Governance and delivery resources | Use Conventional Commits, issue/RACI tracking, protected PRs, non-author reviews, project plan, reports, and evidence register. | No self-approval, reviewer simulation, bypass, invented badge, or fabricated external result. |
| Ponytail process reference | Apply need → reuse project → platform capability → approved dependency → minimum project-owned implementation. | It must never simplify away security, accessibility, error handling, testing, provenance, or release evidence. |

Every resource must remain linked in the reference ledger to one of: a requirement, ADR, source comparison, project-owned implementation, test, training exercise, or explicit non-adoption rationale. This preserves licenses, provenance, and SIH originality obligations while making the resource use auditable.

## 5. Work plan through SIH idea submission

### Sprint A — Eligibility, problem fit, and governance (24–28 August)

| Deliverable | Work | Accountable role | Acceptance evidence |
|---|---|---|---|
| SIH eligibility dossier | Confirm SPOC, internal-hackathon selection, six-member composition, female-member requirement, same-college eligibility, team name, and two-statement limit. | SPOC and team leader | Completed institutional checklist; no personal data committed to GitHub. |
| Problem-statement charter | Freeze the selected SIH problem statement, target users, field pain points, measurable outcomes, non-goals, and why blockchain is justified. | Product lead and domain mentor | One-page charter approved by faculty/domain mentor. |
| Originality/provenance pack | Review every reused library, image, diagram, text, data source, and reference. Record license, attribution, and non-vendoring decision. | Technical lead and IP/faculty reviewer | Reference ledger delta, third-party notice review, signed team declaration if institution requires it. |
| Ownership/RACI | Name roles for SPOC, leader, architecture, contract, API/data, UX/demo, testing/security, documentation, faculty mentor, and external approvals. | Team leader | RACI and weekly cadence. |

### Sprint B — Evidence-first prototype stabilization (29 August–5 September)

| Workstream | Completion scope | Required evidence |
|---|---|---|
| Contract assurance | Freeze the SIH demo contract surface; validate roles, asset lifecycle, access denial, transfer, pause, offboarding, and verifier evidence. | Unit/negative tests, coverage, static analysis, Echidna, ABI/hash verification. |
| API/persistence/indexer | Demonstrate fail-closed audit/intent handling, idempotency, PostgreSQL race/replay/reconciliation, and canonical-versus-projection explanation. | Service tests, real disposable PostgreSQL suite, unavailable-state demo. |
| Privacy/security | Establish a synthetic-data-only policy; verify no secrets in browser/logs; show commitments rather than sensitive metadata. | Secret scan, fixture review, classification/encryption/key-denial tests. |
| Evidence Ledger UX | Polish only critical demo states: empty/unavailable, confirmed/uncertain, audit projection, verifier result, and explicit limitation banner. | Browser E2E, axe, responsive check, manual keyboard/zoom pass. |
| Demo data | Define synthetic personas, synthetic asset records, test DIDs, test commitments, and chain fixtures. | Data dictionary and reset script; no real identity/organizational asset data. |

### Sprint C — Submission package and rehearsal (6–12 September)

| Deliverable | Required content | Quality gate |
|---|---|---|
| SIH idea presentation PDF | Seven-slide SIH template structure described in Section 8. | Rubric scorecard shows coverage of novelty, feasibility, viability, impact, UX, research, and progression. |
| Idea description | Plain-language problem, target beneficiaries, proposed workflow, differentiation, feasibility, risks, and phased deployment path. | Aligns exactly with deck and portal fields; no unsupported deployment claims. |
| Demo script | Three-minute happy path plus one-minute denial/failure proof. | Rehearsal is repeatable from a clean local environment and uses synthetic data. |
| Architecture pack | One context/trust-boundary diagram, one data/authority flow, one implementation timeline, and one risk/mitigation view. | Every diagram matches the traceability matrix and vocabulary. |
| Judge Q&A bank | Responses to blockchain necessity, privacy, scalability, identity, legal title, costs, adoption, operations, and failure scenarios. | Each answer identifies fact, assumption, and decision owner. |

### Sprint D — Submission and contingency (13–20 September)

| Date target | Action | Control |
|---|---|---|
| 13–14 September | Faculty/mentor review, accessibility/readability review, provenance check, and portal-data cross-check. | Maintain a redacted checklist rather than sharing student personal data in the repository. |
| **15 September** | Submit the portal idea package after SPOC/team-leader verification. | Capture confirmation evidence outside public source control. |
| 16–19 September | Correct only factual/format issues permitted by the portal; retain submitted-version hash. | Do not submit an unreviewed scope expansion. |
| 20 September | Final deadline contingency. | Treat as last resort, not normal submission date. |

## 6. SIH idea-presentation plan

The supplied template contains seven pages: **SIH cover, Idea Title, Technical Approach, Feasibility and Viability, Impact and Benefits, Research and References, and a final page**. Preserve the supplied 13.33 × 7.50 inch layout and concise format. Use the template’s visible Times New Roman title treatment, Arial body treatment, white field, and blue accent system when creating the final PDF.

| Slide | Required message | Evidence to show | Prohibited claim |
|---:|---|---|---|
| 1 | SIH 2026 cover | Problem Statement 26125, team name, college, theme, team details as entered by SPOC. | Endorsement by SIH, BEL, ministry, or a named organization without evidence. |
| 2 | Idea Title | A precise problem-to-outcome title; one-sentence value proposition; target users and pain point. | “Production-ready,” “fully deployed,” or “guaranteed fraud-proof.” |
| 3 | Technical Approach | Authority diagram: approved identity adapter → canonical contract → API/intents → indexer/projection → encrypted metadata boundary → read-only evidence console/verifier. | Storing personal identity or sensitive asset data on-chain; browser custody/signing authority. |
| 4 | Feasibility and Viability | Existing prototype evidence, modular phasing, synthetic local demonstration, reuse of secure open-source components, deployment gates, and estimated workstreams. | A claimed provider, testnet, KMS, audit, or operational contract that has not been approved. |
| 5 | Impact and Benefits | Reduced unauthorized operations, tamper-evident audit trail, privacy-aware verification, accountable asset lifecycle, operational transparency, and measurable pilot metrics. | Legal-title guarantee, elimination of all fraud, or realized field impact without a pilot. |
| 6 | Research and References | Official SIH guidance, standards, OpenZeppelin, OWASP, curated source ledger, and license/provenance boundary. | Unattributed copied diagrams, code, or external claims. |
| 7 | Roadmap / closing | 27-day submission plan plus six-to-twelve-month post-selection path, risks, mentors/authority needs, and concise call to action. | A promise of deployment without ministry/institution/security/legal approval. |

## 7. Post-shortlisting and post-winning roadmap

The official implementation guidance describes a six-to-twelve-month development/implementation horizon, regular monitoring, cybersecurity involvement, and quarterly status reporting.[1] The following roadmap is intentionally conditional on actual selection and accountable approvals.

| Phase | Indicative duration | Engineering output | Required non-engineering decision / evidence |
|---|---:|---|---|
| P0 — Mobilization | Weeks 1–2 | Charter, RACI, issue board, evidence register, risk register, architecture freeze. | Ministry/problem-owner contact, institutional consent, technical agency/expert panel, mentor assignment. |
| P1 — Discovery and design | Weeks 3–6 | User research with approved synthetic/consented data, domain workflow, ADRs, threat model, data classification, acceptance plan. | Problem-owner process validation, privacy/legal/records scope, IP agreement clarification. |
| P2 — Core hardening | Weeks 7–12 | Contract/API/persistence/indexer/verifier/web completion against selected evaluation scope. | Cybersecurity expert review, code-review process, source/license verification. |
| P3 — Approved integrations | Weeks 13–18 | Identity adapter, storage/KMS adapter, workflow/retry/observability only after decisions. | Selected identity, network/custody, KMS/storage, tenant/residency, and hosting owners. |
| P4 — Staging and resilience | Weeks 19–24 | Synthetic-data staging, migration, monitoring, backups, restore/reconciliation, load/chaos, manual accessibility. | Hosting account/region, SLO/RPO/RTO, on-call, incident/rollback authority. |
| P5 — Controlled testnet / evaluation deployment | Weeks 25–32 | Approved testnet manifest, source/ABI/hash verification, direct verifier walkthrough, reorg/finality tests. | Multisig/deployer/pause governance, approved RPC/finality policy, security sign-off. |
| P6 — Pilot decision | Weeks 33–40 | Constrained workflows, support/incident exercises, independent security assessment remediation. | Privacy/legal/records, data/asset scope, risk acceptance, pilot authorization. |
| P7 — Production decision | Weeks 41–52 | HA/DR, operational evidence, gradual release controls, monitored readiness. | Formal release approval; independent assurance; legal/privacy; operations ownership; no bypassed review. |

## 8. Governance, monitoring, and reporting

| Cadence | Forum | Minimum content | Evidence owner |
|---|---|---|---|
| Weekly | Team + mentor execution review | Completed tasks, blockers, security/quality results, decisions needed, next-week plan. | Team leader. |
| Monthly | SPOC/faculty/problem-owner review | Milestone status, user feedback, risk changes, budget/tool needs, mentor actions, escalation. | SPOC / project coordinator. |
| Quarterly after selection/winning | Ministry/department implementation report | Progress against plan, deliverables, risks, approvals, cybersecurity status, expenditures where applicable, next-quarter plan. | Designated coordinating agency or project lead. |
| Before each maturity transition | Release-governance review | Exact evidence, unresolved risks, approvals, rollback/removal plan, go/no-go result. | Release authority, not the development team alone. |

### Required decision packets

The repository’s existing decision packets must be completed before corresponding integrations begin:

1. **Identity and organizational trust:** provider/profile, issuer registry, assurance, lifecycle, recovery, privacy basis, support owner.
2. **Network, finality, and custody:** EVM network, finality/reorg policy, RPC, multisig/deployer, pause/emergency authority.
3. **Storage, KMS/HSM, and lifecycle:** key custody, object store, residency, classification, malware controls, retention, restoration, erasure/legal hold.
4. **Tenant, database, hosting, and operations:** isolation model, TLS/backup/HA, RTO/RPO/SLO, logging/metrics/alerts, on-call and incident process.
5. **Legal, independent assurance, and release authority:** privacy/records/title terms, assessment scope, protected review, vulnerability disclosure, go/no-go authority.

## 9. Security, privacy, and claims-control checklist

| Control | Before SIH submission | Before evaluation/demo | Before external deployment |
|---|---|---|---|
| Secrets and identity data | No secrets/personal data in deck, repository, screenshots, logs, or sample data. | Synthetic-only data; browser-storage inspection. | Approved secret manager, data classification, privacy/legal controls. |
| Supply chain | Reference/source ledger and licenses checked; no copied code without attribution. | Locked dependencies, audit, SBOM/provenance, secret scan. | Vendor review, update ownership, image provenance, vulnerability management. |
| Contract and API | Explain scope and limitations truthfully. | Tests, static/fuzz analysis, verifier E2E, fail-closed API tests. | Independent assurance, custody, deployment policy, monitored incident response. |
| Accessibility and UX | Clear readable PDF with non-technical problem framing. | Automated accessibility plus manual keyboard/zoom/screen-reader review. | Localized, supported, user-researched flows with documented accessibility evidence. |
| Claims and communication | No institutional endorsement, field deployment, legal title, or audit claim. | Mark demo as synthetic/local or controlled evaluation evidence. | Claim only the evidence actually accepted by accountable authorities. |

## 10. Risks and mandatory escalations

| Risk | Consequence | Mitigation / stop rule |
|---|---|---|
| SIH nomination or internal-hackathon eligibility is incomplete | Team cannot submit compliantly. | Resolve through SPOC immediately; do not fabricate nomination/authorization material. |
| Problem statement reaches 500 submissions | Portal may close early. | Complete the deck and portal package by 15 September; monitor the official portal through the SPOC. |
| IP terms differ between documents | Later ownership/access dispute. | Obtain written clarification before post-selection contract, data, or funded work; retain source provenance. |
| Prototype overclaims operational readiness | Evaluation, trust, legal, and safety harm. | Use the maturity labels in Section 1; disclose all external gates. |
| Source/license conflict | Plagiarism/copyright exposure. | Maintain reference ledger, notices, license checks, and a team originality declaration. |
| Missing independent review | Protected merge/deployment cannot proceed. | Maintain protected PRs and identify real eligible reviewers; never self-approve or simulate review. |
| Real data/custody used prematurely | Privacy/security/legal harm. | Synthetic data only until authority decisions and environment controls are completed. |

## 11. Definition of done

### A. SIH submission-ready

- The SPOC, internal-hackathon, team, authorization, originality, and portal requirements are satisfied with genuine institutional records.
- The idea title, description, and seven-slide PDF follow the supplied SIH template and are mutually consistent.
- The deck scores every selection criterion with evidence: novelty, technical depth/complexity, clarity, feasibility, practicability, sustainability, impact, UX, and future progression.
- The repository demonstrates a reproducible synthetic workflow and clearly documents what is not yet selected, approved, or deployed.
- Every external source is attributed or recorded in the reference ledger; no copyrighted material, sensitive data, or fabricated assertion is present.

### B. Post-selection implementation-ready

- The detailed plan, tools/hardware needs, timeline, mentor/cybersecurity support needs, RACI, risk register, and quarterly-report template are accepted by the accountable coordinating authority.
- The decision packets are completed before implementation of identity, network/custody, storage/KMS, hosting, or real-data integrations.
- The source baseline is protected by required automated checks and legitimate non-author review.

### C. Deployment-ready only when separately authorized

- Staging and testnet evidence, independent security assurance, privacy/legal/records and IP clarification, KMS/custody controls, operational ownership, backup/restore/reconciliation, accessibility, monitoring, support, and signed release authority are all present.

## 12. References

[1] [Smart India Hackathon, Guidelines for Deployment of SIH Winning Projects](https://sih.gov.in/projectImplementation)

[2] [Supplied SIH 2026 Guidelines PDF](file:///home/ubuntu/upload/SIH2026Guidelines.pdf)

[3] [Supplied SIH 2026 Idea Presentation Format](file:///home/ubuntu/upload/SIH2026-IDEA-Presentation-Format.pptx)

[4] [Smart India Hackathon Official Portal](https://www.sih.gov.in/)

[5] [Repository Problem Statement 26125 Traceability Matrix](file:///home/ubuntu/Blockchain-Based-Secure-Platform-for-Identity-Access-Control-and-Digital-Asset-Management/docs/PROBLEM-STATEMENT-TRACEABILITY.md)

[6] [Repository Final Project Completion Plan](file:///home/ubuntu/Blockchain-Based-Secure-Platform-for-Identity-Access-Control-and-Digital-Asset-Management/docs/FINAL-PROJECT-COMPLETION-PLAN.md)
