import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Circle,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileText,
  History,
  IdCard,
  ListChecks,
  MapPinned,
  MessageSquare,
  Scale,
  ShieldCheck,
  Sparkles,
  Upload,
  UserCheck,
  UsersRound,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PriorityBadge, SeverityBadge, StatusBadge } from "@/components/status-badge";
import { AiExtractPanel } from "@/components/ai-extract-panel";
import { AiAssistPanel } from "@/components/ai-assist-panel";
import { DocGeneratorPanel } from "@/components/doc-generator-panel";
import { ParcelMap } from "@/components/parcel-polygon-overlay";
import { AccessNotice } from "@/components/role-switcher";
import { ShareTracking } from "@/components/share-tracking";
import {
  advanceDossier,
  getDossier,
  reviewExpeditedProcedure,
  updateRequesterVerification,
  uploadDocument,
} from "@/lib/api/dossiers.functions";
import { PROCESSES } from "@/core";
import type { Dossier, PhaseDefinition } from "@/core/types";
import { useDemoRole } from "@/lib/demo-access";
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
  const { role, profile, can } = useDemoRole();

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
  const currentPhaseDuration = currentPhase ? phaseDurationDays(currentPhase) : undefined;

  if (role === "citizen") {
    return (
      <AppShell>
        <div className="px-4 md:px-6 py-5 max-w-[900px] mx-auto space-y-4">
          <AccessNotice
            title="Dosja e brendshme nuk shfaqet per qytetarin"
            body="Ky ekran ka audit, shenime pune, dokumente dhe veprime administrative. Qytetari sheh vetem pamjen publike me kod gjurmimi."
          />
          <Card className="p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Perdoruesi aktiv
            </div>
            <h1 className="mt-1 text-xl font-semibold">{profile.displayName}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile.credentialLabel} - {profile.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link to="/track/$code" params={{ code: d.trackingCode }}>
                  Hap portalin qytetar
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/track/$code" params={{ code: "EKB-2026-000014" }}>
                  Demo EKB qytetar
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </AppShell>
    );
  }

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
      <div className="mx-auto max-w-[1400px] space-y-4 px-4 py-4 md:px-6">
        {/* Header */}
        <Card className="work-surface p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <Button asChild size="sm" variant="ghost" className="h-8 px-2 text-xs">
              <Link to="/dosjet">
                <ArrowLeft className="size-3.5" />
                Kthehu
              </Link>
            </Button>
            <div className="flex flex-wrap items-center gap-2">
              <span className="console-pill">
                <span className="font-mono">{d.trackingCode}</span>
              </span>
              <span className="console-pill border-warning/40 bg-warning/10 text-warning-foreground">
                {currentStep?.title ?? currentPhase?.title ?? "Ne shqyrtim"}
              </span>
            </div>
          </div>
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
                {currentPhaseDuration ? ` · Kohëzgjatje ${currentPhaseDuration} ditë` : ""}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Operator përgjegjës:{" "}
                <span className={d.assignedOperatorName ? "font-medium text-foreground" : ""}>
                  {d.assignedOperatorName ?? "Pa caktuar"}
                </span>
                {!d.assignedOperatorName && d.assignmentDueAt
                  ? ` · auto pas ${new Date(d.assignmentDueAt).toLocaleTimeString("sq-AL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : ""}
              </p>
            </div>
            <div className="shrink-0 flex flex-col gap-1.5 items-end">
              {can("advanceDossier") ? (
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
              ) : null}
              <ShareTracking code={d.trackingCode} />
              {nextStep && !nextStep.isFinal ? (
                <span className="text-[11px] text-muted-foreground text-right">
                  Tjetri: {nextStep.step.title}
                </span>
              ) : null}
            </div>
          </div>

          <DossierProgressRail phases={proc.phases} currentPhaseId={d.currentPhaseId} />

          {/* phase pills */}
          <div className="hidden">
            <div className="flex gap-1.5 min-w-max">
              {proc.phases.map((p) => {
                const isCurrent = p.id === d.currentPhaseId;
                const isDone =
                  proc.phases.findIndex((x) => x.id === d.currentPhaseId) > p.order - 1;
                const durationDays = phaseDurationDays(p);
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
                    <span className="text-[10px] opacity-75">{durationDays} ditë</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="workflow">
          <TabsList className="flex h-auto w-full justify-start overflow-x-auto rounded-md border bg-[#e6eef8] p-1">
            <TabsTrigger value="permbledhje" className="text-xs">
              <Sparkles className="size-3.5" />
              Përmbledhje
            </TabsTrigger>
            <TabsTrigger value="dokumentet" className="text-xs">
              <FileText className="size-3.5" />
              Dokumentet
            </TabsTrigger>
            <TabsTrigger value="verifikimi" className="text-xs">
              <UserCheck className="size-3.5" />
              Verifikimi
            </TabsTrigger>
            <TabsTrigger value="pershpejtimi" className="text-xs">
              <Clock className="size-3.5" />
              Pershpejtimi
              {d.expeditedProcedure?.status === "submitted" ? (
                <span className="ml-1 rounded bg-warning/20 px-1 text-[10px] text-warning-foreground">
                  1
                </span>
              ) : null}
            </TabsTrigger>
            {can("viewAudit") ? (
              <TabsTrigger value="ankesa" className="text-xs">
                <MessageSquare className="size-3.5" />
                Ankesa
                {d.citizenComplaints?.length ? (
                  <span className="ml-1 rounded bg-destructive/15 px-1 text-[10px] text-destructive">
                    {d.citizenComplaints.length}
                  </span>
                ) : null}
              </TabsTrigger>
            ) : null}
            <TabsTrigger value="lista" className="text-xs">
              <ListChecks className="size-3.5" />
              Lista
            </TabsTrigger>
            <TabsTrigger value="workflow" className="text-xs">
              <ClipboardCheck className="size-3.5" />
              Workflow
            </TabsTrigger>
            {can("runAi") ? (
              <TabsTrigger value="ai" className="text-xs">
                <Sparkles className="size-3.5" />
                AI
              </TabsTrigger>
            ) : null}
            {can("generateDocuments") ? (
              <TabsTrigger value="gjenero" className="text-xs">
                <FileText className="size-3.5" />
                Gjenero
              </TabsTrigger>
            ) : null}
            {can("viewAudit") ? (
              <TabsTrigger value="historiku" className="text-xs">
                <History className="size-3.5" />
                Historiku
              </TabsTrigger>
            ) : null}
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
                  {currentPhaseDuration ? (
                    <li>
                      <strong>Kohëzgjatja e fazës:</strong> {currentPhaseDuration} ditë
                      {currentStep?.slaDays ? ` (hapi aktual ${currentStep.slaDays} ditë)` : ""}
                    </li>
                  ) : null}
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
            {d.process === "expropriation" ? <AkptGisDemoCard dossier={d} /> : null}
          </TabsContent>

          {/* Dokumentet */}
          <TabsContent value="dokumentet" className="space-y-3">
            {can("uploadDocument") ? (
              <UploadCard dossierId={d.id} />
            ) : (
              <AccessNotice
                title="Ngarkimi i dokumenteve eshte i kufizuar"
                body="Ky rol mund te konsultoje dosjen, por nuk mund te shtoje dokumente administrative."
              />
            )}
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
                        {doc.notes ? (
                          <div className="mt-1 flex flex-wrap items-center gap-1">
                            <span className="inline-flex items-center gap-1 rounded-md border border-success/25 bg-success/10 px-1.5 py-0.5 text-[10px] text-success">
                              <ShieldCheck className="size-3" />
                              {doc.notes.includes("Vulosur elektronikisht")
                                ? "Vulosur elektronikisht"
                                : doc.notes}
                            </span>
                            {doc.notes.includes("Vulosur elektronikisht") ? (
                              <span className="inline-flex items-center rounded-md border border-info/25 bg-info/10 px-1.5 py-0.5 text-[10px] text-info">
                                I dërguar qytetarit
                              </span>
                            ) : null}
                          </div>
                        ) : null}
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

          <TabsContent value="verifikimi" className="space-y-3">
            <RequesterVerificationPanel dossier={d} readOnly={!can("uploadDocument")} />
          </TabsContent>

          <TabsContent value="pershpejtimi" className="space-y-3">
            <ExpeditedProcedurePanel dossier={d} readOnly={!can("advanceDossier")} />
          </TabsContent>

          {can("viewAudit") ? (
            <TabsContent value="ankesa" className="space-y-3">
              <OperatorComplaintsPanel dossier={d} />
            </TabsContent>
          ) : null}

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
            <ApprovalHierarchyCard dossier={d} currentPhase={currentPhase} />
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
                          {s.slaDays ? ` · Kohëzgjatje ${s.slaDays} ditë` : ""}
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
          {can("runAi") ? (
            <TabsContent value="ai" className="space-y-3">
              <AiExtractPanel dossier={d} />
              <AiAssistPanel dossier={{ id: d.id, trackingCode: d.trackingCode }} />
            </TabsContent>
          ) : null}

          {/* Gjenero dokumente */}
          {can("generateDocuments") ? (
            <TabsContent value="gjenero" className="space-y-3">
              <DocGeneratorPanel dossierId={d.id} />
            </TabsContent>
          ) : null}

          {/* Historiku */}
          {can("viewAudit") ? (
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
          ) : null}
        </Tabs>
      </div>
    </AppShell>
  );
}

function phaseDurationDays(phase: PhaseDefinition) {
  return phase.steps.reduce((total, step) => total + (step.slaDays ?? 0), 0);
}

function ApprovalHierarchyCard({
  dossier,
  currentPhase,
}: {
  dossier: Dossier;
  currentPhase: PhaseDefinition | undefined;
}) {
  const institution = currentPhase?.institutions[0] ?? "Institucioni";
  const steps = [
    {
      title: "Eksperti",
      subtitle: dossier.assignedOperatorName ?? "Pa caktuar",
      state: dossier.assignedOperatorName ? "Ne proces" : "Ne pritje",
      icon: UserCheck,
      active: true,
    },
    {
      title: "Sekretari",
      subtitle: institution,
      state: "Ne pritje",
      icon: FileText,
      active: false,
    },
    {
      title: "Drejtori Juridik",
      subtitle: currentPhase?.title ?? "Verifikim",
      state: "Refuzoi",
      icon: Scale,
      active: false,
    },
    {
      title: "Drejtori i Pergjithshem",
      subtitle: institution,
      state: "Refuzoi",
      icon: ShieldCheck,
      active: false,
    },
  ];

  return (
    <Card className="work-surface p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <UsersRound className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Hierarkia e Miratimit</h2>
        </div>
        <span className="console-pill bg-primary/10 text-primary">
          {dossier.status === "blocked" ? "Bllokuar" : "Ne Shqyrtim"}
        </span>
      </div>
      <ol
        className="grid gap-3 text-center md:grid-cols-4"
        aria-label="Hierarkia e miratimit te dosjes"
      >
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <li key={step.title} className="relative">
              {index > 0 ? (
                <span className="absolute -left-1/2 top-5 hidden h-px w-full bg-border md:block" />
              ) : null}
              <div
                className={cn(
                  "relative mx-auto grid size-11 place-items-center rounded-full border bg-card text-muted-foreground shadow-soft",
                  step.active && "border-primary bg-primary text-primary-foreground",
                )}
              >
                <Icon className="size-4" />
              </div>
              <div className="mt-2 text-xs font-semibold">{step.title}</div>
              <div className="mx-auto mt-0.5 max-w-[9rem] truncate text-[11px] text-muted-foreground">
                {step.subtitle}
              </div>
              <div
                className={cn(
                  "mt-1 text-[10px] font-semibold",
                  step.active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {step.state}
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

function DossierProgressRail({
  phases,
  currentPhaseId,
}: {
  phases: PhaseDefinition[];
  currentPhaseId: string;
}) {
  const currentIndex = Math.max(
    0,
    phases.findIndex((phase) => phase.id === currentPhaseId),
  );
  const progress = phases.length > 1 ? ((currentIndex + 1) / phases.length) * 100 : 100;

  return (
    <div className="mt-4 rounded-md border border-border bg-white/70 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold text-muted-foreground">Progresi</div>
          <div className="mt-1 h-1.5 w-48 overflow-hidden rounded-full bg-primary/15">
            <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="text-[11px] font-semibold text-primary">
          {currentIndex + 1}/{phases.length} Hapa
        </div>
      </div>

      <div className="-mx-1 overflow-x-auto px-1">
        <ol
          className="grid min-w-[720px] gap-0 overflow-hidden text-center md:min-w-0"
          style={{ gridTemplateColumns: `repeat(${phases.length}, minmax(0, 1fr))` }}
        >
          {phases.map((phase, index) => {
            const isCurrent = index === currentIndex;
            const isDone = index < currentIndex;
            return (
              <li key={phase.id} className="relative px-1">
                {index > 0 ? (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-[-50%] top-4 h-px w-full",
                      isDone || isCurrent ? "bg-primary/45" : "bg-border",
                    )}
                  />
                ) : null}
                <div
                  className={cn(
                    "relative mx-auto grid size-8 place-items-center rounded-full border bg-card text-[11px] font-semibold shadow-soft",
                    isDone && "border-success bg-success/10 text-success",
                    isCurrent && "border-primary bg-primary text-primary-foreground",
                  )}
                >
                  {isDone ? <CheckCircle2 className="size-4" /> : index + 1}
                </div>
                <div
                  className={cn(
                    "mt-2 line-clamp-2 text-[10px] leading-tight",
                    isCurrent ? "font-semibold text-primary" : "text-muted-foreground",
                  )}
                >
                  {phase.title}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function formatOperatorDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("sq-AL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function uploadedDocumentUrl(code: string, documentId: string, download = false) {
  const params = new URLSearchParams({ uploadedDocumentId: documentId });
  if (download) params.set("download", "1");
  return `/api/public/track/${encodeURIComponent(code)}?${params.toString()}`;
}

function complaintStatusLabel(status: string) {
  if (status === "resolved") return "E mbyllur";
  if (status === "in_review") return "Në shqyrtim";
  return "E re";
}

function OperatorComplaintsPanel({ dossier }: { dossier: Dossier }) {
  const complaints = [...(dossier.citizenComplaints ?? [])].reverse();
  return (
    <Card className="p-3">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="size-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold">Ankesa të qytetarit</h2>
      </div>
      {complaints.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Nuk ka ankesa të dërguara nga qytetari për këtë dosje.
        </p>
      ) : (
        <ul className="space-y-3">
          {complaints.map((complaint) => (
            <li key={complaint.id} className="rounded-md border border-warning/25 bg-warning/5 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold leading-snug">{complaint.subject}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {formatOperatorDateTime(complaint.createdAt)} · {complaint.routedToLabel}
                  </div>
                </div>
                <SeverityBadge severity={complaint.status === "resolved" ? "info" : "warning"}>
                  {complaintStatusLabel(complaint.status)}
                </SeverityBadge>
              </div>
              <p className="mt-2 text-sm leading-relaxed">{complaint.message}</p>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                <div className="rounded-md border bg-background/80 px-2 py-1.5">
                  <div className="text-muted-foreground">Faza</div>
                  <div className="font-medium">{complaint.phaseTitle ?? "Faza aktuale"}</div>
                </div>
                <div className="rounded-md border bg-background/80 px-2 py-1.5">
                  <div className="text-muted-foreground">Hapi</div>
                  <div className="font-medium">{complaint.stepTitle ?? "Hapi aktual"}</div>
                </div>
                <div className="rounded-md border bg-background/80 px-2 py-1.5">
                  <div className="text-muted-foreground">Kontakt</div>
                  <div className="font-medium">{complaint.contact ?? "Pa kontakt"}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function expeditedStatusLabel(status: string | undefined) {
  if (status === "approved") return "E miratuar";
  if (status === "submitted") return "Ne shqyrtim";
  if (status === "rejected") return "E refuzuar";
  return "Pa kerkese";
}

function ExpeditedReviewDocumentTile({
  trackingCode,
  label,
  fileName,
  documentId,
}: {
  trackingCode: string;
  label: string;
  fileName: string | undefined;
  documentId: string | undefined;
}) {
  return (
    <div className="rounded-md border px-3 py-2">
      <div className="text-muted-foreground">{label}</div>
      <div className="font-medium truncate">{fileName ?? "Nuk aplikohet"}</div>
      {documentId ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Button asChild size="sm" variant="outline" className="h-7 px-2 text-[11px]">
            <a
              href={uploadedDocumentUrl(trackingCode, documentId)}
              target="_blank"
              rel="noreferrer"
            >
              <Eye className="size-3 mr-1" />
              Shiko
            </a>
          </Button>
          <Button asChild size="sm" className="h-7 px-2 text-[11px]">
            <a href={uploadedDocumentUrl(trackingCode, documentId, true)} download>
              <Download className="size-3 mr-1" />
              Shkarko
            </a>
          </Button>
        </div>
      ) : fileName ? (
        <div className="mt-1 text-[11px] text-muted-foreground">
          Skedari nuk eshte ruajtur ne kete demo.
        </div>
      ) : null}
    </div>
  );
}

function expeditedDocumentId(
  dossier: Dossier,
  type: string,
  fileName: string | undefined,
  explicitId: string | undefined,
) {
  return (
    explicitId ?? dossier.documents.find((doc) => doc.type === type && doc.name === fileName)?.id
  );
}

function ExpeditedProcedurePanel({ dossier, readOnly }: { dossier: Dossier; readOnly: boolean }) {
  const expedited = dossier.expeditedProcedure;
  const [reviewNote, setReviewNote] = useState(expedited?.reviewNote ?? "");
  const review = useServerFn(reviewExpeditedProcedure);
  const qc = useQueryClient();
  const status = expedited?.status ?? "not_requested";
  const statusSeverity =
    status === "approved" ? "info" : status === "rejected" ? "critical" : "warning";

  async function save(statusToSave: "approved" | "rejected") {
    try {
      await review({
        data: {
          id: dossier.id,
          status: statusToSave,
          reviewNote,
        },
      });
      toast.success(
        statusToSave === "approved"
          ? "Procedura e pershpejtuar u miratua"
          : "Procedura e pershpejtuar u refuzua",
      );
      qc.invalidateQueries({ queryKey: ["dossier", dossier.id] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gabim ne shqyrtim");
    }
  }

  return (
    <Card className="p-3">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-2 min-w-0">
          <div className="size-8 rounded-md bg-primary/10 text-primary grid place-items-center shrink-0">
            <Clock className="size-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold">Procedure e pershpejtuar</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Kerkesa e qytetarit shqyrtohet vetem kur ka formular PDF te plotesuar dhe dokument
              provues. Tarifa demo nuk garanton miratim.
            </p>
          </div>
        </div>
        <SeverityBadge severity={statusSeverity}>{expeditedStatusLabel(status)}</SeverityBadge>
      </div>

      {!expedited ? (
        <p className="text-xs text-muted-foreground">
          Ende nuk ka kerkese per procedure te pershpejtuar nga qytetari.
        </p>
      ) : (
        <div className="space-y-3">
          <div className="rounded-md border bg-muted/30 p-3">
            <div className="text-sm font-semibold">{expedited.reasonLabel}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Derguar: {formatOperatorDateTime(expedited.requestedAt)}
              {expedited.paymentRequired && expedited.paymentAmountAll
                ? ` · Tarife demo ${expedited.paymentAmountAll.toLocaleString("sq-AL")} ALL`
                : " · Pa tarife"}
            </div>
            <p className="mt-2 text-sm leading-relaxed">{expedited.justification}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            <ExpeditedReviewDocumentTile
              trackingCode={dossier.trackingCode}
              label="Formulari PDF"
              fileName={expedited.requestPdfName}
              documentId={expeditedDocumentId(
                dossier,
                "expedite_request_form",
                expedited.requestPdfName,
                expedited.requestPdfDocumentId,
              )}
            />
            <ExpeditedReviewDocumentTile
              trackingCode={dossier.trackingCode}
              label="Dokumenti provues"
              fileName={expedited.supportingDocumentName}
              documentId={expeditedDocumentId(
                dossier,
                "expedite_supporting_document",
                expedited.supportingDocumentName,
                expedited.supportingDocumentId,
              )}
            />
            <ExpeditedReviewDocumentTile
              trackingCode={dossier.trackingCode}
              label="Mandati"
              fileName={expedited.paymentReceiptName}
              documentId={expeditedDocumentId(
                dossier,
                "payment_receipt",
                expedited.paymentReceiptName,
                expedited.paymentReceiptDocumentId,
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Shenim shqyrtimi</Label>
            <Textarea
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              disabled={readOnly || status !== "submitted"}
              rows={3}
              className="text-sm"
              placeholder="p.sh. Miratohet sepse dokumentacioni provon afatin e afert."
            />
          </div>

          {!readOnly && status === "submitted" ? (
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="destructive" onClick={() => save("rejected")}>
                Refuzo
              </Button>
              <Button size="sm" onClick={() => save("approved")}>
                <CheckCircle2 className="size-3.5 mr-1" />
                Mirato pershpejtimin
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </Card>
  );
}

type UiClaimType = "owner" | "legal_representative";
type UiVerificationStatus = "pending" | "verified" | "needs_documents" | "rejected";

const REQUESTER_DOC_LABELS: Record<string, string> = {
  id_card_copy: "Kopje e kartes se identitetit",
  ashk_certificate: "Certifikate pronesie ASHK",
  ashk_certificate_final: "Certifikate perfundimtare ASHK",
  ownership_extract: "Ekstrakt pronesie nga kadastra",
  legal_authorization: "Prokure / autorizim perfaqesimi",
};

function requesterDocLabel(type: string) {
  return REQUESTER_DOC_LABELS[type] ?? type.replace(/_/g, " ");
}

function requiredRequesterDocs(process: Dossier["process"], claimType: UiClaimType) {
  const cadastralProof = process === "expropriation" ? "ownership_extract" : "ashk_certificate";
  const base = ["id_card_copy", cadastralProof];
  return claimType === "legal_representative" ? [...base, "legal_authorization"] : base;
}

function hasRequesterDoc(dossier: Dossier, type: string) {
  if (type === "ashk_certificate") {
    return dossier.documents.some(
      (doc) =>
        (doc.type === "ashk_certificate" || doc.type === "ashk_certificate_final") &&
        doc.status !== "rejected",
    );
  }
  if (type === "ownership_extract") {
    return dossier.documents.some(
      (doc) =>
        (doc.type === "ownership_extract" ||
          doc.type === "ashk_certificate" ||
          doc.type === "ashk_certificate_final") &&
        doc.status !== "rejected",
    );
  }
  return dossier.documents.some((doc) => doc.type === type && doc.status !== "rejected");
}

function verificationLabel(status: UiVerificationStatus) {
  if (status === "verified") return "E verifikuar";
  if (status === "needs_documents") return "Kerkohet plotesim";
  if (status === "rejected") return "E refuzuar";
  return "Ne pritje";
}

function RequesterVerificationPanel({
  dossier,
  readOnly,
}: {
  dossier: Dossier;
  readOnly: boolean;
}) {
  const current = dossier.requesterVerification;
  const [claimType, setClaimType] = useState<UiClaimType>(current?.claimType ?? "owner");
  const [cadastralSubjectName, setCadastralSubjectName] = useState(
    current?.cadastralSubjectName ?? dossier.parties[0]?.fullName ?? "",
  );
  const [notes, setNotes] = useState(current?.notes ?? "");
  const updateVerification = useServerFn(updateRequesterVerification);
  const qc = useQueryClient();
  const requiredDocs = requiredRequesterDocs(dossier.process, claimType);
  const missingDocs = requiredDocs.filter((type) => !hasRequesterDoc(dossier, type));
  const status = (current?.status ?? "pending") as UiVerificationStatus;
  const statusSeverity =
    status === "verified" ? "info" : status === "rejected" ? "critical" : "warning";

  async function save(statusToSave: UiVerificationStatus) {
    try {
      await updateVerification({
        data: {
          id: dossier.id,
          claimType,
          cadastralSubjectName,
          status: statusToSave,
          notes,
        },
      });
      toast.success(
        statusToSave === "verified"
          ? "E drejta e kerkuesit u verifikua"
          : "Statusi i verifikimit u perditesua",
      );
      qc.invalidateQueries({ queryKey: ["dossier", dossier.id] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gabim ne verifikim");
    }
  }

  return (
    <Card className="p-3">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-2 min-w-0">
          <div className="size-8 rounded-md bg-primary/10 text-primary grid place-items-center shrink-0">
            <UserCheck className="size-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold">E drejta per te marre dokumentin</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Kontrollon nese kerkuesi eshte personi ne kadaster ose perfaqesues ligjor i tij.
            </p>
          </div>
        </div>
        <SeverityBadge severity={statusSeverity}>{verificationLabel(status)}</SeverityBadge>
      </div>

      <div className="rounded-md border border-warning/25 bg-warning/5 p-3 text-xs text-warning-foreground mb-3">
        Pa kete verifikim dokumentet e vulosura nuk shfaqen per shkarkim ne portalin e qytetarit.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Roli i kerkuesit</Label>
          <Select
            value={claimType}
            onValueChange={(value) => setClaimType(value as UiClaimType)}
            disabled={readOnly}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owner">Personi/pronari ne kadaster</SelectItem>
              <SelectItem value="legal_representative">Perfaqesues ligjor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Emri qe duhet te perputhet me kadastres</Label>
          <Input
            value={cadastralSubjectName}
            onChange={(e) => setCadastralSubjectName(e.target.value)}
            disabled={readOnly}
            className="h-9 text-sm"
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
        {requiredDocs.map((type) => {
          const uploaded = hasRequesterDoc(dossier, type);
          return (
            <div
              key={type}
              className={cn(
                "rounded-md border px-3 py-2",
                uploaded ? "border-success/25 bg-success/5" : "border-warning/30 bg-warning/5",
              )}
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                {type === "id_card_copy" ? (
                  <IdCard className="size-4 text-muted-foreground" />
                ) : type === "legal_authorization" ? (
                  <Scale className="size-4 text-muted-foreground" />
                ) : (
                  <ShieldCheck className="size-4 text-muted-foreground" />
                )}
                <span>{requesterDocLabel(type)}</span>
              </div>
              <div
                className={cn(
                  "mt-1 text-[11px]",
                  uploaded ? "text-success" : "text-warning-foreground",
                )}
              >
                {uploaded ? "U ngarkua ne dosje" : "Mungon"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-1.5 mt-3">
        <Label className="text-xs">Shenim verifikimi</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={readOnly}
          rows={3}
          className="text-sm"
          placeholder="p.sh. ID dhe certifikata ASHK perputhen me emrin e kerkuesit."
        />
      </div>

      {!readOnly ? (
        <div className="mt-3 flex flex-wrap justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => save("needs_documents")}>
            Kthe per plotesim
          </Button>
          <Button size="sm" variant="destructive" onClick={() => save("rejected")}>
            Refuzo
          </Button>
          <Button size="sm" onClick={() => save("verified")} disabled={missingDocs.length > 0}>
            <UserCheck className="size-3.5 mr-1" />
            Verifiko te drejten
          </Button>
        </div>
      ) : null}

      {missingDocs.length > 0 ? (
        <p className="mt-2 text-[11px] text-muted-foreground">
          Per verifikim mungon: {missingDocs.map(requesterDocLabel).join(", ")}.
        </p>
      ) : null}
    </Card>
  );
}

function mapPlaceForZone(zone: string) {
  const q = zone.toLowerCase();
  if (q.includes("durres") || q.includes("durr")) {
    return { label: "Durres", lat: 41.3231, lon: 19.4414, zoom: 15 };
  }
  if (q.includes("vlore") || q.includes("vlor")) {
    return { label: "Vlore", lat: 40.4661, lon: 19.4914, zoom: 15 };
  }
  if (q.includes("shkoder") || q.includes("shkod")) {
    return { label: "Shkoder", lat: 42.0693, lon: 19.5033, zoom: 15 };
  }
  if (q.includes("elbasan")) {
    return { label: "Elbasan", lat: 41.1125, lon: 20.0822, zoom: 15 };
  }
  if (q.includes("fier")) {
    return { label: "Fier", lat: 40.7239, lon: 19.5561, zoom: 15 };
  }
  if (q.includes("maliq") || q.includes("maliqi")) {
    return { label: "Maliq", lat: 40.7083, lon: 20.7, zoom: 17 };
  }
  if (q.includes("korce") || q.includes("korc")) {
    return { label: "Korce", lat: 40.6186, lon: 20.7808, zoom: 16 };
  }
  return { label: "Tirane", lat: 41.3275, lon: 19.8187, zoom: 15 };
}

function stableHash(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 1_000_000;
  }
  return hash;
}

function propertyParcelPolygon(place: { lat: number; lon: number }, hash: number) {
  const latSize = 0.0003 + (hash % 5) * 0.000035;
  const lonSize = 0.00042 + (Math.floor(hash / 7) % 5) * 0.000045;
  return [
    {
      lat: Number((place.lat - latSize * 0.56).toFixed(6)),
      lon: Number((place.lon - lonSize * 0.68).toFixed(6)),
    },
    {
      lat: Number((place.lat - latSize * 0.36).toFixed(6)),
      lon: Number((place.lon + lonSize * 0.58).toFixed(6)),
    },
    {
      lat: Number((place.lat + latSize * 0.42).toFixed(6)),
      lon: Number((place.lon + lonSize * 0.72).toFixed(6)),
    },
    {
      lat: Number((place.lat + latSize * 0.64).toFixed(6)),
      lon: Number((place.lon - lonSize * 0.32).toFixed(6)),
    },
  ];
}

function knownParcelForDossier(dossier: Dossier) {
  const zone = dossier.property.zone.toLowerCase();
  const cadastralNo = dossier.property.cadastralNo?.trim();
  if (
    dossier.trackingCode === "EXP-2026-000003" ||
    ((zone.includes("maliq") || zone.includes("maliqi")) && cadastralNo === "6/9")
  ) {
    return {
      lat: 40.70402,
      lon: 20.69816,
      zoom: 18,
      parcelPolygon: [
        { lat: 40.703818, lon: 20.697905 },
        { lat: 40.70391, lon: 20.698438 },
        { lat: 40.70419, lon: 20.698366 },
        { lat: 40.704128, lon: 20.697872 },
      ],
    };
  }
  return null;
}

function propertyMapLocation(dossier: Dossier) {
  const base = mapPlaceForZone(dossier.property.zone);
  const knownParcel = knownParcelForDossier(dossier);
  if (knownParcel) {
    return {
      ...base,
      label: `Vendodhja e parceles - ${base.label}`,
      lat: knownParcel.lat,
      lon: knownParcel.lon,
      zoom: Math.max(base.zoom, knownParcel.zoom),
      parcelPolygon: knownParcel.parcelPolygon,
      accuracyLabel:
        "Poligon demo i korrigjuar ne toke per kete dosje; ne zbatim real merret nga koordinatat/poligoni kadastral ASHK/ASIG.",
    };
  }
  const hash = stableHash(
    `${dossier.trackingCode}:${dossier.property.zone}:${dossier.property.description}:${
      dossier.property.cadastralNo ?? ""
    }`,
  );
  const latOffset = (((hash % 201) - 100) / 100) * 0.0042;
  const lonOffset = (((Math.floor(hash / 201) % 201) - 100) / 100) * 0.0062;
  const lat = Number((base.lat + latOffset).toFixed(6));
  const lon = Number((base.lon + lonOffset).toFixed(6));
  return {
    ...base,
    label: `Vendodhja orientuese e prones - ${base.label}`,
    lat,
    lon,
    zoom: Math.max(base.zoom, 17),
    parcelPolygon: propertyParcelPolygon({ lat, lon }, hash),
    accuracyLabel:
      "Poligon demo i parceles; ne zbatim real merret nga koordinatat/poligoni kadastral ASHK/ASIG.",
  };
}

function osmViewUrl(place: { lat: number; lon: number; zoom: number }) {
  return `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=${place.zoom}/${place.lat}/${place.lon}`;
}

function AkptGisDemoCard({ dossier }: { dossier: Dossier }) {
  const description = dossier.property.description.toLowerCase();
  const isAgricultural =
    description.includes("bujq") ||
    description.includes("agric") ||
    description.includes("toke") ||
    description.includes("tokë");
  const zoning = dossier.property.zone.toLowerCase().includes("tiran")
    ? "Zonë periurbane / verifikim me hartë"
    : isAgricultural
      ? "Zonë rurale"
      : "Zonë urbane";
  const landCategory = isAgricultural
    ? "Tokë bujqësore"
    : dossier.property.description.includes("ndërtes")
      ? "Truall + ndërtesë"
      : "Pasuri e paluajtshme";

  const mapPdfUrl = `/api/public/track/${encodeURIComponent(dossier.trackingCode)}?mapPdf=1`;
  const place = propertyMapLocation(dossier);
  const realMapUrl = osmViewUrl(place);
  const mapPrintUrl = `/api/public/track/${encodeURIComponent(dossier.trackingCode)}?mapPrint=1`;

  return (
    <Card className="overflow-hidden border-emerald-200 bg-emerald-50/70">
      <div className="border-b border-emerald-200/80 px-3 py-2.5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0">
          <div className="mt-0.5 size-8 shrink-0 rounded-md bg-emerald-100 text-emerald-800 grid place-items-center border border-emerald-200">
            <MapPinned className="size-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-emerald-950">AKPT · e-Harta GIS</h2>
            <p className="text-xs text-emerald-800 mt-0.5">
              Konsultohet për zonimin urban/rural dhe kategorinë ligjore të tokës.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className="rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-800">
            vetëm read-only
          </span>
          <Button asChild size="sm" variant="outline" className="h-8 border-emerald-300 bg-white">
            <a href={mapPdfUrl} download>
              <Download className="mr-1.5 size-3.5" />
              Shkarko PDF
            </a>
          </Button>
          <Button asChild size="sm" variant="outline" className="h-8 border-emerald-300 bg-white">
            <a href={mapPrintUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-1.5 size-3.5" />
              Printo / PDF
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 p-3 md:grid-cols-4">
        <AkptFact label="Zona e verifikuar" value={dossier.property.zone} />
        <AkptFact label="Poligoni i parceles" value={`${place.parcelPolygon.length} pika`} />
        <AkptFact label="Zonimi GIS" value={zoning} />
        <AkptFact label="Kategoria e tokës" value={landCategory} />
      </div>

      <div className="mx-3 mb-3 overflow-hidden rounded-md border border-emerald-200 bg-white">
        <div className="relative aspect-[16/7] min-h-56 bg-slate-100">
          <ParcelMap center={place} parcelPolygon={place.parcelPolygon} />
        </div>
        <div className="flex flex-col gap-2 border-t bg-white/90 px-3 py-2 text-xs text-emerald-900 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium">
            Vendodhja e prones - {place.lat.toFixed(4)}, {place.lon.toFixed(4)}
          </span>
          <a
            href={realMapUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-medium text-emerald-800 hover:underline"
          >
            Hap harten reale
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>

      <div className="mx-3 mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        <div className="font-medium">Pa integrim aktiv me ASHK</div>
        <p className="mt-0.5 text-amber-800">
          Demo regjistron konsultimin si evidencë pune, por nuk shkruan të dhëna në sistemet
          shtetërore. AI e përdor si sinjal për vlerësimin dhe rrezikun e vonesës.
        </p>
        <p className="mt-1 text-amber-800">{place.accuracyLabel}</p>
      </div>
    </Card>
  );
}

function AkptFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-emerald-200 bg-white/75 px-3 py-2">
      <div className="text-[11px] text-emerald-700">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-emerald-950">{value}</div>
    </div>
  );
}

function UploadCard({ dossierId }: { dossierId: string }) {
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [extracted, setExtracted] = useState("");
  const [electronicSeal, setElectronicSeal] = useState(true);
  const upload = useServerFn(uploadDocument);
  const qc = useQueryClient();
  return (
    <Card className="p-3">
      <div className="flex items-center gap-2 mb-2">
        <Upload className="size-4 text-info" />
        <h2 className="text-sm font-semibold">Ngarko PDF dhe vulos elektronikisht</h2>
      </div>
      <div className="mb-3 rounded-md border border-info/20 bg-info/5 p-3 text-xs text-muted-foreground">
        Operatori ngarkon dosjen në PDF; sistemi vendos vulën demo të institucionit dhe e ruan
        dokumentin si të verifikuar në historikun e dosjes dhe në portalin e qytetarit.
      </div>
      <div className="space-y-1.5 mb-2">
        <Label className="text-xs">PDF i dosjes</Label>
        <Input
          type="file"
          accept="application/pdf"
          className="h-9 text-sm"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setName(file.name);
            if (!type) setType("dossier_pdf");
            setElectronicSeal(true);
          }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Tipi (p.sh. dossier_pdf)</Label>
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
      <label className="mt-3 flex items-start gap-2 rounded-md border bg-muted/30 p-2 text-xs cursor-pointer">
        <Checkbox
          checked={electronicSeal}
          onCheckedChange={(v) => setElectronicSeal(v === true)}
          className="mt-0.5"
        />
        <span>
          <span className="font-medium flex items-center gap-1">
            <ShieldCheck className="size-3.5 text-success" />
            Vulos elektronikisht me vulën e institucionit
          </span>
          <span className="block text-muted-foreground mt-0.5">
            Për demo, vula merret nga <code>/stamps/ashk-demo-stamp.png</code> dhe dokumenti
            shënohet si i verifikuar. Dokumenti i vulosur shfaqet automatikisht te gjurmimi i
            qytetarit.
          </span>
        </span>
      </label>
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
                  electronicSeal,
                },
              });
              toast.success(electronicSeal ? "PDF u ngarkua dhe u vulos" : "U ngarkua");
              setName("");
              setType("");
              setExtracted("");
              setElectronicSeal(true);
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
