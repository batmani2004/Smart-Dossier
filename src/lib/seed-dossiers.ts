import type { Dossier, Phase, ProcessType } from "./types";
import { SHPRONESIM_FAZAT, EKB_FAZAT } from "./process-knowledge";

function buildPhases(procesi: ProcessType, fazaAktuale: number): Phase[] {
  const burim = procesi === "shpronesim" ? SHPRONESIM_FAZAT : EKB_FAZAT;
  return burim.map((f) => {
    let status: Phase["status"] = "pa_filluar";
    if (f.numri < fazaAktuale) status = "kryer";
    else if (f.numri === fazaAktuale) status = "ne_proces";
    return {
      id: `${procesi}-f${f.numri}`,
      numri: f.numri,
      titulli: f.titulli,
      pershkrim: f.pershkrim,
      institucion: f.institucion,
      manual: f.manual ?? false,
      status,
    };
  });
}

function daysFromNow(d: number) {
  const x = new Date();
  x.setDate(x.getDate() + d);
  return x.toISOString();
}

export const SEED_DOSSIERS: Dossier[] = [
  {
    id: "d-001",
    kodi: "EXP-2026-001",
    titulli: "Expropriation for the Tirana–Elbasan road, sector 7",
    procesi: "shpronesim",
    qytetariEmri: "Arben Hoxha",
    qytetariAtesia: "Bashkim",
    qytetariNID: "I85******G",
    pasuriaPershkrim: "Agricultural land + 1-story building",
    pasuriaZona: "Mullet, Tirana",
    pasuriaSiperfaqe: "1,240 m²",
    pasuriaNrPasurie: "3/124",
    vleraPropozuar: 18_450_000,
    dataKrijimit: daysFromNow(-72),
    afatLigjor: daysFromNow(5),
    fazaAktualeId: "shpronesim-f4",
    fazat: buildPhases("shpronesim", 4).map((p) =>
      p.numri === 4
        ? {
            ...p,
            status: "bllokuar",
            pikaKritike: "Notice sent only by letter — appeal deadline expires in 5 days.",
          }
        : p,
    ),
    dokumentet: [
      {
        id: "doc1",
        emri: "CMD_452_2026.pdf",
        tipi: "Decision",
        dataNgarkimit: daysFromNow(-70),
        ngarkuesi: "M. Kola",
      },
      {
        id: "doc2",
        emri: "Cadastral_Extract_3-124.pdf",
        tipi: "Cadastre",
        dataNgarkimit: daysFromNow(-60),
        ngarkuesi: "SCA",
      },
      {
        id: "doc3",
        emri: "Revaluation_Act.pdf",
        tipi: "Valuation",
        dataNgarkimit: daysFromNow(-15),
        ngarkuesi: "SAE",
      },
    ],
    historiku: [
      { id: "h1", data: daysFromNow(-72), veprimi: "File created", perdoruesi: "M. Kola" },
      {
        id: "h2",
        data: daysFromNow(-60),
        veprimi: "Cadastral extract obtained from SCA",
        perdoruesi: "System",
      },
      {
        id: "h3",
        data: daysFromNow(-15),
        veprimi: "Revaluation act approved — 18,450,000 ALL",
        perdoruesi: "B. Lleshi",
      },
      {
        id: "h4",
        data: daysFromNow(-13),
        veprimi: "Letter notice sent to owner",
        perdoruesi: "System",
      },
    ],
    shenime: "Owner has not confirmed receipt. Rural address — high risk.",
  },
  {
    id: "d-002",
    kodi: "HCA-2026-014",
    titulli: "Dwelling privatization, Myslym Shyri St. 22/4",
    procesi: "privatizim_ekb",
    qytetariEmri: "Marjana Bregu",
    qytetariAtesia: "Pjetër",
    pasuriaPershkrim: "2+1 dwelling, 4th floor",
    pasuriaZona: "Tirana, Unit 5",
    pasuriaSiperfaqe: "68 m²",
    pasuriaNrPasurie: "8/56+10-N4",
    vleraPropozuar: 2_980_000,
    dataKrijimit: daysFromNow(-110),
    afatLigjor: daysFromNow(30),
    fazaAktualeId: "privatizim_ekb-f3",
    fazat: buildPhases("privatizim_ekb", 3).map((p) =>
      p.numri === 3
        ? {
            ...p,
            status: "bllokuar",
            pikaKritike: "Waiting on SCA email reply for zone verification — 18 days pending.",
          }
        : p,
    ),
    dokumentet: [
      {
        id: "doc1",
        emri: "Application_M_Bregu.pdf",
        tipi: "Application",
        dataNgarkimit: daysFromNow(-90),
        ngarkuesi: "HCA desk",
      },
      {
        id: "doc2",
        emri: "Family_Certificate.pdf",
        tipi: "Identity",
        dataNgarkimit: daysFromNow(-90),
        ngarkuesi: "HCA desk",
      },
      {
        id: "doc3",
        emri: "Income_Statement.pdf",
        tipi: "Income",
        dataNgarkimit: daysFromNow(-88),
        ngarkuesi: "HCA desk",
      },
    ],
    historiku: [
      { id: "h1", data: daysFromNow(-110), veprimi: "Public notice posted", perdoruesi: "HCA" },
      {
        id: "h2",
        data: daysFromNow(-90),
        veprimi: "Application accepted at desk",
        perdoruesi: "E. Shehu",
      },
      {
        id: "h3",
        data: daysFromNow(-18),
        veprimi: "Verification email sent to SCA",
        perdoruesi: "E. Shehu",
      },
    ],
    shenime: "Family income 10,200 ALL — 50% of market price scheme.",
  },
  {
    id: "d-003",
    kodi: "EXP-2026-007",
    titulli: "Expropriation for the new bridge over Erzen, Vorë",
    procesi: "shpronesim",
    qytetariEmri: "Petrit Cara",
    pasuriaPershkrim: "Agricultural land",
    pasuriaZona: "Vorë, Marqinet",
    pasuriaSiperfaqe: "3,500 m²",
    vleraPropozuar: 7_200_000,
    vleraFinale: 7_800_000,
    dataKrijimit: daysFromNow(-150),
    fazaAktualeId: "shpronesim-f6",
    fazat: buildPhases("shpronesim", 6),
    dokumentet: [
      {
        id: "doc1",
        emri: "Expropriation_Agreement.pdf",
        tipi: "Agreement",
        dataNgarkimit: daysFromNow(-30),
        ngarkuesi: "SAE",
      },
      {
        id: "doc2",
        emri: "Payment_Confirmation.pdf",
        tipi: "Finance",
        dataNgarkimit: daysFromNow(-10),
        ngarkuesi: "Min. of Economy",
      },
    ],
    historiku: [
      { id: "h1", data: daysFromNow(-150), veprimi: "CMD approved", perdoruesi: "System" },
      { id: "h2", data: daysFromNow(-30), veprimi: "Agreement signed", perdoruesi: "B. Lleshi" },
      {
        id: "h3",
        data: daysFromNow(-10),
        veprimi: "Payment disbursed — 7,800,000 ALL",
        perdoruesi: "Min. of Economy",
      },
    ],
  },
  {
    id: "d-004",
    kodi: "HCA-2026-031",
    titulli: "Dwelling privatization, Kongresi Manastirit St. 14",
    procesi: "privatizim_ekb",
    qytetariEmri: "Skënder Lala",
    pasuriaPershkrim: "1+1 dwelling, 2nd floor",
    pasuriaZona: "Tirana, Unit 11",
    pasuriaSiperfaqe: "52 m²",
    vleraPropozuar: 0,
    dataKrijimit: daysFromNow(-220),
    fazaAktualeId: "privatizim_ekb-f7",
    fazat: buildPhases("privatizim_ekb", 7),
    dokumentet: [
      {
        id: "doc1",
        emri: "Privatization_Contract.pdf",
        tipi: "Contract",
        dataNgarkimit: daysFromNow(-60),
        ngarkuesi: "HCA",
      },
    ],
    historiku: [
      { id: "h1", data: daysFromNow(-220), veprimi: "Application", perdoruesi: "HCA desk" },
      {
        id: "h2",
        data: daysFromNow(-60),
        veprimi: "Contract signed (no payment — income < 9,000)",
        perdoruesi: "HCA",
      },
      { id: "h3", data: daysFromNow(-2), veprimi: "File arrived at SCA", perdoruesi: "SCA" },
    ],
    shenime: "Family receives the dwelling free of charge (income below 9,000 ALL).",
  },
  {
    id: "d-005",
    kodi: "HCA-2026-039",
    titulli: "Dwelling privatization, Bardhok Biba St. 7",
    procesi: "privatizim_ekb",
    qytetariEmri: "Donika Krasniqi",
    pasuriaPershkrim: "3+1 dwelling",
    pasuriaZona: "Tirana, Unit 2",
    pasuriaSiperfaqe: "94 m²",
    dataKrijimit: daysFromNow(-22),
    afatLigjor: daysFromNow(60),
    fazaAktualeId: "privatizim_ekb-f2",
    fazat: buildPhases("privatizim_ekb", 2),
    dokumentet: [
      {
        id: "doc1",
        emri: "Application_D_Krasniqi.pdf",
        tipi: "Application",
        dataNgarkimit: daysFromNow(-20),
        ngarkuesi: "HCA desk",
      },
    ],
    historiku: [
      { id: "h1", data: daysFromNow(-22), veprimi: "Application", perdoruesi: "HCA desk" },
    ],
  },
  {
    id: "d-006",
    kodi: "EXP-2026-012",
    titulli: "Expropriation to expand 'Pjetër Budi' school",
    procesi: "shpronesim",
    qytetariEmri: "Toska family (3 heirs)",
    pasuriaPershkrim: "Land + 2-story building",
    pasuriaZona: "Durrës, Quarter 14",
    pasuriaSiperfaqe: "620 m²",
    vleraPropozuar: 24_000_000,
    dataKrijimit: daysFromNow(-40),
    afatLigjor: daysFromNow(12),
    fazaAktualeId: "shpronesim-f3",
    fazat: buildPhases("shpronesim", 3),
    dokumentet: [
      {
        id: "doc1",
        emri: "CMD_512_2026.pdf",
        tipi: "Decision",
        dataNgarkimit: daysFromNow(-38),
        ngarkuesi: "CoM",
      },
      {
        id: "doc2",
        emri: "Cadastral_Extract.pdf",
        tipi: "Cadastre",
        dataNgarkimit: daysFromNow(-30),
        ngarkuesi: "SCA",
      },
    ],
    historiku: [
      { id: "h1", data: daysFromNow(-40), veprimi: "File created", perdoruesi: "L. Beqiri" },
      {
        id: "h2",
        data: daysFromNow(-25),
        veprimi: "Consultation with NTPA (read-only)",
        perdoruesi: "SAE",
      },
    ],
    shenime: "3 heirs — notarial inheritance certificate required.",
  },
];
