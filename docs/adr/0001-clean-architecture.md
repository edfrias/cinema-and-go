# ADR-0001: Adopt Clean Architecture in Backend

## Status

Proposed.

## Context

The current backend lacks separation between routes, business rules, and persistence. That makes testing, contract evolution, and local refactors harder.

## Decision

Split the backend into presentation, domain, and infrastructure layers with explicit persistence interfaces.

## Consequences

- improves testability and change isolation
- requires an incremental migration to avoid breaking current contracts
- increases the initial cost of structure and conventions

## Links

- `../roadmap/phase-1-backend-arch.md`
- `../implementation/backend-refactor.md`