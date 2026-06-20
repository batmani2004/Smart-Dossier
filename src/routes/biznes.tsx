import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileCheck2,
  FileUp,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AccessNotice } from "@/components/role-switcher";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createBusinessPropertyApplication } from "@/lib/api/dossiers.functions";
import { useDemoRole } from "@/lib/demo-access";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/biznes")({
  head: () => ({
    meta: [
      { title: "Portali i biznesit — Smart Dossier" },
      {
        name: "description",
        content: "Aplikim biznesi me NIPT per regjistrim prone dhe gjurmim te dosjes.",
      },
    ],
  }),
  component: BusinessPortal,
});

const REQUIRED_DOCUMENTS = [
  {
    type: "business_nipt_extract",
    label: "Ekstrakt QKB / NIPT",
    helper: "Dokument qe identifikon subjektin dhe administratorin.",
  },
  {
    type: "legal_representative_id",
    label: "ID e administratorit / perfaqesuesit",
    helper: "Karte identiteti ose autorizim per perfaqesues ligjor.",
  },
  {
    type: "property_registration_request",
    label: "Kerkese per regjistrim prone",
    helper: "Formular kerkese me objektin e regjistrimit.",
  },
  {
    type: "ownership_origin_document",
    label: "Akt origjine pronesie",
    helper: "Kontrate, vendim, akt dhurimi ose dokument tjeter i origjines.",
  },
  {
    type: "property_plan",
    label: "Plan rilevimi / genplan",
    helper: "Plan me kufij, siperfaqe dhe te dhena teknike te pasurise.",
  },
] as const;

function absoluteTrackingUrl(code: string) {
  const path = `/track/${encodeURIComponent(code)}`;
  return typeof window === "undefined" ? path : `${window.location.origin}${path}`;
}

function BusinessPortal() {
  const { role, profile } = useDemoRole();
  const create = useServerFn(createBusinessPropertyApplication);
  const qc = useQueryClient();
  const [businessName, setBusinessName] = useState("AlbaTech sh.p.k.");
  const [nipt, setNipt] = useState("L12345678A");
  const [representativeName, setRepresentativeName] = useState("Arben Dervishi");
  const [zone, setZone] = useState("Tirane");
  const [propertyDescription, setPropertyDescription] = useState(
    "Njesi sherbimi dhe magazine logjistike",
  );
  const [cadastralNo, setCadastralNo] = useState("7/188");
  const [areaSqm, setAreaSqm] = useState("320");
  const [notes, setNotes] = useState(
    "Kerkohet regjistrimi i pasurise ne emer te subjektit sipas dokumentacionit te bashkengjitur.",
  );
  const [documentNames, setDocumentNames] = useState<Record<string, string>>({
    business_nipt_extract: "Ekstrakt-QKB-AlbaTech.pdf",
    legal_representative_id: "ID-administrator.pdf",
    property_registration_request: "Kerkese-regjistrimi.pdf",
    ownership_origin_document: "Kontrate-shitblerje.pdf",
  });
  const [created, setCreated] = useState<{ id: string; trackingCode: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const createdUrl = created ? absoluteTrackingUrl(created.trackingCode) : "";

  async function copyLink() {
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

  async function submitApplication() {
    setSubmitting(true);
    try {
      const documents = REQUIRED_DOCUMENTS.flatMap((doc) => {
        const name = documentNames[doc.type]?.trim();
        return name ? [{ type: doc.type, name }] : [];
      });
      const result = await create({
        data: {
          businessName,
          nipt,
          representativeName,
          zone,
          propertyDescription,
          cadastralNo: cadastralNo || undefined,
          areaSqm: areaSqm ? Number(areaSqm) : undefined,
          notes: notes || undefined,
          documents,
        },
      });
      setCreated({ id: result.id, trackingCode: result.trackingCode });
      setCopied(false);
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["dossiers"] }),
        qc.invalidateQueries({ queryKey: ["dashboard"] }),
      ]);
      toast.success(`Aplikimi u regjistrua: ${result.trackingCode}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Aplikimi deshtoi");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto grid max-w-[1300px] grid-cols-1 gap-4 px-4 py-5 md:px-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          {role !== "business" ? (
            <AccessNotice
              title="Pamje demo biznesi"
              body="Kjo faqe simulon vetesherbimin e subjektit privat. Profili aktiv ndryshohet nga hyrja me OTP."
            />
          ) : null}

          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <Building2 className="size-4" />
                Portali i biznesit
              </div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                Aplikim per regjistrim prone me NIPT
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Subjekti identifikohet me NIPT, ngarkon dokumentacionin dhe dosja kalon te operatori
                i kadastres per shqyrtim.
              </p>
            </div>
            <div className="rounded-md border bg-card px-3 py-2 text-sm">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Perdoruesi
              </div>
              <div className="font-semibold">{profile.displayName}</div>
              <div className="text-xs text-muted-foreground">{profile.credentialLabel}</div>
            </div>
          </div>

          {created ? (
            <Card className="border-success/25 bg-success/5 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">Aplikimi u regjistrua</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    U gjenerua linku i gjurmimit per biznesin. Subjekti mund ta hape nga kjo faqe
                    ose nga opsioni "Gjurmim aplikimi" duke vendosur kodin BIZ.
                  </p>
                  <div className="mt-3 grid gap-2 md:grid-cols-[160px_minmax(0,1fr)]">
                    <div className="rounded-md border bg-background px-2 py-1.5 font-mono text-xs">
                      {created.trackingCode}
                    </div>
                    <div className="rounded-md border bg-background px-2 py-1.5 font-mono text-[11px] text-muted-foreground break-all">
                      {createdUrl}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button type="button" size="sm" onClick={copyLink}>
                      <Copy className="mr-1.5 size-3.5" />
                      {copied ? "Kopjuar" : "Kopjo linkun"}
                    </Button>
                    <Button asChild type="button" size="sm" variant="outline">
                      <a href={createdUrl} target="_blank" rel="noreferrer">
                        <ExternalLink className="mr-1.5 size-3.5" />
                        Hap linkun e gjurmimit
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : null}

          <Card className="p-4">
            <div className="mb-4 flex items-center gap-2">
              <Landmark className="size-4 text-primary" />
              <h2 className="text-sm font-semibold">Te dhenat e subjektit dhe prones</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field label="Emri i biznesit" value={businessName} setValue={setBusinessName} />
              <Field label="NIPT" value={nipt} setValue={setNipt} />
              <Field
                label="Administrator / perfaqesues"
                value={representativeName}
                setValue={setRepresentativeName}
              />
              <Field label="Zona / Bashkia" value={zone} setValue={setZone} />
              <Field label="Nr. kadastral" value={cadastralNo} setValue={setCadastralNo} />
              <Field label="Siperfaqe m2" value={areaSqm} setValue={setAreaSqm} type="number" />
              <div className="md:col-span-2">
                <Field
                  label="Pershkrimi i pasurise"
                  value={propertyDescription}
                  setValue={setPropertyDescription}
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs">Shenime / arsyeja e aplikimit</Label>
                <Textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  className="text-sm"
                />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="mb-4 flex items-center gap-2">
              <FileUp className="size-4 text-primary" />
              <h2 className="text-sm font-semibold">Dokumentacioni i aplikimit</h2>
            </div>
            <div className="space-y-2">
              {REQUIRED_DOCUMENTS.map((doc) => {
                const uploaded = !!documentNames[doc.type]?.trim();
                return (
                  <div
                    key={doc.type}
                    className={cn(
                      "grid gap-2 rounded-md border p-3 md:grid-cols-[minmax(0,1fr)_240px]",
                      uploaded ? "border-success/25 bg-success/5" : "bg-muted/20",
                    )}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <FileCheck2
                          className={cn(
                            "size-4",
                            uploaded ? "text-success" : "text-muted-foreground",
                          )}
                        />
                        <div className="text-sm font-medium">{doc.label}</div>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{doc.helper}</p>
                      {uploaded ? (
                        <div className="mt-2 rounded-md border bg-background px-2 py-1 font-mono text-[11px] text-muted-foreground">
                          {documentNames[doc.type]}
                        </div>
                      ) : null}
                    </div>
                    <Input
                      type="file"
                      accept="application/pdf,image/*"
                      className="h-9 text-sm"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        setDocumentNames((current) => ({ ...current, [doc.type]: file.name }));
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setCreated(null)}>
                Pastro njoftimin
              </Button>
              <Button type="button" onClick={submitApplication} disabled={submitting}>
                <ShieldCheck className="mr-1.5 size-4" />
                {submitting ? "Duke derguar..." : "Dergo aplikimin"}
              </Button>
            </div>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">
              Si shqyrtohet
            </div>
            <div className="mt-3 space-y-3 text-sm">
              <Step
                number="1"
                title="Identifikim me NIPT"
                body="Subjekti dhe administratori verifikohen nga dokumentet e QKB."
              />
              <Step
                number="2"
                title="Dokumente prone"
                body="Operatori kontrollon aktin e origjines, planin dhe nr. kadastral."
              />
              <Step
                number="3"
                title="Kontroll GIS"
                body="Verifikohet zona, siperfaqja dhe mbivendosjet e mundshme."
              />
              <Step
                number="4"
                title="Vendim"
                body="Miratim, kerkese per plotesim ose refuzim i arsyetuar."
              />
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">
              Statusi pas dergimit
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Aplikimi krijohet si dosje `BIZ`, shfaqet te radha e adminit per caktim operatori dhe
              gjurmohet publikisht me linkun e gjeneruar.
            </p>
          </Card>

          <Card className="p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">
              Shpronesim biznesi
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Nese pasuria e subjektit preket nga projekt publik, biznesi mund te aplikoje per
              kompensim dhe ta ndjeke pagesen nga Ministria e Ekonomise.
            </p>
            <Button asChild size="sm" className="mt-3">
              <Link to="/aplikim">Apliko per kompensim</Link>
            </Button>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}

function Field({
  label,
  value,
  setValue,
  type = "text",
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="h-9 text-sm"
      />
    </div>
  );
}

function Step({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <div className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
        {number}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium">{title}</div>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
