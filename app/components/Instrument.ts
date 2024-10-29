import { IfcGroup, IfcPV } from "@/app/types";

const DASHBOARD = "CS:DASHBOARD:TAB:";

// Column[Row[labelPV, valuePV]]
export type DashboardArr = Array<Array<Array<IfcPV>>>;

export class Instrument {
  prefix: string;
  dashboard_prefix: string;

  groups: Array<IfcGroup> = [];
  runInfoPVs: Array<IfcPV> = [];

  dashboard: DashboardArr = [];

  constructor(prefix: string) {
    this.prefix = prefix;
    this.dashboard_prefix = `${this.prefix}${DASHBOARD}`;

    this.dashboard = [
      //column 0
      [
        [
          { pvaddress: "", value: "Title:" },
          { pvaddress: `${this.prefix}DAE:TITLE` },
        ],
        [
          { pvaddress: "", value: "Users:" },
          { pvaddress: `${this.prefix}DAE:_USERNAME` },
        ],
      ],
      //column 1
      [
        [
          { pvaddress: `${this.dashboard_prefix}1:1:LABEL` },
          { pvaddress: `${this.dashboard_prefix}1:1:VALUE` },
        ],
        [
          { pvaddress: `${this.dashboard_prefix}2:1:LABEL` },
          { pvaddress: `${this.dashboard_prefix}2:1:VALUE` },
        ],
        [
          { pvaddress: `${this.dashboard_prefix}3:1:LABEL` },
          { pvaddress: `${this.dashboard_prefix}3:1:VALUE` },
        ],
      ],
      //column 2
      [
        [
          { pvaddress: `${this.dashboard_prefix}1:2:LABEL` },
          { pvaddress: `${this.dashboard_prefix}1:2:VALUE` },
        ],
        [
          { pvaddress: `${this.dashboard_prefix}2:2:LABEL` },
          { pvaddress: `${this.dashboard_prefix}2:2:VALUE` },
        ],
        [
          { pvaddress: `${this.dashboard_prefix}3:2:LABEL` },
          { pvaddress: `${this.dashboard_prefix}3:2:VALUE` },
        ],
      ],
    ];
    this.runInfoPVs = [
      {
        pvaddress: `${this.prefix}CS:BLOCKSERVER:CURR_CONFIG_NAME`,
        human_readable_name: "Config name",
      },
      {
        pvaddress: `${this.prefix}DAE:RUNSTATE_STR`,
        human_readable_name: "Run state",
      },
      {
        pvaddress: `${this.prefix}DAE:RUNNUMBER`,
        human_readable_name: "Run number",
      },
      {
        pvaddress: `${this.prefix}DAE:STARTTIME`,
        human_readable_name: "Start number",
      },
      { pvaddress: `${this.prefix}DAE:TITLE`, human_readable_name: "Title" },
      {
        pvaddress: `${this.prefix}DAE:_USERNAME`,
        human_readable_name: "Users",
      },
      {
        pvaddress: `${this.prefix}DAE:GOODFRAMES`,
        human_readable_name: "Good frames",
      },
      {
        pvaddress: `${this.prefix}DAE:RAWFRAMES`,
        human_readable_name: "Raw frames (Total)",
      },
      {
        pvaddress: `${this.prefix}DAE:RAWFRAMES_PD`,
        human_readable_name: "Raw frames (Period)",
      },
      {
        pvaddress: `${this.prefix}DAE:BEAMCURRENT`,
        human_readable_name: "Current(uamps)",
      },
      {
        pvaddress: `${this.prefix}DAE:TOTALUAMPS`,
        human_readable_name: "Total(uamps)",
      },
      {
        pvaddress: `${this.prefix}DAE:MONITORCOUNTS`,
        human_readable_name: "Monitor counts",
      },
      {
        pvaddress: `${this.prefix}DAE:MONITORSPECTRUM`,
        human_readable_name: "Monitor Spectrum",
      },
      {
        pvaddress: `${this.prefix}DAE:MONITORFROM`,
        human_readable_name: "Monitor From",
      },
      {
        pvaddress: `${this.prefix}DAE:MONITORTO`,
        human_readable_name: "Monitor To",
      },
      {
        pvaddress: `${this.prefix}DAE:SHUTTER`,
        human_readable_name: "Shutter Status",
      },
      {
        pvaddress: `${this.prefix}DAE:NUMSPECTRA`,
        human_readable_name: "Number of Spectra",
      },
      {
        pvaddress: `${this.prefix}DAE:NUMTIMECHANNELS`,
        human_readable_name: "Number of Time Channels",
      },
      {
        pvaddress: `${this.prefix}DAE:SIM_MODE`,
        human_readable_name: "DAE Simulation Mode",
      },
      {
        pvaddress: `${this.prefix}DAE:TIME_OF_DAY`,
        human_readable_name: "Instrument Time",
      },
      {
        pvaddress: `${this.prefix}DAE:STARTTIME`,
        human_readable_name: "Start time",
      },
      {
        pvaddress: `${this.prefix}DAE:RUNDURATION_PD`,
        human_readable_name: "Run time",
      },
      { pvaddress: `${this.prefix}DAE:PERIOD`, human_readable_name: "Period" },
      {
        pvaddress: `${this.prefix}DAE:NUMPERIODS`,
        human_readable_name: "Num periods",
      },
      {
        pvaddress: `${this.prefix}DAE:COUNTRATE`,
        human_readable_name: "Count Rate",
      },
      {
        pvaddress: `${this.prefix}DAE:_RBNUMBER`,
        human_readable_name: "RB Number",
      },
      {
        pvaddress: `${this.prefix}DAE:RUNDURATION`,
        human_readable_name: "Total Run Time",
      },
      {
        pvaddress: `${this.prefix}DAE:RUNDURATION_PD`,
        human_readable_name: "Period Run Time",
      },
      {
        pvaddress: `${this.prefix}DAE:PERIODSEQ`,
        human_readable_name: "Period Sequence",
      },
      {
        pvaddress: `${this.prefix}DAE:DAEMEMORYUSED`,
        human_readable_name: "DAE Memory Used",
      },
    ];
  }
}

export function findPVInDashboard(
  dashboard: DashboardArr,
  pvAddress: string,
): undefined | IfcPV {
  return dashboard.flat(3).find((pv: IfcPV) => pv.pvaddress == pvAddress);
}
