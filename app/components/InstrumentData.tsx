"use client";
import useWebSocket from "partysocket/use-ws";
import { type RefObject, useEffect, useRef, useState } from "react";
import { instListPV, instListSubscription, socketURL } from "@/app/commonVars";
import CheckToggle from "@/app/components/CheckToggle";
import {
  dehex_and_decompress,
  instListFromBytes,
} from "@/app/components/dehex_and_decompress";
import Groups from "@/app/components/Groups";
import {
  findPVInGroups,
  getExtraPVsForBlock,
  getGroupsWithBlocksFromConfigOutput,
  Instrument,
  RC_ENABLE,
  RC_INRANGE,
  SP_RBV,
  storePrecision,
  toPrecision,
  yesToBoolean,
} from "@/app/components/Instrument";
import { getPrefix, getPvValue } from "@/app/components/PVutils";
import TopBar from "@/app/components/TopBar";
import {
  type IfcBlock,
  type IfcPVWSMessage,
  type IfcPVWSRequest,
  PVWSRequestType,
} from "@/app/types";

/** Shallow copy, so React sees a new object without deep-cloning every PV. */
function copyInstrument(instrument: Instrument): Instrument {
  return Object.assign(
    Object.create(Object.getPrototypeOf(instrument)),
    instrument,
  );
}

/** Apply an update to the named dashboard, run info or block PV, returning a new instrument if it was found. */
function applyUpdate(
  prev: Instrument,
  name: string,
  update: (pv: IfcBlock) => IfcBlock,
): Instrument {
  const next = copyInstrument(prev);
  for (const key of ["dashboard", "runInfoPVs"] as const) {
    const existing = prev[key].get(name);
    if (existing) {
      next[key] = new Map(prev[key]).set(name, update({ ...existing }));
      return next;
    }
  }
  for (const [groupName, blocks] of prev.groups) {
    const existing = blocks.get(name);
    if (existing) {
      next.groups = new Map(prev.groups).set(
        groupName,
        new Map(blocks).set(name, update({ ...existing })),
      );
      return next;
    }
  }
  return prev;
}

export function InstrumentData({ instrumentName }: { instrumentName: string }) {
  const [showHiddenBlocks, setShowHiddenBlocks] = useState(false);
  const CONFIG_DETAILS = "CS:BLOCKSERVER:WD_CONF_DETAILS";
  const [currentInstrument, setCurrentInstrument] = useState<Instrument | null>(
    null,
  );
  // Kept in refs rather than state: under heavy load several messages can be
  // handled before React re-renders, so state read here could be stale.
  const prefixRef = useRef<string | null>(null);
  const lastConfigRef = useRef<string | null>(null);
  const [webSockErr, setWebSockErr] = useState("");

  const instName = instrumentName;

  useEffect(() => {
    if (instName != null) {
      document.title = instName.toUpperCase() + " | IBEX Web Dashboard";
    }
  }, [instName]);

  const messageQueue: RefObject<
    Array<{ name: string; update: (pv: IfcBlock) => IfcBlock }>
  > = useRef([]);

  const sendJsonMessage = (message: IfcPVWSRequest) =>
    socket.send(JSON.stringify(message));

  const socket = useWebSocket(socketURL, undefined, {
    onOpen: () => {
      setWebSockErr("");
      lastConfigRef.current = null; // if this is called on a reconnect, we want to clear the last config so we re-subscribe to all blocks again
      sendJsonMessage(instListSubscription);
    },
    onMessage: (m) => {
      const updatedPV: IfcPVWSMessage = JSON.parse(m.data);
      const updatedPVName: string = updatedPV.pv;
      const updatedPVbytes: string | null | undefined = updatedPV.b64byt;
      if (updatedPVName == instListPV && updatedPVbytes != null) {
        const prefix = getPrefix(instListFromBytes(updatedPVbytes), instName);
        const instrument = new Instrument(prefix);
        // PVWS re-sends array PVs such as the instlist shortly after subscribing.
        // Only reset if the prefix has actually changed, as PVWS won't re-send
        // values for PVs we are already subscribed to.
        if (prefix !== prefixRef.current) {
          prefixRef.current = prefix;
          lastConfigRef.current = null;
          setCurrentInstrument(instrument);
          messageQueue.current = [];
        }

        // subscribe to dashboard and run info PVs
        sendJsonMessage({
          type: PVWSRequestType.subscribe,
          pvs: Array.from(instrument.runInfoPVs.keys())
            .concat(Array.from(instrument.dashboard.keys()))
            .concat([`${prefix}${CONFIG_DETAILS}`]),
        });
      } else if (
        prefixRef.current != null &&
        updatedPVName == `${prefixRef.current}${CONFIG_DETAILS}` &&
        updatedPVbytes != null
      ) {
        // config change, reset instrument groups
        if (updatedPVbytes == lastConfigRef.current) {
          // config hasnt actually changed so do nothing
          return;
        }
        lastConfigRef.current = updatedPVbytes;
        const groups = getGroupsWithBlocksFromConfigOutput(
          prefixRef.current,
          JSON.parse(dehex_and_decompress(atob(updatedPVbytes))),
        );

        sendJsonMessage({
          type: PVWSRequestType.subscribe,
          pvs: Array.from(groups.values()).flatMap((blocks) =>
            Array.from(blocks.keys()).flatMap(getExtraPVsForBlock),
          ),
        });

        setCurrentInstrument((prev) => {
          if (!prev) return prev;
          const next = copyInstrument(prev);
          // Keep live values for blocks that are still in the config, as PVWS
          // won't re-send them for PVs we are already subscribed to.
          next.groups = new Map(
            Array.from(groups, ([groupName, blocks]) => [
              groupName,
              new Map(
                Array.from(blocks, ([address, block]) => [
                  address,
                  { ...findPVInGroups(prev.groups, address), ...block },
                ]),
              ),
            ]),
          );
          return next;
        });
      } else {
        const pvVal = getPvValue(updatedPV);
        if (pvVal == undefined) return;
        let name = updatedPVName;
        let update = (pv: IfcBlock): IfcBlock => {
          storePrecision(updatedPV, pv);
          pv.value = toPrecision(pv, pvVal);
          if (updatedPV.seconds) pv.updateSeconds = updatedPV.seconds;
          if (updatedPV.units) pv.units = updatedPV.units;
          if (updatedPV.severity) pv.severity = updatedPV.severity;
          return pv;
        };
        if (name.endsWith(RC_INRANGE)) {
          name = name.replace(RC_INRANGE, "");
          update = (pv) => ({ ...pv, runcontrol_inrange: yesToBoolean(pvVal) });
        } else if (name.endsWith(RC_ENABLE)) {
          name = name.replace(RC_ENABLE, "");
          update = (pv) => ({ ...pv, runcontrol_enabled: yesToBoolean(pvVal) });
        } else if (name.endsWith(SP_RBV)) {
          name = name.replace(SP_RBV, "");
          update = (pv) => ({ ...pv, sp_value: toPrecision(pv, pvVal) });
        }
        // Push into the queue so the update can be processed later in a batch.
        messageQueue.current.push({ name, update });
      }
    },
    onError: () => {
      setWebSockErr(
        "Failed to connect to websocket - please check your network connection and contact Experiment Controls if this persists.",
      );
    },
  });

  useEffect(() => {
    // Previously we have hit into performance issues when trying to render each time a PV update is published by the websocket.
    // This processes any updates in the queue so we can "batch" updates and just re-render every second (as specified by the interval duration)
    // Obviously this has the trade-off of not being "real-time" but for a web dashboard real-time isn't really required.
    const interval = setInterval(() => {
      if (messageQueue.current.length == 0) {
        return;
      }
      const updates = messageQueue.current;
      messageQueue.current = [];

      // Update the state once for all queued updates.
      setCurrentInstrument(
        (prev) =>
          prev &&
          updates.reduce(
            (instrument, { name, update }) =>
              applyUpdate(instrument, name, update),
            prev,
          ),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!currentInstrument) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="p-2 w-full max-w-[1920px] mx-auto">
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
