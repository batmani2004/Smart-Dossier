import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, type ComponentType } from "react";
import {
  AlertTriangle,
  BarChart3,
  Bot,
  BriefcaseBusiness,
  Clock3,
  FileWarning,
  Gauge,
  ListChecks,
  PieChart as PieChartIcon,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDashboard, listDossiers } from "@/lib/api/dossiers.functions";
import { PROCESSES } from "@/core";

export const Route = createFileRoute("/raporte")({
  head: () => ({ meta: [{ title: "Raporte - Smart Dossier" }] }),
  component: ReportsPage,
});

const CHART_COLORS = [
  "var(--primary)",
  "var(--accent)",
  "var(--info)",
  "var(--success)",
  "var(--warning)",
  "var(--destructive)",
];

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  in_progress: "Ne proces",
  blocked: "Bllokuar",
  awaiting_external: "Pritje institucioni",
  completed: "Mbyllur",
  rejected: "Refuzuar",
};

const PROCESS_LABELS: Record<string, string> = {
  ekb_privatization: "EKB",
  expropriation: "Shpronesim",
  property_registration: "Biznes",
};

const AI_KINDS = new Set(["summary", "next_step", "extraction", "valuation"]);

function ReportsPage() {
  const dash = useServerFn(getDashboard);
  const list = useServerFn(listDossiers);
  const dashQ = useQuery({ queryKey: ["dashboard"], queryFn: () => dash() });
  const listQ = useQuery({ queryKey: ["dossiers", "all"], queryFn: () => list({ data: {} }) });

  const items = listQ.data?.items ?? [];
  const statusCounts = dashQ.data?.countsByStatus ?? {};
  const expiringDeadlines = dashQ.data?.expiringDeadlines ?? [];
  const criticalAlerts = dashQ.data?.criticalAlerts ?? [];
  const bottlenecks = dashQ.data?.bottlenecks ?? [];
  const workloads = dashQ.data?.assignment.operatorWorkloads ?? [];

  const activeCount = items.filter(
    (d) => d.status !== "completed" && d.status !== "rejected",
  ).length;
  const blockedCount = (statusCounts.blocked ?? 0) + (statusCounts.awaiting_external ?? 0);
  const overdueCount = expiringDeadlines.filter((d) => d.state === "overdue").length;
  const dueSoonCount = expiringDeadlines.filter((d) => d.state === "due_soon").length;
  const aiTouchedDossiers = items.filter((d) =>
    d.insights.some((insight) => AI_KINDS.has(insight.kind)),
  ).length;
  const aiInsightCount = items.reduce(
    (total, d) => total + d.insights.filter((insight) => AI_KINDS.has(insight.kind)).length,
    0,
  );
  const automationRate = items.length ? Math.round((aiTouchedDossiers / items.length) * 100) : 0;

  const phaseData = useMemo(
    () =>
      (dashQ.data?.countsByPhase ?? []).slice(0, 8).map((c) => ({
        name: `F${PROCESSES[c.processKind].phases.find((p) => p.id === c.phaseId)?.order ?? "?"}`,
        label: c.phaseTitle,
        count: c.count,
      })),
    [dashQ.data],
  );

  const statusData = useMemo(
    () =>
      Object.entries(statusCounts).map(([key, value], index) => ({
        name: STATUS_LABELS[key] ?? key,
        value,
        color: CHART_COLORS[index % CHART_COLORS.length],
      })),
    [statusCounts],
  );

  const processData = useMemo(() => {
    const counts = items.reduce<Record<string, number>>((acc, d) => {
      acc[d.process] = (acc[d.process] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([key, value], index) => ({
      name: PROCESS_LABELS[key] ?? key,
      value,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [items]);

  const recentAi = useMemo(
    () =>
      items
        .flatMap((d) =>
          d.insights
            .filter((insight) => AI_KINDS.has(insight.kind))
            .map((insight) => ({
              dossierId: d.id,
              trackingCode: d.trackingCode,
              kind: insight.kind,
              text: insight.text,
              createdAt: insight.createdAt,
            })),
        )
        .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
        .slice(0, 6),
    [items],
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-4 px-4 py-5 md:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">
              Qendra e raporteve
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Raporte operative</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Fokus te afatet, bllokimet, ngarkesa e operatoreve dhe impakti i AI.
            </p>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link to="/dosjet">
              <ListChecks className="mr-1.5 size-4" />
              Hap listen e dosjeve
            </Link>
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <KpiCard
            icon={BriefcaseBusiness}
            label="Dosje gjithsej"
            value={dashQ.data?.totals.dossiers ?? items.length}
            detail={`${activeCount} aktive`}
          />
          <KpiCard
            icon={FileWarning}
            label="Ne risk"
            value={blockedCount + criticalAlerts.length}
            detail={`${blockedCount} bllokuar / pritje`}
            tone="warning"
          />
          <KpiCard
            icon={Clock3}
            label="Afate"
            value={overdueCount + dueSoonCount}
            detail={`${overdueCount} tejkaluar, ${dueSoonCount} afer afatit`}
            tone={overdueCount ? "danger" : "default"}
          />
          <KpiCard
            icon={Bot}
            label="AI i perdorur"
            value={`${automationRate}%`}
            detail={`${aiInsightCount} veprime AI`}
            tone="primary"
          />
          <KpiCard
            icon={UsersRound}
            label="Pa operator"
            value={dashQ.data?.assignment.unassignedCount ?? 0}
            detail={`${dashQ.data?.assignment.autoDueCount ?? 0} per auto-caktim`}
          />
        </div>

        <div className="grid gap-3 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="p-3">
            <PanelHeader
              icon={BarChart3}
              title="Dosje sipas fazes"
              description="Ku po grumbullohet puna."
            />
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={phaseData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} labelFormatter={phaseLabel(phaseData)} />
                  <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-3">
            <PanelHeader
              icon={Gauge}
              title="Fokus per sot"
              description="Veprimet me prioritet me te larte."
            />
            <div className="space-y-2">
              {expiringDeadlines.slice(0, 5).map((item) => (
                <ReportLinkRow
                  key={`${item.dossierId}-${item.label}`}
                  to={item.dossierId}
                  code={item.trackingCode}
                  title={item.label ?? item.title}
                  meta={`${item.state === "overdue" ? "Tejkaluar" : "Afer afatit"}${
                    item.daysRemaining !== undefined ? ` · ${item.daysRemaining} dite` : ""
                  }`}
                  tone={item.state === "overdue" ? "danger" : "warning"}
                />
              ))}
              {criticalAlerts.slice(0, 4).map((item) => (
                <ReportLinkRow
                  key={`${item.dossierId}-${item.alert.id}`}
                  to={item.dossierId}
                  code={item.trackingCode}
                  title={item.alert.label}
                  meta={item.title}
                  tone="danger"
                />
              ))}
              {!expiringDeadlines.length && !criticalAlerts.length ? (
                <p className="text-sm text-muted-foreground">Asnje alarm kritik per momentin.</p>
              ) : null}
            </div>
          </Card>
        </div>

        <div className="grid gap-3 xl:grid-cols-3">
          <Card className="p-3">
            <PanelHeader icon={PieChartIcon} title="Statusi" description="Shperndarja aktuale." />
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={80}
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <Legend items={statusData} />
          </Card>

          <Card className="p-3">
            <PanelHeader
              icon={TrendingUp}
              title="Proceset"
              description="Volumi sipas tipit te aplikimit."
            />
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                  <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={96} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {processData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-3">
            <PanelHeader icon={Bot} title="AI dhe automatizimi" description="Ku po kursen kohe." />
            <div className="grid grid-cols-3 gap-2">
              <MiniMetric label="Dosje me AI" value={aiTouchedDossiers} />
              <MiniMetric label="Insight" value={aiInsightCount} />
              <MiniMetric
                label="Akt Vleresimi"
                value={items.filter((d) => d.insights.some((i) => i.kind === "valuation")).length}
              />
            </div>
            <div className="mt-3 space-y-2">
              {recentAi.length ? (
                recentAi.map((item) => (
                  <ReportLinkRow
                    key={`${item.dossierId}-${item.createdAt}-${item.kind}`}
                    to={item.dossierId}
                    code={item.trackingCode}
                    title={item.text}
                    meta={`${item.kind} · ${item.createdAt.slice(0, 16).replace("T", " ")}`}
                    tone="primary"
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Ende pa veprime AI te regjistruara.</p>
              )}
            </div>
          </Card>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <Card className="p-3">
            <PanelHeader
              icon={AlertTriangle}
              title="Pengesat kryesore"
              description="Fazat qe duhen liruar te parat."
            />
            <div className="space-y-2">
              {bottlenecks.map((item) => (
                <div key={`${item.processKind}-${item.phaseId}`} className="rounded-md border p-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">{item.phaseTitle}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {PROCESSES[item.processKind].code} · {item.total} dosje · mesatarisht{" "}
                        {item.avgDaysInPhase} dite
                      </div>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-[10px]">
                      score {item.score}
                    </Badge>
                  </div>
                  {item.alertLabels.length ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.alertLabels.map((label) => (
                        <Badge key={label} variant="outline" className="text-[10px]">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
              {!bottlenecks.length ? (
                <p className="text-sm text-muted-foreground">Pa pengesa te dukshme.</p>
              ) : null}
            </div>
          </Card>

          <Card className="p-3">
            <PanelHeader
              icon={UsersRound}
              title="Ngarkesa e operatoreve"
              description="Balancim i shpejte i punes."
            />
            <div className="space-y-2">
              {workloads.map((operator) => (
                <div key={operator.id} className="rounded-md border p-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">{operator.name}</div>
                      <div className="text-[11px] text-muted-foreground">{operator.unit}</div>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {operator.activeCases} aktive
                    </Badge>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${Math.min(100, operator.activeCases * 18)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
              {!workloads.length ? (
                <p className="text-sm text-muted-foreground">Pa operatore aktive.</p>
              ) : null}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

const tooltipStyle = {
  borderRadius: 6,
  borderColor: "var(--border)",
  boxShadow: "var(--shadow-soft)",
} as const;

function phaseLabel(data: { name: string; label: string }[]) {
  return (value: string) => data.find((item) => item.name === value)?.label ?? value;
}

function KpiCard({
  icon: Icon,
  label,
  value,
  detail,
  tone = "default",
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  detail: string;
  tone?: "default" | "primary" | "warning" | "danger";
}) {
  const toneClass =
    tone === "danger"
      ? "border-destructive/30 bg-destructive/5 text-destructive"
      : tone === "warning"
        ? "border-warning/40 bg-warning/10 text-warning-foreground"
        : tone === "primary"
          ? "border-primary/25 bg-primary/5 text-primary"
          : "border-border bg-card text-foreground";

  return (
    <Card className={`p-3 ${toneClass}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wide opacity-75">{label}</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
          <div className="mt-1 text-xs opacity-75">{detail}</div>
        </div>
        <div className="grid size-8 shrink-0 place-items-center rounded-md bg-white/70 text-current">
          <Icon className="size-4" />
        </div>
      </div>
    </Card>
  );
}

function PanelHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-3 flex items-start gap-2">
      <div className="grid size-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border bg-muted/25 px-2 py-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function ReportLinkRow({
  to,
  code,
  title,
  meta,
  tone,
}: {
  to: string;
  code: string;
  title: string;
  meta: string;
  tone: "primary" | "warning" | "danger";
}) {
  const dotClass =
    tone === "danger" ? "bg-destructive" : tone === "warning" ? "bg-warning" : "bg-primary";
  return (
    <Link
      to="/dosja/$id"
      params={{ id: to }}
      className="flex items-start gap-2 rounded-md border bg-card p-2 transition hover:border-primary/30 hover:bg-muted/30"
    >
      <span className={`mt-1.5 size-2 shrink-0 rounded-full ${dotClass}`} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{title}</span>
        <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
          {code} · {meta}
        </span>
      </span>
    </Link>
  );
}

function Legend({ items }: { items: { name: string; color: string; value: number }[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.map((item) => (
        <div
          key={item.name}
          className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
        >
          <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span>{item.name}</span>
          <span className="font-medium text-foreground">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
