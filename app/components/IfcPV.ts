export interface IfcPV {
  pvaddress: string;
  human_readable_name?: string;
  severity?: string;
  units?: string;
  description?: string;
  precision?: number;
  max?: number;
  min?: number;
  warn_low?: number;
  warn_high?: number;
  alarm_low?: number;
  alarm_high?: number;
  value?: string | number;
}

export function findPVByAddress(
  arr: Array<IfcPV>,
  address: string,
): IfcPV | undefined {
  return arr.find((b: IfcPV) => b.pvaddress == address);
}

export function findPVByHumanReadableName(
  arr: Array<IfcPV>,
  human_readable_name: string,
): IfcPV | undefined {
  return arr.find((b: IfcPV) => b.human_readable_name == human_readable_name);
}
