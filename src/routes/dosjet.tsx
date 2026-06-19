import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PriorityBadge, StatusBadge } from "@/components/status-badge";
import { createDossier, listDossiers } from "@/lib/api/dossiers.functions";
import { PROCESSES } from "@/core";
import type { ProcessKind } from "@/core/types";
import { toast } from "sonner";

export const Route = createFileRoute("/dosjet")({
  head: () => ({
    meta: [{ title: "Dosjet — Smart Dossier" }],
  }),
  component: DosjetPage,
});

function DosjetPage() {
  const [q, setQ] = useState("");
  const [process, setProcess] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [priority, setPriority] = useState<string>("all");

  const list = useServerFn(listDossiers);
  const listQ = useQuery({
    queryKey: ["dossiers", process, status, priority, q],
    queryFn: () =>
      list({
        data: {
          process: process === "all" ? undefined : (process as ProcessKind),
          status:
            status === "all"
              ? undefined
              : (status as
                  | "draft"
                  | "in_progress"
                  | "blocked"
                  | "awaiting_external"
                  | "completed"
                  | "rejected"),
          priority: priority === "all" ? undefined : (priority as "low" | "normal" | "high"),
          search: q || undefined,
        },
      }),
  });

  // group by phase for column view
  const grouped = useMemo(() => {
    const map = new Map<
      string,
      {
        phaseTitle: string;
        order: number;
        procKind: ProcessKind;
        items: NonNullable<typeof listQ.data>["items"];
      }
    >();
    for (const d of listQ.data?.items ?? []) {
      const proc = PROCESSES[d.process];
      const phase = proc.phases.find((p) => p.id === d.currentPhaseId);
      const key = `${d.process}:${d.currentPhaseId}`;
      const prev = map.get(key);
      if (prev) prev.items.push(d);
      else
        map.set(key, {
          phaseTitle: phase?.title ?? d.currentPhaseId,
          order: phase?.order ?? 99,
          procKind: d.process,
          items: [d],
        });
    }
    return Array.from(map.values()).sort((a, b) =>
      a.procKind === b.procKind ? a.order - b.order : a.procKind.localeCompare(b.procKind),
    );
  }, [listQ.data]);

  return (
    <AppShell>
      <div className="px-4 md:px-6 py-5 space-y-4 max-w-[1500px] mx-auto">
        {/* Header */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight truncate">Dosjet</h1>
            <p className="text-xs text-muted-foreground">
              Filtroni dosjet sipas procesit, statusit dhe prioritetit.
            </p>
          </div>
          <NewDossierDialog onCreated={() => listQ.refetch()} />
        </div>

        {/* Filters */}
        <Card className="p-3 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Kërko sipas kodit, titullit, qytetarit…"
              className="pl-8 h-9 text-sm"
            />
          </div>
          <Select value={process} onValueChange={setProcess}>
            <SelectTrigger className="h-9 text-sm w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Të gjitha proceset</SelectItem>
              <SelectItem value="ekb_privatization">Privatizim EKB</SelectItem>
              <SelectItem value="expropriation">Shpronësim</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 text-sm w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Të gjitha statuset</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="in_progress">Në proces</SelectItem>
              <SelectItem value="blocked">Bllokuar</SelectItem>
              <SelectItem value="awaiting_external">Pres jashtë</SelectItem>
              <SelectItem value="completed">Mbyllur</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="h-9 text-sm w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Çdo prioritet</SelectItem>
              <SelectItem value="high">I lartë</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="low">I ulët</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {/* Phase columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {grouped.map((g) => (
            <Card key={`${g.procKind}:${g.order}`} className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {PROCESSES[g.procKind].title}
                  </div>
                  <div className="text-sm font-semibold truncate">
                    Faza {g.order} · {g.phaseTitle}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                  {g.items.length}
                </span>
              </div>
              <div className="space-y-1.5">
                {g.items.map((d) => (
                  <Link
                    key={d.id}
                    to="/dosja/$id"
                    params={{ id: d.id }}
                    className="block rounded-md border bg-card hover:bg-muted/40 p-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] text-muted-foreground truncate">
                        {d.trackingCode}
                      </span>
                      <PriorityBadge priority={d.priority} />
                    </div>
                    <div className="text-sm font-medium truncate mt-0.5">{d.title}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground truncate">
                        {d.parties[0]?.fullName ?? "—"}
                      </span>
                      <StatusBadge status={d.status} />
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          ))}
          {!grouped.length && (
            <Card className="p-6 col-span-full text-center text-sm text-muted-foreground">
              Nuk u gjet asnjë dosje me filtrat aktualë.
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function NewDossierDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [process, setProcess] = useState<ProcessKind>("ekb_privatization");
  const [title, setTitle] = useState("");
  const [applicantName, setApplicant] = useState("");
  const [zone, setZone] = useState("");
  const [propertyDescription, setProp] = useState("");
  const create = useServerFn(createDossier);
  const qc = useQueryClient();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-3.5 mr-1" /> Dosje e re
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Krijo dosje të re</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Procesi</Label>
            <Select value={process} onValueChange={(v) => setProcess(v as ProcessKind)}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ekb_privatization">Privatizim EKB</SelectItem>
                <SelectItem value="expropriation">Shpronësim</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Field label="Titulli" value={title} setValue={setTitle} />
          <Field label="Qytetari / Pronari" value={applicantName} setValue={setApplicant} />
          <Field label="Zona" value={zone} setValue={setZone} />
          <Field label="Përshkrim i pasurisë" value={propertyDescription} setValue={setProp} />
        </div>
        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Anulo
          </Button>
          <Button
            size="sm"
            onClick={async () => {
              try {
                const r = await create({
                  data: { process, title, applicantName, zone, propertyDescription },
                });
                toast.success(`Krijuar: ${r.trackingCode}`);
                setOpen(false);
                setTitle("");
                setApplicant("");
                setZone("");
                setProp("");
                qc.invalidateQueries({ queryKey: ["dossiers"] });
                qc.invalidateQueries({ queryKey: ["dashboard"] });
                onCreated();
              } catch (e) {
                toast.error(e instanceof Error ? e.message : "Gabim");
              }
            }}
          >
            Krijo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input value={value} onChange={(e) => setValue(e.target.value)} className="h-9 text-sm" />
    </div>
  );
}
