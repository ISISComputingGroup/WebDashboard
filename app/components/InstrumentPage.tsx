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

let lastUpdate: string = "";

export default function InstrumentPage() {
  const searchParams = useSearchParams();
  const instrument = searchParams.get("name")!;

  return <InstrumentData instrumentName={instrument} />;
}

export const RC_ENABLE = ":RC:ENABLE";

export const RC_INRANGE = ":RC:INRANGE";

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
    pvs: [block_address, block_address + RC_ENABLE, block_address + RC_INRANGE],
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

function InstrumentData({ instrumentName }: { instrumentName: string }) {
  // set up the different states for the instrument data

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

  const CONFIG_DETAILS = "CS:BLOCKSERVER:GET_CURR_CONFIG_DETAILS";
  const [instlist, setInstlist] = useState<Array<any> | null>(null);
  const [currentInstrument, setCurrentInstrument] = useState<Instrument | null>(
    null,
  );

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
        const pv: IfcPV = findPVInDashboard(
          currentInstrument.dashboard,
          updatedPVName,
        )!;
        if (updatedPVName.endsWith("TITLE") && pvVal && pvVal != "\x00") {
          // This is the title block which is base64 encoded, so decode here
          pv.value = pvVal;
        } else if (pvVal) {
          // This is any other dashboard block
          pv.value = pvVal;
        }
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
              if (block.precision && typeof pvVal == "number") {
                // if a block has precision truncate it here
                block.value = pvVal.toPrecision(block.precision);
              } else {
                block.value = pvVal;
              }
              if (updatedPV.units) block.units = updatedPV.units;
              if (updatedPV.severity) block.severity = updatedPV.severity;

              // Let the user know a change has occurred by lighting up the green dot next to the value
              const pvChangedIndicator = document.getElementById(
                block.human_readable_name + "_CIRCLE",
              );
              if (!pvChangedIndicator) return;
              if (pvChangedIndicator.classList.contains("text-green-500"))
                return;
              pvChangedIndicator.classList.remove("text-transparent");
              pvChangedIndicator.classList.add("text-green-500");
              setTimeout(() => {
                pvChangedIndicator.classList.remove("text-green-500");
                pvChangedIndicator.classList.add("text-transparent");
              }, 2000);
            } else if (updatedPVName == block_full_pv_name + RC_INRANGE) {
              block.runcontrol_inrange = updatedPV.value == 1;
              return;
            } else if (updatedPVName == block_full_pv_name + RC_ENABLE) {
              block.runcontrol_enabled = updatedPV.value == 1;
              return;
            }
          }
        }
      }
    }
  }, [lastJsonMessage, currentInstrument, sendJsonMessage]);

  const [showHiddenBlocks, setShowHiddenBlocks] = useState(false);
  const onShowHiddenBlocksCheckboxChange = () => {
    setShowHiddenBlocks(!showHiddenBlocks);
  };

  if (!instName || !currentInstrument) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="p-8 w-full mx-auto max-w-7xl">
      <TopBar
        dashboard={currentInstrument.dashboard}
        instName={instName}
        runInfoPVs={currentInstrument.runInfoPVs}
      />
      <Groups
        groupsMap={currentInstrument.groups}
        instName={instName}
        showHiddenBlocks={showHiddenBlocks}
      />
      <div className="pt-4">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showHiddenBlocks}
            onChange={onShowHiddenBlocksCheckboxChange}
            className="sr-only peer"
          />
          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-900">
            Show hidden blocks?
          </span>
        </label>
      </div>
    </div>
  );
}
