import type { SearchBarAction } from "../types";
import { getSettings } from "../plugin-settings";
import { debug } from "../logger";

interface StoredAction {
  pluginId: string;
  action: SearchBarAction;
}

let storedActions: StoredAction[] = [];

function isSearchBarAction(val: unknown): val is SearchBarAction {
  if (typeof val !== "object" || val === null) return false;
  const a = val as Record<string, unknown>;
  return (
    typeof a.id === "string" &&
    typeof a.label === "string" &&
    typeof a.type === "string" &&
    ["navigate", "bang", "custom"].includes(a.type as string)
  );
}

function isSearchBarActionArray(val: unknown): val is SearchBarAction[] {
  return Array.isArray(val) && val.every(isSearchBarAction);
}

export async function initSearchBarActions(): Promise<void> {
  const { readdir, stat } = await import("fs/promises");
  const { join } = await import("path");
  const { pathToFileURL } = await import("url");
  const pluginDir =
    process.env.DEGOOG_PLUGINS_DIR ?? join(process.cwd(), "data", "plugins");
  storedActions = [];

  try {
    const entries = await readdir(pluginDir);
    for (const entry of entries) {
      const entryPath = join(pluginDir, entry);
      const entryStat = await stat(entryPath).catch(() => null);
      if (!entryStat?.isDirectory()) continue;

      let indexFile: string | undefined;
      for (const f of ["index.js", "index.ts", "index.mjs", "index.cjs"]) {
        const s = await stat(join(entryPath, f)).catch(() => null);
        if (s?.isFile()) {
          indexFile = f;
          break;
        }
      }
      if (!indexFile) continue;

      try {
        const fullPath = join(entryPath, indexFile);
        const url = pathToFileURL(fullPath).href;
        const mod = await import(url);
        const actions = mod.searchBarActions ?? mod.default?.searchBarActions;
        if (!isSearchBarActionArray(actions)) continue;
        for (const action of actions) {
          storedActions.push({
            pluginId: entry,
            action: { ...action, id: `${entry}-${action.id}` },
          });
        }
      } catch (err) {
        debug("search-bar", `Failed to load search bar actions from plugin: ${entry}`, err);
      }
    }
  } catch (err) {
    debug("search-bar", "Failed to read plugin directory", err);
  }
}

export async function getSearchBarActions(): Promise<SearchBarAction[]> {
  const out: SearchBarAction[] = [];
  for (const { pluginId, action } of storedActions) {
    const settings = await getSettings(`plugin-${pluginId}`);
    if (settings["disabled"] === "true") continue;
    const label = (settings.buttonLabel ?? "").trim() || action.label;
    out.push({ ...action, label });
  }
  return out;
}

export async function reloadSearchBarActions(): Promise<void> {
  storedActions = [];
  await initSearchBarActions();
}
