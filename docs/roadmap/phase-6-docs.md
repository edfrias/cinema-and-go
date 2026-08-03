# Phase 6: Documentation

## Objective

Complete the technical and operational documentation using the new separation between `AGENTS.md` and `docs/`.

## Current state

- product-oriented documentation exists in `cinema-and-go-doc/`
- the technical roadmap used to be embedded inside several `AGENTS.md` files

## Target state

- `docs/` as the shared source for roadmap, refactors, and ADRs
- minimal and consistent `AGENTS.md` files
- documentation navigable by phase, decision, and technical area

## Backlog

- [ ] consolidate roadmap material under `docs/roadmap/`
- [ ] create implementation guides by area
- [ ] formalize the initial ADRs
- [ ] review the real setup and shared references
- [ ] decide which content from `cinema-and-go-doc/` remains historical and which is migrated

## Validation

- [ ] no dense technical checklists remain inside `AGENTS.md`
- [ ] the docs separate behavior from implementation correctly
- [ ] the structure supports future decisions and phases