import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Building2,
  CircleDashed,
  FileText,
  FolderKanban,
  LayoutGrid,
  List,
  Rows3,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PriorityBadge, SeverityBadge, StatusBadge } from "@/components/status-badge";
import { PROCESSES } from "@/core";
import type { DeadlineState, Dossier, DossierStatus, ProcessKind } from "@/core";
import { cn } from "@/lib/utils";

export type DossierViewMode = "board" | "list" | "compact";
export type DossierGroupBy = "phase" | "process" | "status" | "operator" | "priority";
export type DossierCategory =
  | "all"
  | "attention"
  | "unassigned"
  | "high_priority"
  | "blocked"
  | "due_soon"
  | "waiting_external"
  | "completed";

export type DossierListItem = Dossier & {
  priority: "low" | "normal" | "high";
  criticalCount: number;
  warningCount: number;
  deadlineState: DeadlineState;
};

type DossierBrowserProps = {
  items: DossierListItem[];
  total?: number;
  loading?: boolean;
  title?: string;
  description?: string;
  initialView?: DossierViewMode;
  initialGroupBy?: DossierGroupBy;
  maxItems?: number;
  emptyTitle?: string;
  emptyBody?: string;
  className?: string;
};

const CATEGORY_LABELS: Record<DossierCategory, { label: string; helper: string }> = {
  all: { label: "Te gjitha", helper: "Gjithe rezultati" },
  attention: { label: "Kerkon vemendje", helper: "Alarm, afat ose prioritet" },
  unassigned: { label: "Pa operator", helper: "Ne pritje caktimi" },
  high_priority: { label: "Prioritet i larte", helper: "Per tu hapur i pari" },
  blocked: { label: "Bllokuar", helper: "Nuk ecen pa veprim" },
  due_soon: { label: "Afat i afert", helper: "Sot, vonese ose 7 dite" },
  waiting_external: { label: "Pritje institucionale", helper: "Koordinim me institucion" },
  completed: { label: "Mbyllur", helper: "Te perfunduara" },
};

const STATUS_LABELS: Record<DossierStatus, string> = {
  draft: "Draft",
  in_progress: "Ne proces",
  blocked: "Bllokuar",
  awaiting_external: "Pritje institucionale",
  completed: "Mbyllur",
  rejected: "Refuzuar",
};

const PRIORITY_LABELS: Record<DossierListItem["priority"], string> = {
  high: "Prioritet i larte",
  normal: "Prioritet normal",
  low: "Prioritet i ulet",
};

const CATEGORY_ORDER: DossierCategory[] = [
  "all",
  "attention",
  "unassigned",
  "high_priority",
  "blocked",
  "due_soon",
  "waiting_external",
  "completed",
];

export function DossierBrowser({
  items,
  total,
  loading = false,
  title = "Dosjet",
  description = "Kategorizoni, gruponi dhe hapni dosjet sipas menyres se punes.",
  initialView = "board",
  initialGroupBy = "phase",
  maxItems,
  emptyTitle = "Pa dosje per keto filtra.",
  emptyBody = "Pastro filtrat ose krijo nje dosje te re.",
  className,
}: DossierBrowserProps) {
  const [category, setCategory] = useState<DossierCategory>("all");
  const [view, setView] = useState<DossierViewMode>(initialView);
  const [groupBy, setGroupBy] = useState<DossierGroupBy>(initialGroupBy);

  const categoryCounts = useMemo(() => buildCategoryCounts(items), [items]);
  const categorized = useMemo(
    () => items.filter((item) => matchesCategory(item, category)),
    [category, items],
  );
  const visibleItems = useMemo(
    () => (maxItems ? categorized.slice(0, maxItems) : categorized),
    [categorized, maxItems],
  );
  const groups = useMemo(() => groupDossiers(visibleItems, groupBy), [groupBy, visibleItems]);
  const displayedTotal = total ?? items.length;

  return (
    <Card className={cn("overflow-hidden p-0", className)}>
      <div className="border-b px-3 py-3 sm:px-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <h2 className="min-w-0 text-sm font-semibold">{title}</h2>
              <Badge variant="secondary" className="shrink-0 text-[11px]">
                {displayedTotal} rekorde
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center lg:w-auto">
            <ToggleGroup
              type="single"
              value={view}
              onValueChange={(value) => value && setView(value as DossierViewMode)}
              className="grid grid-cols-3 justify-start sm:flex"
            >
              <ToggleGroupItem value="board" className="h-8 px-2 text-xs" aria-label="Board">
                <LayoutGrid className="mr-1.5 size-3.5" />
                Board
              </ToggleGroupItem>
              <ToggleGroupItem value="list" className="h-8 px-2 text-xs" aria-label="Liste">
                <List className="mr-1.5 size-3.5" />
                Liste
              </ToggleGroupItem>
              <ToggleGroupItem value="compact" className="h-8 px-2 text-xs" aria-label="Kompakt">
                <Rows3 className="mr-1.5 size-3.5" />
                Kompakt
              </ToggleGroupItem>
            </ToggleGroup>
            <Select value={groupBy} onValueChange={(value) => setGroupBy(value as DossierGroupBy)}>
              <SelectTrigger className="h-8 w-full text-xs sm:w-[165px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phase">Grupo sipas fazes</SelectItem>
                <SelectItem value="process">Grupo sipas procesit</SelectItem>
                <SelectItem value="status">Grupo sipas statusit</SelectItem>
                <SelectItem value="operator">Grupo sipas operatorit</SelectItem>
                <SelectItem value="priority">Grupo sipas prioritetit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
          {CATEGORY_ORDER.map((key) => {
            const meta = CATEGORY_LABELS[key];
            const active = category === key;
            const count = categoryCounts[key] ?? 0;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setCategory(key)}
                className={cn(
                  "min-h-[4rem] rounded-md border px-2.5 py-2 text-left transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-background hover:border-primary/50 hover:bg-[var(--brand-blue-soft)]",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-semibold">{meta.label}</span>
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                      active ? "bg-white/15 text-white" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {count}
                  </span>
                </div>
                <div
                  className={cn(
                    "mt-1 truncate text-[10px]",
                    active ? "text-primary-foreground/75" : "text-muted-foreground",
                  )}
                >
                  {meta.helper}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-2.5 sm:p-3">
        {loading ? (
          <DossierLoading view={view} />
        ) : !visibleItems.length ? (
          <EmptyDossierState title={emptyTitle} body={emptyBody} />
        ) : view === "board" ? (
          <BoardView groups={groups} />
        ) : view === "list" ? (
          <ListView groups={groups} />
        ) : (
          <CompactView groups={groups} />
        )}
      </div>

      {maxItems && categorized.length > maxItems ? (
        <div className="border-t bg-muted/25 px-4 py-2 text-xs text-muted-foreground">
          Po shfaqen {maxItems} nga {categorized.length} dosje ne kete kategori.
        </div>
      ) : null}
    </Card>
  );
}

type DossierGroup = {
  key: string;
  label: string;
  helper?: string;
  sort: number;
  items: DossierListItem[];
};

function buildCategoryCounts(items: DossierListItem[]) {
  const result = Object.fromEntries(CATEGORY_ORDER.map((key) => [key, 0])) as Record<
    DossierCategory,
    number
  >;
  for (const item of items) {
    for (const key of CATEGORY_ORDER) {
      if (matchesCategory(item, key)) result[key] += 1;
    }
  }
  return result;
}

function matchesCategory(item: DossierListItem, category: DossierCategory) {
  if (category === "all") return true;
  if (category === "attention") {
    return (
      item.status === "blocked" ||
      item.priority === "high" ||
      item.criticalCount > 0 ||
      item.warningCount > 0 ||
      item.deadlineState === "overdue" ||
      item.deadlineState === "due_soon"
    );
  }
  if (category === "unassigned") return !item.assignedOperatorId && item.status !== "completed";
  if (category === "high_priority") return item.priority === "high";
  if (category === "blocked") return item.status === "blocked";
  if (category === "due_soon") {
    return item.deadlineState === "overdue" || item.deadlineState === "due_soon";
  }
  if (category === "waiting_external") return item.status === "awaiting_external";
  if (category === "completed") return item.status === "completed";
  return true;
}

function groupDossiers(items: DossierListItem[], groupBy: DossierGroupBy): DossierGroup[] {
  const groups = new Map<string, DossierGroup>();
  for (const item of items) {
    const meta = groupMeta(item, groupBy);
    const existing = groups.get(meta.key);
    if (existing) existing.items.push(item);
    else groups.set(meta.key, { ...meta, items: [item] });
  }
  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      items: [...group.items].sort(sortDossiers),
    }))
    .sort((a, b) => a.sort - b.sort || a.label.localeCompare(b.label));
}

function groupMeta(item: DossierListItem, groupBy: DossierGroupBy): Omit<DossierGroup, "items"> {
  const proc = PROCESSES[item.process];
  const phase = currentPhase(item);

  if (groupBy === "process") {
    return {
      key: `process:${item.process}`,
      label: proc.title,
      helper: proc.code,
      sort: processSort(item.process),
    };
  }
  if (groupBy === "status") {
    return {
      key: `status:${item.status}`,
      label: STATUS_LABELS[item.status],
      helper: "Statusi i dosjes",
      sort: statusSort(item.status),
    };
  }
  if (groupBy === "operator") {
    const name = item.assignedOperatorName ?? "Pa operator";
    return {
      key: `operator:${item.assignedOperatorId ?? "none"}`,
      label: name,
      helper: item.assignedOperatorId ? "I caktuar" : "Ne pritje caktimi",
      sort: item.assignedOperatorId ? 10 : 0,
    };
  }
  if (groupBy === "priority") {
    return {
      key: `priority:${item.priority}`,
      label: PRIORITY_LABELS[item.priority],
      helper: "Renditje pune",
      sort: prioritySort(item.priority),
    };
  }
  return {
    key: `phase:${item.process}:${item.currentPhaseId}`,
    label: `Faza ${phase?.order ?? "-"} - ${phase?.title ?? item.currentPhaseId}`,
    helper: proc.title,
    sort: processSort(item.process) * 100 + (phase?.order ?? 99),
  };
}

function BoardView({ groups }: { groups: DossierGroup[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {groups.map((group) => (
        <section key={group.key} className="rounded-md border bg-muted/20 p-3">
          <GroupHeader group={group} />
          <div className="mt-2 space-y-2">
            {group.items.map((item) => (
              <DossierTile key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ListView({ groups }: { groups: DossierGroup[] }) {
  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <section key={group.key} className="overflow-hidden rounded-md border">
          <div className="border-b bg-muted/25 px-3 py-2">
            <GroupHeader group={group} compact />
          </div>
          <div className="overflow-x-auto">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Kodi</TableHead>
                  <TableHead className="text-xs">Dosja</TableHead>
                  <TableHead className="hidden text-xs md:table-cell">Aplikuesi</TableHead>
                  <TableHead className="hidden text-xs lg:table-cell">Faza</TableHead>
                  <TableHead className="text-xs">Sinjale</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs text-right">Veprim</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.items.map((item) => (
                  <DossierTableRow key={item.id} item={item} />
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      ))}
    </div>
  );
}

function CompactView({ groups }: { groups: DossierGroup[] }) {
  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <section key={group.key}>
          <GroupHeader group={group} compact />
          <div className="mt-2 divide-y rounded-md border">
            {group.items.map((item) => (
              <Link
                key={item.id}
                to="/dosja/$id"
                params={{ id: item.id }}
                className="grid gap-2 px-3 py-2 hover:bg-muted/40 md:grid-cols-[130px_minmax(0,1fr)_130px_120px]"
              >
                <div className="font-mono text-xs text-muted-foreground">{item.trackingCode}</div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{item.title}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {applicantName(item)} - {propertyZone(item)}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <SignalBadges item={item} compact />
                </div>
                <div className="flex items-center justify-start gap-1 md:justify-end">
                  <PriorityBadge priority={item.priority} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function DossierTile({ item }: { item: DossierListItem }) {
  const proc = PROCESSES[item.process];
  const phase = currentPhase(item);

  return (
    <Link
      to="/dosja/$id"
      params={{ id: item.id }}
      className="block rounded-md border bg-card p-3 shadow-soft transition-colors hover:border-primary/40 hover:bg-white"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-mono text-[11px] text-muted-foreground">{item.trackingCode}</div>
          <div className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug">{item.title}</div>
        </div>
        <PriorityBadge priority={item.priority} />
      </div>

      <div className="mt-3 grid gap-1.5 text-xs text-muted-foreground">
        <MetaLine icon={processIcon(item.process)} text={proc.title} />
        <MetaLine icon={UserRound} text={applicantName(item)} />
        <MetaLine
          icon={CircleDashed}
          text={`Faza ${phase?.order ?? "-"} - ${phase?.title ?? item.currentPhaseId}`}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <StatusBadge status={item.status} />
        <SignalBadges item={item} />
      </div>
    </Link>
  );
}

function DossierTableRow({ item }: { item: DossierListItem }) {
  const phase = currentPhase(item);
  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{item.trackingCode}</TableCell>
      <TableCell className="max-w-[260px]">
        <div className="truncate text-xs font-medium">{item.title}</div>
        <div className="truncate text-[11px] text-muted-foreground">
          {PROCESSES[item.process].title}
        </div>
      </TableCell>
      <TableCell className="hidden max-w-[170px] truncate text-xs md:table-cell">
        {applicantName(item)}
      </TableCell>
      <TableCell className="hidden text-xs lg:table-cell">
        <span className="font-medium">Faza {phase?.order ?? "-"}</span>{" "}
        <span className="text-muted-foreground">- {phase?.title ?? item.currentPhaseId}</span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <SignalBadges item={item} />
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge status={item.status} />
      </TableCell>
      <TableCell className="text-right">
        <Link
          to="/dosja/$id"
          params={{ id: item.id }}
          className="inline-flex h-8 items-center rounded-md px-2 text-xs font-semibold text-primary hover:bg-[var(--brand-blue-soft)]"
        >
          Hap
        </Link>
      </TableCell>
    </TableRow>
  );
}

function GroupHeader({ group, compact = false }: { group: DossierGroup; compact?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <div className={cn("truncate font-semibold", compact ? "text-sm" : "text-[13px]")}>
          {group.label}
        </div>
        {group.helper ? (
          <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{group.helper}</div>
        ) : null}
      </div>
      <span className="shrink-0 rounded-md bg-background px-2 py-0.5 text-xs font-semibold tabular-nums text-muted-foreground">
        {group.items.length}
      </span>
    </div>
  );
}

function SignalBadges({ item, compact = false }: { item: DossierListItem; compact?: boolean }) {
  const hasNoSignals =
    item.criticalCount + item.warningCount === 0 &&
    item.deadlineState !== "overdue" &&
    item.deadlineState !== "due_soon";

  if (hasNoSignals) {
    return compact ? (
      <span className="text-xs text-muted-foreground">Pa alarm</span>
    ) : (
      <SeverityBadge severity="info">qete</SeverityBadge>
    );
  }

  return (
    <>
      {item.criticalCount > 0 ? (
        <SeverityBadge severity="critical">{item.criticalCount} kritike</SeverityBadge>
      ) : null}
      {item.warningCount > 0 ? (
        <SeverityBadge severity="warning">{item.warningCount} paralajm.</SeverityBadge>
      ) : null}
      {item.deadlineState === "overdue" ? (
        <SeverityBadge severity="critical">vonese</SeverityBadge>
      ) : null}
      {item.deadlineState === "due_soon" ? (
        <SeverityBadge severity="warning">afat</SeverityBadge>
      ) : null}
    </>
  );
}

function MetaLine({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <Icon className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="truncate">{text}</span>
    </div>
  );
}

function DossierLoading({ view }: { view: DossierViewMode }) {
  const count = view === "board" ? 6 : 5;
  return (
    <div className={cn("grid gap-3", view === "board" ? "md:grid-cols-2 xl:grid-cols-3" : "")}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-md border p-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-2 h-5 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

function EmptyDossierState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-md border border-dashed py-10 text-center">
      <FolderKanban className="size-7 text-muted-foreground/60" />
      <div className="text-sm font-semibold">{title}</div>
      <div className="max-w-md text-xs text-muted-foreground">{body}</div>
    </div>
  );
}

function currentPhase(item: DossierListItem) {
  return PROCESSES[item.process].phases.find((phase) => phase.id === item.currentPhaseId);
}

function applicantName(item: DossierListItem) {
  return item.parties[0]?.fullName ?? "-";
}

function propertyZone(item: DossierListItem) {
  return item.property.zone || "Zone pa emer";
}

function sortDossiers(a: DossierListItem, b: DossierListItem) {
  return (
    prioritySort(a.priority) - prioritySort(b.priority) ||
    signalSort(a) - signalSort(b) ||
    (b.updatedAt > a.updatedAt ? 1 : -1)
  );
}

function signalSort(item: DossierListItem) {
  if (item.deadlineState === "overdue") return 0;
  if (item.criticalCount > 0 || item.status === "blocked") return 1;
  if (item.deadlineState === "due_soon") return 2;
  if (item.warningCount > 0) return 3;
  return 4;
}

function prioritySort(value: DossierListItem["priority"]) {
  if (value === "high") return 0;
  if (value === "normal") return 1;
  return 2;
}

function statusSort(value: DossierStatus) {
  const order: DossierStatus[] = [
    "blocked",
    "awaiting_external",
    "in_progress",
    "draft",
    "rejected",
    "completed",
  ];
  return order.indexOf(value);
}

function processSort(value: ProcessKind) {
  const order: ProcessKind[] = ["ekb_privatization", "expropriation", "property_registration"];
  return order.indexOf(value);
}

function processIcon(process: ProcessKind): LucideIcon {
  if (process === "property_registration") return Building2;
  if (process === "expropriation") return AlertTriangle;
  return FolderKanban;
}
