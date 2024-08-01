import { IfcGroup } from "./IfcGroup";

const DASHBOARD = "CS:DASHBOARD:TAB:";

export class Instrument {
  prefix: string;
  dashboard_prefix: string;
  columnZeroPVs: Map<string, string>;
  dictLongerInstPVs: Map<string, string>;
  runInfoMap: Map<string, string>;
  topBarPVs: Map<any, any>;
  runInfoPVs: Map<any, any>;
  configname: string;
  groups: Array<IfcGroup>;
  constructor(prefix:string) {
    this.prefix = prefix;
    this.dashboard_prefix = `${this.prefix}${DASHBOARD}`;

    this.columnZeroPVs = new Map(
      Object.entries({
        [`${this.prefix}DAE:TITLE`]: "Title:",
        [`${this.prefix}DAE:_USERNAME`]: "Users:",
      })
    );

    this.dictLongerInstPVs = new Map(
      Object.entries({
        [`${this.dashboard_prefix}1:1:LABEL`]: `${this.dashboard_prefix}1:1:VALUE`,
        [`${this.dashboard_prefix}2:1:LABEL`]: `${this.dashboard_prefix}2:1:VALUE`,
        [`${this.dashboard_prefix}3:1:LABEL`]: `${this.dashboard_prefix}3:1:VALUE`,
        [`${this.dashboard_prefix}1:2:LABEL`]: `${this.dashboard_prefix}1:2:VALUE`,
        [`${this.dashboard_prefix}2:2:LABEL`]: `${this.dashboard_prefix}2:2:VALUE`,
        [`${this.dashboard_prefix}3:2:LABEL`]: `${this.dashboard_prefix}3:2:VALUE`,
      })
    );

    // PV name: [human readable name, column in top bar(null is monitor but don't show)]
    this.runInfoMap = new Map(
      Object.entries({
        [`${this.prefix}CS:BLOCKSERVER:CURR_CONFIG_NAME`]: "Config name",
        [`${this.prefix}DAE:RUNSTATE_STR`]: "Run state",
        [`${this.prefix}DAE:RUNNUMBER`]: "Run number",
        [`${this.prefix}DAE:STARTTIME`]: "Start number",
        [`${this.prefix}DAE:TITLE`]: "Title",
        [`${this.prefix}DAE:_USERNAME`]: "Users",
        [`${this.prefix}DAE:GOODFRAMES`]: "Good frames",
        [`${this.prefix}DAE:RAWFRAMES`]: "Raw frames (Total)",
        [`${this.prefix}DAE:RAWFRAMES_PD`]: "Raw frames (Period)",
        [`${this.prefix}DAE:BEAMCURRENT`]: "Current(uamps)",
        [`${this.prefix}DAE:TOTALUAMPS`]: "Total(uamps)",
        [`${this.prefix}DAE:MONITORCOUNTS`]: "Monitor counts",
        [`${this.prefix}DAE:MONITORSPECTRUM`]: "Monitor Spectrum",
        [`${this.prefix}DAE:MONITORFROM`]: "Monitor From",
        [`${this.prefix}DAE:MONITORTO`]: "Monitor To",
        [`${this.prefix}DAE:SHUTTER`]: "Shutter Status",
        [`${this.prefix}DAE:NUMSPECTRA`]: "Number of Spectra",
        [`${this.prefix}DAE:NUMTIMECHANNELS`]: "Number of Time Channels",
        [`${this.prefix}DAE:SIM_MODE`]: "DAE Simulation Mode",
        [`${this.prefix}DAE:TIME_OF_DAY`]: "Instrument Time",
        [`${this.prefix}DAE:STARTTIME`]: "Start time",
        [`${this.prefix}DAE:RUNDURATION_PD`]: "Run time",
        [`${this.prefix}DAE:PERIOD`]: "Period",
        [`${this.prefix}DAE:NUMPERIODS`]: "Num periods",
        [`${this.prefix}DAE:COUNTRATE`]: "Count Rate",
        [`${this.prefix}DAE:_RBNUMBER`]: "RB Number",
        [`${this.prefix}DAE:RUNDURATION`]: "Total Run Time",
        [`${this.prefix}DAE:RUNDURATION_PD`]: "Period Run Time",
        [`${this.prefix}DAE:PERIODSEQ`]: "Period Sequence",
        [`${this.prefix}DAE:DAEMEMORYUSED`]: "DAE Memory Used",
      })
    );

    // (label) PV address  : [row, col, label, value]
    this.topBarPVs = new Map();

    // Human Readable name : value
    this.runInfoPVs = new Map();

    this.groups = [];
    this.configname = "";
  }
}
