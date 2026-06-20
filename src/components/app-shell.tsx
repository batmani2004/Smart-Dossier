import * as React from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Building2,
  ChevronRight,
  ChevronsUpDown,
  FileUp,
  FolderKanban,
  HelpCircle,
  Home,
  Info,
  LayoutDashboard,
  Loader2,
  LogOut,
  MessageSquare,
  Plus,
  Scale,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserCog,
  UserRound,
} from "lucide-react";
import { CitizenVirtualAgent } from "@/components/citizen-virtual-agent";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { type DemoRole, useDemoRole } from "@/lib/demo-access";
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
  { to: "/faq", label: "Pyetje te shpeshta", icon: HelpCircle },
] satisfies { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[];

function pageLabel(path: string) {
  if (path.startsWith("/dosja/")) return "Detaje dosje";
  if (path.startsWith("/dosjet")) return "Dosjet";
  if (path.startsWith("/raporte")) return "Raporte";
  if (path.startsWith("/faq")) return "Pyetje te shpeshta";
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
              <NavItem
                to="/aplikim"
                active={applicationPortalActive}
                icon={Scale}
                label="Aplikim i ri"
              />
              <NavItem
                to="/aplikim/dokumentacion"
                active={applicationDocsActive}
                icon={FileUp}
                label="Dokumentacioni"
                nested
              />
              {role === "business" ? (
                <NavItem
                  to="/biznes"
                  active={businessPortalActive}
                  icon={Building2}
                  label="Regjistrim prone"
                />
              ) : (
                <NavItem
                  to="/track/$code"
                  params={{ code: "EKB-2026-000014" }}
                  active={citizenPortalActive}
                  icon={UserRound}
                  label="Gjurmo aplikimin"
                />
              )}
              <NavItem to="/faq" active={faqActive} icon={HelpCircle} label="Pyetje te shpeshta" />
            </>
          ) : (
            <>
              <NavGroupLabel>Kryesore</NavGroupLabel>
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
              <NavGroupLabel className="mt-4">Menaxhimi</NavGroupLabel>
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

        {/* "New Application" CTA — citizens only */}
        {(role === "citizen" || role === "business") && (
          <div className="px-3 pt-2">
            <Link
              to="/aplikim"
              className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent/90 text-white py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 shadow-lg shadow-accent/20"
            >
              <Plus className="size-4" />
              Aplikim i ri
            </Link>
          </div>
        )}

        {/* User widget — popup menu */}
        <div className="px-3 pb-4 pt-3 mt-auto">
          <UserMenuPopover
            role={role}
            profile={profile}
            RoleIcon={RoleIcon}
            onLogout={handleLogout}
          />
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────── */}
      <div className="md:ml-[280px] flex flex-col min-h-screen">
        {/* Desktop breadcrumb bar */}
        <div className="hidden md:flex h-11 items-center justify-between border-b border-border bg-surface/80 backdrop-blur-sm px-6 sticky top-0 z-30">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              <Home className="size-3.5" />
            </Link>
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
          <Link
            to="/login"
            className="text-[11px] text-white/60 hover:text-white transition-colors"
          >
            {profile.displayName}
          </Link>
        </div>

        {/* Page content */}
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
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
            <MobileLink to="/faq" active={faqActive} icon={HelpCircle} label="Pyetje te shpeshta" />
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

      {showCitizenAgent ? <CitizenVirtualAgent /> : null}
    </div>
  );
}

function NavGroupLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-white/30",
        className,
      )}
    >
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
        <span
          className={cn(
            "ml-auto grid size-5 place-items-center rounded-full text-[10px] font-bold",
            active ? "bg-white/20 text-white" : "bg-destructive/80 text-white",
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
              <li
                key={n.id ?? i}
                className="rounded-lg border-l-2 border-accent/40 bg-muted/40 px-3 py-2 text-xs hover:bg-muted/70 transition-colors"
              >
                <div className="font-medium text-foreground leading-snug">{n.title}</div>
                {n.meta ? (
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{n.meta}</div>
                ) : null}
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

async function callAi(prompt: string): Promise<string> {
  try {
    const res = await fetch("/api/ai/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "_platform_", _prompt: prompt }),
    });
    const d = (await res.json()) as { summary?: string };
    if (d.summary) return d.summary;
  } catch {
    return "";
  }
  return "";
}

const SETTINGS_CONTENT = `**Smart Dossier — Cilësimet e platformës**

• **Gjuha:** Shqip (sq-AL)
• **Zona kohore:** UTC+2 (Tiranë, Shqipëri)
• **Njoftime:** Aktivizuara për dosjet me alarme kritike
• **Ruajtja automatike:** Çdo 30 sekonda
• **Auditimi:** I aktivizuar — çdo veprim regjistrohet
• **Roli aktual:** Nëpunës civil — Dosje pronësore
• **Versioni i AI:** GPT-4o-mini (ekstraktim + asistencë)
• **Siguria:** Sesion i enkriptuar, të dhëna vetëm në server

*Cilësimet e avancuara administrohen nga administratori i sistemit.*`;

const ABOUT_CONTENT = `**Smart Dossier — Platforma e Menaxhimit të Dosjeve**

Smart Dossier është një platformë e digjitalizuar për procesin e privatizimit të banesave (EKB) dhe shpronësimit në Shqipëri.

**Çfarë bën AI në këtë platformë:**
• Lexon dhe nxjerr automatikisht të dhëna nga dokumentet e ngarkuara
• Sugjeron hapin tjetër bazuar në procesin ligjor
• Paralajmëron për pikat kritike dhe vonesat e mundshme
• Gjeneron përmbledhje për menaxherin në 3–5 fjali
• Përgjigjet pyetjeve të nëpunësit vetëm duke u bazuar në burime ligjore

**Teknologjia:** TanStack Start · React 19 · Tailwind v4 · OpenAI GPT-4o-mini

**Versioni:** v2.0 — Hakaton AI 2026
**Zhvilluar nga:** Innovation4Albania`;

function UserMenuPopover({
  role,
  profile,
  RoleIcon,
  onLogout,
}: {
  role: DemoRole;
  profile: { displayName: string; credentialLabel: string };
  RoleIcon: typeof UserRound;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState<"settings" | "about" | "njoftime" | null>(null);
  const [aiSettings, setAiSettings] = useState<string | null>(null);
  const [aiAbout, setAiAbout] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  async function openDialog(type: "settings" | "about" | "njoftime") {
    setOpen(false);
    setDialog(type);
    if (type === "settings" && !aiSettings) {
      setLoadingAi(true);
      const text = await callAi(
        "Gjenero cilësimet e platformës Smart Dossier për nëpunësin civil.",
      );
      setAiSettings(text || SETTINGS_CONTENT);
      setLoadingAi(false);
    }
    if (type === "about" && !aiAbout) {
      setLoadingAi(true);
      const text = await callAi(
        "Gjenero një përshkrim të shkurtër të platformës Smart Dossier dhe rolit të AI.",
      );
      setAiAbout(text || ABOUT_CONTENT);
      setLoadingAi(false);
    }
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-150 hover:bg-white/[0.07] group"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <div className="relative shrink-0">
              <div className="size-9 rounded-full flex items-center justify-center bg-gradient-to-br from-accent/60 to-accent/30 ring-2 ring-accent/20">
                <RoleIcon className="size-4 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-success border-2 border-[#101827]" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <div className="text-sm font-semibold text-white truncate leading-tight">
                {profile.displayName}
              </div>
              <div className="text-[11px] text-white/45 truncate">{profile.credentialLabel}</div>
            </div>
            <ChevronsUpDown className="size-3.5 text-white/30 group-hover:text-white/60 transition-colors shrink-0" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          side="top"
          align="start"
          sideOffset={8}
          className="w-60 p-0 overflow-hidden"
          style={{ background: "#1a2540", border: "1px solid rgba(255,255,255,0.10)" }}
        >
          {/* User header */}
          <div
            className="px-4 py-3 flex items-center gap-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="size-8 rounded-full flex items-center justify-center bg-gradient-to-br from-accent/60 to-accent/30 shrink-0">
              <RoleIcon className="size-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">{profile.displayName}</div>
              <div className="text-[10px] text-white/45 truncate">{profile.credentialLabel}</div>
            </div>
          </div>

          {/* Menu items */}
          <div className="px-2 py-2 space-y-0.5">
            <MenuItem
              icon={Bell}
              label="Njoftime"
              desc="Alarme dhe përditësime"
              onClick={() => openDialog("njoftime")}
            />
            <MenuItem
              icon={Settings2}
              label="Cilësimet"
              desc="Preferencat e platformës"
              onClick={() => openDialog("settings")}
              badge="AI"
            />
            <MenuItem
              icon={Info}
              label="Rreth platformës"
              desc="Smart Dossier v2.0"
              onClick={() => openDialog("about")}
              badge="AI"
            />
          </div>

          <div className="px-2 pb-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2 mt-1.5 rounded-xl text-sm text-white/55 hover:text-white hover:bg-destructive/15 transition-all duration-150 group"
            >
              <LogOut className="size-4 shrink-0 text-destructive/60 group-hover:text-destructive transition-colors" />
              <span>Dil nga llogaria</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Settings dialog */}
      <Dialog open={dialog === "settings"} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings2 className="size-4 text-accent" />
              Cilësimet
              <span className="ml-auto text-[10px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="size-2.5" /> AI
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm leading-relaxed">
            {loadingAi ? (
              <div className="flex items-center gap-2 text-muted-foreground py-6 justify-center">
                <Loader2 className="size-4 animate-spin" />
                <span>Po gjenerohet nga AI…</span>
              </div>
            ) : (
              <div className="space-y-2 text-foreground/90 whitespace-pre-wrap">
                {(aiSettings || SETTINGS_CONTENT).split("\n").map((line, i) => (
                  <p
                    key={i}
                    className={
                      line.startsWith("**") && line.endsWith("**")
                        ? "font-semibold text-foreground"
                        : ""
                    }
                  >
                    {line.replace(/\*\*/g, "")}
                  </p>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* About dialog */}
      <Dialog open={dialog === "about"} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="size-4 text-accent" />
              Rreth platformës
              <span className="ml-auto text-[10px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="size-2.5" /> AI
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm leading-relaxed">
            {loadingAi ? (
              <div className="flex items-center gap-2 text-muted-foreground py-6 justify-center">
                <Loader2 className="size-4 animate-spin" />
                <span>Po gjenerohet nga AI…</span>
              </div>
            ) : (
              <div className="space-y-2 text-foreground/90">
                {(aiAbout || ABOUT_CONTENT).split("\n").map((line, i) => (
                  <p
                    key={i}
                    className={
                      line.startsWith("**") && line.endsWith("**")
                        ? "font-semibold text-foreground"
                        : ""
                    }
                  >
                    {line.replace(/\*\*/g, "")}
                  </p>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications dialog */}
      <Dialog open={dialog === "njoftime"} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="size-4 text-accent" />
              Njoftime
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {[
              {
                title: "EKB-2026-000014 — alarm kritik",
                meta: "Certifikata familjare mungon · Tani",
                color: "border-destructive/50 bg-destructive/5",
              },
              {
                title: "3 dosje me afat brenda 7 ditëve",
                meta: "Shpronësim · Sot",
                color: "border-warning/50 bg-warning/5",
              },
              {
                title: "AI ekstraktoi dokumentin me 92% besueshmëri",
                meta: "EXP-2026-000003 · 2 orë më parë",
                color: "border-accent/30 bg-accent/5",
              },
            ].map((n, i) => (
              <div key={i} className={cn("rounded-xl border px-3 py-2.5", n.color)}>
                <div className="text-sm font-medium text-foreground">{n.title}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{n.meta}</div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function MenuItem({
  icon: Icon,
  label,
  desc,
  onClick,
  badge,
}: {
  icon: typeof Bell;
  label: string;
  desc: string;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all duration-150 hover:bg-white/[0.07] group"
    >
      <div className="size-7 rounded-lg flex items-center justify-center bg-white/[0.06] group-hover:bg-accent/20 transition-colors shrink-0">
        <Icon className="size-3.5 text-white/60 group-hover:text-accent transition-colors" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm text-white/80 group-hover:text-white transition-colors font-medium">
          {label}
        </div>
        <div className="text-[10px] text-white/35">{desc}</div>
      </div>
      {badge && (
        <span className="text-[9px] font-bold text-accent bg-accent/15 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shrink-0">
          <Sparkles className="size-2" />
          {badge}
        </span>
      )}
    </button>
  );
}
