# Frontend Migration

## Current state

- React 16.8.6 and `react-scripts` 3.
- Manual service wrappers and Context API for part of the global state.
- Page components carrying too much responsibility.

## Target state

- React 18 on a supported runtime
- Vite as the main tooling base
- separation between UI, state, and data retrieval
- a defined UI testing and performance strategy

## Workstreams

- review dependencies and remove leftover packages
- migrate the entrypoint, build tooling, and environment variable flow
- decide on the store model and data caching strategy
- split maps, auth, and feedback components into smaller units
- formalize loading, error, and protected-navigation states

## Risks

- incompatibilities between old libraries and React 18
- regressions in auth and geolocation flows
- leaking CRA assumptions into the new build environment