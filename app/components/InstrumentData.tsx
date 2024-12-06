"use client";
import React, { useEffect, useState } from "react";
import {
  IfcPVWSMessage,
  IfcPVWSRequest,
  instList,
  PVWSRequestType,
} from "@/app/types";
import { findPVInDashboard, Instrument } from "@/app/components/Instrument";
import useWebSocket from "react-use-websocket";
import { instListPV, instListSubscription, socketURL } from "@/app/commonVars";
import {
  dehex_and_decompress,
  instListFromBytes,
} from "@/app/components/dehex_and_decompress";
import { findPVByAddress } from "@/app/components/PVutils";
import TopBar from "@/app/components/TopBar";
import CheckToggle from "@/app/components/CheckToggle";
import Groups from "@/app/components/Groups";
import {
  CSSB,
  getGroupsWithBlocksFromConfigOutput,
  RC_ENABLE,
  RC_INRANGE,
  SP_RBV,
  toPrecision,
} from "@/app/components/InstrumentPage";

let lastUpdate: string = "";

export function InstrumentData({ instrumentName }: { instrumentName: string }) {
  const [showHiddenBlocks, setShowHiddenBlocks] = useState(false);
  const CONFIG_DETAILS = "CS:BLOCKSERVER:GET_CURR_CONFIG_DETAILS";
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
