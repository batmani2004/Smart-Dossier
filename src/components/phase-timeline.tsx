import { Check, Circle, AlertTriangle, Clock } from "lucide-react";
import type { Phase } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PhaseTimeline({
  phases,
  activeId,
  onSelect,
}: {
  phases: Phase[];
  activeId?: string;
  onSelect?: (id: string) => void;
}) {
  return (
    <ol className="space-y-1.5">
      {phases.map((p, i) => {
        const isLast = i === phases.length - 1;
        const isActive = activeId
          ? p.id === activeId
          : p.status === "ne_proces" || p.status === "bllokuar";
        return (
          <li key={p.id} className="relative">
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[14px] top-7 bottom-[-6px] w-px",
                  p.status === "kryer" ? "bg-success/50" : "bg-border",
                )}
              />
            )}
            <button
              type="button"
              onClick={() => onSelect?.(p.id)}
              className={cn(
                "w-full text-left flex gap-2.5 p-2 rounded-md border transition-colors",
                isActive
                  ? "border-primary/30 bg-primary/[0.03]"
                  : "border-transparent hover:bg-muted/60",
              )}
            >
              <div
                className={cn(
                  "size-7 shrink-0 rounded-full grid place-items-center border",
                  p.status === "kryer" && "bg-success text-success-foreground border-success",
                  p.status === "ne_proces" && "bg-primary text-primary-foreground border-primary",
                  p.status === "bllokuar" &&
                    "bg-destructive text-destructive-foreground border-destructive",
                  p.status === "pa_filluar" && "bg-card text-muted-foreground border-border",
                )}
              >
                {p.status === "kryer" && <Check className="size-3.5" />}
                {p.status === "ne_proces" && <Clock className="size-3.5" />}
                {p.status === "bllokuar" && <AlertTriangle className="size-3.5" />}
                {p.status === "pa_filluar" && <Circle className="size-2.5" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    PHASE {p.numri}
                  </span>
                  <span className="text-[13px] font-medium text-foreground">{p.titulli}</span>
                  {p.manual && (
                    <span className="text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-warning/15 text-warning-foreground border border-warning/30">
                      Manual
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                  {p.institucion} · {p.pershkrim}
                </div>
                {p.pikaKritike && (
                  <div className="mt-1 text-[11px] text-destructive flex items-start gap-1.5">
                    <AlertTriangle className="size-3 mt-0.5 shrink-0" />
                    <span>{p.pikaKritike}</span>
                  </div>
                )}
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
