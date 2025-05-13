"use client";
import { useEffect, useState } from "react";
import { IfcPVWSMessage, IfcPVWSRequest, PVWSRequestType } from "@/app/types";
import {
  findPVInGroups,
  getGroupsWithBlocksFromConfigOutput,
  Instrument,
  RC_ENABLE,
  RC_INRANGE,
  SP_RBV,
  storePrecision,
  toPrecision,
  yesToBoolean,
} from "@/app/components/Instrument";
import useWebSocket from "react-use-websocket";
import {
  instListPV,
  instListSubscription,
  socketURL,
  webSocketReconnectAttempts,
  webSocketReconnectInterval,
} from "@/app/commonVars";
import {
  dehex_and_decompress,
  instListFromBytes,
} from "@/app/components/dehex_and_decompress";
import { getPrefix, getPvValue } from "@/app/components/PVutils";
import TopBar from "@/app/components/TopBar";
import CheckToggle from "@/app/components/CheckToggle";
import Groups from "@/app/components/Groups";

export function InstrumentData({ instrumentName }: { instrumentName: string }) {
  const [showHiddenBlocks, setShowHiddenBlocks] = useState(false);
  const CONFIG_DETAILS = "CS:BLOCKSERVER:WD_CONF_DETAILS";
  const [currentInstrument, setCurrentInstrument] = useState<Instrument | null>(
    null,
  );
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [webSockErr, setWebSockErr] = useState("");

  const instName = instrumentName;

  useEffect(() => {
    if (instName != null) {
      document.title = instName.toUpperCase() + " | IBEX Web Dashboard";
    }
  }, [instName]);

  const {
    sendJsonMessage,
  }: {
    sendJsonMessage: (a: IfcPVWSRequest) => void;
    lastJsonMessage: IfcPVWSMessage;
  } = useWebSocket(socketURL, {
    shouldReconnect: () => true,
    onOpen: () => {
      setWebSockErr("");
      setLastUpdate(""); // if this is called on a reconnect, we want to clear the last update so we can re-subscribe to everything again
      sendJsonMessage(instListSubscription);
    },
    onMessage: (m) => {
      const updatedPV: IfcPVWSMessage = JSON.parse(m.data);
      const updatedPVName: string = updatedPV.pv;
      const updatedPVbytes: string | null | undefined = updatedPV.b64byt;

      if (updatedPVName == instListPV && updatedPVbytes != null) {
        const prefix = getPrefix(instListFromBytes(updatedPVbytes), instName);
        const instrument = new Instrument(prefix);
        setCurrentInstrument(instrument);

        // subscribe to dashboard and run info PVs
        sendJsonMessage({
          type: PVWSRequestType.subscribe,
          pvs: Array.from(instrument.runInfoPVs.keys())
            .concat(Array.from(instrument.dashboard.keys()))
            .concat([`${prefix}${CONFIG_DETAILS}`]),
        });
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
        setLastUpdate(updatedPVbytes);
        currentInstrument.groups = getGroupsWithBlocksFromConfigOutput(
          currentInstrument.prefix,
          JSON.parse(dehex_and_decompress(atob(updatedPVbytes))),
        );

        sendJsonMessage({
          type: PVWSRequestType.subscribe,
          pvs: currentInstrument.getAllBlockPVs(),
        });
      } else {
        const pvVal = getPvValue(updatedPV);

        if (pvVal == undefined) {
          console.debug(`initial/blank message from ${updatedPVName}`);
          return;
        }

        // Check if this is a dashboard, run info, or block PV update.
        const pv =
          currentInstrument.dashboard.get(updatedPVName) ||
          currentInstrument.runInfoPVs.get(updatedPVName) ||
          findPVInGroups(currentInstrument.groups, updatedPVName);
        if (pv) {
          storePrecision(updatedPV, pv);
          pv.value = toPrecision(pv, pvVal);
          if (updatedPV.seconds) pv.updateSeconds = updatedPV.seconds;
          if (updatedPV.units) pv.units = updatedPV.units;
          if (updatedPV.severity) pv.severity = updatedPV.severity;
        } else {
          // OK, we haven't found the block, but we may have an update for
          // its object such as its run control status or SP:RBV
          if (updatedPVName.endsWith(RC_INRANGE)) {
            const underlyingBlock = findPVInGroups(
              currentInstrument.groups,
              updatedPVName.replace(RC_INRANGE, ""),
            );
            if (underlyingBlock)
              underlyingBlock.runcontrol_inrange = yesToBoolean(pvVal);
          } else if (updatedPVName.endsWith(RC_ENABLE)) {
            const underlyingBlock = findPVInGroups(
              currentInstrument.groups,
              updatedPVName.replace(RC_ENABLE, ""),
            );
            if (underlyingBlock)
              underlyingBlock.runcontrol_enabled = yesToBoolean(pvVal);
          } else if (updatedPVName.endsWith(SP_RBV)) {
            const underlyingBlock = findPVInGroups(
              currentInstrument.groups,
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
    },
    onError: () => {
      setWebSockErr(
        "Failed to connect to websocket - please check your network connection and contact Experiment Controls if this persists.",
      );
    },
    share: true,
    retryOnError: true,
    reconnectInterval: webSocketReconnectInterval,
    reconnectAttempts: webSocketReconnectAttempts,
  });

  if (!currentInstrument) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="p-2 w-full mx-auto">
      <TopBar
        dashboard={currentInstrument.dashboard}
        instName={instName}
        runInfoPVs={currentInstrument.runInfoPVs}
        prefix={currentInstrument.prefix}
      />
      {webSockErr && <h1 className={"text-red-600"}>{webSockErr}</h1>}
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
