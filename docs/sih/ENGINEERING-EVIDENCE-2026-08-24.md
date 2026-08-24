# SIH 2026 Engineering Evidence Record

**Evidence date:** 24 August 2026  
**Consolidation branch:** `consolidate/main-security-baseline`  
**Exact head:** `4c0723b77d69eac233a2439e02083f0e0ca83e80`  
**Pull request:** [PR #19](https://github.com/tejaswin-amara/Blockchain-Based-Secure-Platform-for-Identity-Access-Control-and-Digital-Asset-Management/pull/19)

## Maturity statement

This record supports an **SIH submission-ready and evaluation-ready engineering baseline** using synthetic/local/disposable evidence. It does not establish a testnet, pilot, production, legal-title, BEL, government, independent-audit, or organizational approval claim.

## Local reproducible validation

The following checks were run on the exact consolidation head on 24 August 2026 and passed.

| Area | Command / scope | Result |
|---|---|---|
| Locked dependencies | `pnpm install --frozen-lockfile` | Passed |
| Dependency vulnerability threshold | `pnpm audit --audit-level=low` | Passed |
| Source and documentation | `pnpm validate:references`; `pnpm validate:markdown` | Passed |
| Solidity and repository quality | `pnpm lint`; `pnpm test`; `pnpm build` | Passed |
| Services | `PATH=/tmp/all-services-psycopg-env/bin:$PATH pnpm test:services` | Passed |
| ABI and verifier | `pnpm validate:indexer-abi`; `pnpm test:verifier`; `pnpm test:verifier:e2e` | Passed |
| Web console | `pnpm check:web`; `pnpm test:web`; `pnpm test:web:e2e`; `pnpm build:web`; `pnpm check:web:bundle` | Passed |
| Browser/accessibility | Playwright Evidence Ledger keyboard, axe, and responsive tests | Passed: 3 browser tests |
| Bundle budget | Raw JavaScript 410,883 bytes; gzip JavaScript 120,375 bytes; raw CSS 8,223 bytes. Limits: 460,800 / 131,072 / 16,384 bytes. | Passed |
| Compose structure | `docker compose config -q` | Passed |
| Real PostgreSQL durability | `PERSISTENCE_POSTGRES_INTEGRATION=1` four-case unittest through the local disposable PostgreSQL service account | Passed |

The genuine PostgreSQL suite uses `platform_projection_test` through a local Unix-socket host override and peer authentication. It covers a transactional projection round trip, unique/content conflict enforcement, a two-writer same-idempotency-key race, and uncertain-event replay plus idempotent reconciliation finding persistence.

## Remote PR evidence

The PR’s exact head is open. GitHub reported the required automation as complete, including CI lint/test/build, CodeQL, Echidna, Slither, OpenSSF Scorecard analysis, CodeRabbit’s configured neutral/successful result, and the supply-chain audit. The remote result is **not** a merge authorization: GitHub reports `REVIEW_REQUIRED` and `BLOCKED` because no eligible non-author approval has been recorded after the current head.

## Important limitations

| Limitation | Correct interpretation |
|---|---|
| Docker runtime health | Compose configuration validates, but full `docker compose up --build --wait` cannot be used as runtime-health evidence in this sandbox because its kernel lacks usable bridge iptables support. |
| Identity / DID / OIDC | The prototype uses opaque identity references. A real identity profile, issuer/trust registry, assurance mapping, recovery, and owner are not selected. |
| Chain / custody | No real chain, RPC provider, finality policy, deployer key, multisig, or pause authority is approved. |
| Storage / KMS | Encryption and classification boundaries are reference architecture; no KMS/HSM, object store, residency, retention, or legal-hold decision exists. |
| Operational readiness | There is no approved staging environment, SLO/RPO/RTO, on-call, monitoring provider, incident authority, or backup/restore evidence. |
| Independent assurance | Local and CI testing do not equal an independent security audit or organizational sign-off. |

## SIH demonstration evidence

The approved demonstration uses only synthetic identities, synthetic assets, and a disposable local chain. It may demonstrate role/lifecycle controls, fail-closed unavailable/denial behavior, durable transaction/reconciliation evidence, and a direct-RPC verifier success/mismatch outcome. It must not be described as a deployed solution or evidence of real organizational assets, identity, title, custody, or adoption.
