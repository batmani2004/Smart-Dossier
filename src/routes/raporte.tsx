import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo } from "react";
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
import { getDashboard, listDossiers } from "@/lib/api/dossiers.functions";
import { PROCESSES } from "@/core";

export const Route = createFileRoute("/raporte")({
  head: () => ({ meta: [{ title: "Raporte — Smart Dossier" }] }),
  component: ReportsPage,
});

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#65a30d",
  "#db2777",
];

function ReportsPage() {
  const dash = useServerFn(getDashboard);
  const list = useServerFn(listDossiers);
  const dashQ = useQuery({ queryKey: ["dashboard"], queryFn: () => dash() });
  const listQ = useQuery({ queryKey: ["dossiers", "all"], queryFn: () => list({ data: {} }) });

  const phaseData = useMemo(
    () =>
      (dashQ.data?.countsByPhase ?? []).map((c) => ({
        name: `F${PROCESSES[c.processKind].phases.find((p) => p.id === c.phaseId)?.order ?? "?"} ${c.phaseTitle.slice(0, 18)}`,
        count: c.count,
      })),
    [dashQ.data],
  );

  const statusData = useMemo(
    () => Object.entries(dashQ.data?.countsByStatus ?? {}).map(([k, v]) => ({ name: k, value: v })),
    [dashQ.data],
  );

  const processData = useMemo(() => {
    const items = listQ.data?.items ?? [];
    const ekb = items.filter((d) => d.process === "ekb_privatization").length;
    const exp = items.filter((d) => d.process === "expropriation").length;
    return [
      { name: "EKB", value: ekb },
      { name: "Shpronësim", value: exp },
    ];
  }, [listQ.data]);

  return (
    <AppShell>
      <div className="px-4 md:px-6 py-5 space-y-4 max-w-[1400px] mx-auto">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Raporte</h1>
          <p className="text-xs text-muted-foreground">
            Analiza operacionale e dosjeve, pengesave dhe afateve.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Card className="p-3">
            <h2 className="text-sm font-semibold mb-2">Dosje sipas fazës</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={phaseData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-3">
            <h2 className="text-sm font-semibold mb-2">Status</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={80}
                    label
                  >
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-3">
            <h2 className="text-sm font-semibold mb-2">Shpërndarja sipas procesit</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#16a34a" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-3">
            <h2 className="text-sm font-semibold mb-2">Pengesat kryesore</h2>
            <ul className="text-sm space-y-1.5">
              {dashQ.data?.bottlenecks.map((b) => (
                <li
                  key={`${b.processKind}-${b.phaseId}`}
                  className="flex items-center justify-between border-b last:border-0 py-1"
                >
                  <span className="truncate min-w-0">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider mr-1">
                      {PROCESSES[b.processKind].code}
                    </span>
                    {b.phaseTitle}
                  </span>
                  <span className="text-xs tabular-nums text-muted-foreground shrink-0">
                    score {b.score} · {b.stuck} bllok
                  </span>
                </li>
              ))}
              {!dashQ.data?.bottlenecks.length && (
                <li className="text-xs text-muted-foreground">Pa të dhëna.</li>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
