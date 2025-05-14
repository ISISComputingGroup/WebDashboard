"use client";
import { IfcBlock } from "@/app/types";
import {useMemo, useState} from "react";
import GrafanaLink from "@/app/components/GrafanaLink";

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

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  const name = pv.human_readable_name;

  const [currentValue, setCurrentValue] = useState<
    string | number | undefined
  >();

  const [currentUnits, setCurrentUnits] = useState<string | null | undefined>();

  const [currentSeverity, setCurrentSeverity] = useState<string | null | undefined>();

  const [currentRuncontrolEnabled, setRuncontrolEnabled] = useState<boolean>();
  const [currentRuncontrolInrange, setRuncontrolInrange] = useState<boolean>();
  const [currentUpdateTime, setCurrentUpdateTime] = useState<number | undefined>();
  const [currentUpdateTimeString, setCurrentUpdateTimeString] = useState<string>();
  const [currentSp, setCurrentSp] = useState<string | number | undefined>();

  const [showAdvanced, setShowAdvanced] = useState(false);
  if (!pv.visible && !showHiddenBlocks) {
    return null;
  }
  if (pv.value != currentValue) {
    setCurrentValue(pv.value);
  }
  if (pv.units != currentUnits) {
    setCurrentUnits(pv.units);
  }
  if (pv.severity != currentSeverity) {
    setCurrentSeverity(pv.severity);
  }
  if (pv.runcontrol_enabled != currentRuncontrolEnabled) {
    setRuncontrolEnabled(pv.runcontrol_enabled);
  }
  if (pv.runcontrol_inrange != currentRuncontrolInrange) {
    setRuncontrolInrange(pv.runcontrol_inrange);
  }
  if (pv.updateSeconds != currentUpdateTime && pv.updateSeconds !== undefined) {
    setCurrentUpdateTime(pv.updateSeconds);
    setCurrentUpdateTimeString(new Date(pv.updateSeconds * 1000).toLocaleString());
  }
  if (pv.sp_value != currentSp) {
    setCurrentSp(pv.sp_value);
  }

  const minimum_date_to_be_shown = 631152000; // This is what PVWS thinks epoch time is for some reason. don't bother showing it as the instrument wasn't running EPICS on 01/01/1990
  return (
    <tr
      key={name}
      className="border-b border-blue-gray-200 transition duration-100 hover:bg-gray-100 hover:text-black"
      onClick={toggleAdvanced}
    >
      <GrafanaLink name={name} instName={instName} />

      <td className="py-1 px-2 w-7/12">
        <span id={name + "_VALUE_ROW"}>
          <div className="flex justify-between">
            <span
              id={name + "_VALUE"}
              className={currentSeverity != "NONE" ? "text-red-400" : ""}
            >
              {showAdvanced && "Readback: "}
              {currentValue} {currentUnits != null && currentUnits}
            </span>
          </div>

          {showAdvanced && (
            <div>
              <hr />
              {currentSeverity != "NONE" ? (
                <a
                  href="https://github.com/ISISComputingGroup/ibex_user_manual/wiki/Blocks#alarms"
                  className="text-red-400"
                  target="_blank"
                >
                  Alarm: {currentSeverity}
                </a>
              ) : null}
              <hr />
              {currentSp != null ? (
                <span id={name + "_SP"}>
                  {`Setpoint: ${currentSp}`}
                  <hr />
                </span>
              ) : null}
              {currentUpdateTime != null &&
              currentUpdateTime > minimum_date_to_be_shown ? (
                <span id={name + "_TIMESTAMP"}>
                  {`Last update: ${currentUpdateTimeString}`}
                </span>
              ) : null}
            </div>
          )}
        </span>
      </td>
      <td className="py-1 px-2  flex justify-between items-center">
        <span
          id={name + "_VALUE_RC"}
          title={"Run control in-range?"}
        >
          {currentRuncontrolEnabled && (currentRuncontrolInrange ? "✅" : "❌")}
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
