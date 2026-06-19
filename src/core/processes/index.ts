import type { ProcessDefinition, ProcessKind } from "../types";
import { ekbPrivatizationProcess } from "./ekb";
import { expropriationProcess } from "./expropriation";

export { ekbPrivatizationProcess, expropriationProcess };

export const PROCESSES: Record<ProcessKind, ProcessDefinition> = {
  ekb_privatization: ekbPrivatizationProcess,
  expropriation: expropriationProcess,
};

export function getProcess(kind: ProcessKind): ProcessDefinition {
  return PROCESSES[kind];
}
