# ADR-0003: Migrate Frontend to React 18 and Vite

## Status

Proposed.

## Context

The app uses React 16 and CRA with outdated tooling. The development experience, maintainability, and runtime evolution are limited by that starting point.

## Decision

Upgrade the frontend to React 18 and replace CRA with Vite as the tooling base.

## Consequences

- improves runtime support and likely shortens build feedback loops
- requires reviewing library compatibility and environment variable flow
- creates an opportunity to clean up state management, data fetching, and testing

## Links

- `../roadmap/phase-3-frontend.md`
- `../implementation/frontend-migration.md`