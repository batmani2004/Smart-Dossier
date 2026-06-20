import { Link, useNavigate } from "@tanstack/react-router";
import { Building2, LogOut, ShieldCheck, UserCog, UserRound, UsersRound } from "lucide-react";
import { type DemoRole, useDemoRole } from "@/lib/demo-access";
import { cn } from "@/lib/utils";

const roleIcons = {
  admin: ShieldCheck,
  operator: UserCog,
  citizen: UserRound,
  business: Building2,
} satisfies Record<DemoRole, typeof ShieldCheck>;

export function RoleSwitcher({
  compact = false,
  variant = "sidebar",
}: {
  compact?: boolean;
  variant?: "sidebar" | "header";
}) {
  const navigate = useNavigate();
  const { role, profile, logout } = useDemoRole();
  const Icon = roleIcons[role];

  function handleLogout() {
    logout();
    void navigate({ to: "/login" });
  }

  if (variant === "header") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-md border border-white/15 bg-white/10 text-white shadow-soft backdrop-blur",
          compact ? "max-w-[190px] px-2 py-1.5" : "min-w-[300px] px-2.5 py-2",
        )}
      >
        <div className="grid size-8 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground">
          <Icon className="size-4" />
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          {!compact ? (
            <div className="text-[10px] font-medium uppercase tracking-wider text-white/60">
              Perdoruesi aktiv
            </div>
          ) : null}
          <div className="truncate text-sm font-semibold">{profile.displayName}</div>
          <div className="truncate text-[11px] text-white/70">{profile.credentialLabel}</div>
        </div>
        {!compact ? (
          <Link
            to="/login"
            className="rounded-md border border-white/15 px-2 py-1 text-[11px] font-semibold text-white/85 transition-colors hover:bg-white/10 hover:text-white"
          >
            Ndrysho
          </Link>
        ) : null}
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "inline-flex items-center justify-center rounded-md border border-white/15 font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-white",
            compact ? "size-8" : "h-8 gap-1.5 px-2 text-xs",
          )}
          title="Dil"
          aria-label="Dil nga profili"
        >
          <LogOut className="size-3.5" />
          {!compact ? <span>Dil</span> : null}
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-md border bg-sidebar-accent/40 border-sidebar-border",
        compact ? "p-2" : "p-2.5",
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="size-7 rounded-md bg-accent text-accent-foreground grid place-items-center shrink-0">
          <Icon className="size-3.5" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">
            Perdoruesi aktiv
          </div>
          <div className="text-xs font-semibold truncate">{profile.displayName}</div>
          <div className="text-[11px] text-sidebar-foreground/70 truncate">
            {profile.credentialLabel}
          </div>
        </div>
      </div>

      {!compact && (
        <>
          <Link
            to="/login"
            className="mt-2 flex h-8 items-center justify-center rounded-md bg-primary px-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ndrysho hyrjen
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex h-8 w-full items-center justify-center gap-1.5 rounded-md border border-sidebar-border px-2 text-xs font-semibold text-sidebar-foreground transition-colors hover:bg-sidebar-accent/60"
          >
            <LogOut className="size-3.5" />
            Dil
          </button>
          <p className="mt-2 text-[11px] leading-snug text-sidebar-foreground/75">
            {profile.description}
          </p>
        </>
      )}
    </div>
  );
}

export function AccessNotice({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-md border border-warning/30 bg-warning/10 p-3 text-sm">
      <div className="flex items-center gap-2 font-medium text-warning-foreground">
        <UsersRound className="size-4" />
        {title}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{body}</p>
    </div>
  );
}
