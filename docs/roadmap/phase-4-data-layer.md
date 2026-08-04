# Phase 4: Data Layer and Validation

## Objective

Upgrade the data layer and prepare validation and indexing that match the system's main use cases.

## Current state

- `cinema-and-go-data` upgraded to `mongoose` 8.24.2.
- Core data models were normalized and aligned with the target schema plan.
- Index declarations and validation constraints are now covered by automated tests.

## Target state

- Mongoose upgraded to a current supported version
- a consistent validation strategy
- indexes aligned with login, geosearch, and frequent queries
- a compatibility-aware data migration plan

## Backlog

- [x] review Mongoose 5 to 8 breaking changes
- [x] define target schemas before migrating code
- [ ] decide the exact location of additional validation
- [x] review indexes for email, phone, name, and location
- [x] define migration and rollback strategy
- [x] cover geospatial queries with reliable tests
- [x] formalize data testing boundaries (no external HTTP dependency)

## Validation

- [x] schemas and models are documented
- [x] indexes are declared and verified
- [x] the migration plan is tested in an isolated environment

## Related documents

- `../implementation/data-upgrade.md`
- `../adr/0004-mongoose-8-and-validation.md`
- `../adr/0005-data-testing-strategy.md`