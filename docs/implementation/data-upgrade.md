# Data Upgrade

## Current state

- data package upgraded to `mongoose@8.24.2`
- schemas and index declarations were aligned with the Phase 4 plan and are now covered by tests
- geospatial and unique-index behavior is documented and verified with in-memory integration tests

## Target state

- target schemas agreed before changing persistence code
- a controlled Mongoose upgrade
- clearly defined validation and migration strategy
- explicitly declared and verified indexes

## Differences to resolve

- the current `User` schema uses `distance`, while some plans refer to `distances`
- `movieSessions` does not define `createdAt`, so any time-based index must be introduced explicitly
- additional validation plans must distinguish input validation from persistence validation

## Workstreams

- fix the target models by collection
- decide whether additional validation belongs in the data layer, API layer, or both
- review indexes for email, phone, location, and name based on real usage
- prepare migrations and rollback

## Implementation progress

- target dependency for the data package upgraded to `mongoose@8.24.2`
- integration test runtime upgraded to `mongodb-memory-server@11.2.0`
- API consumers updated to modern `mongoose.connect(url)` usage to avoid deprecated Mongoose 5 options

## Testing strategy

### Scope boundaries

- data package tests validate schemas, model constraints, and index behavior
- data package tests do not depend on external HTTP or scraping
- MSW is reserved for API and app packages where HTTP boundaries exist

### Layers

1. schema contract tests
	- run without database
	- validate required fields, defaults, refs, and index declarations
2. isolated integration tests
	- run with in-memory MongoDB
	- validate unique indexes, geospatial queries, timestamps, and relation behavior

### Why this split

- schema contract tests give fast feedback for model evolution
- in-memory integration tests verify runtime guarantees before production databases are touched
- no external network dependency improves test determinism

## Verification matrix

- `user.email` unique index is declared and enforced
- `distance` compound unique index on `user + cinema` is declared and enforced
- `cinema.location` geospatial index supports near queries
- `movieSessions.createdAt` exists and can be used for ordering

## Verification evidence

- automated data tests pass with Node built-in test runner: 11/11
- schema contract tests validate index and schema declarations
- in-memory integration tests validate runtime index behavior and geospatial queries

## Open debt and follow-up

- API package dependency modernization is still pending and tracked outside this Phase 4 data increment
- `cinema-and-go-api/package-lock.json` changed substantially during install (lockfile format migration and transitive updates)
- API vulnerability remediation should be handled in a dedicated API hardening increment to keep scope and reviewability clear

## Migration safety checks

- execute schema contract tests before migration scripts
- execute in-memory integration tests after each migration increment
- if an increment fails, rollback to the last passing migration checkpoint

## Documentation workflow

- architectural or high-impact decisions go to ADRs
- operational implementation updates stay in `docs/implementation`
- each data-layer PR must include:
  - decision impact note
  - docs updated confirmation

## Phase closure note

- closure date: 2026-08-04
- phase scope: closed for data layer increment
- out-of-scope items remain tracked as follow-up debt in API package

### Done criteria

- [x] data package dependency upgraded to `mongoose@8.24.2`
- [x] schema and index contracts covered by automated tests
- [x] in-memory integration tests validating runtime constraints and geospatial queries
- [x] data-layer testing boundaries formalized without external HTTP dependency
- [x] architecture and implementation documentation updated and linked

## Decision log

- ADR-0004: Mongoose upgrade and validation strategy sequencing
- ADR-0005: data-layer testing strategy without external HTTP dependencies