import * as React from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
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
  LogOut,
  Plus,
  Scale,
  Settings,
  ShieldCheck,
  UserCog,
  UserRound,
} from "lucide-react";
import { CitizenVirtualAgent } from "@/components/citizen-virtual-agent";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDemoRole } from "@/lib/demo-access";
import { cn } from "@/lib/utils";

const roleIcons = {
  admin: ShieldCheck,
  operator: UserCog,
  citizen: UserRound,
  business: Building2,
} as const;

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

function pageLabel(path: string) {
  if (path.startsWith("/dosja/")) return "Detaje dosje";
  if (path.startsWith("/dosjet")) return "Dosjet";
  if (path.startsWith("/raporte")) return "Raporte";
  if (path.startsWith("/faq")) return "FAQ";
  if (path.startsWith("/aplikim/dokumentacion")) return "Dokumentacioni";
  if (path.startsWith("/aplikim")) return "Aplikim i ri";
  if (path.startsWith("/biznes")) return "Regjistrim prone";
  if (path.startsWith("/track/")) return "Gjurmim qytetar";
  return "Dashboard";
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
  const navigate = useNavigate();
  const { role, profile, logout, can } = useDemoRole();
  const path = loc.pathname;
  const RoleIcon = roleIcons[role];

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

  function handleLogout() {
    logout();
    void navigate({ to: "/login" });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Sidebar (desktop) ─────────────────────────────── */}
      <aside
        className="hidden md:flex fixed left-0 top-0 h-full w-[280px] flex-col z-50"
        style={{ background: "linear-gradient(180deg, #141c2b 0%, #101827 100%)" }}
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-7">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent/25 text-white group-hover:bg-accent/35 transition-colors">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <div className="text-base font-bold text-white tracking-tight leading-tight">
                Smart Dossier
              </div>
              <div className="text-[11px] text-white/45 font-mono tracking-widest uppercase">
                Dosja Inteligjente
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {role === "citizen" || role === "business" ? (
            <>
              <NavGroupLabel>Navigimi</NavGroupLabel>
              <NavItem to="/aplikim" active={applicationPortalActive} icon={Scale} label="Aplikim i ri" />
              <NavItem to="/aplikim/dokumentacion" active={applicationDocsActive} icon={FileUp} label="Dokumentacioni" nested />
              {role === "business" ? (
                <NavItem to="/biznes" active={businessPortalActive} icon={Building2} label="Regjistrim prone" />
              ) : (
                <NavItem to="/track/$code" params={{ code: "EKB-2026-000014" }} active={citizenPortalActive} icon={UserRound} label="Gjurmo aplikimin" />
              )}
              <NavItem to="/faq" active={faqActive} icon={HelpCircle} label="FAQ dhe AI" />
            </>
          ) : (
            <>
              <NavGroupLabel>Kryesore</NavGroupLabel>
              {primaryNav.map((item) => (
                <NavItem key={item.to} to={item.to} active={isActive(item)} icon={item.icon} label={item.label} badge={item.badge} />
              ))}
              <NavGroupLabel className="mt-4">Menaxhimi</NavGroupLabel>
              {managementNav.map((item) => (
                <NavItem key={item.to} to={item.to} active={isActive(item)} icon={item.icon} label={item.label} />
              ))}
            </>
          )}
        </nav>

        {/* "New Application" CTA */}
        {can("createDossier") && (
          <div className="px-3 pt-2">
            <Link
              to="/dosjet"
              className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent/90 text-white py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 shadow-lg shadow-accent/20"
            >
              <Plus className="size-4" />
              Aplikim i ri
            </Link>
          </div>
        )}

        {/* User profile footer */}
        <div className="px-3 py-4 mt-2 border-t border-white/[0.08]">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/[0.06] transition-colors">
            <div className="size-9 rounded-full bg-accent/30 flex items-center justify-center shrink-0 ring-2 ring-accent/20">
              <RoleIcon className="size-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white truncate">{profile.displayName}</div>
              <div className="text-[11px] text-white/45 truncate">{profile.credentialLabel}</div>
            </div>
          </div>
          <div className="flex gap-1.5 mt-2 px-2">
            <Link
              to="/login"
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-medium text-white/55 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <Settings className="size-3" />
              Ndrysho
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-medium text-white/55 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <LogOut className="size-3" />
              Dil
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────── */}
      <div className="md:ml-[280px] flex flex-col min-h-screen">
        {/* Desktop breadcrumb bar */}
        <div className="hidden md:flex h-11 items-center justify-between border-b border-border bg-surface/80 backdrop-blur-sm px-6 text-xs text-muted-foreground sticky top-0 z-30">
          <div className="flex items-center gap-1.5">
            <Home className="size-3.5 text-muted-foreground/60" />
            <ChevronRight className="size-3 text-muted-foreground/40" />
            <span className="font-semibold text-foreground">{pageLabel(path)}</span>
          </div>
          <NotificationsPopover notifications={notifications} />
        </div>

        {/* Mobile header */}
        <div
          className="flex items-center gap-3 px-4 py-3 text-white md:hidden"
          style={{ background: "linear-gradient(90deg, #141c2b, #101827)" }}
        >
          <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent/25 text-white">
            <ShieldCheck className="size-4" />
          </div>
          <span className="flex-1 text-sm font-bold truncate">Smart Dossier</span>
          <Link to="/login" className="text-[11px] text-white/60 hover:text-white transition-colors">
            {profile.displayName}
          </Link>
        </div>

        {/* Page content */}
        <main className="flex-1 pb-16 md:pb-0">
          {children}
        </main>
      </div>

      {/* ── Mobile bottom nav ─────────────────────────────── */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid border-t md:hidden"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          background: "#101827",
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
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

function NavGroupLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-white/30", className)}>
      {children}
    </div>
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
        "flex items-center gap-3 rounded-xl text-sm transition-all duration-150 select-none",
        nested ? "ml-5 py-2 px-3 text-xs" : "py-2.5 px-3",
        active
          ? "bg-accent text-white font-semibold shadow-md shadow-accent/20"
          : "text-white/60 hover:text-white hover:bg-white/[0.07]",
      )}
    >
      <Icon className={cn("shrink-0", nested ? "size-3.5" : "size-[18px]")} />
      <span className="truncate">{label}</span>
      {badge ? (
        <span className={cn("ml-auto grid size-5 place-items-center rounded-full text-[10px] font-bold", active ? "bg-white/20 text-white" : "bg-destructive/80 text-white")}>
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
        "flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
        active ? "text-accent" : "text-white/40",
      )}
    >
      <Icon className={cn("size-[20px]", active && "text-accent")} />
      <span className="truncate px-1">{label}</span>
    </Link>
  );
}

function NotificationsPopover({ notifications }: { notifications: ShellNotification[] }) {
  const count = notifications.length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
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
        <div className="border-b px-3 py-2.5">
          <div className="text-sm font-semibold">Njoftime</div>
          <div className="text-[11px] text-muted-foreground">
            {count ? `${count} njoftime aktive` : "Nuk ka njoftime të reja"}
          </div>
        </div>
        {count ? (
          <ul className="max-h-80 overflow-y-auto p-2 space-y-1">
            {notifications.map((n, i) => (
              <li key={n.id ?? i} className="rounded-lg border-l-2 border-accent/40 bg-muted/40 px-3 py-2 text-xs hover:bg-muted/70 transition-colors">
                <div className="font-medium text-foreground leading-snug">{n.title}</div>
                {n.meta ? <div className="mt-0.5 text-[11px] text-muted-foreground">{n.meta}</div> : null}
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-xs text-muted-foreground text-center">
            Njoftimet e dosjes shfaqen këtu kur të ketë përditësime.
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
