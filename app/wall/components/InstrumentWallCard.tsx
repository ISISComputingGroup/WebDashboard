import Link from "next/link";
import {
  getForegroundColour,
  getStatusColour,
} from "../../components/getRunstateColours";

import { IfcInstrumentStatus } from "@/app/types";

export default function WallCard({
  instrument,
}: {
  instrument: IfcInstrumentStatus;
}) {
  return (
    <div
      className={`flex items-center justify-between p-3  rounded-lg shadow-sm border-2 border-gray-700 dark:border-gray-200 hover:shadow-lg hover:border-black dark:hover:border-gray-700 transition-all duration-200
      ${getStatusColour(instrument.runstate || "UNKNOWN")} ${getForegroundColour(
        instrument.runstate || "UNKNOWN",
      )}`}
    >
      <Link
        href={"/instrument?name=" + instrument.name}
        className="flex items-center justify-center  lg:w-20 w-full h-4"
        target="_blank"
      >
        <div className="flex flex-col justify-center items-center">
          <span className="text-sm font-bold truncate line-clamp-1 ">
            {instrument.name}
          </span>
          <span className="text-xs ">
            {instrument.runstate ? instrument.runstate : "UNKNOWN"}
          </span>
        </div>
      </Link>
    </div>
  );
}
