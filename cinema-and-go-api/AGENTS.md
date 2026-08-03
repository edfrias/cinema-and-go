---
name: Backend Team - Cinema and Go API
description: "Backend agent routing for Cinema and Go API. Use for Express architecture, API contracts, testing strategy, and backend product decisions."
---

# Backend Team - Cinema and Go API

**Module**: `cinema-and-go-api`
**Responsibility**: HTTP contracts, authentication, business logic, and coordination with the data layer.

## Team agents

### `@backend-specialist`

Use it for backend architecture refactors, services, middleware, authentication, and API contract evolution.

### `@qa-backend`

Use it for unit and integration testing, API contracts, performance, and backend regression risks.

### `@product-api`

Use it for versioning, endpoint design, compatibility, and product decisions exposed through the API.

## When to invoke it

- changes in routes, middleware, or auth
- refactors of business logic or persistence
- need to document or version contracts
- coordination with frontend for visible changes in responses or errors

## Dependencies

- depends on models and schema decisions from the data module
- directly impacts frontend and shared documentation
- backend QA coordinates global criteria with `@qa-lead`

## Escalation

- if schemas or indexes change: coordinate with `@data-engineer`
- if the change affects security or JWT: coordinate with `@security-specialist`
- if it requires a shared contract or roadmap decision: coordinate with `@tech-writer` and `@scrum-master`

## Related documentation

- phase 1 roadmap: [../docs/roadmap/phase-1-backend-arch.md](../docs/roadmap/phase-1-backend-arch.md)
- phase 2 roadmap: [../docs/roadmap/phase-2-api-dual.md](../docs/roadmap/phase-2-api-dual.md)
- refactor guide: [../docs/implementation/backend-refactor.md](../docs/implementation/backend-refactor.md)
- clean architecture ADR: [../docs/adr/0001-clean-architecture.md](../docs/adr/0001-clean-architecture.md)
- dual API ADR: [../docs/adr/0002-api-dual-rest-graphql.md](../docs/adr/0002-api-dual-rest-graphql.md)