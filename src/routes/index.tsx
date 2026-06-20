import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Building2,
  CalendarClock,
  ExternalLink,
  FileText,
  FolderKanban,
  Link2,
  Loader2,
  MoreVertical,
  RefreshCw,
  Scale,
  ShieldAlert,
  Sparkles,
  TimerReset,
  TrendingDown,
  Trash2,
  UserCheck,
  UserPlus,
  Wrench,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PriorityBadge, SeverityBadge, StatusBadge } from "@/components/status-badge";
import { AccessNotice } from "@/components/role-switcher";
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
import {
  addOperator,
  aiRiskBrief,
  assignDossier,
  getDashboard,
  listDossiers,
  removeOperator,
  resetDemo,
  runAutoAssignment,
} from "@/lib/api/dossiers.functions";
import { PROCESSES } from "@/core";
import type { ProcessKind } from "@/core/types";
import { useDemoRole } from "@/lib/demo-access";
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
  const [selectedOperators, setSelectedOperators] = useState<Record<string, string>>({});
  const [publicTrackingCode, setPublicTrackingCode] = useState("EKB-2026-000014");
  const [newOperatorName, setNewOperatorName] = useState("");
  const [newOperatorUnit, setNewOperatorUnit] = useState("Kadaster - Tirane");
  const { role, profile, can } = useDemoRole();
  const qc = useQueryClient();
  const dash = useServerFn(getDashboard);
  const list = useServerFn(listDossiers);
  const reset = useServerFn(resetDemo);
  const brief = useServerFn(aiRiskBrief);
  const assign = useServerFn(assignDossier);
  const autoAssign = useServerFn(runAutoAssignment);
  const addOperatorFn = useServerFn(addOperator);
  const removeOperatorFn = useServerFn(removeOperator);

  const briefQ = useQuery({
    queryKey: ["ai-risk-brief"],
    queryFn: () => brief(),
    enabled: can("runAi"),
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
  useEffect(() => {
    setPublicTrackingCode(role === "business" ? "BIZ-2026-000901" : "EKB-2026-000014");
  }, [role]);

  async function handleReset() {
    if (!can("resetDemo")) {
      toast.error("Vetem Admin mund te beje reset te demo data.");
      return;
    }
    try {
      await reset();
      toast.success("Demo data u rifreskua");
      dashQ.refetch();
      listQ.refetch();
    } catch {
      toast.error("Reset dështoi");
    }
  }

  async function handleAssignDossier(id: string, operatorId: string) {
    try {
      const result = await assign({ data: { id, operatorId } });
      toast.success(`Dosja iu caktua ${result.assignedOperatorName}`);
      await Promise.all([
        dashQ.refetch(),
        listQ.refetch(),
        qc.invalidateQueries({ queryKey: ["dossiers"] }),
      ]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Caktimi dështoi");
    }
  }

  async function handleAutoAssign() {
    try {
      const result = await autoAssign();
      toast.success(
        result.assigned.length
          ? `U caktuan automatikisht ${result.assigned.length} dosje`
          : "Nuk ka dosje që kanë kaluar 30 minuta",
      );
      await Promise.all([
        dashQ.refetch(),
        listQ.refetch(),
        qc.invalidateQueries({ queryKey: ["dossiers"] }),
      ]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Auto-assign dështoi");
    }
  }

  async function handleAddOperator() {
    if (!can("manageUsers")) {
      toast.error("Vetem Admin mund te menaxhoje operatoret.");
      return;
    }
    if (!newOperatorName.trim() || !newOperatorUnit.trim()) {
      toast.error("Plotesoni emrin dhe njesine e operatorit.");
      return;
    }
    try {
      const result = await addOperatorFn({
        data: { name: newOperatorName.trim(), unit: newOperatorUnit.trim() },
      });
      toast.success(`Operatori u shtua: ${result.operator.name}`);
      setNewOperatorName("");
      await Promise.all([dashQ.refetch(), listQ.refetch()]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Shtimi i operatorit deshtoi");
    }
  }

  async function handleRemoveOperator(id: string) {
    if (!can("manageUsers")) {
      toast.error("Vetem Admin mund te menaxhoje operatoret.");
      return;
    }
    try {
      const result = await removeOperatorFn({ data: { id } });
      toast.success(
        result.requeued
          ? `Operatori u hoq; ${result.requeued} dosje u kthyen ne radhe.`
          : "Operatori u hoq.",
      );
      await Promise.all([dashQ.refetch(), listQ.refetch()]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Heqja e operatorit deshtoi");
    }
  }

  if (role === "citizen" || role === "business") {
    const normalizedTrackingCode = publicTrackingCode.trim().toUpperCase();
    const trackingHref = normalizedTrackingCode
      ? `/track/${encodeURIComponent(normalizedTrackingCode)}`
      : "";

    return (
      <AppShell>
        <div className="mx-auto max-w-[960px] space-y-4 px-4 py-5 md:px-6">
          <div className="rounded-md border bg-white p-4 shadow-soft">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {role === "business" ? "Portal biznesi" : "Portal qytetari"}
                </div>
                <h1 className="mt-1 text-xl font-semibold tracking-tight">
                  Mire se erdhe, {profile.displayName}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Zgjidh nje veprim dhe vazhdo pa menu te panevojshme.
                </p>
              </div>
              <div className="text-xs text-muted-foreground">{profile.credentialLabel}</div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Card className="flex flex-col justify-between gap-3 border-primary/25 bg-primary/5 p-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
                  <Scale className="size-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold">Aplikim i ri</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Nis aplikimin sipas profilit: qytetar per EKB/shpronesim ose biznes per NIPT.
                  </p>
                </div>
              </div>
              <Button asChild size="sm" className="w-fit shrink-0">
                <Link to="/aplikim">Nis aplikimin</Link>
              </Button>
            </Card>

            <Card className="flex items-start gap-3 p-4">
              <div className="grid size-10 shrink-0 place-items-center rounded-md bg-[var(--brand-blue-soft)] text-primary">
                <Link2 className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">Gjurmim aplikimi</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {role === "business"
                    ? "Vendos kodin BIZ ose hap linkun e gjeneruar ne momentin e aplikimit."
                    : "Vendos kodin e gjurmimit ose hap linkun e gjeneruar ne momentin e aplikimit."}
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <Input
                    value={publicTrackingCode}
                    onChange={(event) => setPublicTrackingCode(event.target.value)}
                    placeholder={role === "business" ? "BIZ-2026-000901" : "EKB-2026-000014"}
                    className="h-10 font-mono text-sm"
                    aria-label="Kodi i gjurmimit"
                  />
                  {trackingHref ? (
                    <Button asChild type="button" className="shrink-0">
                      <a href={trackingHref}>
                        <ExternalLink className="mr-1.5 size-4" />
                        Gjurmo aplikimin
                      </a>
                    </Button>
                  ) : (
                    <Button type="button" disabled className="shrink-0">
                      Gjurmo aplikimin
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          <SmartDossierFocus compact />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="px-4 md:px-6 py-5 space-y-5 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight truncate">
              Qendra e punes
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Rradha e dosjeve, sinjalet kritike dhe agjentet AI qe pergatisin punen per konfirmim.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setBriefOpen(true)}
              data-testid="ai-risk-brief"
              disabled={!can("runAi")}
            >
              <ShieldAlert className="size-4 mr-1.5" />
              Analizo me AI
            </Button>
            <Button size="sm" asChild>
              <Link to="/dosjet">Rradha e dosjeve</Link>
            </Button>
            {can("resetDemo") ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Demo / dev"
                    data-testid="dev-menu"
                  >
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
            ) : null}
          </div>
        </div>

        <AiWorkConsole
          data={dashQ.data}
          loading={dashQ.isLoading}
          canRunAi={can("runAi")}
          canManageUsers={can("manageUsers")}
          onRiskBrief={() => setBriefOpen(true)}
          onAutoAssign={handleAutoAssign}
        />

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
            label="Afate 7 dite"
            value={kpi?.expiring7d}
            tone="warning"
            loading={dashQ.isLoading}
          />
          <KpiCard
            icon={<Sparkles className="size-4" />}
            label="Pune AI"
            value={kpi?.aiThisWeek}
            tone="info"
            loading={dashQ.isLoading}
          />
        </div>

        {/* AI Risk Brief — inline, auto-loads for civil servants */}
        {can("runAi") && (briefQ.isLoading || briefQ.data) ? (
          <Card className="p-4 border-destructive/25 bg-destructive/5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="size-4 text-destructive" />
                <h2 className="text-sm font-semibold">AI Risk Brief</h2>
                {briefQ.isLoading && (
                  <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                )}
              </div>
              {briefQ.data?.ok && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => setBriefOpen(true)}
                >
                  Detaje të plota
                </Button>
              )}
            </div>
            {briefQ.isLoading && (
              <p className="text-xs text-muted-foreground">Po analizohen risqet nga AI…</p>
            )}
            {briefQ.data?.ok && (
              <div className="space-y-3">
                <div className="text-sm leading-relaxed">
                  <Markdown>
                    {briefQ.data.brief.length > 600
                      ? briefQ.data.brief.slice(0, 600) + "…"
                      : briefQ.data.brief}
                  </Markdown>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1 border-t">
                  {briefQ.data.ranked.slice(0, 3).map((r) => (
                    <span
                      key={`${r.phaseId}-${r.label}`}
                      className="inline-flex items-center gap-1 rounded-md border border-destructive/25 bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive"
                    >
                      <AlertTriangle className="size-2.5" />
                      {r.label} · {r.affectedCount} dosje
                    </span>
                  ))}
                </div>
              </div>
            )}
            {briefQ.data?.ok === false && (
              <p className="text-xs text-destructive">{briefQ.data.error}</p>
            )}
          </Card>
        ) : null}

        {can("manageUsers") && dashQ.data?.assignment ? (
          <Card className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <UserCheck className="size-4 text-primary" />
                  <h2 className="text-sm font-semibold">Operatoret dhe caktimet</h2>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Admini shton, heq dhe cakton operatore sipas ngarkeses se dosjeve.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAutoAssign}
                disabled={dashQ.data.assignment.autoDueCount === 0}
              >
                <TimerReset className="size-3.5 mr-1" />
                Auto-assign tani
              </Button>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
              {dashQ.data.assignment.operatorWorkloads.map((operator) => (
                <div key={operator.id} className="rounded-md border bg-muted/30 px-3 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{operator.name}</div>
                      <div className="text-[11px] text-muted-foreground">{operator.unit}</div>
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveOperator(operator.id)}
                      aria-label={`Hiq ${operator.name}`}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                  <div className="mt-1 text-xs font-semibold text-primary">
                    {operator.activeCases} çështje aktive
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 grid gap-2 rounded-md border bg-background p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
              <Input
                value={newOperatorName}
                onChange={(event) => setNewOperatorName(event.target.value)}
                placeholder="Emri i operatorit"
                className="h-9 text-sm"
              />
              <Input
                value={newOperatorUnit}
                onChange={(event) => setNewOperatorUnit(event.target.value)}
                placeholder="Njesia / institucioni"
                className="h-9 text-sm"
              />
              <Button type="button" size="sm" onClick={handleAddOperator}>
                <UserPlus className="mr-1.5 size-3.5" />
                Shto operator
              </Button>
            </div>

            <div className="mt-3 space-y-2">
              {dashQ.data.assignment.queue.length === 0 ? (
                <div className="rounded-md border border-success/25 bg-success/10 px-3 py-2 text-sm text-success">
                  Nuk ka aplikime në pritje për caktim operatori.
                </div>
              ) : (
                dashQ.data.assignment.queue.map((item) => {
                  const selected =
                    selectedOperators[item.id] ??
                    dashQ.data.assignment.operatorWorkloads[0]?.id ??
                    "";
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 gap-2 rounded-md border bg-card p-3 md:grid-cols-[minmax(0,1fr)_190px_auto]"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {item.trackingCode}
                          </span>
                          <Badge
                            variant="secondary"
                            className={
                              item.overdue
                                ? "bg-destructive/15 text-destructive border-destructive/20"
                                : "bg-warning/15 text-warning border-warning/20"
                            }
                          >
                            {item.overdue ? "Auto-assign gati" : "Në pritje 30 min"}
                          </Badge>
                        </div>
                        <div className="mt-1 truncate text-sm font-medium">{item.title}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {item.applicantName} · afati{" "}
                          {new Date(item.assignmentDueAt).toLocaleTimeString("sq-AL", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      <Select
                        value={selected}
                        onValueChange={(value) =>
                          setSelectedOperators((prev) => ({ ...prev, [item.id]: value }))
                        }
                      >
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {dashQ.data.assignment.operatorWorkloads.map((operator) => (
                            <SelectItem key={operator.id} value={operator.id}>
                              {operator.name} ({operator.activeCases})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        onClick={() => handleAssignDossier(item.id, selected)}
                        disabled={!selected}
                      >
                        Cakto
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        ) : null}

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
          <ToggleGroupItem value="property_registration" className="text-xs">
            Biznes / regjistrim prone
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

type AiWorkConsoleData = {
  assignment?: {
    unassignedCount: number;
    autoDueCount: number;
    operatorWorkloads: Array<{
      id: string;
      name: string;
      unit: string;
      activeCases: number;
    }>;
  };
  bottlenecks?: Array<{
    phaseTitle: string;
    total: number;
    stuck: number;
    score: number;
  }>;
  expiringDeadlines?: Array<{
    state: string;
    daysRemaining?: number | null;
  }>;
  recentExtractions?: Array<unknown>;
};

function AiWorkConsole({
  data,
  loading,
  canRunAi,
  canManageUsers,
  onRiskBrief,
  onAutoAssign,
}: {
  data?: AiWorkConsoleData;
  loading: boolean;
  canRunAi: boolean;
  canManageUsers: boolean;
  onRiskBrief: () => void;
  onAutoAssign: () => void;
}) {
  const unassigned = data?.assignment?.unassignedCount ?? 0;
  const autoDue = data?.assignment?.autoDueCount ?? 0;
  const leastLoaded = data?.assignment?.operatorWorkloads?.[0];
  const topBottleneck = data?.bottlenecks?.[0];
  const expiring =
    data?.expiringDeadlines?.filter((item) => item.state === "overdue" || item.state === "due_soon")
      .length ?? 0;
  const aiReads = data?.recentExtractions?.length ?? 0;
  const recommended =
    autoDue > 0
      ? `${autoDue} dosje jane gati per auto-caktim`
      : topBottleneck
        ? `${topBottleneck.total} dosje kerkojne vemendje te ${topBottleneck.phaseTitle}`
        : "Rradha eshte e qete; kontrolloni dosjet e reja";

  return (
    <Card className="overflow-hidden border-primary/25 bg-primary/5">
      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary text-primary-foreground">AI workspace</Badge>
            <Badge variant="outline">Nepunesi konfirmon</Badge>
          </div>
          <h2 className="mt-2 text-lg font-semibold tracking-tight">
            Agjentet AI pergatisin dosjen para klikimit
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Sistemi lexon dokumentet, propozon caktimin, llogarit sinjalet dhe nxjerr veprimin e
            radhes. Stafi sheh vetem cfare duhet te konfirmoje.
          </p>
        </div>
        <div className="rounded-md border bg-background/80 p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Veprimi i radhes
          </div>
          <div className="mt-1 text-sm font-semibold">
            {loading ? "Duke lexuar..." : recommended}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={onAutoAssign} disabled={!canManageUsers || autoDue === 0}>
              <TimerReset className="mr-1.5 size-3.5" />
              Auto-cakto
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link to="/dosjet">Hap rradhen</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 border-t bg-background/60 p-4 md:grid-cols-3">
        <AgentTile
          icon={<UserCheck className="size-4" />}
          title="Agjenti i ndarjes se puneve"
          metric={loading ? "..." : `${unassigned} pa caktuar`}
          body={
            leastLoaded
              ? `Sugjeron ${leastLoaded.name}, sepse ka ${leastLoaded.activeCases} ceshtje aktive.`
              : "Analizon operatorin me ngarkesen me te ulet."
          }
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={onAutoAssign}
              disabled={!canManageUsers || autoDue === 0}
            >
              Konfirmo ndarjen
            </Button>
          }
        />
        <AgentTile
          icon={<Sparkles className="size-4" />}
          title="Agjenti i verifikimit"
          metric={loading ? "..." : `${aiReads} lexime AI`}
          body="Nxjerr te dhenat nga PDF, shenon dokumentet qe mungojne dhe pergatit statusin per miratim."
          action={
            <Button size="sm" variant="outline" asChild>
              <Link to="/dosjet">Shiko dosjet</Link>
            </Button>
          }
        />
        <AgentTile
          icon={<ShieldAlert className="size-4" />}
          title="Agjenti i llogaritjes"
          metric={loading ? "..." : `${expiring} sinjale`}
          body="Monitoron afatet, faturat, kompensimin dhe rastet qe kerkojne vendim te shpejte."
          action={
            <Button size="sm" variant="outline" onClick={onRiskBrief} disabled={!canRunAi}>
              Raport AI
            </Button>
          }
        />
      </div>
    </Card>
  );
}

function AgentTile({
  icon,
  title,
  metric,
  body,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  metric: string;
  body: string;
  action: React.ReactNode;
}) {
  return (
    <div className="rounded-md border bg-card p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="grid size-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
            {icon}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{title}</div>
            <div className="text-xs font-medium text-primary">{metric}</div>
          </div>
        </div>
      </div>
      <p className="mt-2 min-h-10 text-xs leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-3">{action}</div>
    </div>
  );
}

function SmartDossierFocus({ compact = false }: { compact?: boolean }) {
  const pillars = [
    {
      icon: Scale,
      title: "Shpronesimi per interes publik",
      body: "Aplikim, verifikim prone, vleresim, ankim dhe pagesa nga Ministria e Ekonomise.",
      action: "Apliko",
      href: "/aplikim",
    },
    {
      icon: Building2,
      title: "Privatizimi i banesave",
      body: "Dosja EKB kalon nga aplikimi dhe verifikimi deri te fatura, kontrata dhe certifikata.",
      action: "Shiko demo",
      href: "/track/EKB-2026-000014",
    },
    {
      icon: FileText,
      title: "Aksesimi i dokumenteve",
      body: "Dokumentet vulosen, ruhen ne dosje dhe hapen per shkarkim pas verifikimit te te drejtes.",
      action: "Pyetje te shpeshta",
      href: "/faq",
    },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="border-b bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <Link2 className="size-4" />
          Smart Dossier
        </div>
        <h2 className="mt-1 text-base font-semibold">
          Nje dosje e vetme per procesin, dokumentet dhe gjurmimin
        </h2>
        {!compact ? (
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Programi fokusohet te shpronesimi per interes publik dhe privatizimi i banesave, ndersa
            aksesimi i dokumenteve sherben si shtresa qe lidh qytetarin, biznesin, operatorin dhe
            institucionet.
          </p>
        ) : null}
      </div>
      <div className="grid gap-3 p-4 md:grid-cols-3">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div key={pillar.title} className="rounded-md border bg-background/80 p-3">
              <div className="flex items-start gap-2">
                <div className="grid size-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{pillar.title}</div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {pillar.body}
                  </p>
                </div>
              </div>
              {!compact ? (
                <Button asChild size="sm" variant="outline" className="mt-3 h-8">
                  <a href={pillar.href}>{pillar.action}</a>
                </Button>
              ) : null}
            </div>
          );
        })}
      </div>
      {!compact ? (
        <div className="grid gap-2 border-t bg-muted/20 px-4 py-3 text-xs text-muted-foreground md:grid-cols-4">
          <div>
            <span className="font-semibold text-foreground">1. Aplikim</span> nga qytetar ose
            biznes.
          </div>
          <div>
            <span className="font-semibold text-foreground">2. Operator</span> verifikon dhe
            monitoron fazat.
          </div>
          <div>
            <span className="font-semibold text-foreground">3. Institucione</span> trajtojne pagesa,
            VKM, ASHK dhe dokumente.
          </div>
          <div>
            <span className="font-semibold text-foreground">4. Gjurmim</span> me link publik dhe
            dokumente te shkarkueshme.
          </div>
        </div>
      ) : null}
    </Card>
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
