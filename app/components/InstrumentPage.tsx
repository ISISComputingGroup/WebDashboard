"use client";
import React, { useEffect, useState } from "react";
import TopBar from "./TopBar";
import Groups from "./Groups";
import useWebSocket from "react-use-websocket";
import { dehex_and_decompress } from "./dehex_and_decompress";
import { findPVInDashboard, Instrument } from "./Instrument";
import { useSearchParams } from "next/navigation";
import {
  ConfigOutput,
  ConfigOutputBlock,
  IfcBlock,
  IfcGroup,
  IfcPV,
  IfcPVWSMessage,
  IfcPVWSRequest,
} from "@/app/types";
import { findPVByAddress } from "@/app/components/PVutils";
import CheckToggle from "@/app/components/CheckToggle";

let lastUpdate: string = "";

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
    type: "subscribe",
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
  return block.precision && typeof pvVal == "number"
    ? pvVal.toPrecision(block.precision)
    : pvVal;
}

function InstrumentData({ instrumentName }: { instrumentName: string }) {
  const [showHiddenBlocks, setShowHiddenBlocks] = useState(false);
  const [showSetpoints, setShowSetpoints] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(false);
  const CONFIG_DETAILS = "CS:BLOCKSERVER:GET_CURR_CONFIG_DETAILS";
  const [instlist, setInstlist] = useState<Array<any> | null>(null);
  const [currentInstrument, setCurrentInstrument] = useState<Instrument | null>(
    null,
  );
  const socketURL =
    process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/pvws/pv";
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
    sendJsonMessage({
      type: "subscribe",
      pvs: ["CS:INSTLIST"],
    });

    if (instName == "" || instName == null || instlist == null) {
      return;
    }

    let prefix = "";

    for (const item of instlist) {
      if (item["name"] == instName.toUpperCase()) {
        prefix = item["pvPrefix"];
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
        type: "subscribe",
        pvs: [`${prefix}${CONFIG_DETAILS}`],
      });

      // subscribe to dashboard and run info PVs
      for (const pv of instrument.runInfoPVs.concat(
        instrument.dashboard.flat(3),
      )) {
        sendJsonMessage({ type: "subscribe", pvs: [pv.pvaddress] });
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

    if (updatedPVName == "CS:INSTLIST" && updatedPVbytes != null) {
      const dehexedInstList = dehex_and_decompress(atob(updatedPVbytes));
      if (dehexedInstList != null && typeof dehexedInstList == "string") {
        setInstlist(JSON.parse(dehexedInstList));
      }
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
      if (res == null || typeof res != "string") {
        return;
      }
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
        return;
      }

      if (findPVInDashboard(currentInstrument.dashboard, updatedPVName)) {
        // This is a dashboard block update.
        findPVInDashboard(currentInstrument.dashboard, updatedPVName)!.value =
          pvVal;
      } else if (findPVByAddress(currentInstrument.runInfoPVs, updatedPVName)) {
        // This is a run information PV
        findPVByAddress(currentInstrument.runInfoPVs, updatedPVName)!.value =
          pvVal;
      } else {
        // This is a block - check if in groups
        for (const group of currentInstrument.groups) {
          for (const block of group.blocks) {
            let block_full_pv_name =
              currentInstrument.prefix + CSSB + block.human_readable_name;
            if (updatedPVName == block_full_pv_name) {
              let prec = updatedPV.precision;

              if (prec != null && prec > 0 && !block.precision) {
                // this is likely the first update, and contains precision information which is not repeated on a normal value update - store this in the block for later truncation (see below)
                block.precision = prec;
              }
              // if a block has precision truncate it here
              block.value = toPrecision(block, pvVal);
              if (updatedPV.seconds) block.updateSeconds = updatedPV.seconds;

              if (updatedPV.units) block.units = updatedPV.units;
              if (updatedPV.severity) block.severity = updatedPV.severity;
            } else if (updatedPVName == block_full_pv_name + RC_INRANGE) {
              block.runcontrol_inrange = updatedPV.value == 1;
            } else if (updatedPVName == block_full_pv_name + RC_ENABLE) {
              block.runcontrol_enabled = updatedPV.value == 1;
            } else if (updatedPVName == block_full_pv_name + SP_RBV) {
              block.sp_value = toPrecision(block, pvVal);
            }
          }
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
