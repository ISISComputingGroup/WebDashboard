export interface PV {
  pvaddress: string;
  human_readable_name?: string;
  severity?: string;
  units?: string;
  description?: string;
  precision?: number;
  max?: number;
  min?: number;
  warn_low?: number;
  warn_high?:  number;
  alarm_low?:number;
  alarm_high?:  number ;
  value?: string | number;
  runcontrol_enabled?: boolean ;
  runcontrol_inrange?: boolean ;
  visible?: boolean;
  suspend_on_invalid?: boolean;
  low_rc?: number;
  high_rc?: number;
}

export function findPVByAddress(arr: Array<PV>, address: string): PV | undefined {
  return arr.find((b: PV) => b.pvaddress == address)
}

export function findPVByHumanReadableName(arr: Array<PV>, human_readable_name: string): PV | undefined {
  return arr.find((b: PV) => b.human_readable_name == human_readable_name)
}
