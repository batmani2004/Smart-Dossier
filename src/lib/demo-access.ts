import { useEffect, useMemo, useState } from "react";

export type DemoRole = "admin" | "operator" | "citizen" | "business";

export type DemoPermission =
  | "viewDashboard"
  | "viewDossiers"
  | "createDossier"
  | "advanceDossier"
  | "uploadDocument"
  | "runAi"
  | "generateDocuments"
  | "viewAudit"
  | "resetDemo"
  | "manageUsers"
  | "viewCitizenPortal";

type RoleProfile = {
  label: string;
  shortLabel: string;
  displayName: string;
  credentialLabel: string;
  description: string;
  defaultRoute: string;
  permissions: Record<DemoPermission, boolean>;
};

const STORAGE_KEY = "smart-dossier-demo-role";
const ROLE_EVENT = "smart-dossier-role-change";
const DEFAULT_ROLE: DemoRole = "citizen";

const adminPermissions = {
  viewDashboard: true,
  viewDossiers: true,
  createDossier: true,
  advanceDossier: true,
  uploadDocument: true,
  runAi: true,
  generateDocuments: true,
  viewAudit: true,
  resetDemo: true,
  manageUsers: true,
  viewCitizenPortal: true,
} satisfies Record<DemoPermission, boolean>;

export const DEMO_ROLES: Record<DemoRole, RoleProfile> = {
  admin: {
    label: "Admin",
    shortLabel: "Admin",
    displayName: "Ina Marku",
    credentialLabel: "Admin",
    description: "Konfigurim, auditim dhe kontroll i plote mbi platformen.",
    defaultRoute: "/",
    permissions: adminPermissions,
  },
  operator: {
    label: "Operator",
    shortLabel: "Operator",
    displayName: "Arben Dervishi",
    credentialLabel: "Operator",
    description: "Punon me dosjet, dokumentet, verifikimet dhe hapat e procesit.",
    defaultRoute: "/dosjet",
    permissions: {
      ...adminPermissions,
      resetDemo: false,
      manageUsers: false,
    },
  },
  citizen: {
    label: "Qytetar",
    shortLabel: "Qytetar",
    displayName: "Elira Kola",
    credentialLabel: "Qytetar",
    description:
      "Aplikon per privatizim banese ose shpronesim/kompensim dhe ndjek gjurmimin publik te dosjes.",
    defaultRoute: "/aplikim",
    permissions: {
      viewDashboard: false,
      viewDossiers: false,
      createDossier: false,
      advanceDossier: false,
      uploadDocument: false,
      runAi: false,
      generateDocuments: false,
      viewAudit: false,
      resetDemo: false,
      manageUsers: false,
      viewCitizenPortal: true,
    },
  },
  business: {
    label: "Biznes",
    shortLabel: "Biznes",
    displayName: "AlbaTech sh.p.k.",
    credentialLabel: "Biznes",
    description:
      "Subjekt me NIPT qe aplikon per regjistrim prone ose kompensim shpronesimi dhe ndjek shqyrtimin nga operatori.",
    defaultRoute: "/biznes",
    permissions: {
      viewDashboard: false,
      viewDossiers: false,
      createDossier: false,
      advanceDossier: false,
      uploadDocument: false,
      runAi: false,
      generateDocuments: false,
      viewAudit: false,
      resetDemo: false,
      manageUsers: false,
      viewCitizenPortal: true,
    },
  },
};

export function isDemoRole(value: string | null): value is DemoRole {
  return value === "admin" || value === "operator" || value === "citizen" || value === "business";
}

export function roleCan(role: DemoRole, permission: DemoPermission): boolean {
  return DEMO_ROLES[role].permissions[permission];
}

function readStoredRole(): DemoRole {
  if (typeof window === "undefined") return DEFAULT_ROLE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isDemoRole(stored) ? stored : DEFAULT_ROLE;
}

export function useDemoRole() {
  const [role, setRoleState] = useState<DemoRole>(() => readStoredRole());

  useEffect(() => {
    setRoleState(readStoredRole());

    const onRoleChange = (event: Event) => {
      const next = (event as CustomEvent<DemoRole>).detail;
      if (isDemoRole(next)) setRoleState(next);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setRoleState(isDemoRole(event.newValue) ? event.newValue : DEFAULT_ROLE);
      }
    };

    window.addEventListener(ROLE_EVENT, onRoleChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(ROLE_EVENT, onRoleChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setRole = (next: DemoRole) => {
    setRoleState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
      window.dispatchEvent(new CustomEvent(ROLE_EVENT, { detail: next }));
    }
  };

  const logout = () => {
    setRoleState(DEFAULT_ROLE);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent(ROLE_EVENT, { detail: DEFAULT_ROLE }));
    }
  };

  return useMemo(
    () => ({
      role,
      setRole,
      logout,
      profile: DEMO_ROLES[role],
      can: (permission: DemoPermission) => roleCan(role, permission),
    }),
    [role],
  );
}
