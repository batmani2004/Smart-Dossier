export type ProcessType = "shpronesim" | "privatizim_ekb";

export type PhaseStatus = "kryer" | "ne_proces" | "bllokuar" | "pa_filluar";

export type Phase = {
  id: string;
  numri: number;
  titulli: string;
  pershkrim: string;
  institucion: string;
  status: PhaseStatus;
  dataFillimi?: string;
  dataMbarimi?: string;
  pikaKritike?: string;
  manual?: boolean;
};

export type DocumentItem = {
  id: string;
  emri: string;
  tipi: string;
  dataNgarkimit: string;
  ngarkuesi: string;
  pershmbledhje?: string;
};

export type HistoryEvent = {
  id: string;
  data: string;
  veprimi: string;
  perdoruesi: string;
  faza?: string;
};

export type Dossier = {
  id: string;
  kodi: string;
  titulli: string;
  procesi: ProcessType;
  qytetariEmri: string;
  qytetariAtesia?: string;
  qytetariNID?: string;
  pasuriaPershkrim: string;
  pasuriaZona: string;
  pasuriaSiperfaqe?: string;
  pasuriaNrPasurie?: string;
  vleraPropozuar?: number;
  vleraFinale?: number;
  dataKrijimit: string;
  afatLigjor?: string; // ISO date deadline
  fazaAktualeId: string;
  fazat: Phase[];
  dokumentet: DocumentItem[];
  historiku: HistoryEvent[];
  shenime?: string;
  // populated by AI on-demand and cached locally
  aiSummary?: string;
  aiNextStep?: string;
  aiCriticalAlerts?: string[];
};

export type ChatMsg = { role: "user" | "assistant"; content: string };
