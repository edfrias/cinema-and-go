# ADR-0006: Migrate API Test Runner from Jest to Vitest

## Status

Accepted.

## Context

The API package had already modernized dependencies and introduced MSW-based HTTP isolation in tests.
During this phase, Jest remained a compatibility anchor from legacy setup while the project was aligning tooling around faster feedback and lower maintenance overhead.

Main concerns during runner selection:

- preserve CommonJS source/tests in the short term
- keep MSW-based deterministic HTTP tests
- reduce configuration friction and test runtime overhead
- avoid broad refactors outside phase scope

## Decision

Adopt Vitest as the primary test runner for cinema-and-go-api now.

Implementation decisions included:

1. Replace Jest scripts with Vitest scripts in the API package.
2. Add a dedicated Vitest configuration file for Node environment, global test APIs, setup files, and timeout policy.
3. Keep MSW test lifecycle setup and reuse it through Vitest setupFiles.
4. Remove obsolete Jest configuration from the API package.

## Consequences

Positive:

- faster execution and startup in local workflows
- simpler runner configuration for current Node-only API tests
- cleaner path to future Vite-aligned tooling in frontend/backend docs

Trade-offs:

- Jest-specific APIs in legacy tests must be replaced (for example, jest.spyOn and toThrowError)
- test infrastructure documentation must reflect runner split with other packages until monorepo-wide alignment

## Links

- ../roadmap/phase-1-backend-arch.md
- ../implementation/backend-refactor.md
- ./0005-data-testing-strategy.md
