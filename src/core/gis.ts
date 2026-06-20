import type { Dossier, ProcessKind } from "./types";

export type ParcelPoint = { lat: number; lon: number };
export type AiGisRiskLevel = "low" | "medium" | "high";

export type AiGisPlace = {
  label: string;
  lat: number;
  lon: number;
  zoom: number;
  parcelPolygon: ParcelPoint[];
  accuracyLabel: string;
};

export type AiGisAssessment = {
  provider: string;
  sourceLabel: string;
  zoning: string;
  landCategory: string;
  aiRiskLevel: AiGisRiskLevel;
  aiSignal: string;
  aiUse: string;
  place: AiGisPlace;
  realMapUrl: string;
  embedUrl: string;
};

const OSM_EMBED_DELTA = 0.004;

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function mapPlaceForZone(zone: string) {
  const q = normalize(zone);
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
  if (q.includes("maliq")) {
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

function propertyParcelPolygon(place: { lat: number; lon: number }, hash: number): ParcelPoint[] {
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

export function parcelPolygonLabel(points: ParcelPoint[]) {
  return points.map((point) => `${point.lat}, ${point.lon}`).join(" | ");
}

function knownParcelForDossier(dossier: Dossier) {
  const zone = normalize(dossier.property.zone);
  const cadastralNo = dossier.property.cadastralNo?.trim();
  if (
    dossier.trackingCode === "EXP-2026-000003" ||
    ((zone.includes("maliq") || zone.includes("maliqi")) && cadastralNo === "6/9")
  ) {
    return {
      label: "Parcela demo 6/9 - Maliq",
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

export function propertyMapLocation(dossier: Dossier): AiGisPlace {
  const base = mapPlaceForZone(dossier.property.zone);
  const knownParcel = knownParcelForDossier(dossier);
  if (knownParcel) {
    return {
      ...base,
      label: `Vendndodhja e parceles - ${base.label}`,
      lat: knownParcel.lat,
      lon: knownParcel.lon,
      zoom: Math.max(base.zoom, knownParcel.zoom),
      parcelPolygon: knownParcel.parcelPolygon,
      accuracyLabel:
        "Poligon demo i korrigjuar ne terren per kete dosje; ne zbatim real merret nga koordinatat/poligoni kadastral ASHK/ASIG.",
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
    label: `Vendndodhja orientuese e prones - ${base.label}`,
    lat,
    lon,
    zoom: Math.max(base.zoom, 17),
    parcelPolygon: propertyParcelPolygon({ lat, lon }, hash),
    accuracyLabel:
      "Poligon demo i parceles; ne zbatim real merret nga koordinatat/poligoni kadastral ASHK/ASIG.",
  };
}

export function osmViewUrl(place: { lat: number; lon: number; zoom: number }) {
  return `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=${place.zoom}/${place.lat}/${place.lon}`;
}

export function osmEmbedUrl(place: { lat: number; lon: number }) {
  const bbox = [
    (place.lon - OSM_EMBED_DELTA).toFixed(5),
    (place.lat - OSM_EMBED_DELTA).toFixed(5),
    (place.lon + OSM_EMBED_DELTA).toFixed(5),
    (place.lat + OSM_EMBED_DELTA).toFixed(5),
  ].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${place.lat},${place.lon}`;
}

function processAiUse(process: ProcessKind) {
  const copy: Record<ProcessKind, string> = {
    ekb_privatization:
      "AI e perdor kontrollin GIS per te krahasuar zonen, pasurine dhe dokumentet qe mungojne para vendimit.",
    expropriation:
      "AI e perdor kontrollin GIS per te sinjalizuar zonimin, kategorine e tokes dhe rrezikun ne vleresim kompensimi.",
    property_registration:
      "AI e perdor kontrollin GIS per te sinjalizuar mbivendosje, verifikim kadastral dhe dokumente qe duhen kontrolluar.",
  };
  return copy[process];
}

export function buildAiGisAssessment(dossier: Dossier): AiGisAssessment {
  const description = normalize(dossier.property.description);
  const zone = normalize(dossier.property.zone);
  const hasCadastralNo = Boolean(dossier.property.cadastralNo?.trim());
  const hasArea = Boolean(dossier.property.areaSqm && dossier.property.areaSqm > 0);
  const isAgricultural =
    description.includes("bujq") ||
    description.includes("agric") ||
    description.includes("toke") ||
    description.includes("tok");
  const isBuilding =
    description.includes("ndertes") ||
    description.includes("objekt") ||
    description.includes("apartament");
  const isPeriurban = zone.includes("tiran") || zone.includes("durres") || zone.includes("durr");

  const zoning = isPeriurban
    ? "Zone periurbane / verifikim me harte"
    : isAgricultural
      ? "Zone rurale"
      : "Zone urbane";
  const landCategory = isAgricultural
    ? "Toke bujqesore"
    : isBuilding
      ? "Truall + ndertese"
      : "Pasuri e paluajtshme";

  let aiRiskLevel: AiGisRiskLevel = "low";
  let aiSignal = "Sinjal normal: zona dhe pasuria mund te verifikohen nga harta orientuese.";
  if (!hasCadastralNo) {
    aiRiskLevel = "high";
    aiSignal = "Rrezik i larte: mungon numri kadastral per lidhjen me poligonin.";
  } else if (dossier.status === "awaiting_external" || isPeriurban) {
    aiRiskLevel = "medium";
    aiSignal = "Rrezik mesatar: kerkohet verifikim i zones dhe koordinatave me ASHK/ASIG.";
  } else if (!hasArea) {
    aiRiskLevel = "medium";
    aiSignal = "Rrezik mesatar: siperfaqja nuk eshte e plotesuar per krahasim me harten.";
  } else if (dossier.process === "expropriation" && isAgricultural) {
    aiRiskLevel = "medium";
    aiSignal = "Rrezik mesatar: toka bujqesore ndikon ne vleresimin e kompensimit.";
  }

  const place = propertyMapLocation(dossier);
  return {
    provider: "OpenStreetMap",
    sourceLabel: "AKPT / e-Harta GIS demo",
    zoning,
    landCategory,
    aiRiskLevel,
    aiSignal,
    aiUse: processAiUse(dossier.process),
    place,
    realMapUrl: osmViewUrl(place),
    embedUrl: osmEmbedUrl(place),
  };
}
