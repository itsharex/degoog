# Adding a new built-in engine

1. **Create** `src/engines/<name>.ts` implementing the `SearchEngine` interface (`name`, `executeSearch(query, page?, timeFilter?)` returning `SearchResult[]`).
2. **Register** in `src/engines/registry.ts`: add one entry to `BUILTIN_DEFINITIONS` with `id`, `displayName`, and your engine class.

No other files need changes. Settings toggles and API params are derived from the registry.
For local only engines, see [/howto/plugins/README.md](/howto/plugins/README.md).
