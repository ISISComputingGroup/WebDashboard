"use client";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { instListFromBytes } from "../components/dehex_and_decompress";
import InstrumentGroup from "./components/InstrumentGroup";
import ShowHideBeamInfo from "./components/ShowHideBeamInfo";
import JenkinsJobIframe from "./components/JenkinsJobsIframe";
import {
  IfcPVWSMessage,
  IfcPVWSRequest,
  PVWSRequestType,
  targetStation,
} from "@/app/types";
import { instListPV, instListSubscription, socketURL } from "@/app/commonVars";

export default function WallDisplay() {
  const runstatePV = "DAE:RUNSTATE_STR";

  const [data, setData] = useState<Array<targetStation>>([
    {
      targetStation: "Target Station 1",
      instruments: [
        { name: "ALF" },
        { name: "CRISP" },
        { name: "EMMA-A" },
        { name: "EMU" },
        { name: "ENGINX" },
        { name: "GEM" },
        {
          name: "HIFI-CRYOMAG",
        },
        { name: "HRPD" },
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
        { name: "SCIDEMO" },
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
        { name: "ARGUS" },
        { name: "CHRONUS" },
        {
          name: "CRYOLAB_R80",
        },
        { name: "DCLAB" },
        { name: "DEMO" },
        { name: "DETMON" },
        {
          name: "ENGINX_SETUP",
        },
        { name: "HIFI" },
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
      for (const item of instListDict) {
        // Iterate through instruments in the instlist, get the runstate PV and subscribe
        const instName = item["name"];
        const instPrefix = item["pvPrefix"];
        setData((prev) => {
          const newData: Array<targetStation> = [...prev];
          newData.map((targetStation) => {
            const foundInstrument = targetStation.instruments.find(
              (instrument) => instrument.name === instName,
            );
            if (foundInstrument) {
              foundInstrument.runstatePV = instPrefix + runstatePV;
              // Subscribe to the instrument's runstate PV
              sendJsonMessage({
                type: PVWSRequestType.subscribe,
                pvs: [foundInstrument.runstatePV],
              });
            }
          });
          return newData;
        });
      }
    } else if (updatedPVvalue) {
      setData((prev) => {
        const newData: Array<targetStation> = [...prev];
        newData.map((targetStation) => {
          const foundInstrument = targetStation.instruments.findIndex(
            (instrument) => instrument.runstatePV === updatedPVName,
          );
          if (foundInstrument !== -1)
            targetStation.instruments[foundInstrument].runstate =
              updatedPVvalue;
        });
        return newData;
      });
    }
  }, [lastJsonMessage, sendJsonMessage]);

  return (
    <main
      className={`flex min-h-screen bg-white dark:bg-zinc-800 flex-col items-center justify-between`}
    >
      <section className=" rounded-xl w-full md:px-0 md:w-11/12 my-4 ">
        <div className="mx-auto  ">
          <ShowHideBeamInfo />
          <div className="w-full mx-auto text-left flex justify-center items-center p-8 dark:bg-zinc-900 rounded-xl">
            <div
              id="status"
              className="flex flex-col justify-center items-center"
            >
              <h1 className="w-full text-left text-black dark:text-white font-semibold text-2xl   ">
                Instrument Status:
              </h1>

              {data.map((targetStation) => {
                return (
                  <InstrumentGroup
                    key={targetStation.targetStation}
                    groupName={targetStation.targetStation}
                    data={targetStation.instruments}
                  />
                );
              })}
            </div>
          </div>
          <hr className="h-[2px] rounded my-4 bg-gray-200 border-0 dark:bg-gray-600" />
          <JenkinsJobIframe />
        </div>
      </section>
    </main>
  );
}
