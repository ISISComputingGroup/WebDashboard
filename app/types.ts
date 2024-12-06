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
  updateSeconds?: number; // Seconds from epoch
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
  sp_value?: number | string;
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

export enum PVWSRequestType {
  subscribe = "subscribe",
  clear = "clear",
}
export interface IfcPVWSRequest {
  /**
   * A request to send to PVWS.
   */
  type: PVWSRequestType;
  pvs: Array<string>;
}

export interface IfcInstrumentStatus {
  /**
   * Instrument status used for the wall display. Contains runstate PV and current runstate.
   */
  name: string; // Name of the instrument
  runstate?: string; // Runstate
  runstatePV?: string; // Runstate PV address
  scienceGroups?: Array<string>;
}

// Column[Row[labelPV, valuePV]]
export type DashboardArr = Array<Array<Array<IfcPV>>>;

export interface ConfigOutput {
  blocks: Array<ConfigOutputBlock>;
  component_iocs: Array<ConfigOutputIOCs>;
  components: Array<ConfigOutputComponent>;
  configuresBlockGWAndArchiver: boolean;
  description: string;
  groups: Array<ConfigOutputGroup>;
  history: Array<string>;
  iocs: Array<ConfigOutputIOCs>;
  isDynamic: boolean;
  isProtected: boolean;
  name: string;
  synoptic: string;
}

export interface ConfigOutputBlock {
  component?: string;
  highlimit: number;
  local: boolean;
  log_deadband: number;
  log_periodic: boolean;
  log_rate: number;
  lowlimit: number;
  name: string;
  pv: string;
  runcontrol: boolean;
  set_block: boolean;
  set_block_val?: number | string;
  suspend_on_invalid: boolean;
  visible: boolean;
}

export interface ConfigOutputComponent {
  name: string;
}

export interface ConfigOutputGroup {
  blocks: Array<string>;
  name: string;
  component?: string;
}

export interface ConfigOutputIOCs {
  autostart: boolean;
  component: string;
  macros: Array<ConfigOutputIocMacro>;
  name: string;
  pvs: Array<string>;
  pvsets: Array<string>;
  remotePvPrefix: string;
  restart: boolean;
  simlevel: string;
}

export interface ConfigOutputIocMacro {
  name: string;
  value: string;
}

export interface targetStation {
  targetStation: string;
  instruments: Array<IfcInstrumentStatus>;
}

export interface instListEntry {
  name: string;
  hostName: string;
  isScheduled: boolean;
  pvPrefix: string;
  seci: boolean;
  groups: Array<string>;
}

export type instList = Array<instListEntry>;
