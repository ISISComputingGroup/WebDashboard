"use client";
import { IfcBlock } from "@/app/types";
import { useState } from "react";

const grafana_stub =
  "https://shadow.nd.rl.ac.uk/grafana/d/wMlwwaHMk/block-history?viewPanel=2&orgId=1&var-block=";

export default function Block({
  pv,
  instName,
  showHiddenBlocks,
}: {
  pv: IfcBlock;
  instName: string;
  showHiddenBlocks: boolean;
}) {
  const [currentValue, setCurrentValue] = useState<
    string | number | undefined
  >();
  const [showAdvanced, setShowAdvanced] = useState(false);
  if (!pv.visible && !showHiddenBlocks) {
    return null;
  }
  if (pv.value != currentValue) {
    setCurrentValue(pv.value);
  }

  const minimum_date_to_be_shown = 631152000; // This is what PVWS thinks epoch time is for some reason. don't bother showing it as the instrument wasn't running EPICS on 01/01/1990
  return (
    <tr
      key={pv.human_readable_name}
      className="border-b border-blue-gray-200 transition duration-100 hover:bg-gray-100 hover:text-black"
      onClick={() => {
        setShowAdvanced(!showAdvanced);
      }}
    >
      <td className="py-1 px-2 w-1/3 flex-row">
        <a
          className="underline"
          href={
            grafana_stub +
            pv.human_readable_name +
            "&var-inst=" +
            instName.toUpperCase()
          }
          target="_blank"
        >
          {pv.human_readable_name}
        </a>
      </td>

      <td className="py-1 px-2 w-7/12">
        <span id={pv.human_readable_name + "_VALUE_ROW"}>
          <div className="flex justify-between">
            <span
              id={pv.human_readable_name + "_VALUE"}
              className={pv.severity != "NONE" ? "text-red-400" : ""}
            >
              {showAdvanced && "Readback: "}
              {pv.value} {pv.units != null && pv.units}
            </span>
          </div>

          {showAdvanced && (
            <div>
              <hr />
              {pv.severity != "NONE" ? (
                <a
                  href="https://github.com/ISISComputingGroup/ibex_user_manual/wiki/Blocks#alarms"
                  className="text-red-400"
                  target="_blank"
                >
                  Alarm: {pv.severity}
                </a>
              ) : null}
              <hr />
              {pv.sp_value != null ? (
                <span id={pv.human_readable_name + "_SP"}>
                  {`Setpoint: ${pv.sp_value}`}
                  <hr />
                </span>
              ) : null}
              {pv.updateSeconds != null &&
              pv.updateSeconds > minimum_date_to_be_shown ? (
                <span id={pv.human_readable_name + "_TIMESTAMP"}>
                  {/*Multiply by 1000 here as Date() expects milliseconds*/}
                  {`Last update: ${new Date(pv.updateSeconds * 1000).toLocaleString()}`}
                </span>
              ) : null}
            </div>
          )}
        </span>
      </td>
      <td className="py-1 px-2  flex justify-between items-center">
        <span
          id={pv.human_readable_name + "_VALUE_RC"}
          title={"Run control in-range?"}
        >
          {pv.runcontrol_enabled && (pv.runcontrol_inrange ? "✅" : "❌")}
        </span>

        <span
          className={"cursor-pointer font-bold"}
          title={"Show/Hide advanced statuses"}
        >
          {showAdvanced ? "-" : "+"}
        </span>
      </td>
    </tr>
  );
}
