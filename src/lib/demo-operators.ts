export type DemoOperator = {
  id: string;
  name: string;
  unit: string;
};

const DEFAULT_DEMO_OPERATORS: DemoOperator[] = [
  { id: "op-elira-kola", name: "Elira Kola", unit: "Kadaster - Tirane" },
  { id: "op-ardit-leka", name: "Ardit Leka", unit: "Kadaster - Durres" },
  { id: "op-mira-hoxha", name: "Mira Hoxha", unit: "Kadaster - Shkoder" },
];

export const DEMO_OPERATORS: DemoOperator[] = DEFAULT_DEMO_OPERATORS;

const g = globalThis as unknown as { __smartDossierOperators?: DemoOperator[] };

function cloneDefaults() {
  return DEFAULT_DEMO_OPERATORS.map((operator) => ({ ...operator }));
}

export function listDemoOperators() {
  if (!g.__smartDossierOperators) g.__smartDossierOperators = cloneDefaults();
  return g.__smartDossierOperators;
}

export function resetDemoOperators() {
  g.__smartDossierOperators = cloneDefaults();
  return g.__smartDossierOperators;
}

function slugifyOperatorId(name: string) {
  const slug =
    name
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "operator";
  const existing = new Set(listDemoOperators().map((operator) => operator.id));
  let id = `op-${slug}`;
  let counter = 2;
  while (existing.has(id)) {
    id = `op-${slug}-${counter}`;
    counter += 1;
  }
  return id;
}

export function addDemoOperator(data: { name: string; unit: string }) {
  const operator: DemoOperator = {
    id: slugifyOperatorId(data.name),
    name: data.name.trim(),
    unit: data.unit.trim(),
  };
  listDemoOperators().push(operator);
  return operator;
}

export function removeDemoOperator(id: string) {
  const operators = listDemoOperators();
  const index = operators.findIndex((operator) => operator.id === id);
  if (index === -1) return null;
  const [removed] = operators.splice(index, 1);
  return removed;
}

export function operatorName(id: string | undefined) {
  return listDemoOperators().find((operator) => operator.id === id)?.name ?? "Operator kadastre";
}
