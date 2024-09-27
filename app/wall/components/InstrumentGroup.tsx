import InstrumentWallCard from "./InstrumentWallCard";
import { IfcInstrumentStatus } from "../IfcInstrumentStatus";

export default function InstrumentGroup({
  groupName,
  data,
}: {
  groupName: string;
  data: Array<IfcInstrumentStatus>;
}) {
  return (
    <div className="flex flex-col justify-center items-start w-full">
      <h1 className="w-full text-left text-gray-600 dark:text-gray-200 font-semibold text-md mt-2 py-2 ">
        {groupName}
      </h1>
      <div className="flex flex-wrap gap-1">
        {data.map((instrument) => (
          <InstrumentWallCard key={instrument.name} instrument={instrument} />
        ))}
      </div>
    </div>
  );
}
