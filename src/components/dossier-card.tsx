import { Link } from "@tanstack/react-router";
import { Building2, MapPin, Calendar, AlertTriangle } from "lucide-react";
import type { Dossier } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function DossierCard({ d }: { d: Dossier }) {
  const proces = d.procesi === "shpronesim" ? "Expropriation" : "HCA Privatization";
  const faza = d.fazat.find((f) => f.id === d.fazaAktualeId);
  const bllokuar = faza?.status === "bllokuar";
  const totale = d.fazat.length;

  let afatDite: number | null = null;
  if (d.afatLigjor) {
    afatDite = Math.ceil((new Date(d.afatLigjor).getTime() - Date.now()) / 86_400_000);
  }

  return (
    <Link
      to="/dosja/$id"
      params={{ id: d.id }}
      className="surface-card p-3 flex flex-col gap-2.5 hover:shadow-lift transition-shadow hover:border-primary/30"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[10px] font-mono text-muted-foreground tracking-wider">{d.kodi}</div>
          <h3 className="text-[13px] font-semibold leading-snug text-foreground mt-0.5 line-clamp-2">
            {d.titulli}
          </h3>
        </div>
        <Badge
          variant="outline"
          className={
            "shrink-0 text-[10px] " +
            (d.procesi === "shpronesim"
              ? "border-info/40 text-info bg-info/5"
              : "border-accent/40 text-accent-foreground bg-accent/10")
          }
        >
          {proces}
        </Badge>
      </div>

      <div className="text-[11px] text-muted-foreground space-y-0.5">
        <div className="flex items-center gap-1.5">
          <Building2 className="size-3 shrink-0" />
          <span className="truncate">{d.qytetariEmri}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="size-3 shrink-0" />
          <span className="truncate">{d.pasuriaZona}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-border">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
          <span className="truncate">
            Phase{" "}
            <span className="font-medium text-foreground">
              {faza?.numri}/{totale}
            </span>{" "}
            · {faza?.titulli}
          </span>
          {bllokuar && (
            <span className="text-destructive flex items-center gap-1 font-medium shrink-0 ml-1">
              <AlertTriangle className="size-3" /> blocked
            </span>
          )}
        </div>
        <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={
              bllokuar
                ? "h-full bg-destructive"
                : faza?.numri === totale
                  ? "h-full bg-success"
                  : "h-full bg-primary"
            }
            style={{ width: `${((faza?.numri ?? 0) / totale) * 100}%` }}
          />
        </div>
        {afatDite !== null && (
          <div
            className={
              "mt-1.5 inline-flex items-center gap-1 text-[10px] " +
              (afatDite < 7 ? "text-destructive font-medium" : "text-muted-foreground")
            }
          >
            <Calendar className="size-3" />
            {afatDite < 0
              ? `Deadline passed ${-afatDite}d ago`
              : afatDite === 0
                ? "Deadline today"
                : `Due in ${afatDite}d`}
          </div>
        )}
      </div>
    </Link>
  );
}
