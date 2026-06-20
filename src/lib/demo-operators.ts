export type DemoOperator = {
  id: string;
  name: string;
  unit: string;
};

export const DEMO_OPERATORS: DemoOperator[] = [
  { id: "op-elira-kola", name: "Elira Kola", unit: "Kadaster · Tiranë" },
  { id: "op-ardit-leka", name: "Ardit Leka", unit: "Kadaster · Durrës" },
  { id: "op-mira-hoxha", name: "Mira Hoxha", unit: "Kadaster · Shkodër" },
];

export function operatorName(id: string | undefined) {
  return DEMO_OPERATORS.find((operator) => operator.id === id)?.name ?? "Operator kadastre";
}
