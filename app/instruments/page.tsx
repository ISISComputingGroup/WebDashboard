"use client";
import { Inter } from "next/font/google";
import Link from "next/link";
import InstList from "@/app/components/InstList";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  let instList = InstList();

  if (!instList) {
    return <h1>Loading...</h1>;
  }

  instList = Array.from(instList);

  let instruments = new Map();

  for (let inst of instList) {
    let groups = inst["groups"];
    let name = inst["name"];

    for (let group of groups) {
      if (!instruments.has(group)) {
        instruments.set(group, new Array());
      }
      instruments.get(group).push(name);
    }
  }

  return (
    <main
      className={`flex min-h-screen bg-gray-100 dark:bg-zinc-800  flex-col items-center justify-between ${inter.className}`}
    >
      <section className="  flex flex-col items-start justify-center rounded-xl w-full  p-6 ">
        <div className=" mx-auto max-w-2/3">
          <h1 className="text-4xl font-extrabold text-left leading-none tracking-normal text-gray-900 dark:text-white md:text-6xl md:tracking-tight">
            Instrument Dashboards
          </h1>

          <div className="flex mt-6 flex-col justify-center items-center space-y-4 ">
            {[...instruments].map(([group, insts]) => {
              return (
                <div
                  key={group}
                  className="flex flex-col justify-center items-center w-full "
                >
                  <h1 className="text-4xl text-black dark:text-gray-100 text-left w-full">
                    {group}
                  </h1>
                  <div className="flex-wrap flex justify-left items-center  w-full mx-auto text-left md:text-center">
                    {insts.map((instrument: string) => {
                      return (
                        <Link
                          href={`/instruments/${instrument}`}
                          key={instrument}
                        >
                          <h1 className="text-1xl font-bold text-left mr-4 w-full leading-none transition-all hover:text-blue-500 tracking-normal text-black dark:text-white md:text-4xl md:tracking-tight">
                            {instrument}
                          </h1>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
