"use client";
import { useState } from "react";
import {
  IfcPVWSMessage,
  IfcPVWSRequest,
  instList,
  PVWSRequestType,
} from "@/app/types";
import useWebSocket from "react-use-websocket";
import {
  instListPV,
  instListSubscription,
  socketURL,
  webSocketReconnectAttempts,
  webSocketReconnectInterval,
} from "@/app/commonVars";
import { instListFromBytes } from "@/app/components/dehex_and_decompress";
import TargetStation from "@/app/components/TargetStation";
import ScienceGroup from "@/app/components/ScienceGroup";

// Ignore support machines for the instruments page.
const instrumentsExcludeList = ["SUPPORT"];

export function createInstrumentGroups(
  instruments: instList,
): Map<string, instList> {
  let newInstrumentGroups: Map<string, instList> = new Map();
  instruments.forEach((inst) => {
    inst.groups
      .filter((group) => !instrumentsExcludeList.includes(group))
      .forEach((group) => {
        if (!newInstrumentGroups.has(group)) {
          // This is a new science group so create a new entry
          newInstrumentGroups.set(group, []);
        }
        newInstrumentGroups.get(group)!.push(inst);
      });
  });
  return newInstrumentGroups;
}

/* c8 ignore start */
export default function InstrumentsDisplay({
  sortByGroups = false,
}: {
  sortByGroups?: boolean;
}) {
  const runstatePV = "DAE:RUNSTATE_STR";
  const ts1BeamCurrentPv = "AC:TS1:BEAM:CURR";
  const ts2BeamCurrentPv = "AC:TS2:BEAM:CURR";
  const muonTargetCurrentPv = "AC:MUON:BEAM:CURR";

  const [instList, setInstList] = useState<instList>([]);
  const [ts1Current, setTS1Current] = useState<number>(0.0);
  const [ts2Current, setTS2Current] = useState<number>(0.0);
  const [muonCurrent, setMuonCurrent] = useState<number>(0.0);
  const [webSockErr, setWebSockErr] = useState("");

  const {
    sendJsonMessage,
  }: {
    sendJsonMessage: (a: IfcPVWSRequest) => void;
    lastJsonMessage: IfcPVWSMessage;
  } = useWebSocket(socketURL, {
    shouldReconnect: () => true,
    onError() {
      setWebSockErr(
        "Failed to connect to websocket - please check your network connection and contact Experiment Controls if this persists.",
      );
    },
    onOpen: () => {
      setInstList([]); // if this is called on a reconnect, clear the instlist so we can re-subscribe to it and get its latest value
      setWebSockErr("");
      sendJsonMessage(instListSubscription);
      // Subscribe to beam current PVs
      sendJsonMessage({
        type: PVWSRequestType.subscribe,
        pvs: [ts1BeamCurrentPv, ts2BeamCurrentPv, muonTargetCurrentPv],
      });
    },
    onMessage: (m) => {
      const updatedPV: IfcPVWSMessage = JSON.parse(m.data);
      const updatedPVName: string = updatedPV.pv;
      const updatedPVbytes: string | null | undefined = updatedPV.b64byt;
      const updatedPVvalue: string | null | undefined = updatedPV.text;
      const updatedPVnum: number | null | undefined = updatedPV.value;
      // PVWS seems to give 2 updates for the instlist, so just use the first one to avoid re-subscribing to all the runstate PVs.
      if (
        updatedPVName == instListPV &&
        updatedPVbytes != null &&
        instList.length == 0
      ) {
        const instListDict = instListFromBytes(updatedPVbytes);

        for (const item of instListDict) {
          item.runStatePV = item.pvPrefix + runstatePV;

          sendJsonMessage({
            type: PVWSRequestType.subscribe,
            pvs: [item.runStatePV],
          });
        }
        setInstList(instListDict);
      } else if (updatedPVvalue) {
        const foundInstrument = instList.find(
          (instrument) => instrument.runStatePV === updatedPVName,
        );
        if (foundInstrument) foundInstrument.runStateValue = updatedPVvalue;

        setInstList(instList);
      } else if (updatedPVnum) {
        // beam current update
        if (updatedPVName == ts1BeamCurrentPv) {
          setTS1Current(updatedPVnum);
        } else if (updatedPVName == ts2BeamCurrentPv) {
          setTS2Current(updatedPVnum);
        } else if (updatedPVName == muonTargetCurrentPv) {
          setMuonCurrent(updatedPVnum);
        }
      }
    },
    share: true,
    retryOnError: true,
    reconnectInterval: webSocketReconnectInterval,
    reconnectAttempts: webSocketReconnectAttempts,
  });

  return (
    <div>
      {webSockErr && <h1 className={"text-red-600"}>{webSockErr}</h1>}
      {sortByGroups &&
        Array.from(createInstrumentGroups(instList).entries())
          .sort((a, b) => b[1].length - a[1].length) // Sort to display the biggest group first
          .map(([name, instruments]) => {
            return (
              <ScienceGroup key={name} name={name} instruments={instruments} />
            );
          })}
      {!sortByGroups && (
        <>
          <TargetStation
            name={"TS1"}
            instruments={instList.filter(
              (instrument) => instrument.targetStation == "TS1",
            )}
            beamCurrent={ts1Current}
          />
          <TargetStation
            name={"MUON"}
            instruments={instList.filter(
              (instrument) => instrument.targetStation == "MUON",
            )}
            beamCurrent={muonCurrent}
          />
          <TargetStation
            name={"TS2"}
            instruments={instList.filter(
              (instrument) => instrument.targetStation == "TS2",
            )}
            beamCurrent={ts2Current}
          />
          <TargetStation
            name={"MISC"}
            instruments={instList.filter(
              (instrument) => instrument.targetStation == "MISC",
            )}
            beamCurrent={undefined}
          />
        </>
      )}
    </div>
  );
}
/* c8 ignore end */
