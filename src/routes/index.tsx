import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  FileText,
  FolderKanban,
  Loader2,
  MoreVertical,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  Wrench,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PriorityBadge, SeverityBadge, StatusBadge } from "@/components/status-badge";
import { Markdown } from "@/components/markdown";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { aiRiskBrief, getDashboard, listDossiers, resetDemo } from "@/lib/api/dossiers.functions";
import { PROCESSES } from "@/core";
import type { ProcessKind } from "@/core/types";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Smart Dossier" },
      { name: "description", content: "Paneli i nëpunësit civil për menaxhimin e dosjeve." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [processFilter, setProcessFilter] = useState<"all" | ProcessKind>("all");
  const [briefOpen, setBriefOpen] = useState(false);
  const dash = useServerFn(getDashboard);
  const list = useServerFn(listDossiers);
  const reset = useServerFn(resetDemo);
  const brief = useServerFn(aiRiskBrief);

  const briefQ = useQuery({
    queryKey: ["ai-risk-brief"],
    queryFn: () => brief(),
    enabled: briefOpen,
    staleTime: 5 * 60_000,
  });

  const dashQ = useQuery({ queryKey: ["dashboard"], queryFn: () => dash() });
  const listQ = useQuery({
    queryKey: ["dossiers", processFilter],
    queryFn: () =>
      list({
        data: processFilter === "all" ? {} : { process: processFilter },
      }),
  });

  const kpi = useMemo(() => {
    const d = dashQ.data;
    if (!d) return null;
    const active = (d.countsByStatus.in_progress ?? 0) + (d.countsByStatus.awaiting_external ?? 0);
    const blocked = d.countsByStatus.blocked ?? 0;
    const expiring7d = d.expiringDeadlines.filter(
      (x) => x.state === "due_soon" && (x.daysRemaining ?? 0) <= 7,
    ).length;
    const aiThisWeek = d.recentExtractions.length;
    return { active, blocked, expiring7d, aiThisWeek };
  }, [dashQ.data]);

  // Error toasts (one per error transition).
  useEffect(() => {
    if (dashQ.error) toast.error("Gabim gjatë ngarkimit të dashboard-it");
  }, [dashQ.error]);
  useEffect(() => {
    if (listQ.error) toast.error("Gabim gjatë ngarkimit të dosjeve");
  }, [listQ.error]);

  async function handleReset() {
    try {
      await reset();
      toast.success("Demo data u rifreskua");
      dashQ.refetch();
      listQ.refetch();
    } catch {
      toast.error("Reset dështoi");
    }
  }

  return (
    <AppShell>
      <div className="px-4 md:px-6 py-5 space-y-5 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight truncate">
              Paneli operacional
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Përmbledhje e dosjeve aktive, pengesave dhe afateve.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setBriefOpen(true)}
              data-testid="ai-risk-brief"
            >
              <ShieldAlert className="size-4 mr-1.5" />
              AI Risk Brief
            </Button>
            <Button size="sm" asChild>
              <Link to="/dosjet">Hap dosjet</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" aria-label="Demo / dev" data-testid="dev-menu">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-1.5 text-xs">
                  <Wrench className="size-3.5" /> Demo / Dev
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleReset}
                  data-testid="reset-demo"
                  className="text-xs"
                >
                  <RefreshCw className="size-3.5 mr-2" />
                  Reset demo data
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-xs">
                  <Link to="/track/$code" params={{ code: "EKB-2026-000014" }}>
                    <Sparkles className="size-3.5 mr-2" />
                    Hap track DEMO (EKB-2026-000014)
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3" data-testid="kpi-strip">
          <KpiCard
            icon={<FolderKanban className="size-4" />}
            label="Dosje aktive"
            value={kpi?.active}
            loading={dashQ.isLoading}
          />
          <KpiCard
            icon={<AlertTriangle className="size-4" />}
            label="Të bllokuara"
            value={kpi?.blocked}
            tone="critical"
            loading={dashQ.isLoading}
          />
          <KpiCard
            icon={<CalendarClock className="size-4" />}
            label="Afate në 7 ditë"
            value={kpi?.expiring7d}
            tone="warning"
            loading={dashQ.isLoading}
          />
          <KpiCard
            icon={<Sparkles className="size-4" />}
            label="Ekstraktime AI"
            value={kpi?.aiThisWeek}
            tone="info"
            loading={dashQ.isLoading}
          />
        </div>

        {/* Process toggle */}
        <ToggleGroup
          type="single"
          value={processFilter}
          onValueChange={(v) => v && setProcessFilter(v as typeof processFilter)}
          className="justify-start"
        >
          <ToggleGroupItem value="all" className="text-xs">
            Të gjitha
          </ToggleGroupItem>
          <ToggleGroupItem value="ekb_privatization" className="text-xs">
            Privatizim EKB
          </ToggleGroupItem>
          <ToggleGroupItem value="expropriation" className="text-xs">
            Shpronësim
          </ToggleGroupItem>
        </ToggleGroup>

        {/* Bottlenecks + Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="size-4 text-destructive" />
              <h2 className="text-sm font-semibold">Pengesat kritike</h2>
            </div>
            <div className="space-y-2">
              {dashQ.data?.bottlenecks.length ? (
                dashQ.data.bottlenecks.map((b) => (
                  <div
                    key={`${b.processKind}-${b.phaseId}`}
                    className="border-b last:border-0 py-2 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{b.phaseTitle}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {PROCESSES[b.processKind].title} · {b.total} dosje · ~{b.avgDaysInPhase}d
                          në fazë
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {b.stuck > 0 && (
                          <SeverityBadge severity="critical">{b.stuck} bllok.</SeverityBadge>
                        )}
                        <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                          score {b.score}
                        </span>
                      </div>
                    </div>
                    {b.alertLabels.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {b.alertLabels.map((l) => (
                          <Badge key={l} variant="outline" className="text-[10px] font-normal">
                            {l}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">Pa pengesa.</p>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <CalendarClock className="size-4 text-warning" />
              <h2 className="text-sm font-semibold">Afate që përfundojnë</h2>
            </div>
            <div className="space-y-2">
              {dashQ.data?.expiringDeadlines.length ? (
                dashQ.data.expiringDeadlines.map((d) => (
                  <Link
                    key={d.dossierId}
                    to="/dosja/$id"
                    params={{ id: d.dossierId }}
                    className="flex items-center justify-between gap-2 text-sm border-b last:border-0 py-1.5 hover:bg-muted/40 rounded px-1 -mx-1"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium">{d.label ?? "—"}</div>
                      <div className="text-xs text-muted-foreground truncate">{d.title}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div
                        className={
                          d.state === "overdue"
                            ? "text-xs font-semibold text-destructive"
                            : "text-xs font-semibold text-warning"
                        }
                      >
                        {d.state === "overdue"
                          ? `${Math.abs(d.daysRemaining ?? 0)} ditë vonesë`
                          : `${d.daysRemaining ?? 0} ditë`}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">Pa afate të afërta.</p>
              )}
            </div>
          </Card>
        </div>

        {/* Dossier table */}
        <Card className="p-0 overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <h2 className="text-sm font-semibold truncate">Dosjet</h2>
            </div>
            <span className="text-xs text-muted-foreground">{listQ.data?.total ?? 0} rekorde</span>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Kodi</TableHead>
                  <TableHead className="text-xs">Faza</TableHead>
                  <TableHead className="text-xs">Qytetari / Pronari</TableHead>
                  <TableHead className="text-xs hidden md:table-cell">Institucioni</TableHead>
                  <TableHead className="text-xs hidden lg:table-cell">Status</TableHead>
                  <TableHead className="text-xs">Sinjale</TableHead>
                  <TableHead className="text-xs">Prioriteti</TableHead>
                  <TableHead className="text-xs text-right">Veprim</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listQ.data?.items.slice(0, 12).map((d) => {
                  const proc = PROCESSES[d.process];
                  const phase = proc.phases.find((p) => p.id === d.currentPhaseId);
                  return (
                    <TableRow key={d.id}>
                      <TableCell className="font-mono text-xs">{d.trackingCode}</TableCell>
                      <TableCell className="text-xs">
                        <span className="font-medium">Faza {phase?.order}</span>{" "}
                        <span className="text-muted-foreground">— {phase?.title}</span>
                      </TableCell>
                      <TableCell className="text-xs truncate max-w-[180px]">
                        {d.parties[0]?.fullName ?? "—"}
                      </TableCell>
                      <TableCell className="text-xs hidden md:table-cell">
                        {phase?.institutions[0] ?? "—"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <StatusBadge status={d.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {d.criticalCount > 0 && (
                            <SeverityBadge severity="critical">{d.criticalCount}</SeverityBadge>
                          )}
                          {d.warningCount > 0 && (
                            <SeverityBadge severity="warning">{d.warningCount}</SeverityBadge>
                          )}
                          {d.deadlineState === "overdue" && (
                            <SeverityBadge severity="critical">vonesë</SeverityBadge>
                          )}
                          {d.deadlineState === "due_soon" && (
                            <SeverityBadge severity="warning">afat</SeverityBadge>
                          )}
                          {d.criticalCount + d.warningCount === 0 &&
                            d.deadlineState !== "overdue" &&
                            d.deadlineState !== "due_soon" && (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={d.priority} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" asChild>
                          <Link to="/dosja/$id" params={{ id: d.id }}>
                            Hap
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {listQ.isLoading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={`sk-${i}`} data-testid="dossier-row-skeleton">
                      <TableCell colSpan={8}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    </TableRow>
                  ))}
                {!listQ.isLoading && !listQ.data?.items.length && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-sm text-muted-foreground py-10"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <FolderKanban className="size-6 text-muted-foreground/60" />
                        <div>Pa dosje për këto filtra.</div>
                        <div className="text-xs">Pastro filtrat ose krijo një dosje të re.</div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Recent AI extractions */}
        {dashQ.data?.recentExtractions.length ? (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="size-4 text-info" />
              <h2 className="text-sm font-semibold">Ekstraktime AI të fundit</h2>
            </div>
            <ul className="text-sm space-y-1.5">
              {dashQ.data.recentExtractions.map((e) => (
                <li key={e.insight.id} className="flex items-start gap-2">
                  <span className="font-mono text-[11px] text-muted-foreground shrink-0">
                    {e.trackingCode}
                  </span>
                  <span className="text-foreground/90 line-clamp-1">{e.insight.text}</span>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}
      </div>

      <Dialog open={briefOpen} onOpenChange={setBriefOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="size-5 text-destructive" />
              AI Risk Brief
            </DialogTitle>
            <DialogDescription>
              5 risqet kryesore operacionale të gjeneruara nga AI mbi të dhënat aktuale të alarmeve.
            </DialogDescription>
          </DialogHeader>
          {briefQ.isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-6">
              <Loader2 className="size-4 animate-spin" /> Po analizohen risqet…
            </div>
          )}
          {briefQ.data && briefQ.data.ok === false && (
            <div className="text-sm text-destructive py-4">{briefQ.data.error}</div>
          )}
          {briefQ.data && briefQ.data.ok && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2 text-xs">
                <StatPill label="Aktive" value={briefQ.data.stats.activeDossiers} />
                <StatPill label="Bllokuara" value={briefQ.data.stats.blocked} tone="critical" />
                <StatPill
                  label="Pres. jashtë"
                  value={briefQ.data.stats.awaitingExternal}
                  tone="warning"
                />
                <StatPill label="Vonesa" value={briefQ.data.stats.overdue} tone="critical" />
              </div>
              <Markdown>{briefQ.data.brief}</Markdown>
              <div className="pt-2 border-t">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">
                  Të dhënat burimore (deterministe)
                </h4>
                <div className="space-y-1.5">
                  {briefQ.data.ranked.slice(0, 5).map((r, i) => (
                    <div key={`${r.phaseId}-${r.label}`} className="text-xs flex items-start gap-2">
                      <span className="font-mono text-muted-foreground shrink-0">#{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <SeverityBadge severity={r.severity}>{r.label}</SeverityBadge>
                          <span className="text-muted-foreground">
                            · {r.affectedCount} dosje · ~{r.avgDaysInPhase}d në fazë
                          </span>
                        </div>
                        <div className="text-muted-foreground truncate">
                          {r.processTitle} → {r.phaseTitle}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Modeli: {briefQ.data.model} ·{" "}
                {new Date(briefQ.data.generatedAt).toLocaleString("sq-AL")}
              </p>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => briefQ.refetch()}
              disabled={briefQ.isFetching}
            >
              Rigjenero
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setBriefOpen(false)}>
              Mbyll
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function StatPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "critical" | "warning";
}) {
  const tint =
    tone === "critical"
      ? "text-destructive"
      : tone === "warning"
        ? "text-warning"
        : "text-foreground";
  return (
    <div className="border rounded-md px-2 py-1.5">
      <div className="text-[10px] text-muted-foreground truncate">{label}</div>
      <div className={`text-base font-semibold tabular-nums ${tint}`}>{value}</div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  tone,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  tone?: "critical" | "warning" | "info";
  loading?: boolean;
}) {
  const tint =
    tone === "critical"
      ? "text-destructive"
      : tone === "warning"
        ? "text-warning"
        : tone === "info"
          ? "text-info"
          : "text-foreground";
  return (
    <Card className="p-3">
      <div className={`flex items-center gap-1.5 text-xs ${tint}`}>
        {icon}
        <span className="truncate">{label}</span>
      </div>
      {loading ? (
        <Skeleton className="mt-1 h-7 w-12" />
      ) : (
        <div className="mt-1 text-2xl font-semibold tabular-nums">{value ?? "—"}</div>
      )}
    </Card>
  );
}
