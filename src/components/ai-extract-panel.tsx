import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, CheckCircle2, FileSearch, Loader2, Sparkles, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { extractTextFromFile } from "@/lib/ai/client-extract";
import { extractFromText, getAiStatus } from "@/lib/ai/extract.functions";
import { applyExtractedFields } from "@/lib/api/apply-extraction.functions";
import { uploadDocument } from "@/lib/api/dossiers.functions";
import type { ExtractionResult } from "@/lib/ai/extraction-schemas";
import type { Dossier, ProcessKind } from "@/core/types";

type Props = { dossier: Dossier };

type Step = "idle" | "reading" | "extracting" | "done" | "error";

export function AiExtractPanel({ dossier }: Props) {
  const status = useServerFn(getAiStatus);
  const extract = useServerFn(extractFromText);
  const apply = useServerFn(applyExtractedFields);
  const upload = useServerFn(uploadDocument);
  const qc = useQueryClient();

  const aiStatus = useQuery({ queryKey: ["ai-status"], queryFn: () => status() });
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState(
    dossier.process === "ekb_privatization" ? "family_certificate" : "valuation_report",
  );
  const [step, setStep] = useState<Step>("idle");
  const [progress, setProgress] = useState(0);
  const [rawText, setRawText] = useState("");
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  const disabled = !aiStatus.data?.enabled;

  async function run() {
    if (!file) return;
    setStep("reading");
    setProgress(15);
    setResult(null);
    setErrorMsg(null);
    try {
      const local = await extractTextFromFile(file);
      setRawText(local.text);
      setProgress(55);
      setStep("extracting");
      const res = await extract({
        data: {
          processKind: dossier.process as ProcessKind,
          documentType: docType,
          text: local.text,
          fileName: file.name,
        },
      });
      setProgress(95);
      if (!res.ok) {
        setErrorMsg(res.error);
        setStep("error");
        return;
      }
      setResult(res.result);
      setStep("done");
      setProgress(100);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Gabim i panjohur");
      setStep("error");
    }
  }

  async function applyResult() {
    if (!result) return;
    setApplying(true);
    try {
      // First record the document upload, then apply extracted fields.
      const up = await upload({
        data: {
          id: dossier.id,
          type: docType,
          name: file?.name ?? `${docType}.txt`,
          aiGenerated: false,
        },
      });
      const r = await apply({
        data: {
          id: dossier.id,
          result,
          sourceDocumentId: up.documentId,
          fileName: file?.name,
        },
      });
      toast.success(
        `U aplikuan ${r.applied.length} fusha${
          r.conflicts.length ? `, ${r.conflicts.length} konflikte` : ""
        }`,
      );
      qc.invalidateQueries({ queryKey: ["dossier", dossier.id] });
      setFile(null);
      setResult(null);
      setRawText("");
      setStep("idle");
      setProgress(0);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gabim gjatë aplikimit");
    } finally {
      setApplying(false);
    }
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-info" />
          <h2 className="text-sm font-semibold">Nxjerrje me AI</h2>
        </div>
        {aiStatus.data ? (
          aiStatus.data.enabled ? (
            <Badge variant="secondary" className="text-[10px]">
              Aktiv · {aiStatus.data.model}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] border-warning text-warning">
              I çaktivizuar (OPENAI_API_KEY mungon)
            </Badge>
          )
        ) : null}
      </div>

      {disabled ? (
        <p className="text-xs text-muted-foreground">
          Vendos <code className="font-mono">OPENAI_API_KEY</code> (dhe opsionalisht{" "}
          <code className="font-mono">OPENAI_MODEL</code>) në variablat e mjedisit për të aktivizuar
          nxjerrjen reale të fushave. Nuk shfaqen të dhëna fiktive.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs">Skedar (PDF, imazh ose tekst)</Label>
              <Input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.md,.csv,.json,application/pdf,image/*,text/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Tipi i dokumentit</Label>
              <Input
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              disabled={!file || step === "reading" || step === "extracting"}
              onClick={run}
            >
              {step === "reading" || step === "extracting" ? (
                <Loader2 className="size-3.5 mr-1 animate-spin" />
              ) : (
                <FileSearch className="size-3.5 mr-1" />
              )}
              Nxirr fushat
            </Button>
            {file ? (
              <span className="text-[11px] text-muted-foreground truncate">
                {file.name} · {(file.size / 1024).toFixed(1)} KB
              </span>
            ) : null}
          </div>

          {(step === "reading" || step === "extracting") && (
            <div className="space-y-1">
              <Progress value={progress} />
              <p className="text-[11px] text-muted-foreground">
                {step === "reading" ? "Po lexohet teksti lokalisht…" : "Po komunikohet me modelin…"}
              </p>
            </div>
          )}

          {step === "error" && errorMsg ? (
            <div className="rounded border border-critical/30 bg-critical/5 p-2 text-xs flex gap-2">
              <AlertTriangle className="size-3.5 text-critical mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          ) : null}

          {result ? (
            <ExtractionResultView
              dossier={dossier}
              result={result}
              onApply={applyResult}
              applying={applying}
              rawTextPreview={rawText.slice(0, 280)}
            />
          ) : null}
        </>
      )}
    </Card>
  );
}

function ExtractionResultView({
  dossier,
  result,
  onApply,
  applying,
  rawTextPreview,
}: {
  dossier: Dossier;
  result: ExtractionResult;
  onApply: () => void;
  applying: boolean;
  rawTextPreview: string;
}) {
  const rows = buildRows(dossier, result);
  const conflicts = rows.filter((r) => r.conflict);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{result.documentType}</Badge>
          <span className="text-muted-foreground">
            Besueshmëri totale: {(result.overallConfidence * 100).toFixed(0)}%
          </span>
        </div>
        <span className="text-muted-foreground">{rows.length} fusha</span>
      </div>

      <div className="rounded border divide-y">
        {rows.map((r) => (
          <div key={r.key} className="p-2 text-xs grid grid-cols-12 gap-2 items-start">
            <div className="col-span-3 font-medium">{r.label}</div>
            <div className="col-span-5 break-words">
              <div>{formatVal(r.value)}</div>
              {r.evidence ? (
                <div className="text-[10px] text-muted-foreground italic mt-0.5">
                  “{r.evidence}”
                </div>
              ) : null}
            </div>
            <div className="col-span-2">
              <ConfidenceBar value={r.confidence} />
            </div>
            <div className="col-span-2 text-right">
              {r.conflict ? (
                <Badge variant="outline" className="border-warning text-warning text-[10px]">
                  konflikt
                </Badge>
              ) : r.value === null ? (
                <Badge variant="outline" className="text-[10px]">
                  mungon
                </Badge>
              ) : (
                <CheckCircle2 className="size-3.5 text-success inline" />
              )}
            </div>
            {r.conflict ? (
              <div className="col-span-12 text-[10px] text-muted-foreground pl-1">
                Aktualisht: <code>{formatVal(r.current)}</code> → e re:{" "}
                <code>{formatVal(r.value)}</code>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {result.missingFields.length ? (
        <div className="text-[11px] text-muted-foreground">
          <strong>Mungojnë:</strong> {result.missingFields.join(", ")}
        </div>
      ) : null}
      {result.warnings.length ? (
        <div className="text-[11px] text-warning">
          <strong>Paralajmërime:</strong> {result.warnings.join("; ")}
        </div>
      ) : null}

      {rawTextPreview ? (
        <details className="text-[11px] text-muted-foreground">
          <summary className="cursor-pointer">Pamje paraprake e tekstit të nxjerrë</summary>
          <pre className="whitespace-pre-wrap mt-1">{rawTextPreview}…</pre>
        </details>
      ) : null}

      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-muted-foreground">
          {conflicts.length
            ? `${conflicts.length} fusha do mbishkruhen.`
            : "Asnjë konflikt me të dhënat ekzistuese."}
        </span>
        <Button size="sm" onClick={onApply} disabled={applying}>
          {applying ? (
            <Loader2 className="size-3.5 mr-1 animate-spin" />
          ) : (
            <Upload className="size-3.5 mr-1" />
          )}
          Apliko fushat e nxjerra
        </Button>
      </div>
    </div>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color = value >= 0.8 ? "bg-success" : value >= 0.5 ? "bg-info" : "bg-warning";
  return (
    <div className="flex items-center gap-1">
      <div className="h-1.5 w-full rounded bg-muted overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] tabular-nums w-7 text-right">{pct}%</span>
    </div>
  );
}

type Row = {
  key: string;
  label: string;
  value: unknown;
  confidence: number;
  evidence?: string;
  current: unknown;
  conflict: boolean;
};

function buildRows(d: Dossier, r: ExtractionResult): Row[] {
  const c = r.common ?? {};
  const ekb = r.ekb ?? {};
  const exp = r.expropriation ?? {};
  const p0 = d.parties[0];
  const rows: Row[] = [];

  const push = (
    key: string,
    label: string,
    fv: { value: unknown; confidence: number; sourceEvidence?: string } | undefined,
    current: unknown,
  ) => {
    if (!fv) return;
    const conflict =
      fv.value !== null &&
      fv.value !== undefined &&
      current !== undefined &&
      current !== null &&
      current !== "" &&
      String(current) !== String(fv.value);
    rows.push({
      key,
      label,
      value: fv.value,
      confidence: fv.confidence,
      evidence: fv.sourceEvidence,
      current,
      conflict,
    });
  };

  push("applicantName", "Emri", c.applicantName, p0?.fullName);
  push("nidMasked", "ID kombëtare (maskuar)", c.nidMasked, p0?.nationalIdMasked);
  push("address", "Adresa", c.address, p0?.contact?.address);
  push("phone", "Telefon", c.phone, p0?.contact?.phone);
  push("email", "Email", c.email, p0?.contact?.email);
  push("documentDate", "Data e dokumentit", c.documentDate, undefined);
  push("institution", "Institucioni", c.institution, undefined);
  push("propertyId", "Identifikuesi i pasurisë", c.propertyId, d.property.cadastralNo);
  push("cadastralZone", "Zona kadastrale", c.cadastralZone, d.property.zone);
  push("propertyAreaM2", "Sipërfaqe (m²)", c.propertyAreaM2, d.property.areaSqm);
  push("municipality", "Bashkia", c.municipality, undefined);

  if (d.process === "ekb_privatization") {
    push("familyMembers", "Anëtarë familje", ekb.familyMembers, undefined);
    push(
      "familyIncomeAll",
      "Të ardhura familjare (ALL)",
      ekb.familyIncomeAll,
      d.property.familyIncomeAll,
    );
    push("marketPriceAll", "Çmim tregu (ALL)", ekb.marketPriceAll, d.property.marketPriceAll);
    push("landPriceAll", "Çmim trualli (ALL)", ekb.landPriceAll, d.property.landPriceAll);
    push("housingNorm", "Norma e strehimit", ekb.housingNorm, undefined);
    push("certificateNumber", "Nr. çertifikate", ekb.certificateNumber, undefined);
    push("qualifiesForPrivatization", "Kualifikohet", ekb.qualifiesForPrivatization, undefined);
    push("suggestedPriceCategory", "Kategoria e çmimit", ekb.suggestedPriceCategory, undefined);
  } else {
    push("ownerName", "Pronari", exp.ownerName, p0?.fullName);
    push("projectName", "Projekti", exp.projectName, undefined);
    push("publicInterestReason", "Interesi publik", exp.publicInterestReason, undefined);
    push("compensationAmountAll", "Kompensim (ALL)", exp.compensationAmountAll, d.finalValueAll);
    push("valuationMethod", "Metoda e vlerësimit", exp.valuationMethod, undefined);
    push("appealDeadline", "Afati i ankimit", exp.appealDeadline, undefined);
    push("acceptanceStatus", "Statusi i pranimit", exp.acceptanceStatus, undefined);
  }

  return rows;
}

function formatVal(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "boolean") return v ? "po" : "jo";
  return String(v);
}
