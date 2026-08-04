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
- initial MSW v1 compatibility constraint was removed in the remediation sprint; current state uses MSW v2 with `http/HttpResponse` handlers

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

### 7) Vulnerability remediation sprint (aggressive scope)

Objective:

- reduce vulnerability backlog to minimum possible, allowing major upgrades when required.

Actions applied:

- regenerated API lockfile from clean install to remove stale transitive records coming from linked local packages.
- upgraded `@cyclonedx/cyclonedx-npm` from `4.x` to `6.x` to remediate high-severity advisory (`GHSA-v75r-vx73-82pj`).
- upgraded `msw` from `1.x` to `2.x` and migrated tests from `rest/ctx` handlers to `http/HttpResponse` API.

Validation performed:

- `npm audit --omit=dev --json` => 0 vulnerabilities
- `npm audit --json` => 0 vulnerabilities
- `npm test` => 52/52 passing
- `npm run sbom` => successful generation after dependency alignment

Outcome:

- API package reached zero known vulnerabilities while preserving Vitest-based testing infrastructure and deterministic integration execution.

### 8) Clean architecture migration kickoff (user slice)

Objective:

- start the architectural split without breaking the current HTTP contract.

Actions applied:

- introduced initial layered structure for user flow:
	- `src/domain/interfaces/IUserRepository.js`
	- `src/infrastructure/repositories/mongoose/UserRepository.js`
	- `src/domain/usecases/user/*`
- wired legacy `src/logic/index.js` user methods to new use cases while preserving current external API.
- restored legacy synchronous validation behavior at `logic` boundary to keep compatibility with existing tests.
- fixed route inconsistency in `src/routes/index.js` for user deletion:
	- removed invalid `handleErrors(... )()` invocation
	- normalized call path to `logic.deleteUser(userId)`
- added temporary compatibility alias `deleteUser -> removeUser` in logic while migration is in progress.

Validation performed:

- `npm test -- src/logic/index.test.js` => 40/40 passing
- `npm test` => 52/52 passing

Outcome:

- migration is now active in code (not only planned), with a first domain/infrastructure slice in production code and no regression in the API test suite.

### 9) Clean architecture migration - cinema read slice

Objective:

- continue migration with read-only cinema flows while keeping route contracts stable.

Actions applied:

- introduced cinema query repository contract and mongoose implementation:
	- `src/domain/interfaces/ICinemaQueryRepository.js`
	- `src/infrastructure/repositories/mongoose/CinemaQueryRepository.js`
- introduced cinema read use cases:
	- `RetrieveAllCinemasUseCase`
	- `RetrieveCinemaUseCase`
	- `RetrieveAllCinemaSessionsUseCase`
	- `RetrieveNearestCinemasUseCase`
- wired legacy logic methods to these use cases in `src/logic/index.js`:
	- `retrieveAllCinemas`
	- `retrieveCinema`
	- `retrieveAllCinemaSessions`
	- `retireveNearestCinemas`

Validation performed:

- `npm test` => 52/52 passing

Outcome:

- second migration vertical is now running through layered architecture with no functional regression in existing API tests.

### 10) Clean architecture migration - cinema import slice

Objective:

- migrate scraping and import write-flow to layered use cases without changing current route behavior.

Actions applied:

- introduced new domain contracts for import flow:
	- `IScrapperAdapter`
	- `IMovieRepository`
	- `IMovieSessionsRepository`
	- `ICinemaWriteRepository`
- introduced infrastructure implementations:
	- `infrastructure/adapters/ScrapperAdapter.js`
	- `infrastructure/repositories/mongoose/MovieRepository.js`
	- `infrastructure/repositories/mongoose/MovieSessionsRepository.js`
	- `infrastructure/repositories/mongoose/CinemaWriteRepository.js`
- introduced import use cases:
	- `RegisterMovieUseCase`
	- `RegisterSessionsUseCase`
	- `RegisterCinemaUseCase`
	- `ScrapCinemaMoviesUseCase`
- wired legacy logic methods to import use cases:
	- `registerMovie`
	- `registerSessions`
	- `registerCinema`
	- `scrapCinemaMovies`

Validation performed:

- `npm test` => 52/52 passing

Outcome:

- third migration vertical is active, and movie/cinema import responsibilities are now routed through domain + infrastructure layers while legacy API contracts remain intact.

### 11) Presentation layer rollout (controllers + routes v1)

Objective:

- move HTTP handling from legacy route file to presentation controllers and versioned routes.

Actions applied:

- introduced presentation middleware wrappers:
	- `src/presentation/middleware/auth.js`
	- `src/presentation/middleware/handleErrors.js`
- introduced presentation controllers:
	- `src/presentation/controllers/UserController.js`
	- `src/presentation/controllers/CinemaController.js`
- introduced versioned presentation routes:
	- `src/presentation/routes/v1/userRoutes.js`
	- `src/presentation/routes/v1/cinemaRoutes.js`
	- `src/presentation/routes/v1/index.js`
- switched `src/routes/index.js` to a compatibility façade that delegates to `presentation/routes/v1`.
- migrated all existing API endpoints from legacy route definitions to presentation routes while preserving the same paths and response contracts.

Validation performed:

- `npm test` => 52/52 passing

Outcome:

- presentation layer is now active as the route/controller entrypoint, and legacy `src/routes/index.js` no longer owns endpoint definitions.

### 12) Presentation HTTP coverage and middleware hardening

Objective:

- add route-level validation for the new presentation layer and harden middleware behavior exposed by those tests.

Actions applied:

- extracted reusable Express app composition into `src/app.js` so HTTP routes can be tested without booting the real server entrypoint.
- updated `index.js` to use the shared app factory as bootstrap-only composition.
- added HTTP tests for presentation routes in `src/presentation/routes/v1/index.test.js` covering:
	- user registration
	- authentication token issuance
	- protected-route rejection without auth header
	- cinema listing through presentation controller
	- domain-error mapping through `handleErrors`
	- 404 fallback behavior
- updated MSW global test setup to allow localhost/127.0.0.1 requests so in-process HTTP route tests can coexist with adapter-level network interception.
- fixed async `UnauthorizedError` handling in `src/middlewares/handleErrors.js` so auth failures return `401` instead of `400`.
- made missing-auth responses explicit in `src/middlewares/auth.js` with `Unauthorized` message.

Validation performed:

- `npm test -- src/presentation/routes/v1/index.test.js` => 6/6 passing
- `npm test` => 58/58 passing

Outcome:

- presentation layer now has direct HTTP contract coverage, and authorization failures are mapped correctly at middleware level.

### 13) Composition root extraction and direct presentation unit coverage

Objective:

- remove dependency wiring from `logic` and add direct unit coverage for controllers/middleware.

Actions applied:

- extracted dependency composition to `src/composition/apiService.js`.
- converted `src/logic/index.js` into a compatibility façade that:
	- preserves legacy sync validation behavior
	- delegates actual application behavior to the composed `apiService`
	- preserves legacy return contracts where tests depend on them
- kept `src/populate/index.js` and presentation controllers compatible through the unchanged `logic` surface.
- added direct unit tests for presentation components:
	- `src/presentation/controllers/UserController.test.js`
	- `src/presentation/controllers/CinemaController.test.js`
	- `src/presentation/middleware/handleErrors.test.js`

Validation performed:

- `npm test -- src/presentation/controllers/UserController.test.js src/presentation/controllers/CinemaController.test.js src/presentation/middleware/handleErrors.test.js` => 6/6 passing
- `npm test` => 64/64 passing

Outcome:

- wiring is now explicit in a composition root instead of being embedded in `logic`, and presentation has both HTTP-level and unit-level coverage.

### 14) Presentation runtime decoupling from legacy logic

Objective:

- make presentation consume the composed application service directly instead of the legacy `logic` facade.

Actions applied:

- updated `src/presentation/controllers/UserController.js` to use `apiService` from `src/composition/apiService.js` directly.
- updated `src/presentation/controllers/CinemaController.js` to use `apiService` directly.
- preserved `src/logic/index.js` as compatibility surface for legacy callers such as logic tests and populate scripts.
- updated controller and route tests to spy on `apiService` instead of `logic`, so tests now validate the real presentation dependency boundary.
- added direct unit coverage for `src/presentation/middleware/auth.js`.

Validation performed:

- `npm test -- src/presentation/controllers/UserController.test.js src/presentation/controllers/CinemaController.test.js src/presentation/routes/v1/index.test.js src/presentation/middleware/auth.test.js` => 12/12 passing
- `npm test` => 66/66 passing

Outcome:

- presentation is now decoupled from the legacy logic facade at runtime, while compatibility for non-presentation callers is preserved.

### 15) Populate flow decoupling and unit coverage

Objective:

- remove remaining non-HTTP dependency on legacy `logic` by migrating populate execution to the composed application service.

Actions applied:

- refactored `src/populate/index.js` to use `apiService` from `src/composition/apiService.js`.
- extracted populate execution orchestration into `src/populate/runPopulate.js`.
- added unit coverage for populate execution lifecycle in `src/populate/runPopulate.test.js`.
- validated successful path (connect -> populate -> disconnect) and failure path (error log -> rethrow -> disconnect).

Validation performed:

- `npm test -- src/populate/runPopulate.test.js src/presentation/middleware/auth.test.js src/presentation/routes/v1/index.test.js` => 10/10 passing
- `npm test` => 68/68 passing

Outcome:

- populate no longer depends on `logic`, reducing the legacy facade footprint and increasing test coverage on operational scripts.

### 16) Legacy logic footprint reduction

Objective:

- minimize `src/logic/index.js` to compatibility-only responsibilities.

Actions applied:

- reduced `logic` to a thin compatibility façade that delegates to `apiService`.
- kept only the synchronous validation guards needed by legacy tests/callers.
- preserved compatibility behavior required by existing contracts:
	- `deleteUser` alias
	- legacy typo method `retireveNearestCinemas`
	- `registerCinemaLocation` resolving to `undefined`
- added explicit in-file note clarifying `logic` as compatibility boundary and `apiService` as behavior owner.

Validation performed:

- `npm test` => 68/68 passing

Outcome:

- legacy logic remains stable for existing consumers while responsibility is now clearly centralized in `apiService`.

### 17) Legacy test suite re-orientation to apiService

Objective:

- reduce coupling of integration behavior tests to `logic` and keep `logic` tests focused on compatibility guarantees.

Actions applied:

- updated `src/logic/index.test.js` so primary behavior assertions execute through `apiService`.
- kept `logic` assertions for compatibility-only concerns:
	- sync validation guard expectations
	- `deleteUser` alias compatibility
	- legacy typo method `retireveNearestCinemas`
	- `registerCinemaLocation` returning `undefined`
- kept integration setup unchanged (MongoMemoryServer / optional remote DB) to avoid destabilizing CI/local determinism.

Validation performed:

- `npm test -- src/logic/index.test.js` => 42/42 passing
- `npm test` => 70/70 passing

Outcome:

- core behavior validation is now centered on the composed application service, while legacy facade checks are explicit and isolated.

### 18) Full retirement of legacy logic module

Objective:

- complete the exit plan by removing `src/logic` after behavior coverage was migrated to `apiService`.

Actions applied:

- created `src/composition/apiService.test.js` as the integration behavior suite owner.
- removed `src/logic/index.test.js` after dropping legacy-only compatibility assertions.
- removed `src/logic/index.js` compatibility facade.
- validated there are no remaining internal references to `logic` in `cinema-and-go-api/src`.

Validation performed:

- `npm test` => 68/68 passing

Outcome:

- the API runtime no longer depends on a legacy logic layer, and integration behavior coverage is now fully owned by `apiService` composition.