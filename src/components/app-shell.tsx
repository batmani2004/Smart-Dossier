import * as React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  BarChart3,
  Building2,
  FolderKanban,
  HelpCircle,
  LayoutDashboard,
  Rocket,
  Scale,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { CitizenVirtualAgent } from "@/components/citizen-virtual-agent";
import { RoleSwitcher } from "@/components/role-switcher";
import { useDemoRole } from "@/lib/demo-access";
import { cn } from "@/lib/utils";

const nav: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/", label: "Qendra punes", icon: LayoutDashboard, exact: true },
  { to: "/dosjet", label: "Dosjet", icon: FolderKanban },
  { to: "/raporte", label: "Raporte", icon: BarChart3 },
  { to: "/faq", label: "FAQ", icon: HelpCircle },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const { role } = useDemoRole();
  const path = loc.pathname;
  const isActive = (item: (typeof nav)[number]) =>
    item.to === "/dosjet"
      ? path.startsWith("/dosjet") || path.startsWith("/dosja/")
      : item.exact
        ? path === item.to
        : path.startsWith(item.to);
  const citizenPortalActive = path.startsWith("/track/");
  const businessPortalActive = path.startsWith("/biznes");
  const applicationPortalActive = path.startsWith("/aplikim");
  const faqActive = path.startsWith("/faq");
  const showCitizenAgent = role === "citizen" || role === "business" || faqActive;

  return (
    <div className="min-h-screen bg-background">
      <div className="h-1.5 bg-destructive" />
      <div className="hidden md:flex min-h-[88px] items-center justify-between gap-4 border-b-4 border-accent bg-[var(--brand-navy)] px-8 text-white">
        <div className="flex min-w-0 items-center gap-4">
          <div className="grid size-12 shrink-0 place-items-center rounded-full bg-destructive text-white shadow-soft">
            <Rocket className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase text-accent">
              Innovation4Albania
            </div>
            <div className="truncate text-xl font-semibold">
              Smart Dossier · Menaxhimi i Dosjeve
            </div>
            <div className="mt-0.5 truncate text-xs text-white/75">
              Portal institucional me asistence AI
            </div>
          </div>
        </div>
        <div className="shrink-0">
          <RoleSwitcher variant="header" />
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-0.375rem)] md:min-h-[calc(100vh-5.875rem)]">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
          <div className="px-4 pt-5 pb-4 border-b border-sidebar-border">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-lg bg-primary text-primary-foreground grid place-items-center shadow-soft shrink-0">
                <ShieldCheck className="size-4" />
              </div>
              <div className="leading-tight min-w-0">
                <div className="text-sm font-semibold tracking-tight truncate">Smart Dossier</div>
                <div className="text-[10px] text-sidebar-foreground/60 uppercase tracking-wider truncate">
                  I4AL · Property Nucleus
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-2 py-3 space-y-0.5">
            {role === "citizen" || role === "business" ? (
              <>
                <Link
                  to="/aplikim"
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors",
                    applicationPortalActive
                      ? "bg-primary text-primary-foreground font-medium shadow-soft"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Scale className="size-[16px] shrink-0" />
                  <span className="truncate">Aplikim i ri</span>
                </Link>
                {role === "business" ? (
                  <Link
                    to="/biznes"
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors",
                      businessPortalActive
                        ? "bg-primary text-primary-foreground font-medium shadow-soft"
                        : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Building2 className="size-[16px] shrink-0" />
                    <span className="truncate">Regjistrim prone</span>
                  </Link>
                ) : (
                  <Link
                    to="/track/$code"
                    params={{ code: "EKB-2026-000014" }}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors",
                      citizenPortalActive
                        ? "bg-primary text-primary-foreground font-medium shadow-soft"
                        : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <UserRound className="size-[16px] shrink-0" />
                    <span className="truncate">Gjurmim qytetar</span>
                  </Link>
                )}
                <Link
                  to="/faq"
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors",
                    faqActive
                      ? "bg-primary text-primary-foreground font-medium shadow-soft"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <HelpCircle className="size-[16px] shrink-0" />
                  <span className="truncate">FAQ dhe AI</span>
                </Link>
              </>
            ) : (
              nav.map((item) => {
                const active = isActive(item);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors",
                      active
                        ? "bg-primary text-primary-foreground font-medium shadow-soft"
                        : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Icon className="size-[16px] shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })
            )}
          </nav>

          <div className="m-2 p-2.5 rounded-md bg-sidebar-accent/40 border border-sidebar-border">
            <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60 mb-1">
              Bazë ligjore
            </div>
            <p className="text-[11px] leading-snug text-sidebar-foreground/80">
              Ligj 8561/1999 — Shpronësimi
              <br />
              VKM 179/2020 + 898/2020 — EKB
            </p>
          </div>
        </aside>

        <main className="flex-1 min-w-0 pb-16 md:pb-0 bg-background">
          {/* Mobile top bar */}
          <div className="md:hidden flex items-center gap-2 px-4 py-2.5 border-b-4 border-accent bg-[var(--brand-navy)] text-white">
            <div className="grid size-8 shrink-0 place-items-center rounded-full bg-destructive">
              <Rocket className="size-4" />
            </div>
            <span className="font-semibold text-sm min-w-0 flex-1 truncate">Smart Dossier</span>
            <div className="w-[190px] shrink-0">
              <RoleSwitcher compact variant="header" />
            </div>
          </div>
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-sidebar text-sidebar-foreground border-t border-sidebar-border grid grid-cols-3">
          {role === "citizen" || role === "business" ? (
            <>
              <Link
                to="/aplikim"
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] transition-colors",
                  applicationPortalActive
                    ? "text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70",
                )}
              >
                <Scale
                  className={cn("size-[18px]", applicationPortalActive && "text-accent")}
                />
                <span className="truncate max-w-full px-1">Aplikim</span>
              </Link>
              {role === "business" ? (
                <Link
                  to="/biznes"
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] transition-colors",
                    businessPortalActive
                      ? "text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70",
                  )}
                >
                  <Building2 className={cn("size-[18px]", businessPortalActive && "text-accent")} />
                  <span className="truncate max-w-full px-1">Regjistrim</span>
                </Link>
              ) : (
                <Link
                  to="/track/$code"
                  params={{ code: "EKB-2026-000014" }}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] transition-colors",
                    citizenPortalActive
                      ? "text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70",
                  )}
                >
                  <UserRound className={cn("size-[18px]", citizenPortalActive && "text-accent")} />
                  <span className="truncate max-w-full px-1">Gjurmim</span>
                </Link>
              )}
              <Link
                to="/faq"
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] transition-colors",
                  faqActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/70",
                )}
              >
                <HelpCircle className={cn("size-[18px]", faqActive && "text-accent")} />
                <span className="truncate max-w-full px-1">FAQ</span>
              </Link>
            </>
          ) : (
            nav.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] transition-colors",
                    active ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/70",
                  )}
                >
                  <Icon className={cn("size-[18px]", active && "text-accent")} />
                  <span className="truncate max-w-full px-1">{item.label}</span>
                </Link>
              );
            })
          )}
        </nav>
      </div>
      {showCitizenAgent ? <CitizenVirtualAgent /> : null}
    </div>
  );
}
