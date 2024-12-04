import InstrumentWallCard from "./InstrumentWallCard";

import { IfcInstrumentStatus } from "@/app/types";

export default function TargetStation({
  name,
  instruments,
}: {
  name: string;
  instruments: Array<IfcInstrumentStatus>;
}) {
  return (
    <div className="flex flex-col justify-center items-start w-full">
      <h1 className="w-full text-left text-gray-600 dark:text-gray-200 font-semibold text-md mt-2 py-2 ">
        {name}
      </h1>
      <div className="flex flex-wrap gap-1">
        {instruments.map((instrument) => (
          <InstrumentWallCard key={instrument.name} instrument={instrument} />
        ))}
      </div>
    </div>
  );
}
