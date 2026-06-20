import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Copy,
  CreditCard,
  ExternalLink,
  FileUp,
  Home,
  Landmark,
  Scale,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createBusinessPropertyApplication,
  createDossier,
  createExpropriationCompensationApplication,
} from "@/lib/api/dossiers.functions";
import { useDemoRole } from "@/lib/demo-access";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/aplikim")({
  head: () => ({
    meta: [
      { title: "Aplikim i ri - Smart Dossier" },
      {
        name: "description",
        content:
          "Aplikim i ri per privatizim banese, shpronesim/kompensim ose regjistrim prone biznesi.",
      },
    ],
  }),
  component: ApplicationPortal,
});

type ApplicantType = "citizen" | "business";
type ApplicationKind = "ekb_privatization" | "expropriation" | "property_registration";

type DocConfig = {
  type: string;
  label: string;
  helper: string;
};

const DOCS: Record<ApplicationKind, Record<ApplicantType, DocConfig[]>> = {
  ekb_privatization: {
    citizen: [
      {
        type: "id_card_copy",
        label: "Kopje ID",
        helper: "Dokumenti identifikues i qytetarit perfitues.",
      },
      {
        type: "family_certificate",
        label: "Certifikate familjare",
        helper: "Per verifikimin e perberjes familjare dhe normave te banimit.",
      },
      {
        type: "income_proof",
        label: "Vertetim te ardhurash",
        helper: "Per llogaritjen e vleres sipas fashave te te ardhurave.",
      },
      {
        type: "rent_contract_history",
        label: "Historik kontrate / qiraje",
        helper: "Dokumentacion qe provon lidhjen me banesen objekt privatizimi.",
      },
      {
        type: "ashk_certificate_copy",
        label: "Kopje certifikate ASHK",
        helper: "Kopje e certifikates / karteles se pasurise kur disponohet.",
      },
      {
        type: "marriage_certificate",
        label: "Certifikate martese",
        helper: "Kerkohet kur statusi familjar ndikon ne dosje.",
      },
    ],
    business: [],
  },
  expropriation: {
    citizen: [
      {
        type: "id_card_copy",
        label: "Kopje ID",
        helper: "Dokumenti identifikues i pronarit ose perfaqesuesit.",
      },
      {
        type: "ownership_extract",
        label: "Ekstrakt pronesie",
        helper: "Dokument qe verteton lidhjen me pasurine ne kadaster.",
      },
      {
        type: "civil_status_extract",
        label: "Ekstrakt gjendje civile",
        helper: "Per verifikim trashegimie ose perputhje identiteti.",
      },
      {
        type: "expropriation_notice",
        label: "Njoftim / akt shpronesimi",
        helper: "Njoftimi i marre ose akti qe lidhet me projektin publik.",
      },
      {
        type: "compensation_claim_request",
        label: "Kerkese kompensimi",
        helper: "Kerkesa e nenshkruar per pagesen e shpronesimit.",
      },
      {
        type: "bank_account_certificate",
        label: "Vertetim bankar / IBAN",
        helper: "Llogaria ku Ministria e Ekonomise do te dergoje pagesen.",
      },
    ],
    business: [
      {
        type: "business_nipt_extract",
        label: "Ekstrakt QKB / NIPT",
        helper: "Identifikon subjektin dhe administratorin.",
      },
      {
        type: "legal_representative_id",
        label: "ID administrator / perfaqesues",
        helper: "ID ose autorizim i personit qe aplikon.",
      },
      {
        type: "ownership_extract",
        label: "Ekstrakt pronesie",
        helper: "Dokument qe lidh biznesin me pasurine.",
      },
      {
        type: "expropriation_notice",
        label: "Njoftim / akt shpronesimi",
        helper: "Akti i shpronesimit ose njoftimi per projektin publik.",
      },
      {
        type: "compensation_claim_request",
        label: "Kerkese kompensimi",
        helper: "Kerkese e subjektit per disbursimin e kompensimit.",
      },
      {
        type: "bank_account_certificate",
        label: "Vertetim bankar / IBAN",
        helper: "Llogaria e subjektit per pagesen nga Ministria e Ekonomise.",
      },
    ],
  },
  property_registration: {
    citizen: [],
    business: [
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
    ],
  },
};

function absoluteTrackingUrl(code: string) {
  const path = `/track/${encodeURIComponent(code)}`;
  return typeof window === "undefined" ? path : `${window.location.origin}${path}`;
}

function defaultDocs(kind: ApplicationKind, type: ApplicantType) {
  if (kind === "ekb_privatization") {
    return {
      id_card_copy: "ID-qytetari.pdf",
      family_certificate: "Certifikate-familjare.pdf",
      income_proof: "Vertetim-te-ardhurash.pdf",
      rent_contract_history: "Historik-kontrate-qiraje.pdf",
      ashk_certificate_copy: "Kopje-certifikate-ASHK.pdf",
      marriage_certificate: "Certifikate-martese.pdf",
    };
  }
  if (kind === "property_registration") {
    return {
      business_nipt_extract: "Ekstrakt-QKB.pdf",
      legal_representative_id: "ID-administrator.pdf",
      property_registration_request: "Kerkese-regjistrimi.pdf",
      ownership_origin_document: "Akt-origjine-pronesie.pdf",
      property_plan: "Plan-rilevimi.pdf",
    };
  }
  return type === "business"
    ? {
        business_nipt_extract: "Ekstrakt-QKB.pdf",
        legal_representative_id: "ID-administrator.pdf",
        ownership_extract: "Ekstrakt-pronesie.pdf",
        expropriation_notice: "Njoftim-shpronesimi.pdf",
        compensation_claim_request: "Kerkese-kompensimi-biznes.pdf",
        bank_account_certificate: "Vertetim-IBAN-biznes.pdf",
      }
    : {
        id_card_copy: "ID-pronari.pdf",
        ownership_extract: "Ekstrakt-pronesie.pdf",
        civil_status_extract: "Ekstrakt-gjendje-civile.pdf",
        expropriation_notice: "Njoftim-shpronesimi.pdf",
        compensation_claim_request: "Kerkese-kompensimi.pdf",
        bank_account_certificate: "Vertetim-IBAN.pdf",
      };
}

function applicationTitle(kind: ApplicationKind) {
  if (kind === "ekb_privatization") return "Privatizim banese EKB";
  if (kind === "property_registration") return "Regjistrim prone biznesi";
  return "Shpronesim / kompensim";
}

function applicationDescription(kind: ApplicationKind, type: ApplicantType) {
  if (kind === "ekb_privatization") {
    return "Qytetari ngarkon dosjen per privatizimin e baneses; operatori verifikon, gjeneron faturen dhe ndjek kontraten.";
  }
  if (kind === "property_registration") {
    return "Biznesi regjistrohet me NIPT, ngarkon dokumentet e prones dhe dosja shqyrtohet nga operatori.";
  }
  return type === "business"
    ? "Biznesi ngarkon dokumentet e prones; operatori ndjek vleresimin dhe pagesen nga Ministria e Ekonomise."
    : "Qytetari ngarkon dokumentet e prones; operatori ndjek vleresimin dhe pagesen nga Ministria e Ekonomise.";
}

function defaultApplicationForRole(role: string): ApplicationKind {
  return role === "business" ? "property_registration" : "ekb_privatization";
}

function applicantTypeForRole(role: string): ApplicantType {
  return role === "business" ? "business" : "citizen";
}

function ApplicationPortal() {
  const { role, profile } = useDemoRole();
  const createGeneric = useServerFn(createDossier);
  const createBusinessProperty = useServerFn(createBusinessPropertyApplication);
  const createExpropriation = useServerFn(createExpropriationCompensationApplication);
  const qc = useQueryClient();
  const [applicationKind, setApplicationKind] = useState<ApplicationKind>(
    defaultApplicationForRole(role),
  );
  const [applicantName, setApplicantName] = useState(
    role === "business" ? "AlbaTech sh.p.k." : "Elira Kola",
  );
  const [nipt, setNipt] = useState("L22334455B");
  const [representativeName, setRepresentativeName] = useState(
    role === "business" ? "Arben Dervishi" : "",
  );
  const [zone, setZone] = useState("Tirane");
  const [propertyDescription, setPropertyDescription] = useState(
    "Apartament banimi objekt privatizimi EKB",
  );
  const [cadastralNo, setCadastralNo] = useState("7/24");
  const [areaSqm, setAreaSqm] = useState("78");
  const [projectName, setProjectName] = useState("Projekt publik - zgjerimi i aksit rrugor");
  const [amountAll, setAmountAll] = useState("12500");
  const [bankAccountLabel, setBankAccountLabel] = useState("AL47212110090000000235698741");
  const [notes, setNotes] = useState(
    "Kerkohet hapja e dosjes dhe shqyrtimi nga operatori perkates.",
  );
  const [documentNames, setDocumentNames] = useState<Record<string, string>>(
    defaultDocs(defaultApplicationForRole(role), applicantTypeForRole(role)),
  );
  const [created, setCreated] = useState<{ id: string; trackingCode: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    chooseApplication(defaultApplicationForRole(role));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const effectiveApplicantType =
    role === "business" || applicationKind === "property_registration" ? "business" : "citizen";
  const docs = DOCS[applicationKind][effectiveApplicantType];
  const createdUrl = created ? absoluteTrackingUrl(created.trackingCode) : "";
  const ApplicantIcon = effectiveApplicantType === "business" ? Building2 : UserRound;
  const isBusinessFlow = effectiveApplicantType === "business";
  const isEkb = applicationKind === "ekb_privatization";
  const isExpropriation = applicationKind === "expropriation";
  const isPropertyRegistration = applicationKind === "property_registration";
  const showCitizenProcesses = role !== "business";
  const showBusinessProcesses = role === "business";

  const selectedDocs = useMemo(
    () =>
      docs.flatMap((doc) => {
        const name = documentNames[doc.type]?.trim();
        return name ? [{ type: doc.type, name }] : [];
      }),
    [docs, documentNames],
  );

  function chooseApplication(kind: ApplicationKind) {
    const nextType: ApplicantType =
      role === "business" || kind === "property_registration" ? "business" : "citizen";
    setApplicationKind(kind);
    setDocumentNames(defaultDocs(kind, nextType));
    setCreated(null);
    setCopied(false);

    if (kind === "ekb_privatization") {
      setApplicantName("Elira Kola");
      setRepresentativeName("");
      setZone("Tirane");
      setPropertyDescription("Apartament banimi objekt privatizimi EKB");
      setCadastralNo("7/24");
      setAreaSqm("78");
      setAmountAll("12500");
      setNotes("Kerkohet privatizimi i baneses EKB dhe gjenerimi i fatures sipas vleresimit.");
    } else if (kind === "property_registration") {
      setApplicantName("AlbaTech sh.p.k.");
      setRepresentativeName("Arben Dervishi");
      setZone("Tirane");
      setPropertyDescription("Njesi sherbimi dhe magazine logjistike");
      setCadastralNo("7/188");
      setAreaSqm("320");
      setNotes("Kerkohet regjistrimi i pasurise ne emer te subjektit sipas dokumentacionit.");
    } else {
      setApplicantName(nextType === "business" ? "AlbaTech sh.p.k." : "Elira Kola");
      setRepresentativeName(nextType === "business" ? "Arben Dervishi" : "");
      setZone("Fier");
      setPropertyDescription("Toke bujqesore e prekur nga zgjerimi i aksit rrugor");
      setCadastralNo("11/24");
      setAreaSqm("1850");
      setAmountAll("6200000");
      setNotes("Kerkohet shqyrtimi i dosjes se kompensimit dhe kalimi i pageses.");
    }
  }

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
      const numericArea = areaSqm ? Number(areaSqm) : undefined;
      const numericAmount = amountAll ? Number(amountAll) : undefined;
      let result: { id: string; trackingCode: string };

      if (applicationKind === "ekb_privatization") {
        result = await createGeneric({
          data: {
            process: "ekb_privatization",
            title: `Privatizim banese EKB - ${applicantName}`,
            applicantName,
            zone,
            propertyDescription,
            areaSqm: numericArea,
            familyIncomeAll: numericAmount,
            notes,
            documents: selectedDocs,
          },
        });
      } else if (applicationKind === "property_registration") {
        result = await createBusinessProperty({
          data: {
            businessName: applicantName,
            nipt,
            representativeName: representativeName || "Administrator",
            zone,
            propertyDescription,
            cadastralNo: cadastralNo || undefined,
            areaSqm: numericArea,
            notes,
            documents: selectedDocs,
          },
        });
      } else {
        result = await createExpropriation({
          data: {
            applicantType: effectiveApplicantType,
            applicantName,
            nipt: effectiveApplicantType === "business" ? nipt : undefined,
            representativeName: representativeName || undefined,
            zone,
            propertyDescription,
            cadastralNo: cadastralNo || undefined,
            areaSqm: numericArea,
            projectName,
            compensationAmountAll: numericAmount,
            bankAccountLabel,
            notes,
            documents: selectedDocs,
          },
        });
      }

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
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <Scale className="size-4" />
                Aplikim i ri
              </div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                {applicationTitle(applicationKind)}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                {applicationDescription(applicationKind, effectiveApplicantType)}
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
                    U gjenerua linku i gjurmimit per aplikuesin. Qytetari ose biznesi mund ta hape
                    nga kjo faqe ose nga opsioni "Gjurmim aplikimi" duke vendosur kodin.
                  </p>
                  <div className="mt-3 grid gap-2 md:grid-cols-[160px_minmax(0,1fr)]">
                    <div className="rounded-md border bg-background px-2 py-1.5 font-mono text-xs">
                      {created.trackingCode}
                    </div>
                    <div className="rounded-md border bg-background px-2 py-1.5 font-mono text-[11px] break-all text-muted-foreground">
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
              <FileUp className="size-4 text-primary" />
              <h2 className="text-sm font-semibold">Zgjidh llojin e aplikimit</h2>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {showCitizenProcesses ? (
                <ProcessButton
                  active={applicationKind === "ekb_privatization"}
                  icon={<Home className="size-4" />}
                  title="Privatizim banese"
                  body="Aplikim EKB, fature dhe kontrate."
                  onClick={() => chooseApplication("ekb_privatization")}
                />
              ) : null}
              <ProcessButton
                active={applicationKind === "expropriation"}
                icon={<Scale className="size-4" />}
                title="Shpronesim"
                body="Kompensim dhe pagesa nga Ministria."
                onClick={() => chooseApplication("expropriation")}
              />
              {showBusinessProcesses ? (
                <ProcessButton
                  active={applicationKind === "property_registration"}
                  icon={<Building2 className="size-4" />}
                  title="Regjistrim prone"
                  body="Aplikim biznesi me NIPT."
                  onClick={() => chooseApplication("property_registration")}
                />
              ) : null}
            </div>
          </Card>

          <Card className="p-4">
            <div className="mb-4 flex items-center gap-2">
              <ApplicantIcon className="size-4 text-primary" />
              <h2 className="text-sm font-semibold">Profili i aplikuesit</h2>
            </div>
            <div className="grid gap-2">
              {role === "business" ? (
                <Button type="button" variant="default" className="justify-start">
                  <Building2 className="mr-1.5 size-4" />
                  Biznes
                </Button>
              ) : (
                <Button type="button" variant="default" className="justify-start">
                  <UserRound className="mr-1.5 size-4" />
                  Qytetar
                </Button>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <div className="mb-4 flex items-center gap-2">
              <Landmark className="size-4 text-primary" />
              <h2 className="text-sm font-semibold">Te dhenat e aplikimit</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field
                label={isBusinessFlow ? "Emri i biznesit" : "Emri i qytetarit"}
                value={applicantName}
                setValue={setApplicantName}
              />
              {isBusinessFlow ? (
                <Field label="NIPT" value={nipt} setValue={setNipt} />
              ) : (
                <Field
                  label="Perfaqesues ligjor (opsional)"
                  value={representativeName}
                  setValue={setRepresentativeName}
                />
              )}
              {isBusinessFlow ? (
                <Field
                  label="Administrator / perfaqesues"
                  value={representativeName}
                  setValue={setRepresentativeName}
                />
              ) : null}
              <Field label="Zona / Bashkia" value={zone} setValue={setZone} />
              <Field label="Nr. kadastral" value={cadastralNo} setValue={setCadastralNo} />
              <Field label="Siperfaqe m2" value={areaSqm} setValue={setAreaSqm} type="number" />
              {!isPropertyRegistration ? (
                <Field
                  label={isEkb ? "Te ardhura familjare mujore ALL" : "Vlera e pritshme ALL"}
                  value={amountAll}
                  setValue={setAmountAll}
                  type="number"
                />
              ) : null}
              {isExpropriation ? (
                <div className="md:col-span-2">
                  <Field label="Projekti publik" value={projectName} setValue={setProjectName} />
                </div>
              ) : null}
              <div className="md:col-span-2">
                <Field
                  label={isEkb ? "Pershkrimi i baneses" : "Pershkrimi i pasurise"}
                  value={propertyDescription}
                  setValue={setPropertyDescription}
                />
              </div>
              {isExpropriation ? (
                <div className="md:col-span-2">
                  <Field
                    label="Llogari bankare / IBAN"
                    value={bankAccountLabel}
                    setValue={setBankAccountLabel}
                  />
                </div>
              ) : null}
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs">Shenime</Label>
                <Textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  className="text-sm"
                />
              </div>
            </div>
          </Card>

          <Card className="border-primary/25 bg-primary/5 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
                  <FileUp className="size-4" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold">Dokumentacioni për operatorin</h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Lista e dokumenteve të kërkuara është zhvendosur në një nënfaqe të veçantë për
                    aplikimin.
                  </p>
                </div>
              </div>
              <Button asChild size="sm" variant="outline" className="shrink-0">
                <Link to="/aplikim/dokumentacion">
                  Hap dokumentacionin
                  <ExternalLink className="size-3.5" />
                </Link>
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap justify-end gap-2 border-t pt-4">
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
              Cfare ndodh pas dergimit
            </div>
            <div className="mt-3 space-y-3 text-sm">
              {isEkb ? (
                <>
                  <Step
                    number="1"
                    title="Aplikimi qytetarit"
                    body="Operatori kontrollon dosjen EKB dhe dokumentet baze."
                  />
                  <Step
                    number="2"
                    title="Verifikim ligjor"
                    body="Kryhen verifikime me EKB, ASHK dhe institucionet perkatese."
                  />
                  <Step
                    number="3"
                    title="Fatura"
                    body="Gjenerohet fatura/mandati dhe ruhet ne dosje."
                  />
                  <Step
                    number="4"
                    title="Kontrata dhe ASHK"
                    body="Pas pageses kalon kontrata dhe certifikata perfundimtare."
                  />
                </>
              ) : isPropertyRegistration ? (
                <>
                  <Step number="1" title="NIPT" body="Subjekti dhe administratori verifikohen." />
                  <Step
                    number="2"
                    title="Dokumente prone"
                    body="Kontrollohen aktet e origjines dhe plani i pasurise."
                  />
                  <Step
                    number="3"
                    title="Kontroll GIS"
                    body="Operatori verifikon kufijte dhe siperfaqen."
                  />
                  <Step
                    number="4"
                    title="Vendim"
                    body="Miratim, plotesim dokumentesh ose refuzim i arsyetuar."
                  />
                </>
              ) : (
                <>
                  <Step
                    number="1"
                    title="Verifikim pronesie"
                    body="Operatori kontrollon pronesine, NIPT/ID dhe dokumentet."
                  />
                  <Step
                    number="2"
                    title="Vleresim kompensimi"
                    body="Vlera lidhet me raportin e vleresimit dhe aktin e shpronesimit."
                  />
                  <Step
                    number="3"
                    title="Afat ankimi"
                    body="Pronari mund te ndjeke afatin dhe te beje ankese nga portali."
                  />
                  <Step
                    number="4"
                    title="Pagesa"
                    body="Ministria e Ekonomise kryen disbursimin; operatori monitoron statusin."
                  />
                </>
              )}
            </div>
          </Card>

          <Card className="border-warning/30 bg-warning/5 p-4">
            <div className="flex items-start gap-2">
              <CreditCard className="mt-0.5 size-4 shrink-0 text-warning-foreground" />
              <div>
                <div className="text-sm font-semibold">Smart Dossier</div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Aplikimi krijohet si dosje, i caktohet operatorit dhe ndiqet me kod gjurmimi
                  publik.
                </p>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}

function ProcessButton({
  active,
  icon,
  title,
  body,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  body: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border p-3 text-left transition-colors",
        active ? "border-primary bg-primary/10 text-foreground" : "bg-background hover:bg-muted/40",
      )}
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className={cn("text-primary", active && "text-primary")}>{icon}</span>
        {title}
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
    </button>
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
