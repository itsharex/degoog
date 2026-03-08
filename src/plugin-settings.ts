import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";

const SETTINGS_PATH =
  process.env.DEGOOG_PLUGIN_SETTINGS_FILE ??
  join(process.cwd(), "data", "plugin-settings.json");

export type SettingValue = string | string[];

type PluginSettingsStore = Record<string, Record<string, SettingValue>>;

let cache: PluginSettingsStore | null = null;

async function load(): Promise<PluginSettingsStore> {
  if (cache) return cache;
  try {
    const raw = await readFile(SETTINGS_PATH, "utf-8");
    cache = JSON.parse(raw) as PluginSettingsStore;
  } catch {
    cache = {};
  }
  return cache;
}

async function persist(store: PluginSettingsStore): Promise<void> {
  await mkdir(dirname(SETTINGS_PATH), { recursive: true });
  await writeFile(SETTINGS_PATH, JSON.stringify(store, null, 2), "utf-8");
}

export async function getSettings(id: string): Promise<Record<string, SettingValue>> {
  const store = await load();
  return store[id] ?? {};
}

export async function setSettings(
  id: string,
  values: Record<string, SettingValue>,
): Promise<void> {
  const store = await load();
  store[id] = { ...(store[id] ?? {}), ...values };
  cache = store;
  await persist(store);
}

export async function getAllSettings(): Promise<PluginSettingsStore> {
  return load();
}

export async function removeSettings(id: string): Promise<void> {
  const store = await load();
  if (id in store) {
    delete store[id];
    cache = store;
    await persist(store);
  }
}

export function maskSecrets(
  settings: Record<string, SettingValue>,
  schema: { key: string; secret?: boolean }[],
): Record<string, SettingValue> {
  const masked: Record<string, SettingValue> = {};
  for (const [key, value] of Object.entries(settings)) {
    const field = schema.find((f) => f.key === key);
    masked[key] = field?.secret ? (value ? "__SET__" : "") : value;
  }
  return masked;
}

export function mergeSecrets(
  incoming: Record<string, SettingValue>,
  existing: Record<string, SettingValue>,
  schema: { key: string; secret?: boolean }[],
): Record<string, SettingValue> {
  const merged: Record<string, SettingValue> = { ...existing };
  for (const [key, value] of Object.entries(incoming)) {
    const field = schema.find((f) => f.key === key);
    if (field?.secret) {
      if (value === "__SET__") continue;
      merged[key] = value;
    } else {
      merged[key] = value;
    }
  }
  return merged;
}
