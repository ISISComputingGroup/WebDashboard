import Link from "next/link";
import {
  instrumentPageLink,
  shutterModePV,
  shutterStatusPV,
  vatStatusPV,
} from "@/app/components/BeamStatusPVs";
import { getShutterColour } from "@/app/components/shutterStatusColours";
import type { IfcPV, instListEntry } from "@/app/types";

const UNKNOWN = "-";

export default function ShutterStatus({
  name,
  instruments,
  pvs,
  showVatAndMode = false,
}: {
  name: string;
  instruments: Array<instListEntry>;
  pvs: Map<string, IfcPV>;
  showVatAndMode?: boolean;
}) {
  return (
    <div className="flex flex-col w-full rounded-xl bg-white dark:bg-zinc-900 text-black dark:text-white shadow-md p-4">
      <h1 className="w-full text-left text-gray-600 dark:text-gray-200 font-semibold text-lg pb-2">
        {name}
      </h1>
      <div className="flex flex-wrap gap-1">
        {instruments.map((instrument) => {
          const shutter = pvs.get(shutterStatusPV(instrument))?.value;
          const vat = pvs.get(vatStatusPV(instrument))?.value;
          const mode = pvs.get(shutterModePV(instrument))?.value;
          return (
            <Link
              key={instrument.name}
              id={instrument.name + "_SHUTTER"}
              href={instrumentPageLink(instrument.name)}
              title={shutterStatusPV(instrument)}
              className={`flex flex-col items-center justify-center text-center py-1 w-28 rounded-lg shadow-xs border-2 border-gray-700 dark:border-gray-200 hover:shadow-lg hover:border-black dark:hover:border-gray-700 transition-all duration-200 ${getShutterColour(shutter)}`}
            >
              <span className="text-sm font-bold line-clamp-1 w-full">
                {instrument.name}
              </span>
              <span className="text-xs">{shutter ?? UNKNOWN}</span>
              {showVatAndMode && (
                <>
                  <span
                    id={instrument.name + "_VAT"}
                    className={`text-xs w-11/12 rounded-sm mt-1 ${getShutterColour(vat)}`}
                  >
                    VAT: {vat ?? UNKNOWN}
                  </span>
                  <span
                    id={instrument.name + "_MODE"}
                    className="text-xs w-11/12 rounded-sm mt-1 bg-white text-black"
                  >
                    {mode ?? UNKNOWN}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
