# ADR-0002: Evaluate a Dual REST and GraphQL API

## Status

Proposed.

## Context

The current API is a small REST surface. Some future queries may benefit from more flexibility, but GraphQL does not exist in the repo today.

## Decision

Keep REST as the base contract and evaluate GraphQL only for cases where it reduces real consumption friction, especially in views that compose multiple data sources.

## Consequences

- avoids rewriting the current contract all at once
- introduces added complexity in observability, testing, and security
- requires explicit scope justification before GraphQL is implemented

## Links

- `../roadmap/phase-2-api-dual.md`
- `../implementation/backend-refactor.md`