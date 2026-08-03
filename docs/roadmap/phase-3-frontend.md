# Phase 3: Frontend React 18 and Vite

## Objective

Modernize the client app from CRA and React 16 toward a more current, maintainable, and testable stack.

## Current state

- CRA with `react-scripts` 3 and React 16.
- Context API and manual service wrappers.
- No visible frontend test suite in the current repo.

## Target state

- React 18
- migration away from CRA to Vite
- better separation between UI, state, and data fetching
- defined testing and performance strategy

## Backlog

- [ ] audit unused or misplaced dependencies
- [ ] upgrade React and associated runtime dependencies
- [ ] migrate build tooling to Vite
- [ ] redesign state and feedback handling
- [ ] introduce a modern data fetching strategy
- [ ] split oversized components
- [ ] prepare gradual TypeScript adoption
- [ ] define a minimum unit and E2E coverage baseline

## Validation

- [ ] build and dev server are consistent
- [ ] navigation and auth flow have no regressions
- [ ] performance goals are agreed and measurable
- [ ] frontend QA has a minimum automation baseline

## Related documents

- `../implementation/frontend-migration.md`
- `../adr/0003-react-18-and-vite.md`