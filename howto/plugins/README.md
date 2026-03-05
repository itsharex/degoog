# Custom search engines

Drop engine modules here to add them to deGoog. Each file must export a **SearchEngine**: an object or class with:

- **`name`** (string) – display name in settings
- **`executeSearch(query, page?, timeFilter?)`** (async function) – returns `Promise<SearchResult[]>`

**SearchResult** shape: `{ title: string, url: string, snippet: string, source: string, thumbnail?: string }`

Supported extensions: `.js`, `.ts`, `.mjs`, `.cjs`.  
Engine id is derived from the filename with a `plugin-` prefix (e.g. `my-engine.js` → id `plugin-my-engine`).

Create a `./data/plugins` folder on the root of your project or set `DEGOOG_PLUGINS_DIR` to load plugins from another directory.
