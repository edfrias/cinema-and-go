# Modernization Roadmap

This document centralizes the modernization phases extracted from the `AGENTS.md` files.

## Phase summary

| Phase | Name | Estimated duration | Main teams | Dependencies |
| --- | --- | --- | --- | --- |
| 0 | Architectural Audit | 1-2 weeks | `@qa-lead`, `@tech-writer` | None |
| 1 | Backend Clean Architecture | 3-4 weeks | `@backend-specialist`, `@qa-backend` | Phase 0 |
| 2 | Dual REST and GraphQL API | 2-3 weeks | `@backend-specialist`, `@product-api` | Phase 1 |
| 3 | Frontend React 18 and Vite | 3-4 weeks | `@frontend-specialist`, `@qa-frontend` | Phase 0 |
| 4 | Data Layer and Validation | 1-2 weeks | `@data-engineer`, `@qa-data` | Phase 1 |
| 5 | CI/CD and Deployment | 2 weeks | `@devops-orchestrator`, `@ci-cd-architect` | Phases 1-4 |
| 6 | Documentation | 1-2 weeks | `@tech-writer`, `@qa-lead` | All |

## Planning notes

- Duration is estimated and should be revisited after the Phase 0 audit.
- Phases 1 and 3 can move in parallel if frontend and backend contractual compatibility is preserved.
- Technical details for each phase live in separate files under `docs/roadmap/` and `docs/implementation/`.

## Related documents

- Phase 0: `phase-0-audit.md`
- Phase 1: `phase-1-backend-arch.md`
- Phase 2: `phase-2-api-dual.md`
- Phase 3: `phase-3-frontend.md`
- Phase 4: `phase-4-data-layer.md`
- Phase 5: `phase-5-devops.md`
- Phase 6: `phase-6-docs.md`