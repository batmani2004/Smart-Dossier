import type { ProcessDefinition, CriticalPoint } from "../types";

const NO_E_ALBANIA: CriticalPoint = {
  id: "no-e-albania",
  label: "Pa e-Albania",
  description: "Procedura nuk është e integruar me e-Albania.",
  severity: "critical",
  tags: ["no-e-albania", "paper-only"],
};

export const ekbPrivatizationProcess: ProcessDefinition = {
  kind: "ekb_privatization",
  code: "EKB",
  title: "Privatizimi i banesave EKB",
  description:
    "Procedura e privatizimit të banesave të Entit Kombëtar të Banesave për qytetarët përfitues.",
  legalBasis: [
    { reference: "VKM 179/2020", title: "Për procedurat e privatizimit të banesave EKB" },
    { reference: "VKM 898/2020", title: "Plotësues mbi vlerësimin e banesave dhe truallit" },
  ],
  phases: [
    {
      id: "ekb-p1",
      order: 1,
      title: "Parakushti — certifikata e pronësisë",
      description:
        "ASHK lëshon certifikatën e pronësisë dhe pasuria regjistrohet në emër të EKB-së.",
      institutions: ["ASHK", "EKB"],
      steps: [
        {
          id: "ekb-s1",
          order: 1,
          title: "Lëshimi i certifikatës ASHK",
          description:
            "ASHK lëshon certifikatën e pronësisë; pasuria figuron e regjistruar nën EKB.",
          institution: "ASHK",
          requiredDocuments: ["ashk_certificate"],
          slaDays: 21,
          manual: true,
        },
      ],
    },
    {
      id: "ekb-p2",
      order: 2,
      title: "Njoftimi publik",
      description: "Afishim fizik në EKB dhe publikim në ekb.gov.al.",
      institutions: ["EKB"],
      steps: [
        {
          id: "ekb-s2",
          order: 1,
          title: "Afishimi fizik dhe online",
          description: "Njoftim fizik në zyrat e EKB-së + publikim në ekb.gov.al. Pa e-Albania.",
          institution: "EKB",
          slaDays: 15,
          manual: true,
          criticalPoints: [
            {
              id: "limited-reach",
              label: "Mbulim i kufizuar",
              description:
                "Njoftimi nuk arrin të gjithë qytetarët e interesuar; pa kanal e-Albania.",
              severity: "warning",
              tags: ["reach", "no-e-albania"],
            },
            NO_E_ALBANIA,
          ],
        },
      ],
    },
    {
      id: "ekb-p3",
      order: 3,
      title: "Aplikimi i qytetarit",
      description:
        "Aplikimi fizik pranë EKB-së me dosje letër (12–18 dokumente, përfshirë certifikatën familjare).",
      institutions: ["EKB", "Bashkia"],
      steps: [
        {
          id: "ekb-s3",
          order: 1,
          title: "Dorëzimi i dosjes fizike",
          description:
            "Qytetari dorëzon dosjen letër me 12–18 dokumente; zero digjital, pa e-Albania.",
          institution: "EKB",
          requiredDocuments: [
            "family_certificate",
            "id_card_copy",
            "income_proof",
            "rent_contract_history",
            "ashk_certificate_copy",
            "marriage_certificate",
          ],
          slaDays: 30,
          manual: true,
          criticalPoints: [
            {
              id: "aplikim-fizik",
              label: "Aplikim fizik",
              description: "Aplikim fizik: 12–18 dokumente letre, rrezik mungesash.",
              severity: "critical",
              tags: ["paper-only", "no-e-albania", "missing-docs"],
            },
            NO_E_ALBANIA,
          ],
        },
      ],
    },
    {
      id: "ekb-p4",
      order: 4,
      title: "Verifikimi ligjor",
      description:
        "Verifikim manual nga EKB; kërkesa drejt ASHK/IPRO me email ose fizikisht. Mund të refuzohet me arsye nga dega.",
      institutions: ["EKB", "ASHK", "IPRO"],
      steps: [
        {
          id: "ekb-s4",
          order: 1,
          title: "Verifikim manual dhe shkëmbim me ASHK/IPRO",
          description:
            "Verifikimi është manual; komunikimi me ASHK/IPRO bëhet me email ose fizikisht. Pa API.",
          institution: "EKB",
          slaDays: 21,
          manual: true,
          criticalPoints: [
            {
              id: "no-api-ashk",
              label: "Pa API me ASHK",
              description: "Pa API me ASHK: verifikimi manual mund të shtojë 2–4 javë.",
              severity: "critical",
              tags: ["no-api", "delay-2-4w"],
              expectedDelayDays: 21,
            },
            {
              id: "branch-refusal",
              label: "Refuzim nga dega",
              description:
                "Dega mund të refuzojë me arsye; qytetari duhet të rifillojë rrugën fizike.",
              severity: "warning",
              tags: ["refusal", "paper-only"],
            },
          ],
        },
      ],
    },
    {
      id: "ekb-p5",
      order: 5,
      title: "Llogaritja e vlerës",
      description:
        "Llogaritja e vlerës sipas normave të banimit + çmimit të truallit. Excel / manual, pa gjurmë audituese.",
      institutions: ["EKB"],
      steps: [
        {
          id: "ekb-s5",
          order: 1,
          title: "Vlerësimi i banesës dhe truallit",
          description:
            "Aplikimi i normave të banimit dhe çmimit të truallit. Rregulli i të ardhurave: >14000 ALL = 100%, 9000–14000 = 50%, <9000 = pa pagesë / 0% trualli.",
          institution: "EKB",
          slaDays: 10,
          manual: true,
          criticalPoints: [
            {
              id: "no-audit-trail",
              label: "Llogaritje Excel/manual",
              description: "Llogaritje Excel/manual: rrezik gabimesh dhe zero audit trail.",
              severity: "critical",
              tags: ["excel", "no-audit"],
            },
          ],
        },
      ],
    },
    {
      id: "ekb-p6",
      order: 6,
      title: "Lidhja e kontratës",
      description:
        "Kontrata EKB–qytetar duhet të lidhet brenda 2 vjetëve nga njoftimi. Word/print, firmosje fizike.",
      institutions: ["EKB"],
      steps: [
        {
          id: "ekb-s6",
          order: 1,
          title: "Hartimi dhe firmosja e kontratës",
          description:
            "Kontrata përgatitet në Word, printohet dhe firmoset fizikisht në praninë e palëve.",
          institution: "EKB",
          slaDays: 730, // 2-year legal window
          manual: true,
          criticalPoints: [
            {
              id: "physical-presence",
              label: "Firmosje fizike e detyrueshme",
              description: "Kërkohet prania fizike e palëve për nënshkrim.",
              severity: "warning",
              tags: ["paper-only", "physical-presence"],
            },
          ],
        },
      ],
    },
    {
      id: "ekb-p7",
      order: 7,
      title: "Dërgimi i dosjes në ASHK",
      description: "Dorëzim fizik i dosjes në ASHK. Rrezik humbjeje, 4–8 javë vonesë.",
      institutions: ["EKB", "ASHK"],
      steps: [
        {
          id: "ekb-s7",
          order: 1,
          title: "Dorëzimi fizik i dosjes",
          description: "Dosja transportohet fizikisht nga EKB në ASHK. Pa API.",
          institution: "EKB",
          slaDays: 14,
          manual: true,
          criticalPoints: [
            {
              id: "loss-risk",
              label: "Dorëzim fizik në ASHK",
              description: "Dorëzim fizik në ASHK: rrezik humbjeje, 4–8 javë vonesë.",
              severity: "critical",
              tags: ["paper-only", "loss-risk", "delay-4-8w"],
              expectedDelayDays: 42,
            },
            {
              id: "no-api-handoff",
              label: "Pa API në dorëzim",
              description: "Pa API në dorëzimin EKB→ASHK; vonesa tipike 4–8 javë.",
              severity: "critical",
              tags: ["no-api", "delay-4-8w"],
              expectedDelayDays: 42,
            },
          ],
        },
      ],
    },
    {
      id: "ekb-p8",
      order: 8,
      title: "Regjistrimi përfundimtar në ASHK",
      description: "ASHK lëshon certifikatën përfundimtare. Radhë institucionale, 4–8 javë.",
      institutions: ["ASHK"],
      steps: [
        {
          id: "ekb-s8",
          order: 1,
          title: "Lëshimi i certifikatës përfundimtare",
          description: "Pas regjistrimit, qytetari merr certifikatën përfundimtare.",
          institution: "ASHK",
          slaDays: 42,
          manual: true,
          criticalPoints: [
            {
              id: "ashk-queue",
              label: "Radhë në ASHK",
              description: "4–8 javë vonesë për shkak të radhës institucionale.",
              severity: "critical",
              tags: ["queue", "delay-4-8w"],
              expectedDelayDays: 42,
            },
          ],
        },
      ],
    },
  ],
};
