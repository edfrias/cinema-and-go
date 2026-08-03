# Phase 2: Dual REST and GraphQL API

## Objective

Evolve the existing API while preserving REST compatibility and evaluating a GraphQL surface for more complex queries.

## Current state

- The current REST API is small and tightly coupled to the current implementation.
- There are no GraphQL dependencies in the backend today.
- There is no maintained OpenAPI specification acting as a source of truth.

## Target state

- REST endpoints reorganized by resource
- OpenAPI or Swagger documentation
- GraphQL schema and resolvers for selected queries
- integration tests for both contracts

## Backlog

- [ ] reorganize REST endpoints without breaking existing consumers
- [ ] define a versioning strategy
- [ ] document REST with OpenAPI
- [ ] evaluate and introduce Apollo Server or equivalent
- [ ] define initial typeDefs and resolvers
- [ ] cover critical queries and mutations with tests

## Validation

- [ ] the REST contract is documented and stable
- [ ] GraphQL is limited to clearly justified use cases
- [ ] performance and compatibility are reviewed with frontend

## Related documents

- `../implementation/backend-refactor.md`
- `../adr/0002-api-dual-rest-graphql.md`