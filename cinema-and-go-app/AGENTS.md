---
name: Frontend Team - Cinema and Go App
description: "Frontend agent routing for Cinema and Go App. Use for React UI changes, frontend QA, UX decisions, and coordination with backend contracts."
---

# Frontend Team - Cinema and Go App

**Module**: `cinema-and-go-app`
**Responsibility**: client UI, navigation, auth UX, maps, and user experience.

## Team agents

### `@frontend-specialist`

Use it for frontend architecture changes, component refactors, React runtime work, tooling, and technical coordination within the module.

### `@qa-frontend`

Use it for UI testing, coverage, accessibility, performance, and client-side regression prevention.

### `@product-frontend`

Use it for UX decisions, feature prioritization, and defining product behavior in the UI.

## When to invoke it

- React migrations or refactors
- changes in routing, auth UX, or visual feedback
- performance or testability issues in the app
- coordination with backend when contracts or error states change

## Dependencies

- depends on stable HTTP contracts from backend
- depends on shared documentation for roadmap and technical decisions
- frontend QA should coordinate with `@qa-lead` if the change affects global criteria

## Escalation

- if the API contract changes: coordinate with `@backend-specialist`
- if authentication or secret handling changes: coordinate with `@security-specialist`
- if the change impacts the roadmap or ADRs: coordinate with `@tech-writer`

## Related documentation

- frontend roadmap: [../docs/roadmap/phase-3-frontend.md](../docs/roadmap/phase-3-frontend.md)
- migration guide: [../docs/implementation/frontend-migration.md](../docs/implementation/frontend-migration.md)
- frontend ADR: [../docs/adr/0003-react-18-and-vite.md](../docs/adr/0003-react-18-and-vite.md)