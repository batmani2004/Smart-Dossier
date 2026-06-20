import * as React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Building2,
  FileUp,
  FolderKanban,
  HelpCircle,
  LayoutDashboard,
  Plus,
  Scale,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { CitizenVirtualAgent } from "@/components/citizen-virtual-agent";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RoleSwitcher } from "@/components/role-switcher";
import { useDemoRole } from "@/lib/demo-access";
import { cn } from "@/lib/utils";

const primaryNav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
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
  { to: "/faq", label: "Ndihmë & FAQ", icon: HelpCircle },
] satisfies { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[];

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
  const { role, profile, can } = useDemoRole();
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
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className="hidden md:flex fixed left-0 top-0 h-full flex-col z-50 border-r border-sidebar-border"
        style={{
          width: "280px",
          background: "linear-gradient(180deg, #141c2b 0%, #101827 100%)",
        }}
      >
        {/* Logo */}
        <div className="px-6 pt-7 pb-8">
          <div className="flex items-center gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent/20 text-white">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <div className="text-[17px] font-bold text-white leading-tight tracking-tight">
                Smart Dossier
              </div>
              <div className="text-[11px] text-white/50 font-mono tracking-wider">
                Dosja Inteligjente
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {role === "citizen" || role === "business" ? (
            <>
              <NavItem to="/aplikim" active={applicationPortalActive} icon={Scale} label="Aplikim i ri" />
              <NavItem to="/aplikim/dokumentacion" active={applicationDocsActive} icon={FileUp} label="Dokumentacioni" nested />
              {role === "business" ? (
                <NavItem to="/biznes" active={businessPortalActive} icon={Building2} label="Regjistrim prone" />
              ) : (
                <NavItem to="/track/$code" params={{ code: "EKB-2026-000014" }} active={citizenPortalActive} icon={UserRound} label="Gjurmim qytetar" />
              )}
              <NavItem to="/faq" active={faqActive} icon={HelpCircle} label="FAQ dhe AI" />
            </>
          ) : (
            <>
              {primaryNav.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  active={isActive(item)}
                  icon={item.icon}
                  label={item.label}
                  badge={item.badge}
                />
              ))}
              <div className="my-3 border-t border-white/8" />
              {managementNav.map((item) => (
                <NavItem
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

        {/* Bottom section */}
        <div className="px-3 pb-6 space-y-2">
          {can("createDossier") ? (
            <Link
              to="/dosjet"
              className="w-full flex items-center justify-center gap-2 bg-accent text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors"
            >
              <Plus className="size-4" />
              Aplikim i ri
            </Link>
          ) : null}

          <div className="border-t border-white/8 pt-3 space-y-1">
            <div className="flex items-center gap-2 px-3 py-1.5 text-white/50 text-xs">
              <span>AL | EN</span>
            </div>
            <Link
              to="/login"
              className="flex items-center gap-2 px-3 py-1.5 text-white/60 hover:text-white text-sm transition-colors rounded-lg hover:bg-white/5"
            >
              <Settings className="size-4" />
              <span>Cilësimet</span>
            </Link>
          </div>

          {/* User profile */}
          <div className="border-t border-white/8 pt-3">
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
              <div className="size-9 rounded-full bg-accent/30 flex items-center justify-center shrink-0">
                <UserRound className="size-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-white truncate">
                  {profile?.displayName ?? "Përdoruesi"}
                </div>
                <div className="text-[11px] text-white/50 truncate">
                  {profile?.credentialLabel ?? role}
                </div>
              </div>
              <RoleSwitcher compact variant="sidebar" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        className="flex-1 min-w-0 bg-background pb-16 md:pb-0"
        style={{ marginLeft: "280px" }}
      >
        {/* Desktop top bar */}
        <div className="hidden md:flex h-12 items-center justify-between border-b border-border bg-surface px-6 text-xs text-muted-foreground sticky top-0 z-30">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            Smart Dossier
          </div>
          <NotificationsPopover notifications={notifications} />
        </div>

        {/* Mobile header */}
        <div className="flex items-center gap-3 border-b border-border bg-sidebar px-4 py-3 text-white md:hidden">
          <div className="size-7 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="size-4" />
          </div>
          <span className="flex-1 text-sm font-bold truncate">Smart Dossier</span>
          <RoleSwitcher compact variant="header" />
        </div>

        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-sidebar-border bg-sidebar text-white md:hidden">
        {role === "citizen" || role === "business" ? (
          <>
            <MobileLink to="/aplikim" active={applicationPortalActive || applicationDocsActive} icon={Scale} label="Aplikim" />
            {role === "business" ? (
              <MobileLink to="/biznes" active={businessPortalActive} icon={Building2} label="Regjistrim" />
            ) : (
              <MobileLink to="/track/$code" params={{ code: "EKB-2026-000014" }} active={citizenPortalActive} icon={UserRound} label="Gjurmim" />
            )}
            <MobileLink to="/faq" active={faqActive} icon={HelpCircle} label="FAQ" />
          </>
        ) : (
          <>
            {[...primaryNav, managementNav[0]].map((item) => (
              <MobileLink key={item.to} to={item.to} active={isActive(item)} icon={item.icon} label={item.label} />
            ))}
          </>
        )}
      </nav>

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
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors"
          aria-label="Hap njoftimet"
        >
          <Bell className="size-3.5" />
          Njoftime
          <span className="grid size-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-white">
            {count}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b px-3 py-2">
          <div className="text-sm font-semibold">Njoftime</div>
          <div className="text-[11px] text-muted-foreground">
            {count ? `${count} njoftime publike` : "Nuk ka njoftime të reja"}
          </div>
        </div>
        {count ? (
          <ul className="max-h-80 overflow-y-auto p-2">
            {notifications.map((notification, index) => (
              <li key={notification.id ?? index} className="rounded-md border-l-2 border-primary/35 px-2 py-2 text-xs hover:bg-muted/60">
                <div className="leading-snug text-foreground">{notification.title}</div>
                {notification.meta ? (
                  <div className="mt-1 text-[11px] text-muted-foreground">{notification.meta}</div>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-3 text-xs text-muted-foreground">
            Njoftimet e dosjes do të shfaqen këtu kur të ketë përditësime.
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function NavItem({
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
        "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-150",
        nested && "ml-5 py-2 text-xs",
        active
          ? "bg-accent text-white font-semibold"
          : "text-white/65 hover:text-white hover:bg-white/8",
      )}
    >
      <Icon className={cn("shrink-0", nested ? "size-3.5" : "size-[18px]")} />
      <span className="truncate">{label}</span>
      {badge ? (
        <span className={cn("ml-auto grid size-5 place-items-center rounded-full text-[10px] font-bold", active ? "bg-white/20 text-white" : "bg-destructive text-white")}>
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
        active ? "text-accent" : "text-white/50",
      )}
    >
      <Icon className={cn("size-[18px]", active && "text-accent")} />
      <span className="max-w-full truncate px-1">{label}</span>
    </Link>
  );
}
