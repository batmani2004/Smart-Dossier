import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { CheckCircle2, Copy, ExternalLink, Plus, Search, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AccessNotice } from "@/components/role-switcher";
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
import { useDemoRole } from "@/lib/demo-access";
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
  const { role, profile, can } = useDemoRole();

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

  if (role === "citizen" || role === "business") {
    return (
      <AppShell>
        <div className="px-4 md:px-6 py-5 max-w-[900px] mx-auto space-y-4">
          <AccessNotice
            title="Lista e dosjeve eshte e brendshme"
            body={
              role === "business"
                ? "Biznesi nuk sheh dosjet e subjekteve te tjera. Aplikimi behet me NIPT dhe gjurmohet me kodin publik."
                : "Qytetari nuk sheh dosjet e qytetareve te tjere, shenime pune, audit apo dokumente. Per qytetarin perdoret vetem kodi i gjurmimit."
            }
          />
          <Card className="p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Perdoruesi aktiv
            </div>
            <h1 className="mt-1 text-xl font-semibold">{profile.displayName}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile.credentialLabel} - {profile.description}
            </p>
            <Button asChild size="sm" className="mt-4">
              {role === "business" ? (
                <Link to="/biznes">Hap portalin e biznesit</Link>
              ) : (
                <Link to="/track/$code" params={{ code: "EKB-2026-000014" }}>
                  Hap portalin qytetar
                </Link>
              )}
            </Button>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="px-4 md:px-6 py-5 space-y-4 max-w-[1500px] mx-auto">
        {/* Header */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight truncate">Dosjet</h1>
            <p className="text-xs text-muted-foreground">
              Hapni rradhen e punes; AI nxjerr sinjalet dhe nepunesi konfirmon veprimin.
            </p>
          </div>
          {can("createDossier") ? <NewDossierDialog onCreated={() => listQ.refetch()} /> : null}
        </div>

        <Card className="border-primary/25 bg-primary/5 p-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold">Rradha e asistuar nga AI</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Filloni me prioritetin e larte; agjenti sugjeron verifikimin, llogaritjen dhe
                  dokumentin per konfirmim.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="rounded-md border bg-background px-2 py-1">1. Lexo PDF</span>
              <span className="rounded-md border bg-background px-2 py-1">2. Llogarit</span>
              <span className="rounded-md border bg-background px-2 py-1">3. Konfirmo</span>
            </div>
          </div>
        </Card>

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
              <SelectItem value="property_registration">Regjistrim prone biznesi</SelectItem>
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
                    <div className="text-[11px] text-muted-foreground truncate mt-0.5">
                      Operator: {d.assignedOperatorName ?? "Pa caktuar"}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground truncate">
                        {d.parties[0]?.fullName ?? "—"}
                      </span>
                      <StatusBadge status={d.status} />
                    </div>
                    <div className="mt-1 rounded-md bg-muted/40 px-2 py-1 font-mono text-[10px] text-muted-foreground truncate">
                      Link qytetari: /track/{d.trackingCode}
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

function absoluteTrackingUrl(code: string) {
  const path = `/track/${encodeURIComponent(code)}`;
  return typeof window === "undefined" ? path : `${window.location.origin}${path}`;
}

function NewDossierDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [process, setProcess] = useState<ProcessKind>("ekb_privatization");
  const [title, setTitle] = useState("");
  const [applicantName, setApplicant] = useState("");
  const [applicantNipt, setApplicantNipt] = useState("");
  const [zone, setZone] = useState("");
  const [propertyDescription, setProp] = useState("");
  const [created, setCreated] = useState<{ id: string; trackingCode: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const create = useServerFn(createDossier);
  const qc = useQueryClient();
  const createdUrl = created ? absoluteTrackingUrl(created.trackingCode) : "";

  async function copyCreatedLink() {
    if (!createdUrl) return;
    try {
      await navigator.clipboard.writeText(createdUrl);
      setCopied(true);
      toast.success("Linku u kopjua");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Linku nuk u kopjua");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setCreated(null);
          setCopied(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-3.5 mr-1" /> Aplikim qytetari
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Regjistro aplikim qytetari</DialogTitle>
        </DialogHeader>
        {created ? (
          <Card className="border-success/25 bg-success/5 p-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">Aplikimi u regjistrua</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Kodi dhe linku publik u gjeneruan per qytetarin.
                </div>
                <div className="mt-2 rounded-md border bg-background px-2 py-1.5 font-mono text-xs">
                  {created.trackingCode}
                </div>
                <div className="mt-2 rounded-md border bg-background px-2 py-1.5 font-mono text-[11px] break-all text-muted-foreground">
                  {createdUrl}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="button" size="sm" onClick={copyCreatedLink}>
                    <Copy className="mr-1.5 size-3.5" />
                    {copied ? "Kopjuar" : "Kopjo linkun"}
                  </Button>
                  <Button asChild type="button" size="sm" variant="outline">
                    <a href={createdUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="mr-1.5 size-3.5" />
                      Hap portalin
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ) : null}
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
                <SelectItem value="property_registration">Regjistrim prone biznesi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Field label="Titulli" value={title} setValue={setTitle} />
          <Field
            label={
              process === "property_registration" ? "Biznesi / Subjekti" : "Qytetari / Pronari"
            }
            value={applicantName}
            setValue={setApplicant}
          />
          {process === "property_registration" ? (
            <Field label="NIPT" value={applicantNipt} setValue={setApplicantNipt} />
          ) : null}
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
                  data: {
                    process,
                    title,
                    applicantName,
                    applicantNipt: applicantNipt || undefined,
                    zone,
                    propertyDescription,
                  },
                });
                setCreated({ id: r.id, trackingCode: r.trackingCode });
                setCopied(false);
                toast.success(`Aplikimi u regjistrua dhe linku u gjenerua: ${r.trackingCode}`);
                setTitle("");
                setApplicant("");
                setApplicantNipt("");
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
            Regjistro
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
