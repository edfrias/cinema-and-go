# ADR-0007: Run API Integration Tests with In-Memory MongoDB by Default

## Status

Accepted.

## Context

The API logic integration suite depended on an external legacy MongoDB host from environment configuration.
That dependency introduced instability (DNS/network failures) and prevented deterministic test execution in local environments and CI.

At the same time, phase goals require preserving integration coverage of repositories/models while removing non-essential external dependencies.

## Decision

Use mongodb-memory-server as the default database backend for API integration tests.

Implementation rules:

1. Start an in-memory MongoDB server in test bootstrap and connect Mongoose to its URI.
2. Keep an escape hatch for explicit remote DB usage using USE_REMOTE_TEST_DB=true.
3. Ensure clean shutdown by disconnecting Mongoose and stopping the in-memory server in test teardown.

## Consequences

Positive:

- deterministic and offline-capable integration tests
- no dependency on external mLab/Atlas/network availability for baseline validation
- improved reproducibility across developers and CI agents

Trade-offs:

- adds one test-time dependency and startup cost
- remote database behavior is no longer exercised by default test run

## Links

- ../roadmap/phase-1-backend-arch.md
- ../implementation/backend-refactor.md
- ./0005-data-testing-strategy.md
