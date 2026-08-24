# SIH 2026 Judge Q&A and Demonstration Script

## Evidence and data boundary

Every demonstration uses synthetic identities, synthetic asset identifiers, a disposable local chain, and non-production data. No team member should represent the prototype as deployed, BEL-endorsed, legally authoritative, independently audited, or production-ready.

## Four-minute demonstration script

| Time | Demonstration | Spoken explanation |
|---:|---|---|
| 0:00–0:30 | Problem and boundary | Explain that the challenge is proving who can act on an asset and what happened to it, without relying on a mutable database screen or exposing sensitive metadata. |
| 0:30–1:15 | Contract authority | Show synthetic identity registration, a manager-authorized mint/allocation, and role/lifecycle restrictions. Explain that contract state governs only contract-owned facts. |
| 1:15–2:00 | Fail-closed audit/API behavior | Show the audit projection/Evidence Ledger unavailable or constrained state and explain that uncertainty is surfaced instead of being silently reported as success. |
| 2:00–2:45 | Independent verification | Run the direct-RPC verifier on the synthetic deployment; show success. Then use the code-hash mismatch case to show that a wrong deployment is rejected. |
| 2:45–3:30 | Privacy and metadata boundary | Explain that on-chain records use opaque identity/asset commitments; metadata remains outside with an encryption/KMS boundary awaiting organizational approval. |
| 3:30–4:00 | Roadmap and ask | State the post-selection decisions required for a controlled evaluation: identity profile, custody/network, KMS/storage, privacy/legal review, operations, and independent assurance. |

## Failure-path proof

Show one prohibited operation or verifier mismatch. The point is to demonstrate that unsafe/uncertain actions do not become success states. Do not fake a live attack or claim penetration-test coverage.

## Judge Q&A

| Likely question | Evidence-grounded answer |
|---|---|
| Why use blockchain instead of a database? | A database remains useful for projections, queries, and operations, but is not used as the authority for contract-owned lifecycle facts. The ledger adds independently verifiable event/state evidence for scoped assets; it does not replace identity, privacy, or legal governance. |
| Is personal data stored on-chain? | No. The design uses opaque identity references and asset commitments. Sensitive metadata is designed to remain off-chain behind approved encryption/key-management controls. |
| How do you prevent unauthorized minting or transfer? | The contract uses explicit roles, active-identity checks, manager-only lifecycle operations, disabled approval surfaces, pause controls, and negative/property/fuzz tests. Real institutional roles still require an approved identity and custody model. |
| Can this prove legal ownership of a physical asset? | No. The prototype proves token and workflow evidence only. Legal title and physical-asset binding require an organization’s registry, field-verification process, and legal approval. |
| How is identity verified? | The current prototype models privacy-preserving identity references. A real DID/VC or OIDC/PKI profile, issuer/trust model, recovery, and assurance level are deliberate external decisions before deployment. |
| How does it scale? | Contract-owned events are compact; read-heavy views use a rebuildable projection/indexer. Scaling choices such as provider, finality, queues, caching, and infrastructure must be measured and approved for the selected environment. |
| What happens if the indexer or API is stale? | The API and UI must surface uncertainty or fail closed. An independent verifier reads canonical contract state directly; reconciliation and replay patterns detect projection issues. |
| What makes the project feasible? | The repository already has a tested contract, fail-closed service boundaries, real PostgreSQL durability checks, direct verifier E2E, Web E2E/axe checks, static/fuzz analysis, and a synthetic local demonstration path. |
| Is it production-ready? | No. It is an evaluation-ready engineering baseline. Production needs actual identity, network/custody, KMS/storage, hosting/operations, privacy/legal, independent assurance, and release approvals. |
| What is the impact? | The intended impact is reduced unsupported operational assertions and clearer verification/audit evidence. Real impact metrics must be measured in an approved pilot, not claimed from synthetic tests. |
