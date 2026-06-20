import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  Building2,
  CalendarClock,
  CheckCircle2,
  Circle,
  Clock,
  CreditCard,
  Download,
  ExternalLink,
  Eye,
  FileUp,
  FileText,
  FileWarning,
  IdCard,
  Landmark,
  Loader2,
  MapPinned,
  MessageSquare,
  RefreshCw,
  Scale,
  Send,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CitizenVirtualAgent } from "@/components/citizen-virtual-agent";
import { ParcelMap, type ParcelPoint } from "@/components/parcel-polygon-overlay";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/track/$code")({
  head: () => ({
    meta: [
      { title: "Gjurmim dosjeje — Smart Dossier" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "description",
        content:
          "Gjurmoni statusin e dosjes suaj ne kohe reale. Smart Dossier - portali per qytetarin.",
      },
    ],
  }),
  component: TrackPage,
});

type Phase = {
  order: number;
  title: string;
  institution: string;
  state: "completed" | "current" | "upcoming";
};
type CitizenDeadline = {
  label: string;
  dueAt: string;
  kind: "legal" | "external";
  daysRemaining: number;
};
type CitizenDocument = {
  id: string;
  type: string;
  label: string;
  name: string;
  status: string;
  uploadedAt: string | null;
  deliveredAt: string;
  electronicallySealed: boolean;
  sealSource: string | null;
};
type CitizenComplaint = {
  id: string;
  createdAt: string;
  subject: string;
  status: "new" | "in_review" | "resolved";
  stage: "phase_review" | "final_review";
  phaseTitle: string | null;
  routedToLabel: string;
};
type RequesterVerification = {
  claimType: "owner" | "legal_representative";
  status: "pending" | "verified" | "needs_documents" | "rejected";
  cadastralSubjectName: string;
  canReceiveDocuments: boolean;
  heldDocumentsCount: number;
  requiredDocuments: { type: string; label: string; uploaded: boolean }[];
  missingDocuments: { type: string; label: string }[];
  verifiedAt: string | null;
  notes: string | null;
};
type ExpeditedReason = "health" | "deadline" | "court" | "social" | "other";
type ExpeditedStatus = "not_requested" | "submitted" | "approved" | "rejected";
type ExpeditedProcedure = {
  status: ExpeditedStatus;
  reason: ExpeditedReason | null;
  reasonLabel: string | null;
  justification: string | null;
  requestedAt: string | null;
  requestPdfName: string | null;
  requestPdfDocumentId: string | null;
  supportingDocumentName: string | null;
  supportingDocumentId: string | null;
  paymentRequired: boolean;
  paymentAmountAll: number | null;
  paymentReceiptName: string | null;
  paymentReceiptDocumentId: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
};
type TrackPayload = {
  trackingCode: string;
  process: string;
  processKind: "ekb_privatization" | "expropriation" | "property_registration";
  status: string;
  currentPhase: { number: number; title: string; institution: string; description: string };
  phasesTimeline: Phase[];
  nextMilestone: string | null;
  nextInstitution: string | null;
  isFinal: boolean;
  deadline: {
    label: string;
    dueAt: string;
    daysRemaining: number;
    state: "ok" | "due_soon" | "overdue";
  } | null;
  citizenDeadlines: CitizenDeadline[];
  missingDocuments: { type: string; label: string }[];
  requesterVerification: RequesterVerification;
  citizenDocuments: CitizenDocument[];
  citizenComplaints: CitizenComplaint[];
  expeditedProcedure: ExpeditedProcedure;
  mapPreview: {
    provider: string;
    label: string;
    lat: number;
    lon: number;
    zoom: number;
    accuracyLabel: string;
    embedUrl: string;
    url: string;
    zoning: string;
    landCategory: string;
    sourceLabel: string;
    aiRiskLevel: "low" | "medium" | "high";
    aiSignal: string;
    aiUse: string;
    parcelPolygon: ParcelPoint[];
  } | null;
  compensation: {
    amountAll: number | null;
    ministry: string;
    statusLabel: string;
    nextAction: string;
    paymentOrderUploaded: boolean;
    paymentConfirmed: boolean;
  } | null;
  notifications: { at: string; action: string }[];
  updatedAt: string;
};

const REQUESTER_STATUS_SQ: Record<RequesterVerification["status"], string> = {
  pending: "Ne pritje",
  verified: "E verifikuar",
  needs_documents: "Kerkohet plotesim",
  rejected: "E refuzuar",
};

const EXPEDITE_STATUS_SQ: Record<ExpeditedStatus, string> = {
  not_requested: "Pa kerkese",
  submitted: "Ne shqyrtim",
  approved: "E miratuar",
  rejected: "E refuzuar",
};

const EXPEDITE_REASONS: Array<{ value: ExpeditedReason; label: string }> = [
  { value: "deadline", label: "Afat ligjor ose administrativ i afert" },
  { value: "health", label: "Gjendje shendetesore / sociale" },
  { value: "court", label: "Vendim gjykate / detyrim institucional" },
  { value: "social", label: "Rast social i dokumentuar" },
  { value: "other", label: "Arsye tjeter e dokumentuar" },
];

const STATUS_SQ: Record<string, string> = {
  draft: "Në hartim",
  in_progress: "Në proces",
  blocked: "E bllokuar",
  awaiting_external: "Në pritje të institucionit",
  completed: "E përfunduar",
  rejected: "E refuzuar",
};

const COMPLAINT_STATUS_SQ: Record<CitizenComplaint["status"], string> = {
  new: "E dërguar",
  in_review: "Në shqyrtim",
  resolved: "E mbyllur",
};

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("sq-AL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
function fmtDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("sq-AL", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function citizenDocumentUrl(code: string, documentId: string, download = false): string {
  const params = new URLSearchParams({ documentId });
  if (download) params.set("download", "1");
  return `/api/public/track/${encodeURIComponent(code)}?${params.toString()}`;
}

function uploadedDocumentUrl(code: string, documentId: string, download = false): string {
  const params = new URLSearchParams({ uploadedDocumentId: documentId });
  if (download) params.set("download", "1");
  return `/api/public/track/${encodeURIComponent(code)}?${params.toString()}`;
}

function expediteFormUrl(code: string): string {
  return `/api/public/track/${encodeURIComponent(code)}?expediteForm=1`;
}

function mapPdfUrl(code: string): string {
  return `/api/public/track/${encodeURIComponent(code)}?mapPdf=1`;
}

function mapPrintUrl(code: string): string {
  return `/api/public/track/${encodeURIComponent(code)}?mapPrint=1`;
}

function requesterDocIcon(type: string) {
  if (type === "id_card_copy") return <IdCard className="size-3.5" />;
  if (type === "legal_authorization") return <Scale className="size-3.5" />;
  return <ShieldCheck className="size-3.5" />;
}

function stripForClientPdf(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7e]/g, "-");
}

function escapeClientPdfText(value: string): string {
  return stripForClientPdf(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function wrapPdfLine(value: string, width = 76): string[] {
  const words = stripForClientPdf(value).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function buildClientPdf(content: string): Uint8Array {
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}

function bytesToArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

function buildCompletedExpeditePdfFile(input: {
  trackingCode: string;
  reasonLabel: string;
  justification: string;
  paymentRequired: boolean;
  paymentAmountAll: number | null;
}) {
  const lines = [
    "SMART DOSSIER",
    "FORMULAR I PLOTESUAR PER PROCEDURE TE PERSHPEJTUAR",
    "",
    `Kodi i dosjes: ${input.trackingCode}`,
    `Arsyeja: ${input.reasonLabel}`,
    `Tarife: ${
      input.paymentRequired
        ? `${(input.paymentAmountAll ?? 1000).toLocaleString("sq-AL")} ALL`
        : "Nuk aplikohet"
    }`,
    `Data e plotesimit: ${new Date().toLocaleDateString("sq-AL")}`,
    "",
    "Pershkrimi i arsyes:",
    ...wrapPdfLine(input.justification),
    "",
    "Dokumentacioni qe bashkelidhet:",
    "1. Dokument provues per arsyen e pershpejtimit",
    input.paymentRequired ? "2. Mandat pagese per tarifen zyrtare" : "2. Pa mandat pagese",
    "",
    "Deklaroj se te dhenat jane te sakta dhe kerkoj shqyrtim te pershpejtuar.",
  ];
  const textCommands = lines
    .map((line, index) => {
      const y = 790 - index * 20;
      const fontSize = index === 0 ? 18 : index === 1 ? 12 : 10;
      return `/F1 ${fontSize} Tf\n1 0 0 1 54 ${y} Tm\n(${escapeClientPdfText(line)}) Tj`;
    })
    .join("\n");
  const content = [
    "q",
    "0.98 0.99 1 rg",
    "36 36 523 770 re f",
    "Q",
    "q",
    "0.01 0.18 0.35 rg",
    "BT",
    textCommands,
    "ET",
    "Q",
    "q",
    "0.95 0.73 0.10 RG",
    "3 w",
    "36 744 523 0 m S",
    "Q",
  ].join("\n");
  const fileName = `${input.trackingCode}-formular-pershpejtimi-plotesuar.pdf`;
  return new File([bytesToArrayBuffer(buildClientPdf(content))], fileName, {
    type: "application/pdf",
  });
}

function ExpeditedDocumentTile({
  trackingCode,
  label,
  fileName,
  documentId,
}: {
  trackingCode: string;
  label: string;
  fileName: string | null;
  documentId: string | null;
}) {
  return (
    <div className="rounded-md border px-2 py-1.5">
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
          Dokumenti nuk ka skedar te ruajtur ne demo.
        </div>
      ) : null}
    </div>
  );
}

function TrackPage() {
  const { code } = Route.useParams();
  const [data, setData] = useState<TrackPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [complaintSubject, setComplaintSubject] = useState("");
  const [complaintMessage, setComplaintMessage] = useState("");
  const [complaintContact, setComplaintContact] = useState("");
  const [complaintSending, setComplaintSending] = useState(false);
  const [complaintError, setComplaintError] = useState<string | null>(null);
  const [complaintSuccess, setComplaintSuccess] = useState<string | null>(null);
  const [expediteReason, setExpediteReason] = useState<ExpeditedReason>("deadline");
  const [expediteJustification, setExpediteJustification] = useState("");
  const [expeditePaymentRequired, setExpeditePaymentRequired] = useState(true);
  const [expediteRequestPdf, setExpediteRequestPdf] = useState<File | null>(null);
  const [expediteRequestPdfSource, setExpediteRequestPdfSource] = useState<
    "generated" | "uploaded" | null
  >(null);
  const [expediteSupportingDocument, setExpediteSupportingDocument] = useState<File | null>(null);
  const [expeditePaymentReceipt, setExpeditePaymentReceipt] = useState<File | null>(null);
  const [expediteSending, setExpediteSending] = useState(false);
  const [expediteError, setExpediteError] = useState<string | null>(null);
  const [expediteSuccess, setExpediteSuccess] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/public/track/${encodeURIComponent(code)}`, {
        cache: "no-store",
      });
      if (!r.ok) {
        setError(r.status === 404 ? "Kodi nuk u gjet" : "Gabim gjatë ngarkimit");
        setData(null);
      } else {
        setData((await r.json()) as TrackPayload);
      }
    } catch {
      setError("Gabim rrjeti");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  function clearGeneratedExpeditePdf() {
    if (expediteRequestPdfSource === "generated") {
      setExpediteRequestPdf(null);
      setExpediteRequestPdfSource(null);
      setExpediteSuccess(null);
    }
  }

  async function submitComplaint() {
    if (!data) return;
    setComplaintError(null);
    setComplaintSuccess(null);
    const subject = complaintSubject.trim();
    const message = complaintMessage.trim();
    if (subject.length < 3 || message.length < 10) {
      setComplaintError("Plotësoni subjektin dhe përshkrimin e ankesës.");
      return;
    }

    setComplaintSending(true);
    try {
      const r = await fetch(`/api/public/track/${encodeURIComponent(code)}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          subject,
          message,
          contact: complaintContact.trim(),
          stage: data.isFinal ? "final_review" : "phase_review",
        }),
      });
      if (!r.ok) throw new Error("Ankesa nuk u dërgua.");
      const payload = (await r.json()) as { complaint?: { routedToLabel?: string } };
      setComplaintSubject("");
      setComplaintMessage("");
      setComplaintContact("");
      setComplaintSuccess(
        `Ankesa u përcoll te ${payload.complaint?.routedToLabel ?? "operatori përkatës"}.`,
      );
      await load();
    } catch (e) {
      setComplaintError(e instanceof Error ? e.message : "Ankesa nuk u dërgua.");
    } finally {
      setComplaintSending(false);
    }
  }

  function generateExpeditedRequestPdf() {
    if (!data) return;
    setExpediteError(null);
    const justification = expediteJustification.trim();
    if (justification.length < 10) {
      setExpediteError("Plotesoni pershkrimin e arsyes para se te gjeneroni formularin PDF.");
      return;
    }
    const reasonLabel =
      EXPEDITE_REASONS.find((reason) => reason.value === expediteReason)?.label ??
      "Arsye e dokumentuar";
    const file = buildCompletedExpeditePdfFile({
      trackingCode: data.trackingCode,
      reasonLabel,
      justification,
      paymentRequired: expeditePaymentRequired,
      paymentAmountAll: data.expeditedProcedure.paymentAmountAll,
    });
    setExpediteRequestPdf(file);
    setExpediteRequestPdfSource("generated");
    setExpediteSuccess("Formulari u plotesua dhe u bashkangjit automatikisht si PDF.");
  }

  async function submitExpeditedProcedure() {
    if (!data) return;
    setExpediteError(null);
    setExpediteSuccess(null);
    const justification = expediteJustification.trim();
    if (justification.length < 10 || !expediteRequestPdf || !expediteSupportingDocument) {
      setExpediteError("Plotesoni/gjeneroni formularin PDF dhe ngarkoni dokumentin provues.");
      return;
    }
    if (expeditePaymentRequired && !expeditePaymentReceipt) {
      setExpediteError("Ngarkoni mandatin e pageses per tarifen demo te pershpejtimit.");
      return;
    }

    const form = new FormData();
    form.set("kind", "expedite");
    form.set("reason", expediteReason);
    form.set("justification", justification);
    form.set("paymentRequired", String(expeditePaymentRequired));
    form.set("requestPdf", expediteRequestPdf);
    form.set("supportingDocument", expediteSupportingDocument);
    if (expeditePaymentReceipt) form.set("paymentReceipt", expeditePaymentReceipt);

    setExpediteSending(true);
    try {
      const r = await fetch(`/api/public/track/${encodeURIComponent(code)}`, {
        method: "POST",
        body: form,
      });
      if (!r.ok) {
        const payload = (await r.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? "Kerkesa nuk u dergua.");
      }
      setExpediteJustification("");
      setExpediteRequestPdf(null);
      setExpediteRequestPdfSource(null);
      setExpediteSupportingDocument(null);
      setExpeditePaymentReceipt(null);
      setExpediteSuccess("Kerkesa u dergua te operatori per shqyrtim.");
      await load();
    } catch (e) {
      setExpediteError(e instanceof Error ? e.message : "Kerkesa nuk u dergua.");
    } finally {
      setExpediteSending(false);
    }
  }

  return (
    <AppShell
      notifications={(data?.notifications ?? []).map((notification, index) => ({
        id: index,
        title: notification.action,
        meta: fmtDateTime(notification.at),
      }))}
    >
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-5 pb-12 md:px-6">
        {/* Code card */}
        <Card className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Kodi i gjurmimit
              </div>
              <div className="font-mono text-lg font-bold tracking-tight break-all">{code}</div>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-1.5">
              {data && (
                <Badge
                  variant="secondary"
                  className={cn(
                    "shrink-0 text-[11px]",
                    data.status === "completed" && "bg-success/15 text-success border-success/20",
                    data.status === "blocked" &&
                      "bg-destructive/15 text-destructive border-destructive/20",
                    data.status === "awaiting_external" &&
                      "bg-warning/15 text-warning-foreground border-warning/30",
                  )}
                >
                  {STATUS_SQ[data.status] ?? data.status}
                </Badge>
              )}
              <Button asChild size="sm" variant="outline" className="h-8">
                <a href="/aplikim">
                  <Scale className="size-3.5" />
                  Aplikim i ri
                </a>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={load}
                disabled={loading}
                aria-label="Rifresko"
                className="h-8"
              >
                <RefreshCw className={cn("size-4", loading && "animate-spin")} />
              </Button>
            </div>
          </div>
          {data && (
            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
              <Landmark className="size-3.5" /> {data.process}
            </div>
          )}
        </Card>

        {error && (
          <Card className="p-4 border-destructive/30 bg-destructive/5">
            <div className="flex items-start gap-2 text-sm">
              <AlertCircle className="size-4 mt-0.5 text-destructive" />
              <div>
                <div className="font-medium text-destructive">{error}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Kontrolloni kodin dhe provoni sërish.
                </p>
              </div>
            </div>
          </Card>
        )}

        {loading && !data && !error && (
          <Card className="p-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Duke ngarkuar…
          </Card>
        )}

        {data && (
          <>
            {/* Current status */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "size-8 rounded-md grid place-items-center shrink-0",
                    data.isFinal ? "bg-success/15 text-success" : "bg-primary/10 text-primary",
                  )}
                >
                  {data.isFinal ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <Clock className="size-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Faza aktuale
                  </div>
                  <div className="text-sm font-semibold truncate">
                    {data.currentPhase.number}. {data.currentPhase.title}
                  </div>
                </div>
              </div>
              {data.currentPhase.description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {data.currentPhase.description}
                </p>
              )}
              <div className="flex items-center gap-1.5 text-xs">
                <Building2 className="size-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Institucioni:</span>
                <span className="font-medium">{data.currentPhase.institution}</span>
              </div>

              {!data.isFinal && data.nextMilestone && (
                <div className="rounded-md border bg-muted/40 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Hapi tjetër i pritshëm
                  </div>
                  <div className="text-sm font-medium mt-0.5">{data.nextMilestone}</div>
                  {data.nextInstitution && (
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Përgjegjës: {data.nextInstitution}
                    </div>
                  )}
                </div>
              )}
              {data.isFinal && (
                <div className="rounded-md border border-success/30 bg-success/10 p-3 text-success text-sm flex items-center gap-2">
                  <CheckCircle2 className="size-4" /> Procedura është mbyllur.
                </div>
              )}
            </Card>

            {data.processKind === "expropriation" && data.compensation ? (
              <Card className="border-warning/30 bg-warning/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-2">
                    <div className="grid size-8 shrink-0 place-items-center rounded-md bg-warning/20 text-warning-foreground">
                      <CreditCard className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">Kompensimi / pagesa</div>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        Pagesa e shpronesimit monitorohet deri te disbursimi nga{" "}
                        {data.compensation.ministry}.
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-[11px]">
                    {data.compensation.statusLabel}
                  </Badge>
                </div>
                <div className="mt-3 grid gap-2 md:grid-cols-3">
                  <div className="rounded-md border bg-background/80 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Vlera
                    </div>
                    <div className="mt-1 text-sm font-semibold">
                      {data.compensation.amountAll !== null
                        ? `${data.compensation.amountAll.toLocaleString("sq-AL")} ALL`
                        : "Ne pritje te vleresimit"}
                    </div>
                  </div>
                  <div className="rounded-md border bg-background/80 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Urdhri i pageses
                    </div>
                    <div className="mt-1 text-sm font-semibold">
                      {data.compensation.paymentOrderUploaded ? "I regjistruar" : "Ne pritje"}
                    </div>
                  </div>
                  <div className="rounded-md border bg-background/80 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Disbursimi
                    </div>
                    <div className="mt-1 text-sm font-semibold">
                      {data.compensation.paymentConfirmed ? "I konfirmuar" : "Ne monitorim"}
                    </div>
                  </div>
                </div>
                <div className="mt-3 rounded-md border bg-background/70 px-3 py-2 text-xs text-muted-foreground">
                  {data.compensation.nextAction}
                </div>
              </Card>
            ) : null}

            {data.mapPreview ? (
              <Card className="overflow-hidden border-emerald-200 bg-emerald-50/70">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-2 p-4 pr-0">
                    <div className="grid size-8 shrink-0 place-items-center rounded-md border border-emerald-200 bg-emerald-100 text-emerald-800">
                      <MapPinned className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-emerald-950">
                        AI GIS / AKPT e-Harta
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-emerald-800">
                        {data.mapPreview.aiUse}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap justify-end gap-1.5 p-4 pl-0">
                    <Button asChild size="sm" variant="outline" className="h-8 bg-white">
                      <a href={data.mapPreview.url} target="_blank" rel="noreferrer">
                        <ExternalLink className="mr-1 size-3.5" />
                        Harta
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="h-8 bg-white">
                      <a href={mapPdfUrl(data.trackingCode)} download>
                        <Download className="mr-1 size-3.5" />
                        PDF
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="h-8 bg-white">
                      <a href={mapPrintUrl(data.trackingCode)} target="_blank" rel="noreferrer">
                        <ExternalLink className="mr-1 size-3.5" />
                        Printo
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="border-t border-emerald-200 bg-white">
                  <div className="relative aspect-[16/9] min-h-52 bg-slate-100">
                    <ParcelMap
                      center={data.mapPreview}
                      parcelPolygon={data.mapPreview.parcelPolygon}
                    />
                  </div>
                  <div className="border-t px-3 py-2 text-[11px] text-emerald-900">
                    Vendodhja e prones - {data.mapPreview.lat.toFixed(4)},{" "}
                    {data.mapPreview.lon.toFixed(4)} - {data.mapPreview.provider}
                    <div className="mt-1 font-medium text-emerald-950">
                      Poligoni i parceles: {data.mapPreview.parcelPolygon.length} pika
                    </div>
                    <div className="mt-1 font-medium text-emerald-950">
                      Sinjali AI: {data.mapPreview.aiSignal}
                    </div>
                    <div className="mt-1 text-emerald-800">{data.mapPreview.accuracyLabel}</div>
                  </div>
                </div>
              </Card>
            ) : null}

            {/* Requester verification */}
            <Card
              className={cn(
                "p-4",
                data.requesterVerification.canReceiveDocuments
                  ? "border-success/25 bg-success/5"
                  : "border-warning/30 bg-warning/5",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 min-w-0">
                  <div
                    className={cn(
                      "size-8 rounded-md grid place-items-center shrink-0",
                      data.requesterVerification.canReceiveDocuments
                        ? "bg-success/15 text-success"
                        : "bg-warning/20 text-warning-foreground",
                    )}
                  >
                    <UserCheck className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">Verifikimi i te drejtes</div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Dokumenti merret vetem nga personi qe perputhet me kartelen kadastrale ose nga
                      perfaqesuesi ligjor i tij.
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    "shrink-0 text-[11px]",
                    data.requesterVerification.canReceiveDocuments
                      ? "bg-success/15 text-success border-success/20"
                      : "bg-warning/15 text-warning-foreground border-warning/30",
                    data.requesterVerification.status === "rejected" &&
                      "bg-destructive/15 text-destructive border-destructive/20",
                  )}
                >
                  {REQUESTER_STATUS_SQ[data.requesterVerification.status]}
                </Badge>
              </div>

              <div className="mt-3 text-xs text-muted-foreground">
                Roli:{" "}
                <span className="font-medium text-foreground">
                  {data.requesterVerification.claimType === "legal_representative"
                    ? "Perfaqesues ligjor"
                    : "Personi/pronari në kadastër"}
                </span>
                {data.requesterVerification.cadastralSubjectName
                  ? ` · Emri në kadastër: ${data.requesterVerification.cadastralSubjectName}`
                  : ""}
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                {data.requesterVerification.requiredDocuments.map((doc) => (
                  <div
                    key={doc.type}
                    className={cn(
                      "rounded-md border px-3 py-2 text-xs",
                      doc.uploaded
                        ? "border-success/25 bg-background/80"
                        : "border-warning/30 bg-background/70",
                    )}
                  >
                    <div className="flex items-center gap-1.5 font-medium">
                      {requesterDocIcon(doc.type)}
                      <span>{doc.label}</span>
                    </div>
                    <div
                      className={cn(
                        "mt-1 text-[11px]",
                        doc.uploaded ? "text-success" : "text-warning-foreground",
                      )}
                    >
                      {doc.uploaded ? "U dorezua" : "Mungon"}
                    </div>
                  </div>
                ))}
              </div>

              {!data.requesterVerification.canReceiveDocuments && (
                <div className="mt-3 rounded-md border border-warning/25 bg-background/70 px-3 py-2 text-xs text-muted-foreground">
                  {data.requesterVerification.heldDocumentsCount > 0
                    ? `${data.requesterVerification.heldDocumentsCount} dokument i vulosur mbahet ne pritje dhe hapet pas verifikimit.`
                    : "Dokumenti i kerkuar do te hapet per shkarkim pas verifikimit."}
                </div>
              )}
            </Card>

            {/* Expedited procedure */}
            <Card className="p-4 border-info/25 bg-info/5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 min-w-0">
                  <div className="size-8 rounded-md bg-primary/10 text-primary grid place-items-center shrink-0">
                    <Clock className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">Procedure e pershpejtuar</div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Plotesoni formularin ne web ose ngarkoni PDF-in tuaj, pastaj bashkengjisni
                      dokumentin provues. Tarifa shtese perdoret vetem kur eshte tarife zyrtare; ne
                      demo eshte vendosur mandat pagese 1,000 ALL.
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    "shrink-0 text-[11px]",
                    data.expeditedProcedure.status === "approved" &&
                      "bg-success/15 text-success border-success/20",
                    data.expeditedProcedure.status === "submitted" &&
                      "bg-warning/15 text-warning-foreground border-warning/30",
                    data.expeditedProcedure.status === "rejected" &&
                      "bg-destructive/15 text-destructive border-destructive/20",
                  )}
                >
                  {EXPEDITE_STATUS_SQ[data.expeditedProcedure.status]}
                </Badge>
              </div>

              {data.expeditedProcedure.status !== "not_requested" ? (
                <div className="mt-3 rounded-md border bg-background/80 p-3 text-xs">
                  <div className="font-medium">
                    {data.expeditedProcedure.reasonLabel ?? "Kerkese e derguar"}
                  </div>
                  <div className="mt-1 text-muted-foreground">
                    Derguar:{" "}
                    {data.expeditedProcedure.requestedAt
                      ? fmtDateTime(data.expeditedProcedure.requestedAt)
                      : "-"}
                    {data.expeditedProcedure.paymentRequired &&
                    data.expeditedProcedure.paymentAmountAll
                      ? ` · Tarifë demo: ${data.expeditedProcedure.paymentAmountAll.toLocaleString(
                          "sq-AL",
                        )} ALL`
                      : ""}
                  </div>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <ExpeditedDocumentTile
                      trackingCode={data.trackingCode}
                      label="Formulari"
                      fileName={data.expeditedProcedure.requestPdfName}
                      documentId={data.expeditedProcedure.requestPdfDocumentId}
                    />
                    <ExpeditedDocumentTile
                      trackingCode={data.trackingCode}
                      label="Dokumenti provues"
                      fileName={data.expeditedProcedure.supportingDocumentName}
                      documentId={data.expeditedProcedure.supportingDocumentId}
                    />
                    <ExpeditedDocumentTile
                      trackingCode={data.trackingCode}
                      label="Mandati"
                      fileName={data.expeditedProcedure.paymentReceiptName}
                      documentId={data.expeditedProcedure.paymentReceiptDocumentId}
                    />
                  </div>
                  <div className="mt-3">
                    <Button asChild size="sm" variant="outline" className="h-8">
                      <a href={expediteFormUrl(data.trackingCode)} download>
                        <Download className="size-3.5 mr-1" />
                        Shkarko formularin bosh
                      </a>
                    </Button>
                  </div>
                  {data.expeditedProcedure.reviewNote ? (
                    <div className="mt-2 text-muted-foreground">
                      Shenim operatori: {data.expeditedProcedure.reviewNote}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {data.expeditedProcedure.status === "not_requested" ||
              data.expeditedProcedure.status === "rejected" ? (
                <div className="mt-3 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline" className="h-8">
                      <a href={expediteFormUrl(data.trackingCode)} download>
                        <Download className="size-3.5 mr-1" />
                        Shkarko formularin PDF
                      </a>
                    </Button>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Arsyeja</Label>
                    <Select
                      value={expediteReason}
                      onValueChange={(value) => {
                        setExpediteReason(value as ExpeditedReason);
                        clearGeneratedExpeditePdf();
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPEDITE_REASONS.map((reason) => (
                          <SelectItem key={reason.value} value={reason.value}>
                            {reason.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Pershkrimi i arsyes</Label>
                    <Textarea
                      value={expediteJustification}
                      onChange={(e) => {
                        setExpediteJustification(e.target.value);
                        clearGeneratedExpeditePdf();
                      }}
                      rows={3}
                      maxLength={2000}
                      className="text-sm"
                      placeholder="Shpjegoni pse kerkohet trajtim i pershpejtuar dhe cfare dokumenti e provon."
                    />
                  </div>
                  <div className="rounded-md border bg-background/80 p-3 text-xs">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="font-medium">Formulari i plotesuar</div>
                        <div className="text-muted-foreground mt-0.5">
                          Gjenero PDF nga te dhenat me siper, ose ngarko nje PDF te plotesuar nga
                          jashte.
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="h-8"
                        onClick={generateExpeditedRequestPdf}
                      >
                        <FileText className="size-3.5 mr-1" />
                        Gjenero PDF
                      </Button>
                    </div>
                    {expediteRequestPdf ? (
                      <div className="mt-2 rounded-md border border-success/25 bg-success/10 px-2 py-1.5 text-success">
                        Gati per ngarkim (
                        {expediteRequestPdfSource === "generated" ? "gjeneruar" : "ngarkuar"}):{" "}
                        {expediteRequestPdf.name}
                      </div>
                    ) : (
                      <div className="mt-2 rounded-md border border-warning/25 bg-warning/10 px-2 py-1.5 text-warning-foreground">
                        Ende nuk ka formular PDF te bashkangjitur.
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Ngarko formular PDF te plotesuar</Label>
                      <Input
                        type="file"
                        accept="application/pdf"
                        className="h-9 text-sm"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          setExpediteRequestPdf(file);
                          setExpediteRequestPdfSource(file ? "uploaded" : null);
                          setExpediteSuccess(null);
                        }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Dokumenti provues</Label>
                      <Input
                        type="file"
                        accept="application/pdf,image/*"
                        className="h-9 text-sm"
                        onChange={(e) => setExpediteSupportingDocument(e.target.files?.[0] ?? null)}
                      />
                    </div>
                  </div>
                  <label className="flex items-start gap-2 rounded-md border bg-background/80 p-2 text-xs cursor-pointer">
                    <Checkbox
                      checked={expeditePaymentRequired}
                      onCheckedChange={(value) => {
                        setExpeditePaymentRequired(value === true);
                        clearGeneratedExpeditePdf();
                      }}
                      className="mt-0.5"
                    />
                    <span>
                      <span className="font-medium flex items-center gap-1">
                        <CreditCard className="size-3.5 text-primary" />
                        Bashkangjit mandat pagese per tarifen zyrtare
                      </span>
                      <span className="block text-muted-foreground mt-0.5">
                        Ne demo: 1,000 ALL. Ne zbatim real, kjo tarife duhet te jete e miratuar
                        zyrtarisht dhe pagesa nuk garanton miratimin.
                      </span>
                    </span>
                  </label>
                  {expeditePaymentRequired ? (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Mandat pagese</Label>
                      <Input
                        type="file"
                        accept="application/pdf,image/*"
                        className="h-9 text-sm"
                        onChange={(e) => setExpeditePaymentReceipt(e.target.files?.[0] ?? null)}
                      />
                    </div>
                  ) : null}
                  {expediteError ? (
                    <div className="text-xs text-destructive">{expediteError}</div>
                  ) : null}
                  {expediteSuccess ? (
                    <div className="rounded-md border border-success/25 bg-success/10 px-3 py-2 text-xs text-success">
                      {expediteSuccess}
                    </div>
                  ) : null}
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={submitExpeditedProcedure}
                      disabled={expediteSending}
                      className="h-8"
                    >
                      {expediteSending ? (
                        <Loader2 className="size-3.5 mr-1 animate-spin" />
                      ) : (
                        <FileUp className="size-3.5 mr-1" />
                      )}
                      Dergoni kerkesen
                    </Button>
                  </div>
                </div>
              ) : null}
            </Card>

            {/* Phases timeline */}
            <Card className="p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
                Rrugëtimi
              </div>
              <ol className="relative space-y-3">
                {data.phasesTimeline.map((p, i) => {
                  const isLast = i === data.phasesTimeline.length - 1;
                  return (
                    <li key={p.order} className="relative flex gap-3">
                      <div className="relative flex flex-col items-center">
                        <div
                          className={cn(
                            "size-6 rounded-full grid place-items-center text-[10px] font-semibold shrink-0",
                            p.state === "completed" && "bg-success text-success-foreground",
                            p.state === "current" &&
                              "bg-primary text-primary-foreground ring-4 ring-primary/15",
                            p.state === "upcoming" && "bg-muted text-muted-foreground border",
                          )}
                        >
                          {p.state === "completed" ? (
                            <CheckCircle2 className="size-3.5" />
                          ) : p.state === "current" ? (
                            <Circle className="size-2.5 fill-current" />
                          ) : (
                            p.order
                          )}
                        </div>
                        {!isLast && (
                          <div
                            className={cn(
                              "w-px flex-1 mt-1 min-h-[18px]",
                              p.state === "completed" ? "bg-success/40" : "bg-border",
                            )}
                          />
                        )}
                      </div>
                      <div className="min-w-0 pb-2">
                        <div
                          className={cn(
                            "text-sm",
                            p.state === "current" ? "font-semibold" : "font-medium",
                            p.state === "upcoming" && "text-muted-foreground",
                          )}
                        >
                          {p.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{p.institution}</div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </Card>

            {/* Missing documents */}
            {data.missingDocuments.length > 0 && (
              <Card className="p-4 border-warning/30 bg-warning/5">
                <div className="flex items-center gap-2 mb-2">
                  <FileWarning className="size-4 text-warning-foreground" />
                  <div className="text-sm font-semibold">Dokumente që kërkohen prej jush</div>
                </div>
                <ul className="space-y-1.5">
                  {data.missingDocuments.map((doc) => (
                    <li key={doc.type} className="flex items-start gap-2 text-sm leading-snug">
                      <Circle className="size-2 mt-2 shrink-0 fill-warning-foreground/60 text-warning-foreground/60" />
                      <span>{doc.label}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-muted-foreground mt-3">
                  Dorëzoni këto dokumente në sportelin e institucionit përgjegjës ose përmes
                  e-Albania kur është e mundur.
                </p>
              </Card>
            )}

            {/* Delivered documents */}
            {data.citizenDocuments.length > 0 && (
              <Card className="p-4 border-success/25 bg-success/5">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="size-4 text-success" />
                  <div className="text-sm font-semibold">Dokumente nga institucioni</div>
                </div>
                <ul className="space-y-2">
                  {data.citizenDocuments.map((doc) => (
                    <li key={doc.id} className="rounded-md border bg-background/80 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-medium leading-snug truncate">
                            {doc.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {doc.label} · dërguar më {fmtDateTime(doc.deliveredAt)}
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="shrink-0 bg-success/15 text-success border-success/20"
                        >
                          Marrë
                        </Badge>
                      </div>
                      {doc.electronicallySealed && (
                        <div className="mt-2 inline-flex items-center gap-1 rounded-md border border-success/25 bg-success/10 px-2 py-1 text-[11px] text-success">
                          <ShieldCheck className="size-3.5" />
                          Vulosur elektronikisht
                        </div>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button asChild size="sm" variant="outline" className="h-8">
                          <a
                            href={citizenDocumentUrl(data.trackingCode, doc.id)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Eye className="size-3.5 mr-1" />
                            Shiko PDF
                          </a>
                        </Button>
                        <Button asChild size="sm" className="h-8">
                          <a href={citizenDocumentUrl(data.trackingCode, doc.id, true)} download>
                            <Download className="size-3.5 mr-1" />
                            Shkarko
                          </a>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Citizen complaints */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="size-4 text-muted-foreground" />
                <div className="text-sm font-semibold">Ankesë për dosjen</div>
              </div>
              <div className="space-y-3">
                <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
                  Ankesa lidhet me fazën aktuale dhe i përcillet operatorit që ka trajtuar dosjen.
                  Në përfundim mund të dërgohet si verifikim final.
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Subjekti</Label>
                  <Input
                    value={complaintSubject}
                    onChange={(e) => setComplaintSubject(e.target.value)}
                    placeholder="p.sh. Dokumenti nuk është i saktë"
                    className="h-9 text-sm"
                    maxLength={120}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Përshkrimi i ankesës</Label>
                  <Textarea
                    value={complaintMessage}
                    onChange={(e) => setComplaintMessage(e.target.value)}
                    placeholder="Shkruani çfarë nuk shkon me fazën, dokumentin ose vendimin."
                    rows={4}
                    className="text-sm"
                    maxLength={2000}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Kontakt opsional</Label>
                  <Input
                    value={complaintContact}
                    onChange={(e) => setComplaintContact(e.target.value)}
                    placeholder="Telefon ose email"
                    className="h-9 text-sm"
                    maxLength={120}
                  />
                </div>
                {complaintError ? (
                  <div className="text-xs text-destructive">{complaintError}</div>
                ) : null}
                {complaintSuccess ? (
                  <div className="rounded-md border border-success/25 bg-success/10 px-3 py-2 text-xs text-success">
                    {complaintSuccess}
                  </div>
                ) : null}
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={submitComplaint}
                    disabled={complaintSending}
                    className="h-8"
                  >
                    {complaintSending ? (
                      <Loader2 className="size-3.5 mr-1 animate-spin" />
                    ) : (
                      <Send className="size-3.5 mr-1" />
                    )}
                    Dërgo ankesë
                  </Button>
                </div>
              </div>

              {data.citizenComplaints.length > 0 && (
                <div className="mt-4 border-t pt-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                    Ankesat e dërguara
                  </div>
                  <ul className="space-y-2">
                    {data.citizenComplaints.map((complaint) => (
                      <li key={complaint.id} className="rounded-md border p-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-sm font-medium leading-snug">
                              {complaint.subject}
                            </div>
                            <div className="text-[11px] text-muted-foreground mt-0.5">
                              {fmtDateTime(complaint.createdAt)} · {complaint.routedToLabel}
                              {complaint.phaseTitle ? ` · ${complaint.phaseTitle}` : ""}
                            </div>
                          </div>
                          <Badge variant="secondary" className="shrink-0 text-[11px]">
                            {COMPLAINT_STATUS_SQ[complaint.status]}
                          </Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>

            {/* Deadlines */}
            {(data.citizenDeadlines.length > 0 || data.deadline) && (
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarClock className="size-4 text-muted-foreground" />
                  <div className="text-sm font-semibold">Afatet që ju interesojnë</div>
                </div>
                <ul className="space-y-2">
                  {data.citizenDeadlines.map((dl) => (
                    <DeadlineRow
                      key={dl.label + dl.dueAt}
                      label={dl.label}
                      dueAt={dl.dueAt}
                      daysRemaining={dl.daysRemaining}
                      kind={dl.kind === "legal" ? "Afat ligjor" : "Institucional"}
                    />
                  ))}
                  {data.citizenDeadlines.length === 0 && data.deadline && (
                    <DeadlineRow
                      label={data.deadline.label}
                      dueAt={data.deadline.dueAt}
                      daysRemaining={data.deadline.daysRemaining ?? 0}
                      kind="Afat"
                    />
                  )}
                </ul>
              </Card>
            )}

            <p className="text-[10px] text-center text-muted-foreground pt-2">
              Përditësuar së fundmi: {fmtDateTime(data.updatedAt)}
            </p>
          </>
        )}
      </main>
      <CitizenVirtualAgent defaultTrackingCode={code} />
    </AppShell>
  );
}

function DeadlineRow({
  label,
  dueAt,
  daysRemaining,
  kind,
}: {
  label: string;
  dueAt: string;
  daysRemaining: number;
  kind: string;
}) {
  const overdue = daysRemaining < 0;
  const soon = daysRemaining >= 0 && daysRemaining <= 7;
  return (
    <li className="flex items-start justify-between gap-3 rounded-md border p-2.5">
      <div className="min-w-0">
        <div className="text-sm font-medium leading-snug">{label}</div>
        <div className="text-[11px] text-muted-foreground mt-0.5">
          {kind} · {fmtDate(dueAt)}
        </div>
      </div>
      <Badge
        variant="secondary"
        className={cn(
          "shrink-0 text-[11px]",
          overdue && "bg-destructive/15 text-destructive border-destructive/20",
          soon && !overdue && "bg-warning/15 text-warning-foreground border-warning/30",
          !overdue && !soon && "bg-success/15 text-success border-success/20",
        )}
      >
        {overdue
          ? `${Math.abs(daysRemaining)} ditë vonesë`
          : daysRemaining === 0
            ? "Sot"
            : `${daysRemaining} ditë`}
      </Badge>
    </li>
  );
}
