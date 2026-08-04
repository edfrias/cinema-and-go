# CINEMA AND GO REST-API

## server

- to run server

```sh
$ npm start
```

- to run server with watcher

```sh
$ npm run watch
```

- to run server in debug mode

```sh
$ npm run debug
```

- to test server in debug mode

```sh
$ npm run test
```

## architecture

- clean architecture layers are active under `src/domain`, `src/infrastructure`, `src/presentation`, and `src/composition`
- HTTP entrypoints are served by presentation routes (`src/presentation/routes/v1`) via `src/routes/index.js`
- business behavior is composed in `src/composition/apiService.js`
- legacy `src/logic` runtime facade has been retired

## testing

- runner: Vitest
- HTTP/network isolation: MSW v2
- integration database: mongodb-memory-server (default)
- reference full-suite baseline after phase-1 migration: `68/68` passing tests
