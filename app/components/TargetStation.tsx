import { instListEntryWithRunstatePVandValue } from "@/app/types";
import InstrumentWallCard from "./InstrumentWallCard";

export default function TargetStation({
  name,
  instruments,
  beamCurrent,
}: {
  name: string;
  instruments: Array<instListEntryWithRunstatePVandValue>;
  beamCurrent: number| string | null | undefined;
}) {
  instruments = instruments.sort((instrumenta, instrumentb) =>
    instrumenta.name.localeCompare(instrumentb.name),
  );
  return (
    <div className="flex flex-col justify-center items-start w-full">
      <h1 className="w-full text-left text-gray-600 dark:text-gray-200 font-semibold text-md mt-2 py-2 ">
        {name}{" "}
        {beamCurrent !== undefined && beamCurrent !== null && typeof beamCurrent !== 'string'
          ? "- " + beamCurrent.toFixed(2) + " μA"
          : ""}
      </h1>
      <div className="flex flex-wrap gap-1">
        {instruments.map((instrument) => (
          <InstrumentWallCard key={instrument.name} instrument={instrument} />
        ))}
      </div>
    </div>
  );
}
