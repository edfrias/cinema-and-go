# ADR-0002: Evaluate a Dual REST and GraphQL API

## Status

Accepted (REST-first baseline; GraphQL deferred to phase 2 evaluation).

## Context

Phase 1 delivered a stable REST v1 surface over clean architecture layers in the API package. Some future queries may benefit from more flexibility, but GraphQL does not exist in the repo today.

## Decision

Keep REST as the base contract for production delivery and evaluate GraphQL only for phase 2 cases where it reduces real consumption friction, especially in views that compose multiple data sources.

## Consequences

- avoids rewriting the current contract all at once
- introduces added complexity in observability, testing, and security
- requires explicit scope justification before GraphQL is implemented
- preserves phase-1 closure by avoiding premature protocol expansion

## Links

- `../roadmap/phase-2-api-dual.md`
- `../implementation/backend-refactor.md`