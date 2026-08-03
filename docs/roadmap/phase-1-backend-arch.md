# Phase 1: Backend Clean Architecture

## Objective

Refactor the current backend into a more maintainable, testable, and decoupled architecture.

## Current state

- Express routes and business logic are tightly coupled to data access.
- Validation and error handling are only partially encapsulated.
- The logic layer depends directly on Mongoose models.

## Target state

- clear separation between `domain/`, `infrastructure/`, and `presentation/`
- repository pattern to decouple persistence
- explicit use cases and services
- robust error handling and HTTP middleware boundaries
- unit and integration coverage that supports safe evolution

## Backlog

- [ ] create the `domain/`, `infrastructure/`, and `presentation/` structure
- [ ] define core entities and value objects
- [ ] introduce repository interfaces
- [ ] move business logic into services or use cases
- [ ] isolate HTTP middleware and error handling
- [ ] review JWT authentication and harden flows
- [ ] prepare gradual TypeScript adoption

## Validation

- [ ] layers are separated and navigable
- [ ] logic is decoupled from Mongoose
- [ ] critical-path unit and integration tests exist
- [ ] coverage criteria are agreed with `@qa-backend`

## Related documents

- `../implementation/backend-refactor.md`
- `../adr/0001-clean-architecture.md`