export interface IfcPV {
  /**
   * An EPICS Process variable.
   */
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

export interface IfcBlock extends IfcPV {
  /**
   * A block with run control and visibility additions to a regular PV.
   */
  runcontrol_enabled?: boolean;
  runcontrol_inrange?: boolean;
  visible?: boolean;
  suspend_on_invalid?: boolean;
  low_rc?: number;
  high_rc?: number;
}

export interface IfcGroup {
  /**
   * A group, contained within a configuration or component, containing blocks.
   */
  name: string;
  blocks: Array<IfcBlock>;
}

export interface IfcPVWSMessage {
  /**
   * A message from PVWS.
   */
  type: string;
  pv: string;
  value?: number | null;
  text?: string | null;
  b64byt?: string | null;
  units?: string | null;
  precision?: number | null;
  labels?: string | null;
  min?: number | null;
  max?: number | null;
  warn_low?: number | null;
  warn_high?: number | null;
  alarm_low?: number | null;
  alarm_high?: number | null;
  severity?: string | null;
  seconds?: number | null;
  readonly?: boolean | null;
  nanos?: number | null;
}

export interface IfcPVWSRequest {
  /**
   * A request to send to PVWS.
   */
  type: string;
  pvs: Array<string>;
}

export interface IfcInstrumentStatus {
  /**
   * Instrument status used for the wall display.
   */
  name: string;
  status?: string;
  pv?: string;
}
