"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import {
  ConfigOutput,
  ConfigOutputBlock,
  IfcBlock,
  IfcGroup,
  IfcPVWSRequest,
  PVWSRequestType,
} from "@/app/types";
import { ExponentialOnThresholdFormat } from "@/app/components/PVutils";
import { InstrumentData } from "@/app/components/InstrumentData";

export default function InstrumentPage() {
  const searchParams = useSearchParams();
  const instrument = searchParams.get("name")!;

  return <InstrumentData instrumentName={instrument} />;
}

export const RC_ENABLE = ":RC:ENABLE";

export const RC_INRANGE = ":RC:INRANGE";

export const SP_RBV = ":SP:RBV";

export const CSSB = "CS:SB:";

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

export function getGroupsWithBlocksFromConfigOutput(
  ConfigOutput: ConfigOutput,
  sendJsonMessage: (a: IfcPVWSRequest) => void,
  prefix: string,
): Array<IfcGroup> {
  const groups = ConfigOutput.groups;
  let newGroups: Array<IfcGroup> = [];
  for (const group of groups) {
    const groupName = group.name;
    let blocks: Array<IfcBlock> = [];
    for (const block of group.blocks) {
      const newBlock = ConfigOutput.blocks.find(
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

export function toPrecision(
  block: IfcBlock,
  pvVal: number | string,
): string | number {
  return block.precision
    ? ExponentialOnThresholdFormat(pvVal, block.precision)
    : pvVal;
}
