# SIH 2026 Submission Content Draft

## Submission-control notice

This draft is designed for **SIH 2026 Problem Statement 26125**. The college SPOC and team leader must replace only the bracketed operational placeholders after verifying them against the official portal, authorization letter, and team record. No placeholder may be completed from assumption, and no personal information should be committed to the public repository.

## Portal title

**Evidence-Gated Blockchain Platform for Secure Identity, Asset Lifecycle, and Auditable Access Control**

## One-line value proposition

>A privacy-aware platform that binds verifiable organizational identity references to controlled digital-asset lifecycles and independently verifiable audit evidence, without treating application databases or browser state as the source of truth.

## Short portal description

Organizations that manage sensitive digital or physical asset records often need to prove who is authorized to create, assign, access, transfer, suspend, restore, and verify an asset record. Conventional systems frequently split these facts across identity systems, databases, documents, and application logs, making reconciliation difficult and allowing stale or unauthorized operational views to persist.

The proposed solution is an evidence-gated blockchain platform that uses a canonical smart contract for asset lifecycle and role-controlled operations, opaque cryptographic identity references rather than raw personal identity data on-chain, and tamper-evident events for asset and access decisions. A fail-closed API, durable non-authoritative audit projection, encrypted-metadata boundary, and read-only Evidence Ledger console make the system explainable to operators and auditors. An independent direct-RPC verifier checks contract state, lifecycle evidence, and deployed-code identity rather than trusting a cached application screen.

The working prototype demonstrates synthetic identities, role-based asset operations, lifecycle restrictions, denied-access audit events, idempotent transaction intents, durable reconciliation patterns, and verification of local disposable-chain evidence. The architecture deliberately separates implemented engineering evidence from future decisions that require an organization’s approval, including the real identity profile, network/finality policy, multisig custody, KMS/HSM, storage residency, legal-title process, and production operations. This makes the solution feasible for staged adoption while avoiding overclaiming operational readiness.

## Detailed idea description

### Problem and target users

The platform addresses the need for reliable lifecycle governance of sensitive assets and associated access rights. The intended users are authorized administrators, managers, auditors, verifiers, and asset subjects working inside an approved organization. Their common challenges are proving authority, preventing duplicate or unauthorized reassignment, reconciling application records with event history, and disclosing enough evidence for verification without publishing sensitive metadata.

### Proposed workflow

1. An approved organizational identity process supplies a privacy-preserving identity reference. The current prototype models this as a unique opaque DID hash; the actual DID/VC or OIDC/PKI profile is an explicit organizational decision.
2. The canonical smart contract registers lifecycle-controlled identity references and enforces Admin, Manager, Auditor, and User roles for permitted asset operations.
3. A manager can mint and allocate a unique ERC-721-backed digital asset reference only when authorization and lifecycle checks pass. Transfers, suspensions, restorations, offboarding, and pauses are subject to explicit contract controls.
4. Each material operation emits structured events. The indexer stores raw-log evidence and rebuildable projections, while the API fails closed when authorization, freshness, or canonical state is uncertain.
5. Sensitive metadata stays outside the ledger. Only a commitment/reference is retained, with an envelope-encryption/KMS boundary designed for a later approved integration.
6. An operator sees a constrained Evidence Ledger console. A verifier can independently query the contract and compare expected contract code/asset/lifecycle facts against direct RPC results.

### Differentiation

The design does not treat “blockchain” as a replacement for all enterprise controls. Instead, it defines explicit authority boundaries: contract state governs contract-owned facts; indexers and databases are rebuildable read models; the browser is a presentation/intention layer; and real identity, key custody, storage, legal ownership, and deployment policy stay with accountable authorities. This combination of fail-closed behavior, evidence visibility, privacy boundaries, and direct verification is the primary differentiation.

### Feasibility and implementation path

The project already includes a Solidity/Hardhat contract baseline, OpenZeppelin security primitives, negative and lifecycle tests, static analysis, property/fuzz evidence, FastAPI transaction/audit boundaries, PostgreSQL durability tests, ABI-validated indexing primitives, a direct-RPC verifier, and an accessible React Evidence Ledger console. A staged path is therefore practical:

| Stage | Scope | Required decision |
|---|---|---|
| SIH prototype | Synthetic local/disposable-chain demonstration and reproducible engineering evidence. | None beyond team/institutional submission authority. |
| Controlled evaluation | Approved identity adapter, storage/KMS test integration, staging evidence, manual accessibility, and independent review. | Identity, security, privacy, and operations owners. |
| Testnet / pilot | Approved network, finality, RPC, custody, KMS, storage, monitoring, backup, and incident controls. | Named organizational authorities. |
| Production | Independent assurance, legal/privacy/records approval, operational ownership, release sign-off, and real data governance. | Formal go/no-go authority. |

### Impact and success measures

The project is intended to reduce unsupported operational assertions by making role decisions, asset lifecycle changes, and verification evidence independently checkable. Early evaluation metrics will use synthetic data and include: failed unauthorized-operation rate, time to reconstruct an audit projection, verifier agreement with canonical contract reads, reconciliation findings resolved, accessibility defects found/fixed, and controlled recovery/restore results. Field impact must not be claimed until a real pilot is approved and measured.

## 60-second pitch

“Our solution is an evidence-gated blockchain platform for secure identity references, asset lifecycle control, and auditable access. Instead of placing personal data on-chain or trusting a database screen, we keep contract-owned facts in a canonical smart contract, record structured tamper-evident events, and let an independent verifier check the actual network state. The API fails closed if authorization or freshness is uncertain, while sensitive metadata stays behind an encryption and key-management boundary. The current prototype already demonstrates role-based asset actions, lifecycle controls, denied-access auditing, durable transaction intent handling, reconciliation patterns, and direct verification using synthetic data. Our roadmap is deliberately staged: first an evaluation-ready prototype, then approved identity, custody, storage, and operations integrations. This makes the solution technically feasible, privacy-aware, and honest about the governance required for real deployment.”

## Claims-control footer for deck and demo

> Demonstration uses synthetic identities, assets, and disposable/local test evidence. It is not a deployed government, BEL, legal-title, production, independently audited, or organizationally approved system.

## Reference shortlist for the submission deck

1. Smart India Hackathon, Project Implementation Guidance.[1]
2. Supplied SIH 2026 Guidelines and SIH 2026 Idea Presentation Template.[2]
3. W3C, Decentralized Identifiers (DIDs) v1.0.[3]
4. Ethereum Improvement Proposal 721, Non-Fungible Token Standard.[4]
5. OpenZeppelin Contracts documentation.[5]
6. OWASP Application Security Verification Standard.[6]

## References

[1] [Smart India Hackathon: Guidelines for Deployment of SIH Winning Projects](https://sih.gov.in/projectImplementation)

[2] Supplied `SIH2026Guidelines.pdf` and `SIH2026-IDEA-Presentation-Format.pptx`.

[3] [W3C DID Core](https://www.w3.org/TR/did-core/)

[4] [EIP-721: Non-Fungible Token Standard](https://eips.ethereum.org/EIPS/eip-721)

[5] [OpenZeppelin Contracts Documentation](https://docs.openzeppelin.com/contracts/)

[6] [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)
