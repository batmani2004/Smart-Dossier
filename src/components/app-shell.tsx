import * as React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, FolderKanban, BarChart3, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const nav: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/dosjet", label: "Dosjet", icon: FolderKanban },
  { to: "/raporte", label: "Raporte", icon: BarChart3 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const path = loc.pathname;
  const isActive = (item: (typeof nav)[number]) =>
    item.exact ? path === item.to : path.startsWith(item.to);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="px-4 pt-5 pb-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-md bg-accent text-accent-foreground grid place-items-center shadow-soft shrink-0">
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
          {nav.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-[16px] shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
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

      <main className="flex-1 min-w-0 pb-16 md:pb-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-2 px-4 py-2.5 border-b bg-sidebar text-sidebar-foreground">
          <ShieldCheck className="size-4" />
          <span className="font-semibold text-sm">Smart Dossier</span>
        </div>
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-sidebar text-sidebar-foreground border-t border-sidebar-border grid grid-cols-3">
        {nav.map((item) => {
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
        })}
      </nav>
    </div>
  );
}
