# Data Upgrade

## Current state

- models are still on Mongoose 5.5.11
- there is divergence between current schemas and the schemas described by the target plan
- geospatial queries exist, but there is no centralized index documentation

## Target state

- target schemas agreed before changing persistence code
- a controlled Mongoose upgrade
- clearly defined validation and migration strategy
- explicitly declared and verified indexes

## Differences to resolve

- the current `User` schema uses `distance`, while some plans refer to `distances`
- `movieSessions` does not define `createdAt`, so any time-based index must be introduced explicitly
- additional validation plans must distinguish input validation from persistence validation

## Workstreams

- fix the target models by collection
- decide whether additional validation belongs in the data layer, API layer, or both
- review indexes for email, phone, location, and name based on real usage
- prepare migrations and rollback