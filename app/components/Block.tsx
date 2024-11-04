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
  if (!pv.visible && !showHiddenBlocks && !instName) {
    return null;
  }
  if (pv.value != currentValue) {
    setCurrentValue(pv.value);
    // Let the user know a change has occurred by lighting up the green dot next to the value
    const pvChangedIndicator = document.getElementById(
      pv.human_readable_name + "_CIRCLE",
    );
    if (!pvChangedIndicator) return;
    if (pvChangedIndicator.classList.contains("text-green-500")) return;
    pvChangedIndicator.classList.remove("text-transparent");
    pvChangedIndicator.classList.add("text-green-500");
    setTimeout(() => {
      pvChangedIndicator.classList.remove("text-green-500");
      pvChangedIndicator.classList.add("text-transparent");
    }, 2000);
  }

  return (
    <tr
      key={pv.human_readable_name}
      className="border-b border-blue-gray-200 transition duration-100 hover:bg-gray-100 hover:text-black"
    >
      <td className="py-1 px-4">
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

      <td className="py-1 px-4 ">
        <span id={pv.human_readable_name + "_VALUE"}>
          {pv.value} {pv.units != null && pv.units}
          {(pv.sp_value != undefined) && `(SP: ${pv.sp_value})`}{" "}
          <a
            href="https://github.com/ISISComputingGroup/ibex_user_manual/wiki/Blocks#alarms"
            className="text-red-600"
          >
            {pv.severity != "NONE" && pv.severity}
          </a>{" "}
        </span>
      </td>
      <td className="py-1 px-4 flex justify-between items-center">
        <span id={pv.human_readable_name + "_VALUE_RC"}>
          {pv.runcontrol_enabled && (pv.runcontrol_inrange ? "✅" : "❌")}
        </span>
        <svg
          id={pv.human_readable_name + "_CIRCLE"}
          className="min-w-2 min-h-2 max-w-2 max-h-2 transition-all text-transparent"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="12" />
        </svg>
      </td>
    </tr>
  );
}
