import { Inter } from "next/font/google";
import Link from "next/link";
import { useState, useEffect } from "react";
import InstrumentWallCard from "../components/InstrumentWallCard";

const inter = Inter({ subsets: ["latin"] });

export default function WallDisplay() {
  const [TS1Data, setTS1Data] = useState([]);
  const [TS2Data, setTS2Data] = useState([]);
  const [miscData, setMiscData] = useState([]);

  useEffect(() => {
    setTS1Data([
      { name: "ALF", status: "SETUP" },
      { name: "CRISP", status: "PROCESSING" },
      { name: "EMMA-A", status: "SETUP" },
      { name: "EMU", status: "RUNNING" },
      { name: "ENGINX", status: "RUNNING" },
      { name: "GEM", status: "RUNNING" },
      { name: "HIFI-CRYOMAG", status: "RUNNING" },
      { name: "HRPD", status: "RUNNING" },
      { name: "INES", status: "SETUP" },
      { name: "IRIS", status: "RUNNING" },
      { name: "LOQ", status: "SETUP" },
      { name: "MAPS", status: "RUNNING" },
      { name: "MARI", status: "RUNNING" },
      { name: "MERLIN", status: "WAITING" },
      { name: "MUONFE", status: "SETUP" },
      { name: "OSIRIS", status: "WAITING" },
      { name: "PEARL", status: "RUNNING" },
      { name: "POLARIS", status: "RUNNING" },
      { name: "RIKENFE", status: "SETUP" },
      { name: "SANDALS", status: "RUNNING" },
      { name: "SCIDEMO", status: "SETUP" },
      { name: "SURF", status: "SETUP" },
      { name: "TOSCA", status: "RUNNING" },
      { name: "VESUVIO", status: "RUNNING" },
    ]);

    setTS2Data([
      { name: "IMAT", status: "RUNNING" },
      { name: "INTER", status: "RUNNING" },
      { name: "LARMOR", status: "SETUP" },
      { name: "LET", status: "RUNNING" },
      { name: "NIMROD", status: "RUNNING" },
      { name: "OFFSPEC", status: "RUNNING" },
      { name: "POLREF", status: "RUNNING" },
      { name: "SANS2D", status: "RUNNING" },
      { name: "WISH", status: "RUNNING" },
      { name: "ZOOM", status: "RUNNING" },
    ]);

    setMiscData([
      { name: "ARGUS", status: "UNKNOWN" },
      { name: "CHIPIR", status: "UNKNOWN" },
      { name: "CHRONUS", status: "RUNNING" },
      { name: "CRYOLAB_R80", status: "SETUP" },
      { name: "DCLAB", status: "UNKNOWN" },
      { name: "DEMO", status: "UNKNOWN" },
      { name: "DETMON", status: "UNKNOWN" },
      { name: "ENGINX_SETUP", status: "UNKNOWN" },
      { name: "HIFI", status: "UNKNOWN" },
      { name: "HRPD_SETUP", status: "PROCESSING" },
      { name: "IBEXGUITEST", status: "UNKNOWN" },
      { name: "IRIS_SETUP", status: "SETUP" },
      { name: "MOTION", status: "UNKNOWN" },
      { name: "MUSR", status: "RUNNING" },
      { name: "PEARL_SETUP", status: "SETUP" },
      { name: "SELAB", status: "SETUP" },
      { name: "SOFTMAT", status: "SETUP" },
      { name: "SXD", status: "UNKNOWN" },
      { name: "WISH_SETUP", status: "SETUP" },
    ]);
  }, []);

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
