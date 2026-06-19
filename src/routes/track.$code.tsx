import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  Bell,
  Building2,
  CalendarClock,
  CheckCircle2,
  Circle,
  Clock,
  FileWarning,
  Landmark,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/track/$code")({
  head: () => ({
    meta: [
      { title: "Gjurmim dosjeje — Smart Dossier" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "description",
        content:
          "Gjurmoni statusin e dosjes suaj në kohë reale. Smart Dossier — portali për qytetarin.",
      },
    ],
  }),
  component: TrackPage,
});

type Phase = {
  order: number;
  title: string;
  institution: string;
  state: "completed" | "current" | "upcoming";
};
type CitizenDeadline = {
  label: string;
  dueAt: string;
  kind: "legal" | "external";
  daysRemaining: number;
};
type TrackPayload = {
  trackingCode: string;
  process: string;
  processKind: "ekb_privatization" | "expropriation";
  status: string;
  currentPhase: { number: number; title: string; institution: string; description: string };
  phasesTimeline: Phase[];
  nextMilestone: string | null;
  nextInstitution: string | null;
  isFinal: boolean;
  deadline: {
    label: string;
    dueAt: string;
    daysRemaining: number;
    state: "ok" | "due_soon" | "overdue";
  } | null;
  citizenDeadlines: CitizenDeadline[];
  missingDocuments: { type: string; label: string }[];
  notifications: { at: string; action: string }[];
  updatedAt: string;
};

const STATUS_SQ: Record<string, string> = {
  draft: "Në hartim",
  in_progress: "Në proces",
  blocked: "E bllokuar",
  awaiting_external: "Në pritje të institucionit",
  completed: "E përfunduar",
  rejected: "E refuzuar",
};

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("sq-AL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
function fmtDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("sq-AL", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function TrackPage() {
  const { code } = Route.useParams();
  const [data, setData] = useState<TrackPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/public/track/${encodeURIComponent(code)}`, {
        cache: "no-store",
      });
      if (!r.ok) {
        setError(r.status === 404 ? "Kodi nuk u gjet" : "Gabim gjatë ngarkimit");
        setData(null);
      } else {
        setData((await r.json()) as TrackPayload);
      }
    } catch {
      setError("Gabim rrjeti");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/40 to-background">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur bg-background/85 border-b">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-8 shrink-0 rounded-md bg-primary text-primary-foreground grid place-items-center">
              <ShieldCheck className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">Smart Dossier</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Portali për qytetarin
              </div>
            </div>
          </div>
          <Button size="sm" variant="ghost" onClick={load} disabled={loading} aria-label="Rifresko">
            <RefreshCw className={cn("size-4", loading && "animate-spin")} />
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-5 space-y-4 pb-12">
        {/* Code card */}
        <Card className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Kodi i gjurmimit
              </div>
              <div className="font-mono text-lg font-bold tracking-tight break-all">{code}</div>
            </div>
            {data && (
              <Badge
                variant="secondary"
                className={cn(
                  "shrink-0 text-[11px]",
                  data.status === "completed" && "bg-success/15 text-success border-success/20",
                  data.status === "blocked" &&
                    "bg-destructive/15 text-destructive border-destructive/20",
                  data.status === "awaiting_external" &&
                    "bg-warning/15 text-warning-foreground border-warning/30",
                )}
              >
                {STATUS_SQ[data.status] ?? data.status}
              </Badge>
            )}
          </div>
          {data && (
            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
              <Landmark className="size-3.5" /> {data.process}
            </div>
          )}
        </Card>

        {error && (
          <Card className="p-4 border-destructive/30 bg-destructive/5">
            <div className="flex items-start gap-2 text-sm">
              <AlertCircle className="size-4 mt-0.5 text-destructive" />
              <div>
                <div className="font-medium text-destructive">{error}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Kontrolloni kodin dhe provoni sërish.
                </p>
              </div>
            </div>
          </Card>
        )}

        {loading && !data && !error && (
          <Card className="p-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Duke ngarkuar…
          </Card>
        )}

        {data && (
          <>
            {/* Current status */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "size-8 rounded-md grid place-items-center shrink-0",
                    data.isFinal ? "bg-success/15 text-success" : "bg-primary/10 text-primary",
                  )}
                >
                  {data.isFinal ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <Clock className="size-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Faza aktuale
                  </div>
                  <div className="text-sm font-semibold truncate">
                    {data.currentPhase.number}. {data.currentPhase.title}
                  </div>
                </div>
              </div>
              {data.currentPhase.description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {data.currentPhase.description}
                </p>
              )}
              <div className="flex items-center gap-1.5 text-xs">
                <Building2 className="size-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Institucioni:</span>
                <span className="font-medium">{data.currentPhase.institution}</span>
              </div>

              {!data.isFinal && data.nextMilestone && (
                <div className="rounded-md border bg-muted/40 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Hapi tjetër i pritshëm
                  </div>
                  <div className="text-sm font-medium mt-0.5">{data.nextMilestone}</div>
                  {data.nextInstitution && (
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Përgjegjës: {data.nextInstitution}
                    </div>
                  )}
                </div>
              )}
              {data.isFinal && (
                <div className="rounded-md border border-success/30 bg-success/10 p-3 text-success text-sm flex items-center gap-2">
                  <CheckCircle2 className="size-4" /> Procedura është mbyllur.
                </div>
              )}
            </Card>

            {/* Phases timeline */}
            <Card className="p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
                Rrugëtimi
              </div>
              <ol className="relative space-y-3">
                {data.phasesTimeline.map((p, i) => {
                  const isLast = i === data.phasesTimeline.length - 1;
                  return (
                    <li key={p.order} className="relative flex gap-3">
                      <div className="relative flex flex-col items-center">
                        <div
                          className={cn(
                            "size-6 rounded-full grid place-items-center text-[10px] font-semibold shrink-0",
                            p.state === "completed" && "bg-success text-success-foreground",
                            p.state === "current" &&
                              "bg-primary text-primary-foreground ring-4 ring-primary/15",
                            p.state === "upcoming" && "bg-muted text-muted-foreground border",
                          )}
                        >
                          {p.state === "completed" ? (
                            <CheckCircle2 className="size-3.5" />
                          ) : p.state === "current" ? (
                            <Circle className="size-2.5 fill-current" />
                          ) : (
                            p.order
                          )}
                        </div>
                        {!isLast && (
                          <div
                            className={cn(
                              "w-px flex-1 mt-1 min-h-[18px]",
                              p.state === "completed" ? "bg-success/40" : "bg-border",
                            )}
                          />
                        )}
                      </div>
                      <div className="min-w-0 pb-2">
                        <div
                          className={cn(
                            "text-sm",
                            p.state === "current" ? "font-semibold" : "font-medium",
                            p.state === "upcoming" && "text-muted-foreground",
                          )}
                        >
                          {p.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{p.institution}</div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </Card>

            {/* Missing documents */}
            {data.missingDocuments.length > 0 && (
              <Card className="p-4 border-warning/30 bg-warning/5">
                <div className="flex items-center gap-2 mb-2">
                  <FileWarning className="size-4 text-warning-foreground" />
                  <div className="text-sm font-semibold">Dokumente që kërkohen prej jush</div>
                </div>
                <ul className="space-y-1.5">
                  {data.missingDocuments.map((doc) => (
                    <li key={doc.type} className="flex items-start gap-2 text-sm leading-snug">
                      <Circle className="size-2 mt-2 shrink-0 fill-warning-foreground/60 text-warning-foreground/60" />
                      <span>{doc.label}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-muted-foreground mt-3">
                  Dorëzoni këto dokumente në sportelin e institucionit përgjegjës ose përmes
                  e-Albania kur është e mundur.
                </p>
              </Card>
            )}

            {/* Deadlines */}
            {(data.citizenDeadlines.length > 0 || data.deadline) && (
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarClock className="size-4 text-muted-foreground" />
                  <div className="text-sm font-semibold">Afatet që ju interesojnë</div>
                </div>
                <ul className="space-y-2">
                  {data.citizenDeadlines.map((dl) => (
                    <DeadlineRow
                      key={dl.label + dl.dueAt}
                      label={dl.label}
                      dueAt={dl.dueAt}
                      daysRemaining={dl.daysRemaining}
                      kind={dl.kind === "legal" ? "Afat ligjor" : "Institucional"}
                    />
                  ))}
                  {data.citizenDeadlines.length === 0 && data.deadline && (
                    <DeadlineRow
                      label={data.deadline.label}
                      dueAt={data.deadline.dueAt}
                      daysRemaining={data.deadline.daysRemaining ?? 0}
                      kind="Afat"
                    />
                  )}
                </ul>
              </Card>
            )}

            {/* Notifications */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="size-4 text-muted-foreground" />
                <div className="text-sm font-semibold">Njoftime</div>
              </div>
              {data.notifications.length === 0 ? (
                <p className="text-xs text-muted-foreground">Ende nuk ka njoftime publike.</p>
              ) : (
                <ul className="space-y-2">
                  {data.notifications.map((n, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 border-l-2 border-primary/30 pl-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-sm leading-snug">{n.action}</div>
                        <div className="text-[11px] text-muted-foreground">{fmtDateTime(n.at)}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <p className="text-[10px] text-center text-muted-foreground pt-2">
              Përditësuar së fundmi: {fmtDateTime(data.updatedAt)}
            </p>
          </>
        )}
      </main>
    </div>
  );
}

function DeadlineRow({
  label,
  dueAt,
  daysRemaining,
  kind,
}: {
  label: string;
  dueAt: string;
  daysRemaining: number;
  kind: string;
}) {
  const overdue = daysRemaining < 0;
  const soon = daysRemaining >= 0 && daysRemaining <= 7;
  return (
    <li className="flex items-start justify-between gap-3 rounded-md border p-2.5">
      <div className="min-w-0">
        <div className="text-sm font-medium leading-snug">{label}</div>
        <div className="text-[11px] text-muted-foreground mt-0.5">
          {kind} · {fmtDate(dueAt)}
        </div>
      </div>
      <Badge
        variant="secondary"
        className={cn(
          "shrink-0 text-[11px]",
          overdue && "bg-destructive/15 text-destructive border-destructive/20",
          soon && !overdue && "bg-warning/15 text-warning-foreground border-warning/30",
          !overdue && !soon && "bg-success/15 text-success border-success/20",
        )}
      >
        {overdue
          ? `${Math.abs(daysRemaining)} ditë vonesë`
          : daysRemaining === 0
            ? "Sot"
            : `${daysRemaining} ditë`}
      </Badge>
    </li>
  );
}
