import type { SearchResponse } from "./types";

const TTL_MS = 12 * 60 * 60 * 1000;
const store = new Map<string, { value: SearchResponse; expiresAt: number }>();

export function get(key: string): SearchResponse | null {
  const entry = store.get(key);
  if (!entry || Date.now() > entry.expiresAt) {
    if (entry) store.delete(key);
    return null;
  }
  return entry.value;
}

export function set(key: string, value: SearchResponse, ttlMs: number = TTL_MS): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function clear(): void {
  store.clear();
}
