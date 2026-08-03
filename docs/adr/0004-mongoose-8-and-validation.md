# ADR-0004: Upgrade Mongoose and Define a Validation Strategy

## Status

Proposed.

## Context

The data layer still runs on Mongoose 5.5.11, and there are differences between the current model state and the target described in planning.

## Decision

Define target models and required indexes first, then execute a controlled Mongoose upgrade together with an explicit validation strategy.

## Consequences

- reduces the risk of mixing a technical upgrade with domain redesign without a clear boundary
- requires documenting current state vs target state before changing persistence
- improves traceability for indexes, migrations, and validation rules

## Links

- `../roadmap/phase-4-data-layer.md`
- `../implementation/data-upgrade.md`