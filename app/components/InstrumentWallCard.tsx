import Link from "next/link";
import { getForegroundColour, getStatusColour } from "./getRunstateColours";
import { instListEntryWithRunstatePVandValue } from "@/app/types";

export default function InstrumentWallCard({
  instrument,
}: {
  instrument: instListEntryWithRunstatePVandValue;
}) {
  return (
    <div className={"flex"}>
      <Link
        href={"/instrument?name=" + instrument.name}
        target="_blank"
        className={`flex items-center justify-center text-center py-1 w-28 max-h-12 rounded-lg shadow-sm border-2 border-gray-700 dark:border-gray-200 hover:shadow-lg hover:border-black dark:hover:border-gray-700 transition-all duration-200
      ${getStatusColour(instrument.runStateValue || "UNKNOWN")} ${getForegroundColour(
        instrument.runStateValue || "UNKNOWN",
      )}`}
      >
        <div className="flex flex-col">
          <span className="text-sm font-bold line-clamp-1 w-full">
            {instrument.name}
          </span>
          <span className="text-xs ">
            {instrument.runStateValue || "UNKNOWN"}
          </span>
        </div>
      </Link>
    </div>
  );
}
