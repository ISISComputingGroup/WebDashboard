import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const theRestInsts = [
    "loq",
    "sans2d",
    "offspec",
    "surf",
    "zoom",
    "iris",
    // "iris_setup",
    "osiris",
    "tosca",
    "vesuvio",
    "emu",
  ];

  const reflecInsts = ["imat", "inter", "let", "sandals", "polref", "larmor"];

  const muonsInsts = [
    "wish",
    "enginx",
    "gem",
    "ines",
    "pearl",
    "polaris",
    "alf",
    "crisp",
  ];

  const instruments = [
    ["Reflectometry", reflecInsts],
    ["Muons", muonsInsts],
    ["The rest", theRestInsts],
  ];

  return (
    <main
      className={`flex min-h-screen bg-gray-100 flex-col items-center justify-between ${inter.className}`}
    >
      <section className="  flex flex-col items-start justify-center rounded-xl w-full  p-12 ">
        <div className=" mx-auto max-w-2/3">
          <h1 className="text-4xl font-extrabold text-left leading-none tracking-normal text-gray-900 md:text-6xl md:tracking-tight">
            Instrument Dashboards
          </h1>

          <div className="flex mt-12 flex-col justify-center items-center space-y-4 ">
            {instruments.map((instrument) => {
              return (
                <div
                  key={instrument[0]}
                  className="flex flex-col justify-center items-center w-full "
                >
                  <h1 className="text-6xl text-black text-left w-full">
                    {instrument[0]}
                  </h1>
                  <div className="flex-wrap flex justify-left items-center  w-full mx-auto text-left md:text-center">
                    {instrument[1].map((instrument) => {
                      return (
                        <Link
                          href={`/instruments/${instrument}`}
                          key={instrument}
                        >
                          <h1 className="text-2xl font-bold text-left mr-4 w-full leading-none transition-all hover:text-blue-500 tracking-normal text-black md:text-4xl md:tracking-tight">
                            {instrument}
                          </h1>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {/* //   <div className="flex flex-col justify-center items-center divide-y">
          //   <h1>{title}</h1>
          // <div className="flex-wrap flex justify-between w-full mx-auto text-left md:w-11/12 xl:w-9/12 md:text-center">
          //   {instruments.map((instrument) => {
          //     return (
          //       <Link href={`/instruments/${instrument}`} key={instrument}>
          //         <h1 className="text-4xl font-extrabold leading-none transition-all hover:text-blue-500 tracking-normal text-black md:text-6xl md:tracking-tight">
          //           {instrument}
          //         </h1>
          //       </Link>
          //     );
          //   })}
          // </div>
          // </div> */}
          </div>
        </div>
      </section>
    </main>
  );
}
