"use client";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import IfcInstrumentStatus from "./IfcInstrumentStatus";
import IfcPVWSMessage from "../components/IfcPVWSMessage";
import { dehex_and_decompress } from "../components/dehex_and_decompress";
import InstrumentGroup from "./components/InstrumentGroup";
import ShowHideBeamInfo from "./components/ShowHideBeamInfo";
import JenkinsJobIframe from "./components/JenkinsJobsIframe";
import IfcPVWSRequest from "@/app/components/IfcPVWSRequest";

const inter = Inter({ subsets: ["latin"] });

export default function WallDisplay() {
  const runstatePV = "DAE:RUNSTATE_STR";
  const instListPV = "CS:INSTLIST";

  const [TS1Data] = useState<Array<IfcInstrumentStatus>>(
    [
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
    ].sort((a, b) => a.name.localeCompare(b.name)),
  );
  const [TS2Data] = useState<Array<IfcInstrumentStatus>>(
    [
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
    ].sort((a, b) => a.name.localeCompare(b.name)),
  );
  const [miscData] = useState<Array<IfcInstrumentStatus>>(
    [
      { name: "ARGUS" },
      { name: "CHIPIR" },
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
    ].sort((a, b) => a.name.localeCompare(b.name)),
  );

  const socketURL = process.env.NEXT_PUBLIC_WS_URL!;

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
    // On page load, subscribe to the instrument list as it's required to get each instrument's IfcPV prefix.
    sendJsonMessage({
      type: "subscribe",
      pvs: [instListPV],
    });
  }, [sendJsonMessage]);

  useEffect(() => {
    // This is a IfcPV update, it could be either the instlist or an instrument's runstate that has changed
    if (!lastJsonMessage) {
      return;
    }

    const updatedPV: IfcPVWSMessage = lastJsonMessage;
    const updatedPVName: string = updatedPV.pv;
    const updatedPVbytes: string | null | undefined = updatedPV.b64byt;
    let updatedPVvalue: string | null | undefined = updatedPV.text;

    if (updatedPVName == instListPV && updatedPVbytes != null) {
      // Act on an instlist change - subscribe to each instrument's runstate IfcPV.
      const dehexedInstList = dehex_and_decompress(atob(updatedPVbytes));
      if (dehexedInstList != null && typeof dehexedInstList == "string") {
        const instListDict = JSON.parse(dehexedInstList);
        for (const item of instListDict) {
          // Iterate through the instlist, find their associated object in the ts1data, ts2data or miscData arrays, runstate IfcPV and subscribe
          const instName = item["name"];
          const instPrefix = item["pvPrefix"];
          const foundInstrument = [...TS1Data, ...TS2Data, ...miscData].find(
            (instrument) => instrument.name === instName,
          );
          if (foundInstrument) {
            // Subscribe to the instrument's runstate IfcPV
            foundInstrument.pv = instPrefix + runstatePV;
            sendJsonMessage({ type: "subscribe", pvs: [foundInstrument.pv] });
          }
        }
      }
    } else {
      // An instrument's runstate has changed. Find the instrument and update its status (if there is one!).
      const foundInstrument = [...TS1Data, ...TS2Data, ...miscData].find(
        (instrument) => instrument.pv === updatedPVName,
      );
      if (updatedPVvalue && foundInstrument) {
        foundInstrument.status = updatedPVvalue;
      }
    }
  }, [lastJsonMessage, TS1Data, TS2Data, miscData, sendJsonMessage]);

  return (
    <main
      className={`flex min-h-screen bg-white dark:bg-zinc-800 flex-col items-center justify-between ${inter.className}`}
    >
      <section className=" rounded-xl w-full  w-full  md:px-0 md:w-11/12 my-4 ">
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
              <InstrumentGroup
                groupName={"Target Station 1"}
                data={TS1Data}
              ></InstrumentGroup>
              <InstrumentGroup
                groupName={"Target Station 2"}
                data={TS2Data}
              ></InstrumentGroup>
              <InstrumentGroup
                groupName={"Miscellaneous"}
                data={miscData}
              ></InstrumentGroup>
            </div>
          </div>
          <hr className="h-[2px] rounded my-4 bg-gray-200 border-0 dark:bg-gray-600" />
          <JenkinsJobIframe />
        </div>
      </section>
    </main>
  );
}
