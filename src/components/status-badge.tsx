import { cn } from "@/lib/utils";
import type { DossierStatus } from "@/core/types";

const STATUS_STYLES: Record<DossierStatus, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "bg-muted text-muted-foreground" },
  in_progress: { label: "Në proces", cls: "bg-info/15 text-info" },
  blocked: { label: "Bllokuar", cls: "bg-destructive/15 text-destructive" },
  awaiting_external: { label: "Pritje institucionale", cls: "bg-warning/15 text-warning" },
  completed: { label: "Mbyllur", cls: "bg-success/15 text-success" },
  rejected: { label: "Refuzuar", cls: "bg-destructive/15 text-destructive" },
};

export function StatusBadge({ status }: { status: DossierStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium",
        s.cls,
      )}
    >
      {s.label}
    </span>
  );
}

const SEV_STYLES = {
  info: "bg-info/15 text-info",
  warning: "bg-warning/15 text-warning",
  critical: "bg-destructive/15 text-destructive",
} as const;

export function SeverityBadge({
  severity,
  children,
}: {
  severity: "info" | "warning" | "critical";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium",
        SEV_STYLES[severity],
      )}
    >
      {children}
    </span>
  );
}

const PRIO_STYLES = {
  high: "bg-destructive/15 text-destructive",
  normal: "bg-warning/15 text-warning",
  low: "bg-muted text-muted-foreground",
} as const;

export function PriorityBadge({ priority }: { priority: "high" | "normal" | "low" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium capitalize",
        PRIO_STYLES[priority],
      )}
    >
      {priority === "high" ? "I lartë" : priority === "normal" ? "Normal" : "I ulët"}
    </span>
  );
}
