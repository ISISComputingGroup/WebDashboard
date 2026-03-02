import { memo } from "react";
import { DASHBOARD } from "@/app/components/Instrument";
import { tBlockMapping } from "@/app/types";
import {
  getForegroundColour,
  getStatusColour,
  UNREACHABLE,
} from "./getRunstateColours";

export function getRunstate(prefix: string, runInfoPVs: tBlockMapping): string {
  const runStatePV = runInfoPVs.get(`${prefix}DAE:RUNSTATE_STR`);
  if (runStatePV && runStatePV.value && typeof runStatePV.value === "string") {
    return runStatePV.value;
  }
  return UNREACHABLE;
}

const TopBar = function TopBar({
  dashboard,
  instName,
  runInfoPVs,
  prefix,
}: {
  dashboard: tBlockMapping;
  instName: string;
  runInfoPVs: tBlockMapping;
  prefix: string;
}) {
  if (!dashboard || !runInfoPVs || !instName) {
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
        <div
          id={"runstateDiv"}
          className={`p-2 rounded-t-lg w-full flex-col justify-center items-center text-center ${getStatusColour(getRunstate(prefix, runInfoPVs))} ${getForegroundColour(getRunstate(prefix, runInfoPVs))}`}
        >
          <h2 className={"text-xl"} id={"instNameLabel"}>
            {instName.toUpperCase()} is{" "}
            <span id={"runStateSpan"}>{getRunstate(prefix, runInfoPVs)}</span>
          </h2>
          <div
            id={"banner"}
            className={"flex flex-col md:flex-row text-center w-full"}
          >
            {["LEFT", "MIDDLE", "RIGHT"].map((place) => (
              <div key={place} className={"flex-row md:w-1/3"}>
                {
                  dashboard.get(`${prefix}CS:DASHBOARD:BANNER:${place}:LABEL`)!
                    .value
                }{" "}
                {
                  dashboard.get(`${prefix}CS:DASHBOARD:BANNER:${place}:VALUE`)!
                    .value
                }
              </div>
            ))}
          </div>
        </div>
        <h3 className="text-black text-wrap max-w-full break-all py-2 font-semibold">
          Config:{" "}
          <span id={"configNameSpan"}>
            {runInfoPVs.get(`${prefix}CS:BLOCKSERVER:CURR_CONFIG_NAME`)
              ? runInfoPVs.get(`${prefix}CS:BLOCKSERVER:CURR_CONFIG_NAME`)!
                  .value
              : "UNKNOWN"}
          </span>
        </h3>

        <div className="bg-gray-50 border-2 border-gray-200 flex flex-col max-w-full w-full">
          <table
            id={"dashboardTable"}
            className="text-sm max-w-full table-fixed flex divide-x divide-gray-200 text-wrap w-full "
          >
            <tbody className="w-1/3">
              <tr className="not-last:border-b border-gray-300 text-black transition duration-100 hover:bg-gray-700 hover:text-white md:flex">
                <td className="py-1 px-4 flex font-bold break-words">Title</td>
                <td className="py-1 px-4 flex justify-between items-center break-all">
                  <span className="font-light">
                    {dashboard.get(`${prefix}DAE:WDTITLE`)?.value
                      ? dashboard.get(`${prefix}DAE:WDTITLE`)!.value
                      : "Unknown"}
                  </span>
                </td>
              </tr>

              <tr className="not-last:border-b border-gray-300 text-black transition duration-100 hover:bg-gray-700 hover:text-white md:flex">
                <td className="py-1 px-4 flex font-bold break-words">Users</td>
                <td className="py-1 px-4 flex justify-between items-center break-all">
                  <span className="font-light">
                    {dashboard.get(`${prefix}DAE:WDUSERS`)?.value
                      ? dashboard.get(`${prefix}DAE:WDUSERS`)!.value
                      : "Unknown"}
                  </span>
                </td>
              </tr>
            </tbody>

            {[1, 2].map((col: number) => (
              <tbody key={col} id={col.toString()} className="w-1/3">
                {[1, 2, 3].map((row: number) => (
                  <tr
                    key={row}
                    className="not-last:border-b border-gray-300 text-black transition duration-100 hover:bg-gray-700 hover:text-white md:flex"
                  >
                    <td className="py-1 px-4 flex font-bold break-words">
                      {
                        dashboard.get(
                          `${prefix}${DASHBOARD}${row}:${col}:LABEL`,
                        )!.value
                      }
                    </td>
                    <td className="py-1 px-4 flex justify-between items-center break-all">
                      <span className="font-light">
                        {dashboard.get(
                          `${prefix}${DASHBOARD}${row}:${col}:VALUE`,
                        )?.value
                          ? dashboard.get(
                              `${prefix}${DASHBOARD}${row}:${col}:VALUE`,
                            )!.value
                          : "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>

        <details className="w-full rounded-lg  bg-gray-600 text-white px-0 py-0 mb-2 items-center mt-2">
          <summary className="flex h-14 font-bold text-center items-center cursor-pointer justify-center rounded-lg w-full bg-gray-800 hover:bg-black">
            Show/hide all run information
          </summary>
          <div className="grid md:grid-cols-5 gap-2 px-4 pt-4">
            {Array.from(runInfoPVs.values()).map((runInfoPV) => (
              <div
                className="mb-2 shadow-xs rounded-md"
                key={runInfoPV.human_readable_name}
              >
                <p className="font-bold">{runInfoPV.human_readable_name}:</p>{" "}
                <p className="break-all">{runInfoPV.value}</p>
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
};

export default memo(TopBar);
export const exportedForTesting = TopBar;
