"use client";
import React, { useEffect, useState } from "react";
import {
  ConfigOutput,
  ConfigOutputBlock,
  IfcBlock,
  IfcGroup,
  IfcPV,
  IfcPVWSMessage,
  IfcPVWSRequest,
  instList,
  PVWSRequestType,
} from "@/app/types";
import {
  findPVInDashboard,
  findPVInGroups,
  Instrument,
} from "@/app/components/Instrument";
import useWebSocket from "react-use-websocket";
import { instListPV, instListSubscription, socketURL } from "@/app/commonVars";
import {
  dehex_and_decompress,
  instListFromBytes,
} from "@/app/components/dehex_and_decompress";
import {
  ExponentialOnThresholdFormat,
  findPVByAddress,
} from "@/app/components/PVutils";
import TopBar from "@/app/components/TopBar";
import CheckToggle from "@/app/components/CheckToggle";
import Groups from "@/app/components/Groups";

let lastUpdate: string = "";
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

function storePrecision(updatedPV: IfcPVWSMessage, block: IfcBlock) {
  const prec = updatedPV.precision;
  if (prec != null && prec > 0 && !block.precision) {
    // this is likely the first update, and contains precision information which is not repeated on a normal value update - store this in the block for later truncation (see below)
    block.precision = prec;
  }
}
function yesToBoolean(pvVal: string | number) {
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

export function InstrumentData({ instrumentName }: { instrumentName: string }) {
  const [showHiddenBlocks, setShowHiddenBlocks] = useState(false);
  const CONFIG_DETAILS = "CS:BLOCKSERVER:WD_CONF_DETAILS";
  const [instlist, setInstlist] = useState<instList | null>(null);
  const [currentInstrument, setCurrentInstrument] = useState<Instrument | null>(
    null,
  );

  const instName = instrumentName;

  useEffect(() => {
    if (instName != null) {
      document.title = instName.toUpperCase() + " | IBEX Web Dashboard";
    }
  }, [instName]);

  const {
    sendJsonMessage,
    lastJsonMessage,
  }: {
    sendJsonMessage: (a: IfcPVWSRequest) => void;
    lastJsonMessage: IfcPVWSMessage;
  } = useWebSocket(socketURL, {
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    // This is an initial useEffect to subscribe to lots of PVs including the instlist.
    sendJsonMessage(instListSubscription);

    if (instName == "" || instName == null || instlist == null) {
      return;
    }

    let prefix = "";

    for (const item of instlist) {
      if (item.name == instName.toUpperCase()) {
        prefix = item.pvPrefix;
      }
    }
    if (!prefix) {
      // not on the instlist, or the instlist is not available. Try to guess it's a developer machine
      prefix = "TE:" + instName.toUpperCase() + ":";
    }

    if (!currentInstrument) {
      let instrument = new Instrument(prefix);
      setCurrentInstrument(instrument);

      sendJsonMessage({
        type: PVWSRequestType.subscribe,
        pvs: [`${prefix}${CONFIG_DETAILS}`],
      });

      // subscribe to dashboard and run info PVs
      for (const pv of instrument.runInfoPVs.concat(
        instrument.dashboard.flat(3),
      )) {
        sendJsonMessage({
          type: PVWSRequestType.subscribe,
          pvs: [pv.pvaddress],
        });
      }
    }
  }, [instlist, instName, sendJsonMessage, currentInstrument]);

  useEffect(() => {
    // This gets run whenever there is a PV update ie. when lastJsonMessage changes.
    if (!lastJsonMessage) {
      return;
    }
    const updatedPV: IfcPVWSMessage = lastJsonMessage;
    const updatedPVName: string = updatedPV.pv;
    const updatedPVbytes: string | null | undefined = updatedPV.b64byt;

    if (updatedPVName == instListPV && updatedPVbytes != null) {
      setInstlist(instListFromBytes(updatedPVbytes));
      return;
    }

    if (!currentInstrument) {
      return;
    }

    if (
      updatedPVName == `${currentInstrument.prefix}${CONFIG_DETAILS}` &&
      updatedPVbytes != null
    ) {
      // config change, reset instrument groups
      if (updatedPVbytes == lastUpdate) {
        // config hasnt actually changed so do nothing
        return;
      }
      lastUpdate = updatedPVbytes;
      const res = dehex_and_decompress(atob(updatedPVbytes));
      currentInstrument.groups = getGroupsWithBlocksFromConfigOutput(
        JSON.parse(res),
        sendJsonMessage,
        currentInstrument.prefix,
      );
    } else {
      let pvVal;
      if (updatedPV.text != null) {
        // PV has string value
        pvVal = updatedPV.text;
      } else if (updatedPVbytes != null) {
        // PV value is base64 encoded
        pvVal = atob(updatedPVbytes);
      } else if (updatedPV.value != null) {
        // PV value is a number
        pvVal = updatedPV.value;
      } else {
        console.debug(`initial/blank message from ${updatedPVName}`);
        return;
      }

      // Check if this is a dashboard, run info, or block PV update.
      const pv =
        findPVInDashboard(currentInstrument.dashboard, updatedPVName) ||
        findPVByAddress(currentInstrument.runInfoPVs, updatedPVName) ||
        findPVInGroups(
          currentInstrument.groups,
          currentInstrument.prefix,
          updatedPVName,
        );
      if (pv) {
        storePrecision(updatedPV, pv);
        pv.value = toPrecision(pv, pvVal);
        if (updatedPV.seconds) pv.updateSeconds = updatedPV.seconds;
        if (updatedPV.units) pv.units = updatedPV.units;
        if (updatedPV.severity) pv.severity = updatedPV.severity;
      } else {
        // OK, we haven't found the block, but we may have an update for its object such as its run control status
        if (updatedPVName.endsWith(RC_INRANGE)) {
          const underlyingBlock = findPVInGroups(
            currentInstrument.groups,
            currentInstrument.prefix,
            updatedPVName.replace(RC_INRANGE, ""),
          );
          if (underlyingBlock)
            underlyingBlock.runcontrol_inrange = yesToBoolean(pvVal);
        } else if (updatedPVName.endsWith(RC_ENABLE)) {
          const underlyingBlock = findPVInGroups(
            currentInstrument.groups,
            currentInstrument.prefix,
            updatedPVName.replace(RC_ENABLE, ""),
          );
          if (underlyingBlock)
            underlyingBlock.runcontrol_enabled = yesToBoolean(pvVal);
        } else if (updatedPVName.endsWith(SP_RBV)) {
          const underlyingBlock = findPVInGroups(
            currentInstrument.groups,
            currentInstrument.prefix,
            updatedPVName.replace(SP_RBV, ""),
          );
          if (underlyingBlock)
            underlyingBlock.sp_value = toPrecision(underlyingBlock, pvVal);
        } else {
          console.warn(
            `update from unknown PV: ${updatedPVName} with value ${pvVal}`,
          );
        }
      }
    }
  }, [lastJsonMessage, currentInstrument, sendJsonMessage]);

  if (!instName || !currentInstrument) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="p-2 w-full mx-auto">
      <TopBar
        dashboard={currentInstrument.dashboard}
        instName={instName}
        runInfoPVs={currentInstrument.runInfoPVs}
      />
      <div className="flex gap-2 ml-2 md:flex-row flex-col">
        <CheckToggle
          checked={showHiddenBlocks}
          setChecked={setShowHiddenBlocks}
          text={"Show hidden blocks"}
        />
      </div>
      <Groups
        groupsMap={currentInstrument.groups}
        instName={instName}
        showHiddenBlocks={showHiddenBlocks}
      />
    </div>
  );
}
