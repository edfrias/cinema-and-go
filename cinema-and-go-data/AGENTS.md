---
name: Data Team - Cinema and Go Data
description: "Data-layer agent routing for Cinema and Go. Use for schema evolution, Mongoose changes, indexing, validation strategy, and data integrity concerns."
---

# Data Team - Cinema and Go Data

**Module**: `cinema-and-go-data`
**Responsibility**: models, schemas, indexes, and persistence-layer compatibility.

## Team agents

### `@data-engineer`

Use it to evolve models and schemas, review indexes, plan migrations, and coordinate Mongoose upgrades.

### `@qa-data`

Use it to validate data integrity, query behavior, performance, and the impact of schema changes.

### Consult `@security-specialist`

Required when a change affects sensitive data, authentication, or access policies.

## When to invoke it

- changes in schemas and collection relationships
- indexing or geosearch needs
- persistence dependency upgrades
- data migrations or validation strategies

## Dependencies

- backend consumes these models directly today
- schema changes must be coordinated with backend before landing
- shared documentation must reflect current state and target state

## Escalation

- if the change breaks business contracts: coordinate with `@backend-specialist`
- if it affects security or sensitive fields: coordinate with `@security-specialist`
- if it requires documentation formalization or an ADR: coordinate with `@tech-writer`

## Related documentation

- data roadmap: [../docs/roadmap/phase-4-data-layer.md](../docs/roadmap/phase-4-data-layer.md)
- upgrade guide: [../docs/implementation/data-upgrade.md](../docs/implementation/data-upgrade.md)
- data-layer ADR: [../docs/adr/0004-mongoose-8-and-validation.md](../docs/adr/0004-mongoose-8-and-validation.md)