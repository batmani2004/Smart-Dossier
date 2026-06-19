import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  History,
  ListChecks,
  Sparkles,
  Upload,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PriorityBadge, SeverityBadge, StatusBadge } from "@/components/status-badge";
import { AiExtractPanel } from "@/components/ai-extract-panel";
import { AiAssistPanel } from "@/components/ai-assist-panel";
import { DocGeneratorPanel } from "@/components/doc-generator-panel";
import { ShareTracking } from "@/components/share-tracking";
import { advanceDossier, getDossier, uploadDocument } from "@/lib/api/dossiers.functions";
import { PROCESSES } from "@/core";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dosja/$id")({
  head: () => ({ meta: [{ title: "Dosja — Smart Dossier" }] }),
  component: DossierWorkspace,
});

function DossierWorkspace() {
  const { id } = Route.useParams();
  const get = useServerFn(getDossier);
  const advance = useServerFn(advanceDossier);
  const qc = useQueryClient();

  const q = useQuery({ queryKey: ["dossier", id], queryFn: () => get({ data: { id } }) });

  if (q.isLoading) {
    return (
      <AppShell>
        <div className="p-6 text-sm text-muted-foreground">Duke ngarkuar…</div>
      </AppShell>
    );
  }
  if (!q.data) {
    return (
      <AppShell>
        <div className="p-6">
          <p className="text-sm">Dosja nuk u gjet.</p>
          <Button size="sm" asChild className="mt-3">
            <Link to="/dosjet">Mbrapsht te dosjet</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const { dossier: d, summary, alerts, deadline, nextStep } = q.data;
  const proc = PROCESSES[d.process];
  const currentPhase = proc.phases.find((p) => p.id === d.currentPhaseId);
  const currentStep = currentPhase?.steps.find((s) => s.id === d.currentStepId);
  const priority =
    deadline.state === "overdue"
      ? ("high" as const)
      : alerts.filter((a) => a.severity === "critical").length >= 2
        ? ("high" as const)
        : deadline.state === "due_soon"
          ? ("normal" as const)
          : ("low" as const);

  return (
    <AppShell>
      <div className="px-4 md:px-6 py-5 space-y-4 max-w-[1400px] mx-auto">
        {/* Header */}
        <Card className="p-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 items-start">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs text-muted-foreground">{d.trackingCode}</span>
                <StatusBadge status={d.status} />
                <PriorityBadge priority={priority} />
                <span className="text-[11px] text-muted-foreground">{proc.title}</span>
              </div>
              <h1 className="mt-1 text-lg md:text-xl font-semibold tracking-tight truncate">
                {d.title}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {currentPhase?.institutions.join(" · ")} · Faza {currentPhase?.order} ·{" "}
                {currentPhase?.title}
              </p>
            </div>
            <div className="shrink-0 flex flex-col gap-1.5 items-end">
              <Button
                size="sm"
                onClick={async () => {
                  try {
                    const r = await advance({ data: { id: d.id } });
                    toast.success(r.final ? "Procedura u mbyll" : "U avancua hapi");
                    qc.invalidateQueries({ queryKey: ["dossier", id] });
                    qc.invalidateQueries({ queryKey: ["dashboard"] });
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : "Gabim");
                  }
                }}
              >
                Avanco hapin <ArrowRight className="size-3.5 ml-1" />
              </Button>
              <ShareTracking code={d.trackingCode} />
              {nextStep && !nextStep.isFinal ? (
                <span className="text-[11px] text-muted-foreground text-right">
                  Tjetri: {nextStep.step.title}
                </span>
              ) : null}
            </div>
          </div>

          {/* phase pills */}
          <div className="mt-3 -mx-1 px-1 overflow-x-auto">
            <div className="flex gap-1.5 min-w-max">
              {proc.phases.map((p) => {
                const isCurrent = p.id === d.currentPhaseId;
                const isDone =
                  proc.phases.findIndex((x) => x.id === d.currentPhaseId) > p.order - 1;
                return (
                  <div
                    key={p.id}
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] border",
                      isCurrent
                        ? "bg-info/15 text-info border-info/30"
                        : isDone
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-muted text-muted-foreground border-transparent",
                    )}
                  >
                    {isDone ? (
                      <CheckCircle2 className="size-3" />
                    ) : isCurrent ? (
                      <Circle className="size-3 fill-info text-info" />
                    ) : (
                      <Circle className="size-3" />
                    )}
                    <span>F{p.order}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="permbledhje">
          <TabsList className="flex w-full overflow-x-auto">
            <TabsTrigger value="permbledhje" className="text-xs">
              Përmbledhje
            </TabsTrigger>
            <TabsTrigger value="dokumentet" className="text-xs">
              Dokumentet
            </TabsTrigger>
            <TabsTrigger value="lista" className="text-xs">
              Lista
            </TabsTrigger>
            <TabsTrigger value="workflow" className="text-xs">
              Workflow
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-xs">
              AI
            </TabsTrigger>
            <TabsTrigger value="gjenero" className="text-xs">
              Gjenero
            </TabsTrigger>
            <TabsTrigger value="historiku" className="text-xs">
              Historiku
            </TabsTrigger>
          </TabsList>

          {/* Përmbledhje */}
          <TabsContent value="permbledhje" className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Card className="p-3 md:col-span-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="size-3.5 text-info" />
                  <h2 className="text-sm font-semibold">AI përmbledhje</h2>
                </div>
                <ul className="text-xs space-y-1 text-foreground/90">
                  <li>
                    <strong>Procesi:</strong> {summary.process}
                  </li>
                  <li>
                    <strong>Faza aktuale:</strong> {summary.currentPhase} — {summary.currentStep}
                  </li>
                  {summary.nextStep ? (
                    <li>
                      <strong>Hapi tjetër:</strong> {summary.nextStep}
                    </li>
                  ) : null}
                  <li>
                    <strong>Dokumente:</strong> {summary.documentsUploaded} të ngarkuara,{" "}
                    {summary.documentsMissing.length} mungojnë
                  </li>
                  <li>
                    <strong>Afati:</strong> {summary.deadlineState}
                    {summary.daysToNearestDeadline !== undefined
                      ? ` (${summary.daysToNearestDeadline} ditë)`
                      : ""}
                  </li>
                  <li>
                    <strong>Bazë ligjore:</strong> {summary.legalBasis.join(", ")}
                  </li>
                </ul>
              </Card>
              <Card className="p-3">
                <h2 className="text-sm font-semibold mb-1.5">Fushat që mungojnë</h2>
                {summary.documentsMissing.length ? (
                  <ul className="text-xs space-y-1">
                    {summary.documentsMissing.map((t) => (
                      <li key={t} className="flex items-center gap-1.5">
                        <AlertTriangle className="size-3 text-warning" /> {t}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">Të gjitha të plotësuara.</p>
                )}
              </Card>
            </div>
            <Card className="p-3">
              <h2 className="text-sm font-semibold mb-1.5">Alarme kritike</h2>
              {alerts.length ? (
                <ul className="space-y-1.5">
                  {alerts.map((a) => (
                    <li key={a.id} className="flex items-start gap-2">
                      <SeverityBadge severity={a.severity}>{a.label}</SeverityBadge>
                      <span className="text-xs text-muted-foreground">{a.description}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">Pa alarme.</p>
              )}
            </Card>
          </TabsContent>

          {/* Dokumentet */}
          <TabsContent value="dokumentet" className="space-y-3">
            <UploadCard dossierId={d.id} />
            <Card className="p-3">
              <h2 className="text-sm font-semibold mb-2">Dokumentet e ngarkuara</h2>
              {d.documents.length ? (
                <ul className="divide-y">
                  {d.documents.map((doc) => (
                    <li
                      key={doc.id}
                      className="py-2 text-sm flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="font-medium truncate">{doc.name}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {doc.type} · {doc.status}
                        </div>
                      </div>
                      <span className="text-[11px] text-muted-foreground shrink-0">
                        {doc.uploadedAt?.slice(0, 10)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">Pa dokumente.</p>
              )}
            </Card>
            {d.insights.filter((i) => i.kind === "extraction").length ? (
              <Card className="p-3">
                <h2 className="text-sm font-semibold mb-2">Fusha të ekstraktuara nga AI</h2>
                <ul className="space-y-2 text-sm">
                  {d.insights
                    .filter((i) => i.kind === "extraction")
                    .map((i) => (
                      <li key={i.id} className="border rounded-md p-2">
                        <div className="text-xs text-muted-foreground">{i.text}</div>
                        {i.data ? (
                          <pre className="mt-1 text-[11px] bg-muted/40 rounded p-1.5 overflow-x-auto">
                            {JSON.stringify(i.data, null, 2)}
                          </pre>
                        ) : null}
                      </li>
                    ))}
                </ul>
              </Card>
            ) : null}
          </TabsContent>

          {/* Lista */}
          <TabsContent value="lista" className="space-y-3">
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <ListChecks className="size-4 text-info" />
                <h2 className="text-sm font-semibold">Checklist për fazën aktuale</h2>
              </div>
              {currentStep?.requiredDocuments?.length ? (
                <ul className="space-y-1.5 text-sm">
                  {currentStep.requiredDocuments.map((t) => {
                    const ok = d.documents.some((doc) => doc.type === t);
                    return (
                      <li key={t} className="flex items-center gap-2">
                        {ok ? (
                          <CheckCircle2 className="size-4 text-success" />
                        ) : (
                          <Circle className="size-4 text-muted-foreground" />
                        )}
                        <span className={ok ? "" : "text-muted-foreground"}>{t}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">Pa kërkesa specifike.</p>
              )}
            </Card>
            <Card className="p-3">
              <h2 className="text-sm font-semibold mb-2">Lista e plotë e procesit</h2>
              <ol className="space-y-2 text-sm">
                {proc.phases.flatMap((p) =>
                  p.steps.map((s) => (
                    <li key={s.id} className="border-l-2 pl-3 py-0.5 border-muted">
                      <div className="text-xs text-muted-foreground">
                        F{p.order} · {p.title}
                      </div>
                      <div className="font-medium text-sm">{s.title}</div>
                      {s.requiredDocuments?.length ? (
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          Dok: {s.requiredDocuments.join(", ")}
                        </div>
                      ) : null}
                    </li>
                  )),
                )}
              </ol>
            </Card>
          </TabsContent>

          {/* Workflow */}
          <TabsContent value="workflow" className="space-y-3">
            <Card className="p-3">
              <ol className="relative border-l ml-3 space-y-3">
                {proc.phases.flatMap((p) =>
                  p.steps.map((s) => {
                    const phaseIdx = proc.phases.findIndex((x) => x.id === p.id);
                    const currentPhaseIdx = proc.phases.findIndex((x) => x.id === d.currentPhaseId);
                    const isCurrent = s.id === d.currentStepId;
                    const isDone =
                      phaseIdx < currentPhaseIdx ||
                      (phaseIdx === currentPhaseIdx &&
                        p.steps.findIndex((x) => x.id === s.id) <
                          p.steps.findIndex((x) => x.id === d.currentStepId));
                    return (
                      <li key={s.id} className="ml-3">
                        <span
                          className={cn(
                            "absolute -left-[7px] mt-1 size-3 rounded-full border-2 border-background",
                            isDone ? "bg-success" : isCurrent ? "bg-info" : "bg-muted",
                          )}
                        />
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] text-muted-foreground">
                            F{p.order} · {p.title}
                          </span>
                          {isCurrent && <SeverityBadge severity="info">aktiv</SeverityBadge>}
                          {isDone && <SeverityBadge severity="info">kryer</SeverityBadge>}
                        </div>
                        <div className="text-sm font-medium">{s.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {s.institution}
                          {s.slaDays ? ` · SLA ${s.slaDays}d` : ""}
                          {s.manual ? " · manual" : ""}
                        </div>
                        {s.criticalPoints?.length ? (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {s.criticalPoints.map((c) => (
                              <SeverityBadge key={c.id} severity={c.severity}>
                                {c.label}
                              </SeverityBadge>
                            ))}
                          </div>
                        ) : null}
                      </li>
                    );
                  }),
                )}
              </ol>
            </Card>
          </TabsContent>

          {/* AI Assistant */}
          <TabsContent value="ai" className="space-y-3">
            <AiExtractPanel dossier={d} />
            <AiAssistPanel dossier={{ id: d.id, trackingCode: d.trackingCode }} />
          </TabsContent>

          {/* Gjenero dokumente */}
          <TabsContent value="gjenero" className="space-y-3">
            <DocGeneratorPanel dossierId={d.id} />
          </TabsContent>

          {/* Historiku */}
          <TabsContent value="historiku">
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <History className="size-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">Historiku i audituar</h2>
              </div>
              {d.audit.length ? (
                <ol className="space-y-1.5">
                  {[...d.audit].reverse().map((e) => (
                    <li key={e.id} className="text-xs flex items-start gap-2 border-b pb-1.5">
                      <Clock className="size-3 mt-0.5 text-muted-foreground" />
                      <div className="min-w-0">
                        <div>
                          <span className="font-medium">{e.action}</span>
                          {e.details ? (
                            <span className="text-muted-foreground"> — {e.details}</span>
                          ) : null}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {e.at.replace("T", " ").slice(0, 19)} · {e.actor}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-xs text-muted-foreground">Pa ngjarje.</p>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

function UploadCard({ dossierId }: { dossierId: string }) {
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [extracted, setExtracted] = useState("");
  const upload = useServerFn(uploadDocument);
  const qc = useQueryClient();
  return (
    <Card className="p-3">
      <div className="flex items-center gap-2 mb-2">
        <Upload className="size-4 text-info" />
        <h2 className="text-sm font-semibold">Ngarko dokument (demo)</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Tipi (p.sh. family_certificate)</Label>
          <Input value={type} onChange={(e) => setType(e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Emri i skedarit</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9 text-sm" />
        </div>
      </div>
      <div className="space-y-1.5 mt-2">
        <Label className="text-xs">Fusha të ekstraktuara (JSON, opsionale)</Label>
        <Textarea
          value={extracted}
          onChange={(e) => setExtracted(e.target.value)}
          rows={3}
          className="text-xs font-mono"
          placeholder='{"emri":"Arta Beqiri","atesia":"Petrit"}'
        />
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <Button
          size="sm"
          onClick={async () => {
            try {
              let extractedObj: Record<string, unknown> | undefined;
              if (extracted.trim()) {
                try {
                  extractedObj = JSON.parse(extracted);
                } catch {
                  toast.error("JSON i pavlefshëm");
                  return;
                }
              }
              await upload({
                data: {
                  id: dossierId,
                  type: type || "document",
                  name: name || "untitled.pdf",
                  extracted: extractedObj as Record<string, unknown> | undefined,
                  aiGenerated: !!extractedObj,
                },
              });
              toast.success("U ngarkua");
              setName("");
              setType("");
              setExtracted("");
              qc.invalidateQueries({ queryKey: ["dossier", dossierId] });
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Gabim");
            }
          }}
        >
          <FileText className="size-3.5 mr-1" /> Ngarko
        </Button>
      </div>
    </Card>
  );
}
