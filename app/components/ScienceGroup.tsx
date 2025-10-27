import InstrumentWallCard from "@/app/components/InstrumentWallCard";
import { instList, instListEntryWithRunstatePVandValue } from "@/app/types";

export default function ScienceGroup({
  name,
  instruments,
}: {
  name: string;
  instruments: instList;
}) {
  return (
    <div
      key={name}
      className={"flex flex-col justify-center items-start w-full"}
    >
      <h2 className="w-full text-left text-gray-600 dark:text-gray-200 font-semibold text-md mt-2 py-2 ">
        {name}
      </h2>
      <div className={"flex flex-wrap gap-1"}>
        {instruments
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((instrument: instListEntryWithRunstatePVandValue) => {
            return (
              <InstrumentWallCard
                key={instrument.name}
                instrument={instrument}
              />
            );
          })}
      </div>
    </div>
  );
}
