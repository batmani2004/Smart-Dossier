import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  FileCheck2,
  FileUp,
  Landmark,
  Scale,
  UserRound,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDemoRole } from "@/lib/demo-access";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/aplikim/dokumentacion")({
  head: () => ({
    meta: [
      { title: "Dokumentacioni për operatorin - Smart Dossier" },
      {
        name: "description",
        content: "Lista e dokumenteve që i duhen operatorit për shqyrtimin e aplikimit.",
      },
    ],
  }),
  component: OperatorDocumentationPage,
});

type DocGroup = {
  id: string;
  title: string;
  subtitle: string;
  profile: "Qytetar" | "Biznes";
  icon: typeof UserRound;
  docs: { label: string; helper: string; required?: boolean }[];
};

const DOC_GROUPS: DocGroup[] = [
  {
    id: "ekb",
    title: "Privatizim banese EKB",
    subtitle: "Dokumente bazë për verifikimin e përfituesit dhe banesës.",
    profile: "Qytetar",
    icon: UserRound,
    docs: [
      {
        label: "Kopje ID",
        helper: "Dokumenti identifikues i qytetarit përfitues.",
        required: true,
      },
      {
        label: "Certifikatë familjare",
        helper: "Përdoret për përbërjen familjare dhe normat e banimit.",
        required: true,
      },
      {
        label: "Vërtetim të ardhurash",
        helper: "Përdoret për llogaritjen e vlerës sipas fashave të të ardhurave.",
        required: true,
      },
      {
        label: "Historik kontrate / qiraje",
        helper: "Provon lidhjen me banesën objekt privatizimi.",
      },
      {
        label: "Kopje certifikate ASHK",
        helper: "Kopje e certifikatës ose kartelës së pasurisë kur disponohet.",
      },
      {
        label: "Certifikatë martese",
        helper: "Kërkohet kur statusi familjar ndikon në dosje.",
      },
    ],
  },
  {
    id: "shpronesim",
    title: "Shpronësim / kompensim",
    subtitle: "Dokumente pronësie, akti i shpronësimit dhe të dhënat e pagesës.",
    profile: "Qytetar",
    icon: Landmark,
    docs: [
      { label: "Kopje ID", helper: "Dokumenti identifikues i pronarit ose përfaqësuesit." },
      { label: "Ekstrakt pronësie", helper: "Dokument që vërteton lidhjen me pasurinë." },
      {
        label: "Ekstrakt gjendje civile",
        helper: "Për verifikim trashëgimie ose përputhje identiteti.",
      },
      { label: "Njoftim / akt shpronësimi", helper: "Akti që lidhet me projektin publik." },
      { label: "Kërkesë kompensimi", helper: "Kërkesa e nënshkruar për pagesën." },
      {
        label: "Vërtetim bankar / IBAN",
        helper: "Të dhënat ku kryhet disbursimi pas miratimit.",
      },
    ],
  },
  {
    id: "biznes",
    title: "Regjistrim prone biznesi",
    subtitle: "Dokumente për identifikimin e subjektit dhe pasurinë që regjistrohet.",
    profile: "Biznes",
    icon: Building2,
    docs: [
      { label: "Ekstrakt QKB / NIPT", helper: "Identifikon subjektin dhe administratorin." },
      {
        label: "ID e administratorit / përfaqësuesit",
        helper: "Kartë identiteti ose autorizim për përfaqësues ligjor.",
      },
      {
        label: "Kërkesë për regjistrim prone",
        helper: "Formular kërkese me objektin e regjistrimit.",
      },
      {
        label: "Akt origjine pronësie",
        helper: "Kontratë, vendim, akt dhurimi ose dokument tjetër i origjinës.",
      },
      {
        label: "Plan rilevimi / genplan",
        helper: "Plan me kufij, sipërfaqe dhe të dhëna teknike të pasurisë.",
      },
    ],
  },
];

function OperatorDocumentationPage() {
  const { role } = useDemoRole();
  const defaultGroupId = role === "business" ? "biznes" : "ekb";

  return (
    <AppShell>
      <div className="mx-auto max-w-[1180px] space-y-4 px-4 py-5 md:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <FileUp className="size-4" />
              Dokumentacioni për operatorin
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Dokumentet që shoqërojnë aplikimin
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Kjo nënfaqe përmbledh dokumentet që operatori kontrollon pasi aplikimi regjistrohet si
              dosje pune.
            </p>
          </div>
          <Button asChild size="sm" variant="outline" className="shrink-0">
            <Link to="/aplikim">
              <ArrowLeft className="size-3.5" />
              Kthehu te aplikimi
            </Link>
          </Button>
        </div>

        <Card className="border-primary/25 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
              <Scale className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold">Si përdoret kjo listë</div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Dokumentet ruhen me aplikimin, shfaqen në dosje dhe ndihmojnë operatorin të
                verifikojë identitetin, pasurinë dhe hapat ligjorë.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-3">
          {DOC_GROUPS.map((group) => (
            <DocumentationCard key={group.id} group={group} active={group.id === defaultGroupId} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function DocumentationCard({ group, active }: { group: DocGroup; active: boolean }) {
  const Icon = group.icon;

  return (
    <Card className={cn("p-4", active && "border-primary/30 bg-primary/[0.03]")}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground",
              active && "bg-primary text-primary-foreground",
            )}
          >
            <Icon className="size-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold leading-snug">{group.title}</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{group.subtitle}</p>
          </div>
        </div>
        <Badge variant="secondary" className="shrink-0 text-[11px]">
          {group.profile}
        </Badge>
      </div>

      <ul className="space-y-2">
        {group.docs.map((doc) => (
          <li key={doc.label} className="rounded-md border bg-card p-3">
            <div className="flex items-start gap-2">
              <FileCheck2 className="mt-0.5 size-4 shrink-0 text-primary" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-sm font-medium">{doc.label}</div>
                  {doc.required ? (
                    <span className="rounded-md bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
                      i detyrueshëm
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{doc.helper}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center gap-2 border-t pt-3 text-[11px] text-muted-foreground">
        <CheckCircle2 className="size-3.5 text-success" />
        Kontrollohet nga operatori pas regjistrimit të aplikimit.
      </div>
    </Card>
  );
}
