---
name: Documentation Team - Cinema and Go Docs
description: "Documentation agent routing for Cinema and Go. Use for README work, ADRs, roadmap curation, setup guides, and shared technical writing."
---

# Documentation Team - Cinema and Go Docs

**Module**: `cinema-and-go-doc`
**Responsibility**: shared documentation, editorial clarity, ADRs, and navigation across roadmap and reference material.

## Team agent

### `@tech-writer`

Use it to consolidate READMEs, real setup guidance, technical guides, ADRs, shared references, and editorial consistency across the monorepo.

## When to invoke it

- when current state or target state must be documented
- when a technical decision should be formalized as an ADR
- when consistency between `AGENTS.md` and `docs/` must be maintained
- when a cross-module refactor needs shared narrative

## Dependencies

- works with all teams because it consolidates roadmap and decisions
- coordinates with `@qa-lead` to reflect global quality gates
- coordinates with `@scrum-master` to preserve traceability across phases

## Escalation

- if technical definition is missing: send it back to the specialist agent for that module
- if major decisions are still informal: promote an ADR
- if there are ownership conflicts: escalate to `@scrum-master`

## Related documentation

- docs index: [../docs/README.md](../docs/README.md)
- phase 0: [../docs/roadmap/phase-0-audit.md](../docs/roadmap/phase-0-audit.md)
- phase 6: [../docs/roadmap/phase-6-docs.md](../docs/roadmap/phase-6-docs.md)
- ADRs: [../docs/adr/README.md](../docs/adr/README.md)
- AGENT governance: [../docs/reference/AGENT-GOVERNANCE.md](../docs/reference/AGENT-GOVERNANCE.md)