import { getForegroundColour, getStatusColour } from "./getRunstateColours";

import { DashboardArr, IfcPV } from "@/app/types";
import { findPVByHumanReadableName } from "@/app/components/PVutils";

export const runStateStr = "Run state";
export const configName = "Config name";

export function getRunstate(runInfoPVs: Array<IfcPV>): string {
  const runStatePV = findPVByHumanReadableName(runInfoPVs, runStateStr);
  if (runStatePV && runStatePV.value && typeof runStatePV.value === "string") {
    return runStatePV.value;
  }
  return "UNKNOWN";
}

export default function TopBar({
  dashboard,
  instName,
  runInfoPVs,
}: {
  dashboard: DashboardArr;
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
      <div
        id="instNameDiv"
        className="w-full flex justify-center items-center flex-col"
      >
        <h2
          className={`text-center p-4 text-xl rounded-t-lg w-full 
          ${getStatusColour(getRunstate(runInfoPVs))}
           
           ${getForegroundColour(getRunstate(runInfoPVs))}
          
          `}
          id={"instNameLabel"}
        >
          {instName.toUpperCase()} is{" "}
          <span id={"runStateSpan"}>{getRunstate(runInfoPVs)}</span>
        </h2>
        <h3 className="text-black text-wrap max-w-full break-all py-2 font-semibold">
          Config:{" "}
          <span id={"configNameSpan"}>
            {findPVByHumanReadableName(runInfoPVs, configName)
              ? findPVByHumanReadableName(runInfoPVs, configName)!.value
              : "UNKNOWN"}
          </span>
        </h3>

        <div className="bg-gray-50 border-2 border-gray-200 flex flex-col max-w-full w-full">
          <table
            id={"dashboardTable"}
            className="text-sm max-w-full table-fixed flex divide-x divide-gray-200 text-wrap "
          >
            {dashboard.map((column: Array<Array<IfcPV>>, index: number) => (
              <tbody key={index} id={index.toString()} className="w-1/3">
                {column.map((row: Array<IfcPV>, index: number) => (
                  <tr
                    key={index}
                    className="[&:not(:last-child)]:border-b border-gray-300 text-black transition duration-100 hover:bg-gray-700 hover:text-white md:flex"
                  >
                    <td className="py-1 px-4 flex font-bold break-words">
                      {row[0].value}
                    </td>
                    <td className="py-1 px-4 flex justify-between items-center break-all">
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

        <label id={"runInfoLabel"} className="p-2 w-full">
          <input className="peer/showLabel absolute scale-0" type="checkbox" />
          <span className="block max-h-14 overflow-hidden rounded-lg bg-gray-600 hover:bg-gray-800 text-white px-4 py-0 mb-2 transition-all duration-300 peer-checked/showLabel:max-h-fit cursor-pointer items-center">
            <h3 className="flex h-14 cursor-pointer font-bold text-center items-center justify-center">
              Show/hide all run information
            </h3>
            <div className="grid md:grid-cols-5 gap-2">
              {runInfoPVs.map((runInfoPV) => (
                <div
                  className="mb-2 shadow-sm rounded-md"
                  key={runInfoPV.human_readable_name}
                >
                  <p className="font-bold">{runInfoPV.human_readable_name}:</p>{" "}
                  <p className="break-all">{runInfoPV.value}</p>
                </div>
              ))}
            </div>
          </span>
        </label>
      </div>
    </div>
  );
}
