import {
  ConfigOutput,
  ConfigOutputBlock,
  IfcBlock,
  IfcPV,
  IfcPVWSMessage,
  tBlockMapping,
  tGroups,
} from "@/app/types";
import { ExponentialOnThresholdFormat } from "@/app/components/PVutils";

export const DASHBOARD = "CS:DASHBOARD:TAB:";

export class Instrument {
  prefix: string;
  dashboard_prefix: string;

  groups: tGroups = new Map();
  runInfoPVs: tBlockMapping = new Map();
  dashboard: tBlockMapping = new Map();

  constructor(prefix: string) {
    this.prefix = prefix;
    this.dashboard_prefix = `${this.prefix}${DASHBOARD}`;

    this.dashboard.set(`${this.prefix}DAE:WDTITLE`, {
      pvaddress: `${this.prefix}DAE:WDTITLE`,
    });
    this.dashboard.set(`${this.prefix}DAE:WDUSERS`, {
      pvaddress: `${this.prefix}DAE:WDUSERS`,
    });
    for (const col of [1, 2]) {
      for (const row of [1, 2, 3]) {
        this.dashboard.set(`${this.dashboard_prefix}${row}:${col}:LABEL`, {
          pvaddress: `${this.dashboard_prefix}${row}:${col}:LABEL`,
        });
        this.dashboard.set(`${this.dashboard_prefix}${row}:${col}:VALUE`, {
          pvaddress: `${this.dashboard_prefix}${row}:${col}:VALUE`,
        });
      }
    }
    this.runInfoPVs = new Map(
      [
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
          pvaddress: `${this.prefix}DAE:RUNDURATION_STR`,
          human_readable_name: "Run time",
        },
        {
          pvaddress: `${this.prefix}DAE:PERIOD`,
          human_readable_name: "Period",
        },
        {
          pvaddress: `${this.prefix}DAE:RAWFRAMES_PD`,
          human_readable_name: "Period Raw frames",
        },
        {
          pvaddress: `${this.prefix}DAE:NUMPERIODS`,
          human_readable_name: "Num periods",
        },
        {
          pvaddress: `${this.prefix}DAE:RUNDURATION_PD_STR`,
          human_readable_name: "Period Run Time",
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
      ].map((i: IfcPV) => [i.pvaddress, i]),
    );
  }

  clone(): Instrument {
    let cloned = new Instrument(this.prefix);
    cloned.groups = structuredClone(this.groups);
    cloned.runInfoPVs = structuredClone(this.runInfoPVs);
    cloned.dashboard = structuredClone(this.dashboard);
    return cloned;
  }

  getAllBlockPVs(): Array<string> {
    const blocksPerGroup = Array.from(this.groups.values());
    return Array.from(blocksPerGroup).flatMap((m) =>
      Array.from(m.keys()).flatMap((k) => getExtraPVsForBlock(k)),
    );
  }
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

export function storePrecision(
  updatedPV: IfcPVWSMessage,
  block: IfcBlock,
): void {
  const prec = updatedPV.precision;
  if (prec != null && prec > 0 && !block.precision) {
    // this is likely the first update, and contains precision information which is not repeated on a normal value update - store this in the block for later truncation (see below)
    block.precision = prec;
  }
}

export function yesToBoolean(pvVal: string | number): boolean {
  return pvVal == "YES";
}

export function getExtraPVsForBlock(block_address: string): Array<string> {
  /**
   * Given a block name, give the run control and sp_rbv PVs.
   */
  return [
    block_address,
    block_address + RC_ENABLE,
    block_address + RC_INRANGE,
    block_address + SP_RBV,
  ];
}

/**
 * Parse the blockserver's current configuration output
 * and create an array of groups which contain blocks.
 */
export function getGroupsWithBlocksFromConfigOutput(
  prefix: string,
  configOutput: ConfigOutput,
): tGroups {
  const configOutputGroups = configOutput.groups;
  let newGroups: tGroups = new Map();
  for (const configOutputGroup of configOutputGroups) {
    const groupName = configOutputGroup.name;
    let blocks: tBlockMapping = new Map();
    for (const configOutputBlock of configOutputGroup.blocks) {
      const newBlock = configOutput.blocks.find(
        (b: ConfigOutputBlock) => b.name === configOutputBlock,
      );
      if (newBlock) {
        blocks.set(prefix + CSSB + newBlock.name, {
          pvaddress: newBlock.pv,
          human_readable_name: newBlock.name,
          low_rc: newBlock.lowlimit,
          high_rc: newBlock.highlimit,
          visible: newBlock.visible,
        });
      }
    }
    newGroups.set(groupName, blocks);
  }
  return newGroups;
}

export function findPVInGroups(
  groups: tGroups,
  updatedPVName: string,
): undefined | IfcBlock {
  for (const blocksPerGroup of groups.values()) {
    if (blocksPerGroup.has(updatedPVName)) {
      return blocksPerGroup.get(updatedPVName);
    }
  }
}
