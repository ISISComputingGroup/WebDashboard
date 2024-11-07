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
        instruments.set(group, []);
      }
      instruments.get(group).push(name);
    }
  }

  return (
    <main
      className={`flex min-h-screen bg-gray-100 dark:bg-zinc-800  flex-col items-center justify-between ${inter.className}`}
    >
      <section className="  flex flex-col items-start justify-center rounded-xl w-full p-1">
        <div className=" mx-auto max-w-2/3">
          <div className="flex mt-6 flex-col justify-center items-center space-y-2">
            {[...instruments].sort().map(([group, insts]) => {
              return (
                <div
                  key={group}
                  className="flex flex-col justify-center items-center w-full "
                >
                  <h1 className="text-2xl font-bold text-black dark:text-gray-100 text-left w-full">
                    {group}
                  </h1>
                  <div className="flex-wrap flex justify-left items-center w-full mx-auto text-left md:text-center">
                    {insts.sort().map((instrument: string) => {
                      return (
                        <Link
                          href={`/instrument?name=${instrument}`}
                          key={instrument}
                        >
						  <div className="shadow-lg rounded-lg border-2 border-gray-600 bg-slate-800 hover:bg-slate-700 py-2 px-3 m-1 transition-all duration-100">
                            <h1 className="text-xl flex items-center justify-center text-left leading-none transition-all text-black dark:text-white">
                              {instrument}
                            </h1>
						  </div>
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
