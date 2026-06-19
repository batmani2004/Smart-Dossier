import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Dossier } from "./types";
import { SEED_DOSSIERS } from "./seed-dossiers";

type State = {
  dossiers: Dossier[];
  hydrated: boolean;
  addDossier: (d: Dossier) => void;
  updateDossier: (id: string, patch: Partial<Dossier>) => void;
  cacheAi: (id: string, ai: Pick<Dossier, "aiSummary" | "aiNextStep" | "aiCriticalAlerts">) => void;
  resetSeed: () => void;
};

export const useDossierStore = create<State>()(
  persist(
    (set) => ({
      dossiers: SEED_DOSSIERS,
      hydrated: false,
      addDossier: (d) => set((s) => ({ dossiers: [d, ...s.dossiers] })),
      updateDossier: (id, patch) =>
        set((s) => ({
          dossiers: s.dossiers.map((d) => (d.id === id ? { ...d, ...patch } : d)),
        })),
      cacheAi: (id, ai) =>
        set((s) => ({
          dossiers: s.dossiers.map((d) => (d.id === id ? { ...d, ...ai } : d)),
        })),
      resetSeed: () => set({ dossiers: SEED_DOSSIERS }),
    }),
    {
      name: "smart-dossier-v2-en",
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);
