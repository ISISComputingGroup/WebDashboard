import { IfcPV } from "@/app/types";

/**
 * Given an array of PVs, find a PV based on its human-readable name. If none found, return undefined.
 */
export function findPVByHumanReadableName(
  arr: Array<IfcPV>,
  human_readable_name: string,
): IfcPV | undefined {
  return arr.find((b: IfcPV) => b.human_readable_name == human_readable_name);
}

/**
 * Given an array of PVs, find a PV based on its PV address. If none found, return undefined.
 */
export function findPVByAddress(
  arr: Array<IfcPV>,
  address: string,
): IfcPV | undefined {
  return arr.find((b: IfcPV) => b.pvaddress == address);
}
