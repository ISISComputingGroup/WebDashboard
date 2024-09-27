"use client";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import InstrumentWallCard from "@/app/wall/InstrumentWallCard";
import { IfcInstrumentStatus } from "./IfcInstrumentStatus";
import Image from "next/image";
import { PVWSMessage } from "../components/IfcPVWSMessage";
import { dehex_and_decompress } from "../components/dehex_and_decompress";
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
  }: { sendJsonMessage: any, lastJsonMessage: PVWSMessage } = useWebSocket(socketURL, {
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    // On page load, subscribe to the instrument list as it's required to get each instrument's PV prefix.
    sendJsonMessage({
      type: "subscribe",
      pvs: [instListPV],
    });
  }, [sendJsonMessage]);

  useEffect(() => {
    // This is a PV update, it could be either the instlist or an instrument's runstate that has changed
    if (!lastJsonMessage) {
      return;
    }

    const updatedPV: PVWSMessage = lastJsonMessage;
    const updatedPVName: string = updatedPV.pv;
    const updatedPVbytes: string | null | undefined = updatedPV.b64byt;
    let updatedPVvalue: string | null | undefined = updatedPV.text;

    if (updatedPVName == instListPV && updatedPVbytes != null) {
      // Act on an instlist change - subscribe to each instrument's runstate PV.
      const dehexedInstList = dehex_and_decompress(atob(updatedPVbytes));
      if (dehexedInstList != null && typeof dehexedInstList == "string") {

        const instListDict = JSON.parse(dehexedInstList);
        for (const item of instListDict) {
          const instName = item["name"];
          const instPrefix = item["pvPrefix"];
          const instrument = [...TS1Data, ...TS2Data, ...miscData].find(
            (instrument) => instrument.name === instName,
          );
          if (instrument != null) {
            instrument.pv = instPrefix + runstatePV;
            sendJsonMessage({ type: "subscribe", pvs: [instrument.pv] });
          }
        }

      }
    } else {
      // An instrument's runstate has changed. Find the instrument and update its status.
      const instrument = [...TS1Data, ...TS2Data, ...miscData].find(
        (instrument) => instrument.pv === updatedPVName,
      );

      if (instrument && updatedPVvalue != null) {
        instrument.status = updatedPVvalue;
      }
    }


  }, [lastJsonMessage, TS1Data, TS2Data, miscData, sendJsonMessage]);

  return (
    <main
      className={`flex min-h-screen bg-white dark:bg-zinc-800 flex-col items-center justify-between ${inter.className}`}
    >
      <section className=" rounded-xl w-full  w-full  md:px-0 md:w-11/12 my-4 ">
        <div className="mx-auto  ">
          <div
            id="beampic"
            className="flex flex-col items-center justify-center"
          >
            <label>
              <input
                className="peer/showLabel absolute scale-0"
                type="checkbox"
              />
              <span className="block max-h-14 overflow-hidden rounded-lg bg-zinc-600 hover:bg-gray-800 px-4 py-0 mb-2  shadow-lg transition-all duration-300 peer-checked/showLabel:max-h-fit cursor-pointer">
                <h3 className="flex h-14 cursor-pointer items-center font-bold justify-center text-white ">
                  Show/hide beam info
                </h3>
                <Image
                  src={`https://www.isis.stfc.ac.uk/Gallery/beam-status/ISIS_Status.jpg?t=${Date.now()}`}
                  alt="beam info"
                  className="w-auto"
                  height={600}
                  width={600}
                />
              </span>
            </label>
          </div>
          <div className="w-full mx-auto text-left flex justify-center items-center p-8 dark:bg-zinc-900 rounded-xl">
            <div
              id="status"
              className="flex flex-col justify-center items-center"
            >
              <h1 className="w-full text-left text-black dark:text-white font-semibold text-2xl   ">
                Instrument Status:
              </h1>{" "}
              <div className="flex flex-col justify-center items-start w-full">
                <h1 className="w-full text-left text-gray-600 dark:text-gray-200 font-semibold text-md mt-2 py-2 ">
                  Target Station 1:
                </h1>{" "}
                <div className="flex flex-wrap gap-1">
                  {TS1Data.map((instrument) => (
                    <InstrumentWallCard
                      key={instrument.name}
                      instrument={instrument}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center items-start w-full">
                <h1 className="w-full text-left text-gray-600 dark:text-gray-200 font-semibold text-md mt-2 py-2 ">
                  Target Station 2:
                </h1>{" "}
                <div className="flex flex-wrap gap-1">
                  {TS2Data.map((instrument) => (
                    <InstrumentWallCard
                      key={instrument.name}
                      instrument={instrument}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center items-start w-full">
                <h1 className="w-full text-left text-gray-600 dark:text-gray-200 font-semibold text-md mt-2 py-2 ">
                  Miscellaneous:
                </h1>{" "}
                <div className="flex flex-wrap gap-1 ">
                  {miscData.map((instrument) => (
                    <InstrumentWallCard
                      key={instrument.name}
                      instrument={instrument}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <hr className="h-[2px] rounded my-4 bg-gray-200 border-0 dark:bg-gray-600" />

          <div className="flex flex-col justify-center items-center">
            <h1 className="w-full text-left text-black dark:text-white font-semibold text-2xl   ">
              Jenkins Jobs:
            </h1>{" "}
            <p className="text-md text-left w-full text-black dark:text-white">
              Tip: Open the jobs into a{" "}
              <span className="font-bold underline">new tab</span> only
            </p>
            <iframe
              className="w-full h-[300px] mt-4 border-2 border-gray-100 dark:border-black rounded-lg shadow-sm hover:shadow-lg hover:border-black dark:hover:border-white transition-all duration-200"
              src="https://epics-jenkins.isis.rl.ac.uk/plugin/jenkinswalldisplay/walldisplay.html?viewName=WallDisplay&amp;jenkinsUrl=https%3A%2F%2Fepics-jenkins.isis.rl.ac.uk%2F"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  );
}
