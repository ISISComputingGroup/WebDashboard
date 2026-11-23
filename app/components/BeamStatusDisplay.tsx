"use client";
import useWebSocket from "partysocket/use-ws";
import { type RefObject, useRef, useState } from "react";
import { instListPV, instListSubscription, socketURL } from "@/app/commonVars";
import {
  BEAM_STATUS_SECTIONS,
  getBeamStatusPVs,
  getShutterInstruments,
  getShutterPVs,
  SHUTTER_TARGET_STATIONS,
} from "@/app/components/BeamStatusPVs";
import BeamStatusSection from "@/app/components/BeamStatusSection";
import { instListFromBytes } from "@/app/components/dehex_and_decompress";
import { storePrecision, toPrecision } from "@/app/components/Instrument";
import { getPvValue } from "@/app/components/PVutils";
import ShutterStatus from "@/app/components/ShutterStatus";
import {
  type IfcPV,
  type IfcPVWSMessage,
  type IfcPVWSRequest,
  type instListEntry,
  PVWSRequestType,
} from "@/app/types";

/* c8 ignore start */
export default function BeamStatusDisplay() {
  const [pvs, setPvs] = useState<Map<string, IfcPV>>(new Map());
  const [instList, setInstList] = useState<Array<instListEntry>>([]);
  const [webSockErr, setWebSockErr] = useState("");

  // Raw value of the last instlist we subscribed to shutter PVs for,
  // so that we only re-subscribe if the instlist actually changes.
  const lastInstList: RefObject<string | null> = useRef(null);

  const sendJsonMessage = (message: IfcPVWSRequest) =>
    socket.send(JSON.stringify(message));

  const socket = useWebSocket(socketURL, undefined, {
    onOpen: () => {
      // if this is called on a reconnect, clear any old values and re-subscribe to everything
      setWebSockErr("");
      lastInstList.current = null;
      setPvs(new Map());
      setInstList([]);
      sendJsonMessage(instListSubscription);
      sendJsonMessage({
        type: PVWSRequestType.subscribe,
        pvs: getBeamStatusPVs(),
      });
    },
    onMessage: (m) => {
      const updatedPV: IfcPVWSMessage = JSON.parse(m.data);
      if (updatedPV.pv == instListPV) {
        const updatedPVbytes = updatedPV.b64byt;
        // PVWS can give duplicate updates for the instlist, so only act if it has changed.
        if (updatedPVbytes != null && updatedPVbytes != lastInstList.current) {
          lastInstList.current = updatedPVbytes;
          const newInstList = instListFromBytes(updatedPVbytes);
          sendJsonMessage({
            type: PVWSRequestType.subscribe,
            pvs: getShutterPVs(newInstList),
          });
          setInstList(newInstList);
        }
        return;
      }
      setPvs((oldPvs) => {
        const pvName = updatedPV.pv;
        const pv: IfcPV = {
          ...(oldPvs.get(pvName) ?? { pvaddress: pvName }),
        };

        storePrecision(updatedPV, pv);
        // Things like units and severity aren't guaranteed on every PV update so cache them if they are available.
        if (updatedPV.units) pv.units = updatedPV.units;
        if (updatedPV.severity) pv.severity = updatedPV.severity;
        if (updatedPV.seconds) pv.updateSeconds = updatedPV.seconds;

        const pvVal = getPvValue(updatedPV);
        if (pvVal != undefined) {
          pv.value = toPrecision(pv, pvVal);
        }
        return new Map(oldPvs).set(pvName, pv);
      });
    },
    onError: () => {
      setWebSockErr(
        "Failed to connect to websocket - please check your network connection and contact Experiment Controls if this persists.",
      );
    },
  });

  return (
    <div className="w-full flex flex-col gap-4">
      {webSockErr && <h1 className={"text-red-600"}>{webSockErr}</h1>}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {BEAM_STATUS_SECTIONS.map((section) => (
          <BeamStatusSection
            key={section.title}
            title={section.title}
            rows={section.rows}
            pvs={pvs}
          />
        ))}
      </div>
      {SHUTTER_TARGET_STATIONS.map(
        ({ targetStation, title, showVatAndMode }) => (
          <ShutterStatus
            key={targetStation}
            name={title}
            instruments={getShutterInstruments(instList, targetStation)}
            pvs={pvs}
            showVatAndMode={showVatAndMode}
          />
        ),
      )}
    </div>
  );
}
/* c8 ignore end */
