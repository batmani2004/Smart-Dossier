import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  FileCheck2,
  FileUp,
  Landmark,
  Scale,
  Trash2,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDemoRole } from "@/lib/demo-access";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/aplikim/dokumentacion")({
  head: () => ({
    meta: [
      { title: "Dokumentet e aplikimit - Smart Dossier" },
      {
        name: "description",
        content: "Ngarkoni dokumentet e aplikimit në një pamje të qartë për qytetarin.",
      },
    ],
  }),
  component: OperatorDocumentationPage,
});

type ApplicantType = "citizen" | "business";
type ApplicationKind = "ekb_privatization" | "expropriation" | "property_registration";

type DocItem = {
  type: string;
  label: string;
  helper: string;
  required?: boolean;
};

type DocGroup = {
  id: string;
  kind: ApplicationKind;
  applicantType: ApplicantType;
  title: string;
  subtitle: string;
  profile: "Qytetar" | "Biznes";
  icon: typeof UserRound;
  docs: DocItem[];
};

const DOC_GROUPS: DocGroup[] = [
  {
    id: "ekb",
    kind: "ekb_privatization",
    applicantType: "citizen",
    title: "Privatizim banese EKB",
    subtitle: "Dokumente bazë për verifikimin e përfituesit dhe banesës.",
    profile: "Qytetar",
    icon: UserRound,
    docs: [
      {
        type: "id_card_copy",
        label: "Kopje ID",
        helper: "Dokumenti identifikues i qytetarit përfitues.",
        required: true,
      },
      {
        type: "family_certificate",
        label: "Certifikatë familjare",
        helper: "Përdoret për përbërjen familjare dhe normat e banimit.",
        required: true,
      },
      {
        type: "income_proof",
        label: "Vërtetim të ardhurash",
        helper: "Përdoret për llogaritjen e vlerës sipas fashave të të ardhurave.",
        required: true,
      },
      {
        type: "rent_contract_history",
        label: "Historik kontrate / qiraje",
        helper: "Provon lidhjen me banesën objekt privatizimi.",
      },
      {
        type: "ashk_certificate_copy",
        label: "Kopje certifikate ASHK",
        helper: "Kopje e certifikatës ose kartelës së pasurisë kur disponohet.",
      },
      {
        type: "marriage_certificate",
        label: "Certifikatë martese",
        helper: "Kërkohet kur statusi familjar ndikon në dosje.",
      },
    ],
  },
  {
    id: "shpronesim",
    kind: "expropriation",
    applicantType: "citizen",
    title: "Shpronësim / kompensim",
    subtitle: "Dokumente pronësie, akti i shpronësimit dhe të dhënat e pagesës.",
    profile: "Qytetar",
    icon: Landmark,
    docs: [
      {
        type: "id_card_copy",
        label: "Kopje ID",
        helper: "Dokumenti identifikues i pronarit ose përfaqësuesit.",
        required: true,
      },
      {
        type: "ownership_extract",
        label: "Ekstrakt pronësie",
        helper: "Dokument që vërteton lidhjen me pasurinë.",
        required: true,
      },
      {
        type: "civil_status_extract",
        label: "Ekstrakt gjendje civile",
        helper: "Për verifikim trashëgimie ose përputhje identiteti.",
      },
      {
        type: "expropriation_notice",
        label: "Njoftim / akt shpronësimi",
        helper: "Akti që lidhet me projektin publik.",
      },
      {
        type: "compensation_claim_request",
        label: "Kërkesë kompensimi",
        helper: "Kërkesa e nënshkruar për pagesën.",
      },
      {
        type: "bank_account_certificate",
        label: "Vërtetim bankar / IBAN",
        helper: "Të dhënat ku kryhet disbursimi pas miratimit.",
      },
    ],
  },
  {
    id: "biznes",
    kind: "property_registration",
    applicantType: "business",
    title: "Regjistrim prone biznesi",
    subtitle: "Dokumente për identifikimin e subjektit dhe pasurinë që regjistrohet.",
    profile: "Biznes",
    icon: Building2,
    docs: [
      {
        type: "business_nipt_extract",
        label: "Ekstrakt QKB / NIPT",
        helper: "Identifikon subjektin dhe administratorin.",
        required: true,
      },
      {
        type: "legal_representative_id",
        label: "ID e administratorit / përfaqësuesit",
        helper: "Kartë identiteti ose autorizim për përfaqësues ligjor.",
        required: true,
      },
      {
        type: "property_registration_request",
        label: "Kërkesë për regjistrim prone",
        helper: "Formular kërkese me objektin e regjistrimit.",
      },
      {
        type: "ownership_origin_document",
        label: "Akt origjine pronësie",
        helper: "Kontratë, vendim, akt dhurimi ose dokument tjetër i origjinës.",
      },
      {
        type: "property_plan",
        label: "Plan rilevimi / genplan",
        helper: "Plan me kufij, sipërfaqe dhe të dhëna teknike të pasurisë.",
      },
    ],
  },
  {
    id: "shpronesim-biznes",
    kind: "expropriation",
    applicantType: "business",
    title: "Shpronësim / kompensim biznesi",
    subtitle: "Dokumente të subjektit, pronësisë, aktit të shpronësimit dhe llogarisë bankare.",
    profile: "Biznes",
    icon: Landmark,
    docs: [
      {
        type: "business_nipt_extract",
        label: "Ekstrakt QKB / NIPT",
        helper: "Identifikon subjektin dhe administratorin.",
        required: true,
      },
      {
        type: "legal_representative_id",
        label: "ID administrator / përfaqësues",
        helper: "ID ose autorizim i personit që aplikon në emër të subjektit.",
        required: true,
      },
      {
        type: "ownership_extract",
        label: "Ekstrakt pronësie",
        helper: "Dokument që lidh biznesin me pasurinë.",
        required: true,
      },
      {
        type: "expropriation_notice",
        label: "Njoftim / akt shpronësimi",
        helper: "Akti i shpronësimit ose njoftimi për projektin publik.",
      },
      {
        type: "compensation_claim_request",
        label: "Kërkesë kompensimi",
        helper: "Kërkesë e subjektit për disbursimin e kompensimit.",
      },
      {
        type: "bank_account_certificate",
        label: "Vërtetim bankar / IBAN",
        helper: "Llogaria e subjektit për pagesën nga Ministria e Ekonomisë.",
      },
    ],
  },
];

const APPLICATION_DOCS_STORAGE_PREFIX = "smart-dossier-application-docs";

function applicationDocsStorageKey(kind: ApplicationKind, type: ApplicantType) {
  return `${APPLICATION_DOCS_STORAGE_PREFIX}:${kind}:${type}`;
}

function defaultDocs(kind: ApplicationKind, type: ApplicantType): Record<string, string> {
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

function readSavedDocumentNames(
  kind: ApplicationKind,
  type: ApplicantType,
): Record<string, string> {
  const defaults = defaultDocs(kind, type);
  if (typeof window === "undefined") return defaults;
  try {
    const raw = window.localStorage.getItem(applicationDocsStorageKey(kind, type));
    if (!raw) return defaults;
    return { ...defaults, ...(JSON.parse(raw) as Record<string, string>) };
  } catch {
    return defaults;
  }
}

function saveDocumentNames(
  kind: ApplicationKind,
  type: ApplicantType,
  documentNames: Record<string, string>,
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(applicationDocsStorageKey(kind, type), JSON.stringify(documentNames));
}

function OperatorDocumentationPage() {
  const { role } = useDemoRole();
  const defaultGroupId = role === "business" ? "biznes" : "ekb";
  const visibleGroups = useMemo(
    () =>
      DOC_GROUPS.filter((group) =>
        role === "business"
          ? group.applicantType === "business"
          : group.applicantType === "citizen",
      ),
    [role],
  );
  const roleLabel = role === "business" ? "Biznes" : "Qytetar";
  const [documentNamesByGroup, setDocumentNamesByGroup] = useState(() =>
    Object.fromEntries(
      DOC_GROUPS.map((group) => [
        group.id,
        readSavedDocumentNames(group.kind, group.applicantType),
      ]),
    ),
  );

  const selectedTotal = useMemo(
    () =>
      visibleGroups.reduce(
        (total, group) =>
          total +
          group.docs.filter((doc) => documentNamesByGroup[group.id]?.[doc.type]?.trim()).length,
        0,
      ),
    [documentNamesByGroup, visibleGroups],
  );

  function updateDocumentName(group: DocGroup, docType: string, fileName: string) {
    setDocumentNamesByGroup((current) => {
      const nextForGroup = { ...(current[group.id] ?? {}), [docType]: fileName };
      saveDocumentNames(group.kind, group.applicantType, nextForGroup);
      return { ...current, [group.id]: nextForGroup };
    });
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1120px] space-y-4 px-4 py-4 md:px-6">
        <div className="rounded-lg border border-primary/15 bg-white p-4 shadow-soft">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <FileUp className="size-3.5" />
                Dokumentet e aplikimit
              </div>
              <h1 className="mt-1 text-xl font-semibold tracking-tight">
                Ngarkoni dokumentet për dosjen tuaj
              </h1>
              <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Shfaqen vetëm dokumentet që duhen për profilin aktiv {roleLabel.toLowerCase()}.
                Zgjidhni PDF ose imazhe, kontrolloni statusin dhe kthehuni te aplikimi për ta
                dërguar dosjen.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Badge variant="secondary" className="h-9 rounded-md px-3 text-xs">
                {roleLabel} · {selectedTotal} dokumente
              </Badge>
              <Button asChild size="sm" variant="outline" className="h-9">
                <Link to="/aplikim">
                  <ArrowLeft className="size-3.5" />
                  Kthehu te aplikimi
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-4 grid gap-2 md:grid-cols-3">
            <GuidanceStep
              number="1"
              title="Zgjidh procesin"
              body="Privatizim, shpronësim ose regjistrim prone sipas profilit."
            />
            <GuidanceStep
              number="2"
              title="Ngarko dokumentet"
              body="Çdo dokument ka shpjegim të shkurtër dhe status të dukshëm."
            />
            <GuidanceStep
              number="3"
              title="Dërgo aplikimin"
              body="Dokumentet ruhen dhe bashkëngjiten automatikisht në dosje."
            />
          </div>
        </div>

        <div className="rounded-lg border border-sky-200 bg-sky-50/80 px-3 py-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div className="grid size-7 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
                <Scale className="size-3" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold leading-tight">Ruajtje automatike</div>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Emrat e dokumenteve ruhen menjëherë. Kur klikoni `Dërgo aplikimin`, dokumentet e
                  zgjedhura kalojnë bashkë me dosjen.
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="shrink-0">
              {selectedTotal} të zgjedhura
            </Badge>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {visibleGroups.map((group) => (
            <DocumentationCard
              key={group.id}
              group={group}
              active={group.id === defaultGroupId}
              documentNames={documentNamesByGroup[group.id] ?? {}}
              onDocumentNameChange={(docType, fileName) =>
                updateDocumentName(group, docType, fileName)
              }
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function GuidanceStep({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div className="flex gap-2.5 rounded-lg border bg-muted/20 p-2.5">
      <div className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
        {number}
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold">{title}</div>
        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}

function DocumentationCard({
  group,
  active,
  documentNames,
  onDocumentNameChange,
}: {
  group: DocGroup;
  active: boolean;
  documentNames: Record<string, string>;
  onDocumentNameChange: (docType: string, fileName: string) => void;
}) {
  const Icon = group.icon;
  const selectedCount = group.docs.filter((doc) => documentNames[doc.type]?.trim()).length;
  const progress = Math.round((selectedCount / group.docs.length) * 100);

  return (
    <Card
      className={cn(
        "overflow-hidden border-slate-200 bg-white p-0 shadow-sm",
        active && "border-primary/35",
      )}
    >
      <div
        className={cn(
          "border-b bg-slate-50/75 p-3",
          active && "border-primary/15 bg-primary/[0.04]",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground",
                active && "bg-primary text-primary-foreground",
              )}
            >
              <Icon className="size-3.5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold leading-snug">{group.title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{group.subtitle}</p>
            </div>
          </div>
          <Badge variant="secondary" className="shrink-0 text-[11px]">
            {selectedCount}/{group.docs.length}
          </Badge>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <ul className="divide-y divide-slate-100">
        {group.docs.map((doc) => {
          const selectedName = documentNames[doc.type]?.trim();
          const inputId = `${group.id}-${doc.type}`;
          return (
            <li
              key={doc.type}
              className={cn(
                "bg-card px-3 py-2 transition-colors",
                selectedName ? "bg-success/[0.035]" : "hover:bg-muted/25",
              )}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-2">
                  <div
                    className={cn(
                      "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                      selectedName
                        ? "bg-success/15 text-success"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {selectedName ? (
                      <CheckCircle2 className="size-3" />
                    ) : (
                      <FileCheck2 className="size-3" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <div className="text-[13px] font-semibold leading-tight">{doc.label}</div>
                      {selectedName ? (
                        <span className="rounded-md bg-success/10 px-1.5 py-0.5 text-[9px] font-semibold text-success">
                          Gati
                        </span>
                      ) : null}
                      {doc.required ? (
                        <span className="rounded-md bg-destructive/10 px-1.5 py-0.5 text-[9px] font-semibold text-destructive">
                          i detyrueshëm
                        </span>
                      ) : (
                        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground">
                          opsional
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                      {doc.helper}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:max-w-[240px]">
                  {selectedName ? (
                    <div className="flex min-w-0 flex-1 items-center gap-1 rounded-md bg-muted/60 px-2 py-1">
                      <span className="truncate font-mono text-[11px] text-foreground">
                        {selectedName}
                      </span>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="size-5 shrink-0"
                        onClick={() => onDocumentNameChange(doc.type, "")}
                        aria-label="Hiq dokumentin"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  ) : null}
                  <label
                    htmlFor={inputId}
                    className="flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-primary/25 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/10"
                  >
                    <FileUp className="size-3" />
                    {selectedName ? "Ndrysho" : "Ngarko"}
                  </label>
                  <input
                    id={inputId}
                    type="file"
                    accept="application/pdf,image/*"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      onDocumentNameChange(doc.type, file.name);
                    }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center gap-2 border-t bg-slate-50/70 px-3 py-2 text-[11px] text-muted-foreground">
        <CheckCircle2 className="size-3.5 text-success" />
        Do të ruhet me aplikimin për këtë proces.
      </div>
    </Card>
  );
}
