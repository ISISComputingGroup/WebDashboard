import { getForegroundColour, getStatusColour } from "./getRunstateColours";

import { IfcPV } from "@/app/types";
import { findPVByHumanReadableName } from "@/app/components/PVutils";

export const runStateStr = "Run state";
export const configName = "Config name";

export function getRunstate(runInfoPVs: Array<IfcPV>): string | undefined {
  const runStatePV = findPVByHumanReadableName(runInfoPVs, runStateStr);
  if (runStatePV && runStatePV.value && typeof runStatePV.value === "string") {
    return runStatePV.value;
  }
}

export default function TopBar({
  dashboard,
  instName,
  runInfoPVs,
}: {
  dashboard: Array<Array<Array<IfcPV>>>;
  instName: string;
  runInfoPVs: Array<IfcPV>;
}) {
  if (
    !dashboard ||
    !dashboard.flat().length ||
    !runInfoPVs ||
    !runInfoPVs.length ||
    !instName
  ) {
    return (
      <h1 className="text-lg w-full text-white bg-gray-400 border-gray-500 border-2 p-3 font-semibold px-7 animate-pulse">
        Loading...
      </h1>
    );
  }

  return (
    <div
      id="top_bar"
      className="w-full bg-white  shadow-lg text-black rounded-xl text-md"
    >
      <div className="text-left mb-4 p-4">
        <h1 className="text-black text-2xl">
          Instrument:{" "}
          <span id={"instNameSpan"} className="font-semibold">
            {instName.toUpperCase()}
          </span>
        </h1>
        <h1 className="text-black text-lg">
          Config:{" "}
          <span id={"configNameSpan"} className="font-semibold">
            {findPVByHumanReadableName(runInfoPVs, configName)
              ? findPVByHumanReadableName(runInfoPVs, configName)!.value
              : "UNKNOWN"}
          </span>
        </h1>
      </div>
      <div
        id="instNameDiv"
        className="w-full flex justify-center items-center flex-col"
      >
        <h2
          className={`text-center p-4 text-xl rounded-t-lg w-full 
          ${getStatusColour(getRunstate(runInfoPVs))}
           
           ${getForegroundColour(getRunstate(runInfoPVs))}
          
          `}
        >
          {instName.toUpperCase()} is{" "}
          <span id={"runStateSpan"}>{getRunstate(runInfoPVs)}</span>
        </h2>
        <div className="bg-gray-50 border-2 border-gray-800 m-4 p-4 shadow-md flex flex-col">
          <table
            id={"dashboardTable"}
            className="text-sm w-full table-fixed flex divide-x divide-gray-200 "
          >
            {dashboard.map((column: Array<Array<IfcPV>>, index: number) => (
              <tbody key={index} id={index.toString()}>
                {column.map((row: Array<IfcPV>, index: number) => (
                  <tr
                    key={index}
                    className="[&:not(:last-child)]:border-b border-gray-300 text-black transition duration-100 hover:bg-gray-700 hover:text-white"
                  >
                    <td className="py-1 px-4 flex font-bold">{row[0].value}</td>
                    <td className="py-1 px-4 flex justify-between items-center">
                      <span className="font-light">
                        {row[1].value != null ? row[1].value : "Hidden/unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>

        <label id={"runInfoLabel"}>
          <input className="peer/showLabel absolute scale-0" type="checkbox" />
          <span className="block max-h-14 overflow-hidden rounded-lg bg-gray-50 hover:bg-gray-800 hover:text-white px-4 py-0 mb-2  shadow-lg transition-all duration-300 peer-checked/showLabel:max-h-fit cursor-pointer">
            <h3 className="flex h-14 cursor-pointer items-center font-bold ">
              Click to show/hide all run information
            </h3>
            {runInfoPVs.map((runInfoPV) => (
              <p className="mb-2" key={runInfoPV.human_readable_name}>
                {runInfoPV.human_readable_name}: {runInfoPV.value}
              </p>
            ))}
          </span>
        </label>
      </div>
    </div>
  );
}
