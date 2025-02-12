"use client";
import { useEffect, useState } from "react";
import {
  IfcInstrumentStatus,
  IfcPVWSMessage,
  IfcPVWSRequest,
  targetStation,
} from "@/app/types";
import useWebSocket from "react-use-websocket";
import { instListPV, instListSubscription, socketURL } from "@/app/commonVars";
import { instListFromBytes } from "@/app/components/dehex_and_decompress";
import {
  updateInstrumentRunstate,
  updateInstrumentRunstatePV,
} from "@/app/wall/utils";
import TargetStation from "@/app/components/TargetStation";
import ScienceGroup from "@/app/components/ScienceGroup";

// Ignore support machines for the instruments page.
const instrumentsExcludeList = ["SUPPORT"];

export function createInstrumentGroups(
  targetStations: Array<targetStation>,
): Map<string, Array<IfcInstrumentStatus>> {
  let newInstrumentGroups: Map<string, Array<IfcInstrumentStatus>> = new Map();
  for (const targetStation of targetStations) {
    for (const inst of targetStation.instruments) {
      if (inst.scienceGroups) {
        for (const group of inst.scienceGroups) {
          if (!instrumentsExcludeList.includes(group)) {
            if (!newInstrumentGroups.has(group)) {
              // This is a new science group so create a new entry
              newInstrumentGroups.set(group, []);
            }
            newInstrumentGroups.get(group)!.push(inst);
          }
        }
      }
    }
  }
  return newInstrumentGroups;
}

/* c8 ignore start */
export default function InstrumentsDisplay({
  sortByGroups = false,
}: {
  sortByGroups?: boolean;
}) {
  const runstatePV = "DAE:RUNSTATE_STR";

  const [data, setData] = useState<Array<targetStation>>([
    {
      targetStation: "Target Station 1",
      instruments: [
        { name: "ALF" },
        { name: "ARGUS" },
        { name: "CHRONUS" },
        { name: "CRISP" },
        { name: "EMMA-A" },
        { name: "EMU" },
        { name: "ENGINX" },
        { name: "GEM" },
        { name: "HIFI" },
        {
          name: "HIFI-CRYOMAG",
        },
        { name: "INES" },
        { name: "IRIS" },
        { name: "LOQ" },
        { name: "MAPS" },
        { name: "MARI" },
        { name: "MERLIN" },
        { name: "MUONFE" },
        { name: "MUSR" },
        { name: "OSIRIS" },
        { name: "PEARL" },
        { name: "POLARIS" },
        { name: "RIKENFE" },
        { name: "SANDALS" },
        { name: "SURF" },
        { name: "SXD" },
        { name: "TOSCA" },
        { name: "VESUVIO" },
      ],
    },
    {
      targetStation: "Target Station 2",
      instruments: [
        { name: "CHIPIR" },
        { name: "IMAT" },
        { name: "INTER" },
        { name: "LARMOR" },
        { name: "LET" },
        { name: "NIMROD" },
        { name: "OFFSPEC" },
        { name: "POLREF" },
        { name: "SANS2D" },
        { name: "WISH" },
        { name: "ZOOM" },
      ],
    },
    {
      targetStation: "Miscellaneous",
      instruments: [
        {
          name: "CRYOLAB_R80",
        },
        { name: "DCLAB" },
        { name: "DEMO" },
        { name: "DETMON" },
        {
          name: "ENGINX_SETUP",
        },
        { name: "HRPD" },
        {
          name: "HRPD_SETUP",
        },
        {
          name: "IBEXGUITEST",
        },
        {
          name: "IRIS_SETUP",
        },
        { name: "MOTION" },
        {
          name: "PEARL_SETUP",
        },
        { name: "SCIDEMO" },
        { name: "SELAB" },
        { name: "SOFTMAT" },
        {
          name: "WISH_SETUP",
        },
      ],
    },
  ]);

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
    // On page load, subscribe to the instrument list as it's required to get each instrument's PV prefix.
    sendJsonMessage(instListSubscription);
  }, [sendJsonMessage]);

  useEffect(() => {
    // This is a PV update, it could be either the instlist or an instrument's runstate that has changed
    if (!lastJsonMessage) {
      return;
    }

    const updatedPV: IfcPVWSMessage = lastJsonMessage;
    const updatedPVName: string = updatedPV.pv;
    const updatedPVbytes: string | null | undefined = updatedPV.b64byt;
    let updatedPVvalue: string | null | undefined = updatedPV.text;

    if (updatedPVName == instListPV && updatedPVbytes != null) {
      const instListDict = instListFromBytes(updatedPVbytes);
      for (const instrument of instListDict) {
        setData((prev) => {
          return updateInstrumentRunstatePV(
            prev,
            instrument,
            runstatePV,
            sendJsonMessage,
          );
        });
      }
    } else if (updatedPVvalue) {
      setData((prev) => {
        return updateInstrumentRunstate(prev, updatedPVName, updatedPVvalue);
      });
    }
  }, [lastJsonMessage, sendJsonMessage]);

  return (
    <div>
      {sortByGroups &&
        Array.from(createInstrumentGroups(data).entries())
          .sort((a, b) => b[1].length - a[1].length) // Sort to display the biggest group first
          .map(([name, instruments]) => {
            return (
              <ScienceGroup key={name} name={name} instruments={instruments} />
            );
          })}
      {!sortByGroups &&
        data.map((targetStation) => {
          return (
            <TargetStation
              key={targetStation.targetStation}
              name={targetStation.targetStation}
              instruments={targetStation.instruments}
            />
          );
        })}
    </div>
  );
}
/* c8 ignore end */
