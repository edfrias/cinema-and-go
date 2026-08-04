# ADR-0005: Data Layer Testing Strategy Without External HTTP Dependencies

## Status

Accepted.

## Context

Phase 4 focuses on data-layer quality, validation, and indexing.
The `cinema-and-go-data` package defines schemas and models but does not issue HTTP requests.
Mock Service Worker (MSW) is designed to intercept outgoing network traffic, so using it directly in this package does not provide direct value.

At the same time, we need reliable tests that validate:

- schema constraints and defaults
- index declarations
- geospatial behavior and uniqueness constraints
- migration safety during Mongoose upgrades

## Decision

Use a layered testing strategy for the data package:

1. Keep schema contract tests in the data package for static guarantees (indexes, refs, required fields, defaults).
2. Add isolated integration tests with in-memory MongoDB for runtime guarantees (unique indexes, geospatial queries, timestamps, and relation constraints).
3. Do not use external scraping or external HTTP calls as test prerequisites for data-layer validation.
4. Reserve MSW 2.x for API and app packages where HTTP boundaries exist.

Documentation policy for this area is also standardized:

- ADR files capture architectural and high-impact decisions.
- `docs/implementation` captures operational progress and rollout details.

## Consequences

- improves determinism and speed of data tests
- removes network flakiness from data validation scope
- clarifies tool boundaries between data tests and HTTP mocking
- requires maintaining fixtures and in-memory integration setup

## Links

- `../roadmap/phase-4-data-layer.md`
- `../implementation/data-upgrade.md`
- `./0004-mongoose-8-and-validation.md`
