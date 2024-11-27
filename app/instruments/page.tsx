"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  IfcPVWSMessage,
  IfcPVWSRequest,
  instList,
  PVWSRequestType,
} from "@/app/types";
import {
  dehex_and_decompress,
  instListFromBytes,
} from "@/app/components/dehex_and_decompress";
import useWebSocket from "react-use-websocket";
import { instListPV, instListSubscription, socketURL } from "@/app/commonVars";

export function createInstrumentGroupsFromInstlist(
  jsonInstList: instList,
): Map<string, Array<string>> {
  let newInstrumentGroups: Map<string, Array<string>> = new Map();
  for (let inst of jsonInstList) {
    for (let group of inst["groups"]) {
      if (!newInstrumentGroups.has(group)) {
        newInstrumentGroups.set(group, []);
      }
      newInstrumentGroups.get(group)!.push(inst["name"]);
    }
  }
  return newInstrumentGroups;
}

export default function Instruments() {
  const [instrumentGroups, setInstrumentGroups] = useState<
    Map<string, Array<string>>
  >(new Map());

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
    // On page load, subscribe to the instrument list as it's required to get each instrument.
    sendJsonMessage(instListSubscription);
  }, [sendJsonMessage]);

  useEffect(() => {
    // Instlist has changed
    if (!lastJsonMessage) {
      return;
    }

    const updatedPV: IfcPVWSMessage = lastJsonMessage;
    const updatedPVbytes: string | null | undefined = updatedPV.b64byt;

    if (updatedPV.pv == instListPV && updatedPVbytes != null) {
      const newInstrumentGroups = createInstrumentGroupsFromInstlist(
        instListFromBytes(updatedPVbytes),
      );
      setInstrumentGroups(newInstrumentGroups);
    }
  }, [lastJsonMessage]);

  if (!instrumentGroups.size) {
    return <h1>Loading...</h1>;
  }

  return (
    <main
      className={`flex min-h-screen bg-gray-100 dark:bg-zinc-800  flex-col items-center justify-between`}
    >
      <section className="  flex flex-col items-start justify-center rounded-xl w-full p-1">
        <div className=" mx-auto max-w-2/3">
          <div className="flex mt-6 flex-col justify-center items-center space-y-2">
            {Array.from(instrumentGroups.entries()).map(([group, insts]) => {
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
