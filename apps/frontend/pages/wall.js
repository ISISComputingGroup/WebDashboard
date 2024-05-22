import { Inter } from "next/font/google";
import Link from "next/link";
import { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import InstrumentWallCard from "../components/InstrumentWallCard";

const inter = Inter({ subsets: ["latin"] });

export default function WallDisplay() {
  const [TS1Data, setTS1Data] = useState([]);
  const [TS2Data, setTS2Data] = useState([]);
  const [miscData, setMiscData] = useState([]);

  const runstatePV = "DAE:RUNSTATE_STR";

  useEffect(() => {
    setTS1Data([
      { name: "ALF", status: "", pv: "IN:ALF:" + runstatePV },
      { name: "CRISP", status: "", pv: "IN:CRISP:" + runstatePV },
      { name: "EMMA", status: "", pv: "IN:EMMA:" + runstatePV },
      { name: "EMMA-A", status: "", pv: "IN:EMMA-A:" + runstatePV },
      { name: "EMU", status: "", pv: "IN:EMU:" + runstatePV },
      { name: "ENGINX", status: "", pv: "IN:ENGINX:" + runstatePV },
      { name: "GEM", status: "", pv: "IN:GEM:" + runstatePV },
      {
        name: "HIFI-CRYOMAG",
        status: "",
        pv: "IN:HIFI-CRYOMAG:" + runstatePV,
      },
      { name: "HRPD", status: "", pv: "IN:HRPD:" + runstatePV },
      { name: "INES", status: "", pv: "IN:INES:" + runstatePV },
      { name: "IRIS", status: "", pv: "IN:IRIS:" + runstatePV },
      { name: "LOQ", status: "", pv: "IN:LOQ:" + runstatePV },
      { name: "MAPS", status: "", pv: "IN:MAPS:" + runstatePV },
      { name: "MARI", status: "", pv: "IN:MARI:" + runstatePV },
      { name: "MERLIN", status: "", pv: "IN:MERLIN:" + runstatePV },
      { name: "MUONFE", status: "", pv: "IN:MUONFE:" + runstatePV },
      { name: "OSIRIS", status: "", pv: "IN:OSIRIS:" + runstatePV },
      { name: "PEARL", status: "", pv: "IN:PEARL:" + runstatePV },
      { name: "POLARIS", status: "", pv: "IN:POLARIS:" + runstatePV },
      { name: "RIKENFE", status: "", pv: "IN:RIKENFE:" + runstatePV },
      { name: "SANDALS", status: "", pv: "IN:SANDALS:" + runstatePV },
      { name: "SCIDEMO", status: "", pv: "IN:SCIDEMO:" + runstatePV },
      { name: "SURF", status: "", pv: "IN:SURF:" + runstatePV },
      { name: "TOSCA", status: "", pv: "IN:TOSCA:" + runstatePV },
      { name: "VESUVIO", status: "", pv: "IN:VESUVIO:" + runstatePV },
    ]);

    setTS2Data([
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
    ]);

    setMiscData([
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
        name: "ENGINX_UNKNOWN",
        status: "",
        pv: "IN:ENGINX_UNKNOWN:" + runstatePV,
      },
      { name: "HIFI", status: "", pv: "IN:HIFI:" + runstatePV },
      {
        name: "HRPD_UNKNOWN",
        status: "",
        pv: "IN:HRPD_UNKNOWN:" + runstatePV,
      },
      {
        name: "IBEXGUITEST",
        status: "",
        pv: "IN:IBEXGUITEST:" + runstatePV,
      },
      {
        name: "IRIS_UNKNOWN",
        status: "",
        pv: "IN:IRIS_UNKNOWN:" + runstatePV,
      },
      { name: "MOTION", status: "", pv: "IN:MOTION:" + runstatePV },
      { name: "MUSR", status: "", pv: "IN:MUSR:" + runstatePV },
      {
        name: "PEARL_UNKNOWN",
        status: "",
        pv: "IN:PEARL_UNKNOWN:" + runstatePV,
      },
      { name: "SELAB", status: "", pv: "IN:SELAB:" + runstatePV },
      { name: "SOFTMAT", status: "", pv: "IN:SOFTMAT:" + runstatePV },
      { name: "SXD", status: "", pv: "IN:SXD:" + runstatePV },
      {
        name: "WISH_UNKNOWN",
        status: "",
        pv: "IN:WISH_UNKNOWN:" + runstatePV,
      },
    ]);
  }, []);

  const socketURL = process.env.NEXT_PUBLIC_WS_URL;

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketURL, {
    shouldReconnect: (closeEvent) => true,
  });

  // subscribe to the pv's
  useEffect(() => {
    const pvList = [...TS1Data, ...TS2Data, ...miscData].map(
      (instrument) => instrument.pv
    );

    pvList.forEach((pv) => {
      sendJsonMessage({ type: "subscribe", pvs: [pv] });
    });
  }, [TS1Data, TS2Data, miscData, sendJsonMessage]);

  useEffect(() => {
    if (!lastJsonMessage) {
      return;
    }

    const message = lastJsonMessage;

    const pv = message.pv;
    let value = message.text;

    if (!value) {
      value = "UNKNOWN";
    }

    const instrument = [...TS1Data, ...TS2Data, ...miscData].find(
      (instrument) => instrument.pv === pv
    );

    if (!instrument) {
      return;
    }

    const newInstrument = { ...instrument, status: value };

    if (TS1Data.find((instrument) => instrument.pv === pv)) {
      setTS1Data((prev) =>
        prev.map((instrument) =>
          instrument.pv === pv ? newInstrument : instrument
        )
      );
    } else if (TS2Data.find((instrument) => instrument.pv === pv)) {
      setTS2Data((prev) =>
        prev.map((instrument) =>
          instrument.pv === pv ? newInstrument : instrument
        )
      );
    } else if (miscData.find((instrument) => instrument.pv === pv)) {
      setMiscData((prev) =>
        prev.map((instrument) =>
          instrument.pv === pv ? newInstrument : instrument
        )
      );
    }
  }, [lastJsonMessage, TS1Data, TS2Data, miscData]);

  return (
    <main
      className={`flex min-h-screen bg-gray-100 flex-col items-center justify-between ${inter.className}`}
    >
      <section className=" rounded-xl w-full  px-4 md:p-12 w-full px-8 md:px-0 md:w-2/3  ">
        <div className="mx-auto ">
          <div className="w-full mx-auto text-left">
            {/* <div className="mb-8 flex flex-col text-4xl font-extrabold leading-none tracking-normal text-gray-900 md:text-6xl md:tracking-tight"> */}
            {/* <h1>Experiment Controls</h1>{" "} */}

            {/* <h1 className="block w-full mt-2 py-2  ">
                🧱
                <span className="text-transparent mx-2 bg-clip-text leading-12 bg-gradient-to-r from-green-400 to-purple-500 lg:inline">
                  The Wall
                </span>
              </h1> */}
            {/* <span>around your product ?</span> */}
            {/* </div> */}
            {/* <p className="px-0 mb-8 text-lg text-gray-600 md:text-xl lg:px-24">
              Use this page to monitor the status of the instruments and Jenkins
              jobs
            </p> */}
            <div className="flex flex-col justify-center items-center">
              <h1 className="w-full text-left text-black font-semibold text-4xl mt-2 py-2 ">
                Instrument Statuses:
              </h1>{" "}
              <div className="flex flex-col justify-center items-start w-full">
                <h1 className="w-full text-left text-gray-600 font-semibold text-2xl mt-2 py-2 ">
                  TS1:
                </h1>{" "}
                <div className="flex flex-wrap">
                  {TS1Data.map((instrument) => (
                    <InstrumentWallCard
                      key={instrument.name}
                      instrument={instrument}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center items-start w-full">
                <h1 className="w-full text-left text-gray-600 font-semibold text-2xl mt-2 py-2 ">
                  TS2:
                </h1>{" "}
                <div className="flex flex-wrap">
                  {TS2Data.map((instrument) => (
                    <InstrumentWallCard
                      key={instrument.name}
                      instrument={instrument}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center items-start w-full">
                <h1 className="w-full text-left text-gray-600 font-semibold text-2xl mt-2 py-2 ">
                  MISC:
                </h1>{" "}
                <div className="flex flex-wrap ">
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

          <hr class="h-[2px] rounded my-8 bg-gray-200 border-0 dark:bg-gray-700" />

          <div className="flex flex-col justify-center items-center">
            <h1 className="w-full text-left text-black font-semibold text-3xl mt-2 py-2 ">
              Jenkins Jobs:
            </h1>{" "}
            <p className="text-lg text-left w-full text-black">
              Tip: Open the jobs into a{" "}
              <span className="font-bold underline">new tab</span> only
            </p>
            <iframe
              className="w-full h-[400px] border-2 border-gray-100 rounded-lg shadow-sm hover:shadow-lg hover:border-black transition-all duration-200"
              src="https://epics-jenkins.isis.rl.ac.uk/plugin/jenkinswalldisplay/walldisplay.html?viewName=WallDisplay&amp;jenkinsUrl=https%3A%2F%2Fepics-jenkins.isis.rl.ac.uk%2F"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  );
}
