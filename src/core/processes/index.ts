import type { ProcessDefinition, ProcessKind } from "../types";
import { ekbPrivatizationProcess } from "./ekb";
import { expropriationProcess } from "./expropriation";
import { propertyRegistrationProcess } from "./property-registration";

export { ekbPrivatizationProcess, expropriationProcess, propertyRegistrationProcess };

export const PROCESSES: Record<ProcessKind, ProcessDefinition> = {
  ekb_privatization: ekbPrivatizationProcess,
  expropriation: expropriationProcess,
  property_registration: propertyRegistrationProcess,
};

export function getProcess(kind: ProcessKind): ProcessDefinition {
  return PROCESSES[kind];
}
