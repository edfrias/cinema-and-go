# AGENT Governance

## Purpose

`AGENTS.md` files should describe operational agent behavior, not the detailed implementation of the technical roadmap.

## What belongs in AGENTS

- team or agent purpose
- when to invoke it
- dependencies and escalation
- functional ownership
- links to supporting documentation

## What does not belong in AGENTS

- week-by-week or day-by-day checklists
- detailed technical backlog
- implementation examples or target folder structures
- inline ADR drafts
- estimates presented as fixed facts

## Editorial rule

When content answers "how will this be implemented" or "which concrete technical changes will we make", it belongs in `docs/roadmap/`, `docs/implementation/`, or `docs/adr/`.

When content answers "who acts", "when should this agent be invoked", or "how do teams coordinate", it should stay in `AGENTS.md`.

## Recommended minimum template

1. Team name and mission.
2. Agent list and capabilities.
3. Invocation scenarios.
4. Dependencies and escalation.
5. Links to roadmap, implementation, and ADRs.