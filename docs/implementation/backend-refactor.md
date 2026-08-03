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