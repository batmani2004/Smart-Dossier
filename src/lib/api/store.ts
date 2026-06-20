// In-memory dossier store, seeded from src/core/seed.ts.
// Module-level singleton — fine for a hackathon demo. Resets on Worker cold start.

import { SEED_CORE_DOSSIERS } from "@/core/seed";
import type { Dossier } from "@/core/types";

type StoreState = {
  dossiers: Map<string, Dossier>;
  // simple ai-run cache, keyed by inputHash
  aiRuns: Map<string, { dossierId: string; type: string; output: unknown; createdAt: string }>;
};

const g = globalThis as unknown as { __smartDossierStore?: StoreState };

function fresh(): StoreState {
  return {
    dossiers: new Map(SEED_CORE_DOSSIERS.map((d) => [d.id, structuredClone(d)])),
    aiRuns: new Map(),
  };
}

function syncSeedDossiers(state: StoreState): StoreState {
  const existingTrackingCodes = new Set(
    Array.from(state.dossiers.values()).map((d) => d.trackingCode),
  );
  for (const seed of SEED_CORE_DOSSIERS) {
    if (state.dossiers.has(seed.id) || existingTrackingCodes.has(seed.trackingCode)) continue;
    state.dossiers.set(seed.id, structuredClone(seed));
    existingTrackingCodes.add(seed.trackingCode);
  }
  return state;
}

export function store(): StoreState {
  if (!g.__smartDossierStore) g.__smartDossierStore = fresh();
  return syncSeedDossiers(g.__smartDossierStore);
}

export function resetStore(): { dossiers: number } {
  g.__smartDossierStore = fresh();
  return { dossiers: g.__smartDossierStore.dossiers.size };
}

export function allDossiers(): Dossier[] {
  return Array.from(store().dossiers.values());
}

export function getById(id: string): Dossier | undefined {
  return store().dossiers.get(id);
}

export function getByTrackingCode(code: string): Dossier | undefined {
  for (const d of store().dossiers.values()) {
    if (d.trackingCode === code) return d;
  }
  return undefined;
}

export function upsert(d: Dossier): Dossier {
  d.updatedAt = new Date().toISOString();
  store().dossiers.set(d.id, d);
  return d;
}

export function nextId(prefix: string): string {
  const ids = Array.from(store().dossiers.keys()).filter((k) => k.startsWith(prefix));
  return `${prefix}${String(ids.length + 1).padStart(3, "0")}`;
}
