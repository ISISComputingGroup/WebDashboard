"use client";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import InstrumentWallCard from "@/app/components/InstrumentWallCard";
import { IfcInstrumentStatus } from "./IfcInstrumentStatus";
import Image from "next/image";
const inter = Inter({ subsets: ["latin"] });

export default function WallDisplay() {
  const runstatePV = "DAE:RUNSTATE_STR";

  const [TS1Data] = useState<Array<IfcInstrumentStatus>>(
    [
      { name: "ALF", status: "", pv: "IN:ALF:" + runstatePV },
      { name: "CRISP", status: "", pv: "IN:CRISP:" + runstatePV },
      { name: "EMMA-A", status: "", pv: "IN:EMMA-A:" + runstatePV },
      { name: "EMU", status: "", pv: "IN:EMU:" + runstatePV },
      { name: "ENGINX", status: "", pv: "IN:ENGINX:" + runstatePV },
      { name: "GEM", status: "", pv: "IN:GEM:" + runstatePV },
      {
        name: "HIFI-CRYOMAG",
        status: "",
        pv: "IN:HIFI-C11:" + runstatePV,
      },
      { name: "HRPD", status: "", pv: "IN:HRPD:" + runstatePV },
      { name: "INES", status: "", pv: "IN:INES:" + runstatePV },
      { name: "IRIS", status: "", pv: "IN:IRIS:" + runstatePV },
      { name: "LOQ", status: "", pv: "IN:LOQ:" + runstatePV },
      { name: "MAPS", status: "", pv: "IN:MAPS:" + runstatePV },
      { name: "MARI", status: "", pv: "IN:MARI:" + runstatePV },
      { name: "MERLIN", status: "", pv: "IN:MERLIN:" + runstatePV },
      { name: "MUONFE", status: "", pv: "IN:MUONFE:" + runstatePV },
      { name: "MUSR", status: "", pv: "IN:MUSR:" + runstatePV },
      { name: "OSIRIS", status: "", pv: "IN:OSIRIS:" + runstatePV },
      { name: "PEARL", status: "", pv: "IN:PEARL:" + runstatePV },
      { name: "POLARIS", status: "", pv: "IN:POLARIS:" + runstatePV },
      { name: "RIKENFE", status: "", pv: "IN:RIKENFE:" + runstatePV },
      { name: "SANDALS", status: "", pv: "IN:SANDALS:" + runstatePV },
      { name: "SCIDEMO", status: "", pv: "IN:SCIDEMO:" + runstatePV },
      { name: "SURF", status: "", pv: "IN:SURF:" + runstatePV },
      { name: "SXD", status: "", pv: "IN:SXD:" + runstatePV },
      { name: "TOSCA", status: "", pv: "IN:TOSCA:" + runstatePV },
      { name: "VESUVIO", status: "", pv: "IN:VESUVIO:" + runstatePV },
    ].sort((a, b) => a.name.localeCompare(b.name)),
  );
  const [TS2Data] = useState<Array<IfcInstrumentStatus>>(
    [
      { name: "IMAT", status: "", pv: "IN:IMAT:" + runstatePV },
      { name: "INTER", status: "", pv: "IN:INTER:" + runstatePV },
      { name: "LARMOR", status: "", pv: "IN:LARMOR:" + runstatePV },
      { name: "LET", status: "", pv: "IN:LET:" + runstatePV },
      { name: "NIMROD", status: "", pv: "IN:NIMROD:" + runstatePV },
      { name: "OFFSPEC", status: "", pv: "IN:OFFSPEC:" + runstatePV },
      { name: "POLREF", status: "", pv: "IN:POLREF:" + runstatePV },
      { name: "SANS2D", status: "", pv: "IN:SANS2D:" + runstatePV },
      { name: "WISH", status: "", pv: "IN:WISH:" + runstatePV },
      { name: "ZOOM", status: "", pv: "IN:ZOOM:" + runstatePV },
    ].sort((a, b) => a.name.localeCompare(b.name)),
  );
  const [miscData] = useState<Array<IfcInstrumentStatus>>(
    [
      { name: "ARGUS", status: "", pv: "IN:ARGUS:" + runstatePV },
      { name: "CHIPIR", status: "", pv: "IN:CHIPIR:" + runstatePV },
      { name: "CHRONUS", status: "", pv: "IN:CHRONUS:" + runstatePV },
      {
        name: "CRYOLAB_R80",
        status: "",
        pv: "IN:CRYOLAB_R80:" + runstatePV,
      },
      { name: "DCLAB", status: "", pv: "IN:DCLAB:" + runstatePV },
      { name: "DEMO", status: "", pv: "IN:DEMO:" + runstatePV },
      { name: "DETMON", status: "", pv: "IN:DETMON:" + runstatePV },
      {
        name: "ENGINX_SETUP",
        status: "",
        pv: "IN:ENGINX_SETUP:" + runstatePV,
      },
      { name: "HIFI", status: "", pv: "IN:HIFI:" + runstatePV },
      {
        name: "HRPD_SETUP",
        status: "",
        pv: "IN:HRPD_SETUP:" + runstatePV,
      },
      {
        name: "IBEXGUITEST",
        status: "",
        pv: "IN:IBEXGUITEST:" + runstatePV,
      },
      {
        name: "IRIS_SETUP",
        status: "",
        pv: "IN:IRIS_SETUP:" + runstatePV,
      },
      { name: "MOTION", status: "", pv: "IN:MOTION:" + runstatePV },
      {
        name: "PEARL_SETUP",
        status: "",
        pv: "IN:PEARL_SETUP:" + runstatePV,
      },
      { name: "SELAB", status: "", pv: "IN:SELAB:" + runstatePV },
      { name: "SOFTMAT", status: "", pv: "IN:SOFTMAT:" + runstatePV },
      {
        name: "WISH_SETUP",
        status: "",
        pv: "IN:WISH_SETUP:" + runstatePV,
      },
    ].sort((a, b) => a.name.localeCompare(b.name)),
  );

  const socketURL = process.env.NEXT_PUBLIC_WS_URL!;

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketURL, {
    shouldReconnect: (closeEvent) => true,
  });

  // subscribe to the pv's
  useEffect(() => {
    const pvList = [...TS1Data, ...TS2Data, ...miscData].map(
      (instrument) => instrument.pv,
    );

    pvList.forEach((pv) => {
      sendJsonMessage({ type: "subscribe", pvs: [pv] });
    });
  }, [TS1Data, TS2Data, miscData, sendJsonMessage]);

  useEffect(() => {
    if (!lastJsonMessage) {
      return;
    }

    const message: any = lastJsonMessage;

    const pv = message.pv;
    let value = message.text;

    if (!value) {
      value = "UNKNOWN";
    }

    const instrument = [...TS1Data, ...TS2Data, ...miscData].find(
      (instrument) => instrument.pv === pv,
    );

    if (!instrument) {
      return;
    } else {
      instrument.status = value;
    }
  }, [lastJsonMessage, TS1Data, TS2Data, miscData]);

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
