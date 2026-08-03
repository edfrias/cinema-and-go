# Phase 4: Data Layer and Validation

## Objective

Upgrade the data layer and prepare validation and indexing that match the system's main use cases.

## Current state

- `mongoose` 5.5.11.
- The models differ from what the target plan describes.
- Indexing is partial and validation is mostly handled in the application layer.

## Target state

- Mongoose upgraded to a current supported version
- a consistent validation strategy
- indexes aligned with login, geosearch, and frequent queries
- a compatibility-aware data migration plan

## Backlog

- [ ] review Mongoose 5 to 8 breaking changes
- [ ] define target schemas before migrating code
- [ ] decide the exact location of additional validation
- [ ] review indexes for email, phone, name, and location
- [ ] define migration and rollback strategy
- [ ] cover geospatial queries with reliable tests

## Validation

- [ ] schemas and models are documented
- [ ] indexes are declared and verified
- [ ] the migration plan is tested in an isolated environment

## Related documents

- `../implementation/data-upgrade.md`
- `../adr/0004-mongoose-8-and-validation.md`