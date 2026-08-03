---
name: Cinema and Go - Agent System
description: "Monorepo agent orchestration for Cinema and Go. Use this file to route work across frontend, backend, data, docs, and cross-functional agents."
---

# Cinema and Go - Agent Orchestration System

This file coordinates agent usage across the monorepo. Its purpose is to route work, clarify ownership, and make team dependencies explicit.

## Teams

- Frontend Team: `cinema-and-go-app/`
- Backend Team: `cinema-and-go-api/`
- Data Team: `cinema-and-go-data/`
- Documentation Team: `cinema-and-go-doc/`
- Cross-functional: security, global QA, Scrum, and DevOps

## Navigation

- Frontend: [cinema-and-go-app/AGENTS.md](cinema-and-go-app/AGENTS.md)
- Backend: [cinema-and-go-api/AGENTS.md](cinema-and-go-api/AGENTS.md)
- Data: [cinema-and-go-data/AGENTS.md](cinema-and-go-data/AGENTS.md)
- Docs: [cinema-and-go-doc/AGENTS.md](cinema-and-go-doc/AGENTS.md)
- Shared roadmap: [docs/roadmap/PHASES.md](docs/roadmap/PHASES.md)
- Editorial governance: [docs/reference/AGENT-GOVERNANCE.md](docs/reference/AGENT-GOVERNANCE.md)

## When to use this root AGENT

- when the work affects multiple modules
- when ownership must be decided across frontend, backend, and data
- when a technical decision requires coordination with QA, security, or documentation
- when shared roadmap, refactor, or ADR documentation needs to be located

## Main dependencies

- frontend depends on the contract exposed by backend
- backend depends on the evolution of the data model
- data must coordinate schema changes with backend
- documentation consolidates current state, roadmap, and decisions
- QA and security validate cross-cutting changes

## Recommended escalation

- backend architecture decisions: `@backend-specialist`
- API contract changes: `@backend-specialist` + `@product-api`
- frontend migrations: `@frontend-specialist`
- model and index changes: `@data-engineer`
- documentation, ADRs, and guides: `@tech-writer`
- global testing strategy: `@qa-lead`
- security and authentication: `@security-specialist`
- prioritization and coordination across phases: `@scrum-master`

## Related documentation

- documentation index: [docs/README.md](docs/README.md)
- phase roadmap: [docs/roadmap/PHASES.md](docs/roadmap/PHASES.md)
- ADRs: [docs/adr/README.md](docs/adr/README.md)

## Maintenance rule

`AGENTS.md` files describe operational behavior. Refactors, implementation decisions, technical backlog, and phase plans belong in `docs/`.