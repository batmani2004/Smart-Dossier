import * as React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Building2,
  ChevronRight,
  FileUp,
  FolderKanban,
  HelpCircle,
  Home,
  LayoutDashboard,
  Menu,
  Scale,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { CitizenVirtualAgent } from "@/components/citizen-virtual-agent";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RoleSwitcher } from "@/components/role-switcher";
import { useDemoRole } from "@/lib/demo-access";
import { cn } from "@/lib/utils";

const primaryNav = [
  { to: "/", label: "Faqja kryesore", icon: LayoutDashboard, exact: true },
  { to: "/dosjet", label: "Dosjet", icon: FolderKanban, badge: "4" },
] satisfies {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  badge?: string;
}[];

const managementNav = [
  { to: "/raporte", label: "Raporte", icon: BarChart3 },
  { to: "/faq", label: "Ndihme", icon: HelpCircle },
] satisfies { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[];

function pageLabel(path: string) {
  if (path.startsWith("/dosja/")) return "Regjenerimi Urban i Bregdetit...";
  if (path.startsWith("/dosjet")) return "Dosjet";
  if (path.startsWith("/raporte")) return "Raporte";
  if (path.startsWith("/faq")) return "FAQ";
  if (path.startsWith("/aplikim/dokumentacion")) return "Dokumentacioni për operatorin";
  if (path.startsWith("/aplikim")) return "Aplikim i ri";
  if (path.startsWith("/biznes")) return "Regjistrim prone";
  if (path.startsWith("/track/")) return "Gjurmim qytetar";
  return "Faqja kryesore";
}

type ShellNotification = {
  id?: string | number;
  title: string;
  meta?: string;
};

export function AppShell({
  children,
  notifications = [],
}: {
  children: React.ReactNode;
  notifications?: ShellNotification[];
}) {
  const loc = useLocation();
  const { role } = useDemoRole();
  const path = loc.pathname;
  const citizenPortalActive = path.startsWith("/track/");
  const businessPortalActive = path.startsWith("/biznes");
  const applicationDocsActive = path.startsWith("/aplikim/dokumentacion");
  const applicationPortalActive = path === "/aplikim";
  const faqActive = path.startsWith("/faq");
  const showCitizenAgent =
    ((role === "citizen" || role === "business") && !citizenPortalActive) || faqActive;

  const isActive = (item: { to: string; exact?: boolean }) =>
    item.to === "/dosjet"
      ? path.startsWith("/dosjet") || path.startsWith("/dosja/")
      : item.exact
        ? path === item.to
        : path.startsWith(item.to);

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden min-h-[78px] items-center justify-between gap-4 border-b-4 border-accent bg-[var(--brand-navy)] px-8 text-white md:flex">
        <div className="flex min-w-0 items-center gap-4">
          <div className="grid h-14 w-16 shrink-0 place-items-center">
            <img
              src="/brand/smart-dossier-logo.png"
              alt="Smart Dossier"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase text-accent">Materiali C</div>
            <div className="truncate text-xl font-semibold leading-tight">
              Smart Dossier - Menaxhimi i Dosjeve
            </div>
            <div className="mt-0.5 truncate text-xs text-white/75">
              Pamje orientuese e nje platforme per menaxhimin e dosjeve te prones.
            </div>
          </div>
        </div>
        <div className="shrink-0">
          <RoleSwitcher variant="header" />
        </div>
      </div>

      <div className="flex min-h-screen md:min-h-[calc(100vh-5.125rem)]">
        <aside className="hidden w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
          <div className="border-b border-sidebar-border px-4 pb-4 pt-4">
            <div className="flex items-center gap-2.5">
              <div className="grid h-11 w-12 shrink-0 place-items-center">
                <img
                  src="/brand/smart-dossier-logo.png"
                  alt="Smart Dossier"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="min-w-0 leading-tight">
                <div className="truncate text-sm font-semibold tracking-tight text-primary">
                  Menaxhimi i Dosjeve
                </div>
                <div className="truncate text-[10px] uppercase text-sidebar-foreground/60">
                  Smart Dossier
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-5 px-3 py-5">
            {role === "citizen" || role === "business" ? (
              <div className="space-y-1">
                <SidebarGroupLabel>Navigimi Kryesor</SidebarGroupLabel>
                <SidebarLink
                  to="/aplikim"
                  active={applicationPortalActive}
                  icon={Scale}
                  label="Aplikim i ri"
                />
                <SidebarLink
                  to="/aplikim/dokumentacion"
                  active={applicationDocsActive}
                  icon={FileUp}
                  label="Dokumentacioni"
                  nested
                />
                {role === "business" ? (
                  <SidebarLink
                    to="/biznes"
                    active={businessPortalActive}
                    icon={Building2}
                    label="Regjistrim prone"
                  />
                ) : (
                  <SidebarLink
                    to="/track/$code"
                    params={{ code: "EKB-2026-000014" }}
                    active={citizenPortalActive}
                    icon={UserRound}
                    label="Gjurmim qytetar"
                  />
                )}
                <SidebarLink to="/faq" active={faqActive} icon={HelpCircle} label="FAQ dhe AI" />
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <SidebarGroupLabel>Navigimi Kryesor</SidebarGroupLabel>
                  {primaryNav.map((item) => (
                    <SidebarLink
                      key={item.to}
                      to={item.to}
                      active={isActive(item)}
                      icon={item.icon}
                      label={item.label}
                      badge={item.badge}
                    />
                  ))}
                </div>
                <div className="space-y-1">
                  <SidebarGroupLabel>Menaxhimi</SidebarGroupLabel>
                  {managementNav.map((item) => (
                    <SidebarLink
                      key={item.to}
                      to={item.to}
                      active={isActive(item)}
                      icon={item.icon}
                      label={item.label}
                    />
                  ))}
                </div>
              </>
            )}
          </nav>

          <div className="m-3">
            <RoleSwitcher compact variant="sidebar" />
          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-background pb-16 md:pb-0">
          <div className="hidden h-12 items-center justify-between border-b border-border bg-[#e8eef7] px-5 text-xs text-muted-foreground md:flex">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="grid size-7 place-items-center rounded-md text-foreground/65 hover:bg-white/60"
                aria-label="Menu"
              >
                <Menu className="size-4" />
              </button>
              <Home className="size-3.5" />
              <ChevronRight className="size-3" />
              <span>Dosjet</span>
              <ChevronRight className="size-3" />
              <span className="truncate font-semibold text-foreground">{pageLabel(path)}</span>
            </div>
            <NotificationsPopover notifications={notifications} />
          </div>

          <div className="flex items-center gap-2 border-b-4 border-accent bg-[var(--brand-navy)] px-4 py-2.5 text-white md:hidden">
            <div className="grid h-10 w-11 shrink-0 place-items-center">
              <img
                src="/brand/smart-dossier-logo.png"
                alt="Smart Dossier"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">Smart Dossier</span>
            <div className="w-[190px] shrink-0">
              <RoleSwitcher compact variant="header" />
            </div>
          </div>
          {children}
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-sidebar-border bg-sidebar text-sidebar-foreground md:hidden">
          {role === "citizen" || role === "business" ? (
            <>
              <MobileLink
                to="/aplikim"
                active={applicationPortalActive || applicationDocsActive}
                icon={Scale}
                label="Aplikim"
              />
              {role === "business" ? (
                <MobileLink
                  to="/biznes"
                  active={businessPortalActive}
                  icon={Building2}
                  label="Regjistrim"
                />
              ) : (
                <MobileLink
                  to="/track/$code"
                  params={{ code: "EKB-2026-000014" }}
                  active={citizenPortalActive}
                  icon={UserRound}
                  label="Gjurmim"
                />
              )}
              <MobileLink to="/faq" active={faqActive} icon={HelpCircle} label="FAQ" />
            </>
          ) : (
            <>
              {[...primaryNav, managementNav[0]].map((item) => (
                <MobileLink
                  key={item.to}
                  to={item.to}
                  active={isActive(item)}
                  icon={item.icon}
                  label={item.label}
                />
              ))}
            </>
          )}
        </nav>
      </div>
      {showCitizenAgent ? <CitizenVirtualAgent /> : null}
    </div>
  );
}

function NotificationsPopover({ notifications }: { notifications: ShellNotification[] }) {
  const count = notifications.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="console-pill border-accent/40 bg-accent/15 text-accent-foreground"
          aria-label="Hap njoftimet"
        >
          <Bell className="size-3.5" />
          Njoftime
          <span className="grid size-4 place-items-center rounded-full bg-accent text-[10px] font-bold">
            {count}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b px-3 py-2">
          <div className="text-sm font-semibold">Njoftime</div>
          <div className="text-[11px] text-muted-foreground">
            {count ? `${count} njoftime publike` : "Nuk ka njoftime te reja"}
          </div>
        </div>
        {count ? (
          <ul className="max-h-80 overflow-y-auto p-2">
            {notifications.map((notification, index) => (
              <li
                key={notification.id ?? index}
                className="rounded-md border-l-2 border-primary/35 px-2 py-2 text-xs hover:bg-muted/60"
              >
                <div className="leading-snug text-foreground">{notification.title}</div>
                {notification.meta ? (
                  <div className="mt-1 text-[11px] text-muted-foreground">{notification.meta}</div>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-3 text-xs text-muted-foreground">
            Njoftimet e dosjes do te shfaqen ketu kur te kete perditesime.
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function SidebarGroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 pb-2 text-[10px] font-semibold text-sidebar-foreground/55">{children}</div>
  );
}

function SidebarLink({
  to,
  params,
  active,
  icon: Icon,
  label,
  badge,
  nested = false,
}: {
  to: string;
  params?: Record<string, string>;
  active: boolean;
  icon: typeof LayoutDashboard;
  label: string;
  badge?: string;
  nested?: boolean;
}) {
  return (
    <Link
      to={to}
      params={params}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
        nested && "ml-6 py-1.5 text-xs",
        active
          ? "bg-primary text-primary-foreground font-semibold shadow-soft"
          : "text-sidebar-foreground/75 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon className="size-[16px] shrink-0" />
      <span className="truncate">{label}</span>
      {badge ? (
        <span
          className={cn(
            "ml-auto grid size-5 place-items-center rounded-full text-[10px] font-bold",
            active ? "bg-white/20 text-white" : "bg-destructive text-destructive-foreground",
          )}
        >
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

function MobileLink({
  to,
  params,
  active,
  icon: Icon,
  label,
}: {
  to: string;
  params?: Record<string, string>;
  active: boolean;
  icon: typeof LayoutDashboard;
  label: string;
}) {
  return (
    <Link
      to={to}
      params={params}
      className={cn(
        "flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] transition-colors",
        active ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/70",
      )}
    >
      <Icon className={cn("size-[18px]", active && "text-accent")} />
      <span className="max-w-full truncate px-1">{label}</span>
    </Link>
  );
}
