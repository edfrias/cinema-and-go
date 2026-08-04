# Phase 1: Backend Clean Architecture

## Objective

Refactor the current backend into a more maintainable, testable, and decoupled architecture.

## Current state

- Express routes and business logic are tightly coupled to data access.
- Validation and error handling are only partially encapsulated.
- The logic layer depends directly on Mongoose models.

## Target state

- clear separation between `domain/`, `infrastructure/`, and `presentation/`
- repository pattern to decouple persistence
- explicit use cases and services
- robust error handling and HTTP middleware boundaries
- unit and integration coverage that supports safe evolution

## Backlog

- [ ] create the `domain/`, `infrastructure/`, and `presentation/` structure
- [ ] define core entities and value objects
- [ ] introduce repository interfaces
- [ ] move business logic into services or use cases
- [ ] isolate HTTP middleware and error handling
- [ ] review JWT authentication and harden flows
- [ ] prepare gradual TypeScript adoption

## Implementation status (2026-08-04)

- [x] start dependency modernization in `cinema-and-go-api`
- [x] raise minimum runtime to Node 20+ and npm 10+
- [x] migrate network-coupled tests (`maps`, `scrapper`) from real HTTP calls to MSW mocks
- [x] migrate API test runner from Jest to Vitest
- [x] make API logic integration tests deterministic with in-memory MongoDB
- [x] add baseline dependency governance scripts (`audit`, `audit:fail`, `sbom`)
- [x] start clean architecture implementation in API with first user vertical (domain/interface/use-cases + mongoose repository wiring)
- [x] fix legacy delete-user route inconsistency (`deleteUser/removeUser` + invalid `handleErrors(... )()` call)
- [x] migrate cinema read vertical (`retrieveAllCinemas`, `retrieveCinema`, `retrieveAllCinemaSessions`, `retireveNearestCinemas`) to domain use cases + query repository
- [x] migrate cinema import vertical (`registerMovie`, `registerSessions`, `registerCinema`, `scrapCinemaMovies`) to domain use cases + adapter/repository layer
- [x] roll out presentation layer with controllers + v1 routes and move endpoint definitions out of legacy `src/routes/index.js`
- [x] add HTTP route coverage for presentation layer and fix middleware auth/error mapping defects found by those tests
- [x] extract API composition root from `logic` and add direct unit coverage for presentation controllers/middleware
- [x] make presentation controllers consume `apiService` directly and add unit coverage for auth middleware
- [x] migrate populate script to `apiService` with dedicated unit tests for execution lifecycle
- [x] reduce `logic` to a compatibility-only facade while preserving legacy contracts
- [x] re-orient legacy integration tests toward `apiService` and isolate explicit `logic` compatibility checks
- [x] retire `src/logic` fully by moving integration coverage to `src/composition/apiService.test.js`
- [ ] complete dependency modernization across app/data packages
- [ ] complete backend architectural split into `domain/infrastructure/presentation`
- [ ] migrate remaining API tests still tied to legacy assumptions

### Measured delta (API package)

- `npm audit` before upgrade: 99 vulnerabilities
- `npm audit` after first upgrade slice: 9 vulnerabilities
- `npm audit` after remediation sprint (current state): 0 vulnerabilities (including `--omit=dev`)
- major dependency remediations completed in API package:
	- `@cyclonedx/cyclonedx-npm` upgraded to `6.x` (fixes high severity advisory)
	- `msw` upgraded to `2.x` and tests adapted to new handler API
	- API lockfile regenerated from clean install to remove stale vulnerable transitive graph from linked data package

### Decision note: Dependency-Track

Dependency-Track is accepted as a target platform for dependency governance, but full operational adoption is deferred to the DevOps phase when CI/CD pipelines are available. In phase 1 we use a lighter strategy: `npm audit` + SBOM generation + periodic triage.

## Validation

- [ ] layers are separated and navigable
- [ ] logic is decoupled from Mongoose
- [ ] critical-path unit and integration tests exist
- [ ] coverage criteria are agreed with `@qa-backend`

## Related documents

- `../implementation/backend-refactor.md`
- `../adr/0001-clean-architecture.md`