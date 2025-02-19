import {
  ConfigOutput,
  ConfigOutputBlock,
  DashboardArr,
  IfcBlock,
  IfcGroup,
  IfcPV,
  IfcPVWSMessage,
  IfcPVWSRequest,
  PVWSRequestType,
} from "@/app/types";
import {
  ExponentialOnThresholdFormat,
  findPVByAddress,
} from "@/app/components/PVutils";

const DASHBOARD = "CS:DASHBOARD:TAB:";

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
        human_readable_name: "Raw frames",
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
        pvaddress: `${this.prefix}CS:SHUTTER`,
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
        pvaddress: `${this.prefix}TIME_OF_DAY`,
        human_readable_name: "Instrument Time",
      },
      {
        pvaddress: `${this.prefix}DAE:STARTTIME`,
        human_readable_name: "Start time",
      },
      {
        pvaddress: `${this.prefix}DAE:RUNDURATION`,
        human_readable_name: "Run time(s)",
      },
      { pvaddress: `${this.prefix}DAE:PERIOD`, human_readable_name: "Period" },
      {
        pvaddress: `${this.prefix}DAE:RAWFRAMES_PD`,
        human_readable_name: "Period Raw frames",
      },
      {
        pvaddress: `${this.prefix}DAE:NUMPERIODS`,
        human_readable_name: "Num periods",
      },
      {
        pvaddress: `${this.prefix}DAE:RUNDURATION_PD`,
        human_readable_name: "Period Run Time(s)",
      },
      {
        pvaddress: `${this.prefix}DAE:PERIODSEQ`,
        human_readable_name: "Period Sequence",
      },
      {
        pvaddress: `${this.prefix}DAE:GOODFRAMES_PD`,
        human_readable_name: "Period Good Frames",
      },
      {
        pvaddress: `${this.prefix}DAE:DAEMEMORYUSED`,
        human_readable_name: "DAE Memory Used",
      },
      {
        pvaddress: `${this.prefix}DAE:DAETIMINGSOURCE`,
        human_readable_name: "Timing Source",
      },
      {
        pvaddress: `${this.prefix}DAE:EVENTS`,
        human_readable_name: "Total Counts",
      },
    ];
  }
}

export function findPVInDashboard(
  dashboard: DashboardArr,
  pvAddress: string,
): undefined | IfcPV {
  return findPVByAddress(dashboard.flat(3), pvAddress);
}

export const RC_ENABLE = ":RC:ENABLE";
export const RC_INRANGE = ":RC:INRANGE";
export const SP_RBV = ":SP:RBV";
export const CSSB = "CS:SB:";

export function toPrecision(
  block: IfcPV,
  pvVal: number | string,
): string | number {
  return block.precision
    ? ExponentialOnThresholdFormat(pvVal, block.precision)
    : pvVal;
}

export function storePrecision(updatedPV: IfcPVWSMessage, block: IfcBlock) {
  const prec = updatedPV.precision;
  if (prec != null && prec > 0 && !block.precision) {
    // this is likely the first update, and contains precision information which is not repeated on a normal value update - store this in the block for later truncation (see below)
    block.precision = prec;
  }
}

export function yesToBoolean(pvVal: string | number) {
  return pvVal == "YES";
}

export function subscribeToBlockPVs(
  sendJsonMessage: (a: IfcPVWSRequest) => void,
  block_address: string,
) {
  /**
   * Subscribes to a block and its associated run control PVs
   */
  sendJsonMessage({
    type: PVWSRequestType.subscribe,
    pvs: [
      block_address,
      block_address + RC_ENABLE,
      block_address + RC_INRANGE,
      block_address + SP_RBV,
    ],
  });
}

/**
 * Parse the blockserver's current configuration output
 * and create an array of groups which contain blocks.
 */
export function getGroupsWithBlocksFromConfigOutput(
  configOutput: ConfigOutput,
  sendJsonMessage: (a: IfcPVWSRequest) => void,
  prefix: string,
): Array<IfcGroup> {
  const groups = configOutput.groups;
  let newGroups: Array<IfcGroup> = [];
  for (const group of groups) {
    const groupName = group.name;
    let blocks: Array<IfcBlock> = [];
    for (const block of group.blocks) {
      const newBlock = configOutput.blocks.find(
        (b: ConfigOutputBlock) => b.name === block,
      );
      if (newBlock) {
        blocks.push({
          pvaddress: newBlock.pv,
          human_readable_name: newBlock.name,
          low_rc: newBlock.lowlimit,
          high_rc: newBlock.highlimit,
          visible: newBlock.visible,
        });
        const fullyQualifiedBlockPVAddress = prefix + CSSB + newBlock.name;
        subscribeToBlockPVs(sendJsonMessage, fullyQualifiedBlockPVAddress);
      }
    }
    newGroups.push({
      name: groupName,
      blocks: blocks,
    });
  }
  return newGroups;
}

export function findPVInGroups(
  groups: Array<IfcGroup>,
  prefix: string,
  updatedPVName: string,
): undefined | IfcBlock {
  return groups
    .flatMap((group: IfcGroup) => group.blocks)
    .find(
      (block: IfcBlock) =>
        updatedPVName == prefix + CSSB + block.human_readable_name,
    );
}
