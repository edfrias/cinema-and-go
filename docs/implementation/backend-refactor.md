# Backend Refactor

## Current state

- Express routes and business logic are very close to each other.
- The logic layer accesses Mongoose models directly.
- HTTP contracts and error handling are not well isolated from implementation details.

## Target state

- a presentation layer for controllers and routes
- a domain layer for entities and use cases
- an infrastructure layer for persistence, external services, and adapters

## Workstreams

### Target structure

- `presentation/`: controllers, routes, serialization
- `domain/`: entities, use cases, interfaces
- `infrastructure/`: repositories, db, external adapters

### Key refactors

- introduce repository interfaces for User, Cinema, and session data
- encapsulate use cases such as `RegisterUser`, `AuthenticateUser`, and `GetCinemaDetail`
- isolate JWT, auth middleware, and HTTP errors from pure logic
- prepare versioning and contractual API documentation

## Risks

- breaking contracts currently used by frontend
- duplicating logic while legacy and new architecture coexist
- introducing TypeScript without a clear boundary

## Execution log - 2026-08-04 (phase 1 start)

### 1) API dependency modernization (first slice)

Applied in `cinema-and-go-api`:

- upgraded runtime packages:
	- `bcrypt` 5 -> 6
	- `cors` 2.8.5 -> 2.8.6
	- `dotenv` 8 -> 17
	- `express` 4 -> 5
	- `jsonwebtoken` 8 -> 9
- removed direct `body-parser` dependency from routes and switched to `express.json()`
- upgraded dev tooling:
	- `axios` 0.18 -> 1.x
	- `cheerio` rc -> 1.x
	- `jest` 24 -> 30
	- `nodemon` 1.x -> 3.x

Operational constraints introduced intentionally:

- `engines.node >=20` and `engines.npm >=10` added to package manifest
- MSW pinned to major 1 in this phase due CommonJS + Jest compatibility

### 2) Test stability refactor with MSW

Goal: remove network flakiness and third-party dependency from tests.

Implemented:

- added global test setup (`setupFilesAfterEnv`) for mock server lifecycle
- added shared mock server in `src/test/msw/server.js`
- migrated `src/lib/maps/index.test.js` to mocked Google Maps responses
- migrated `src/lib/scrapper/index.test.js` to deterministic HTML fixtures
- aligned matchers with Jest 30 (`toThrow`)

Verification performed:

- `npm test -- src/lib/maps/index.test.js src/lib/scrapper/index.test.js` -> pass

### 3) Dependency governance baseline

Added scripts in API package:

- `npm run audit`
- `npm run audit:fail` (threshold: high)
- `npm run sbom` (CycloneDX JSON)

Measured result after first slice:

- vulnerability count reduced from 99 to 9 in API dependency graph

### 4) Dependency-Track decision

Decision:

- adopt Dependency-Track as target governance platform
- defer full rollout to CI/CD phase (phase 5)

Reasoning:

- without CI workflows, Dependency-Track setup adds operational cost but limited automation value
- current phase receives most benefit from lightweight controls (`audit`, `sbom`, triage) while preserving focus on backend refactor

Planned path:

1. phase 1-4: keep lightweight baseline and periodic dependency triage
2. phase 5: wire SBOM upload and quality gates through CI pipelines

### 5) API test platform migration (Jest -> Vitest)

Decision executed in phase 1:

- API runner migrated from Jest to Vitest
- Jest configuration removed from API package
- Vitest setup introduced with:
	- Node test environment
	- global APIs
	- shared MSW setup file
	- explicit timeout policy for integration suite

Compatibility changes applied:

- migrated Jest-specific assertions and spies in legacy tests (`toThrowError` -> `toThrow`, `jest.spyOn` -> `vi.spyOn`)
- removed Jest-only file pragmas in test files

Verification performed:

- full API suite on Vitest: 52/52 tests passing

### 6) Integration database stabilization for tests

Problem observed:

- API logic tests depended on legacy external Mongo host (`ds337377.mlab.com`), causing DNS/network failures and skipped execution.

Resolution applied:

- added `mongodb-memory-server` for local deterministic integration execution
- updated logic test bootstrap to default to in-memory MongoDB
- kept explicit opt-in escape hatch for remote DB via `USE_REMOTE_TEST_DB=true`
- fixed ObjectId constructor usage for Mongoose 8 compatibility (`new ObjectId(...)`)
- cleaned legacy async assertions that masked failures

Result:

- logic integration suite now runs offline and passes consistently under Vitest