"use client"
import React from "react";
import TopBar from "./TopBar";
import Groups from "./Groups";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { dehex_and_decompress } from "./dehex_and_decompress";
import { Instrument } from "./Instrument";
import {PV} from "./PV";

let lastUpdate = "";

export default function InstrumentData({instrumentName}) {
  // set up the different states for the instrument data

  const socketURL = process.env.NEXT_PUBLIC_WS_URL;

  const instName = instrumentName ;

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketURL, {
    shouldReconnect: (closeEvent) => true,
  });

  const CONFIG_DETAILS = "CS:BLOCKSERVER:GET_CURR_CONFIG_DETAILS";
  const [instlist, setInstlist] = useState(null);
  const [currentInstrument, setCurrentInstrument] = useState(null);

  useEffect(() => {
    sendJsonMessage({
      type: "subscribe",
      pvs: ["CS:INSTLIST"],
    });


    if (instName == "" || instName == null || instlist == null ) {
      return;
    }

    let prefix = "";

    for (const item of instlist) {
      if (item["name"] == instName.toUpperCase()) {
        prefix = item["pvPrefix"];
      }
    }
    if (!prefix) {
      // not on the instlist, or the instlist is not available. Try to guess it's a developer machine
      prefix = "TE:" + instName.toUpperCase() + ":";
    }

    if (!currentInstrument) {
      let instrument = new Instrument(prefix);
      setCurrentInstrument(instrument);

      sendJsonMessage({
        type: "subscribe",
        pvs: [`${prefix}${CONFIG_DETAILS}`],
      });

      // subscribe to the top bar (column 0) PVs
      for (const pv of instrument.columnZeroPVs.keys()) {
        sendJsonMessage({ type: "subscribe", pvs: [pv] });
      }

      // subscribe to top bar label PVs
      for (const pv of instrument.dictLongerInstPVs.keys()) {
        sendJsonMessage({ type: "subscribe", pvs: [pv] });
      }

      // subscribe to run info PVs
      for (const pv of instrument.runInfoMap.keys()) {
        sendJsonMessage({ type: "subscribe", pvs: [pv] });
      }
    }
  }, [instlist, instName, sendJsonMessage, currentInstrument]);

  useEffect(() => {
    if (!lastJsonMessage) {
      return;
    }
    const updatedPV = lastJsonMessage;
    const updatedPVName = updatedPV.pv;

    if (updatedPVName == "CS:INSTLIST" && updatedPV.text != null) {
      setInstlist(JSON.parse(dehex_and_decompress(updatedPV.text)));
    }

    if (!currentInstrument) {
      return;
    }

    if (
      updatedPVName == `${currentInstrument.prefix}${CONFIG_DETAILS}` &&
      updatedPV.text != null
    ) {
      // config change, reset instrument groups
      if (updatedPV.text == lastUpdate) {
        //config hasnt actually changed
        return;
      }
      lastUpdate = updatedPV.text;

      console.log("config changed");
      let raw = updatedPV.text;

      const res = dehex_and_decompress(raw);
      const response = JSON.parse(res);

      //parse it here
      //create PV objects for currentinstrument.groups
      //subscribe to pvs
      const ConfigOutput = response;
      const blocks = ConfigOutput.blocks;
      const groups = ConfigOutput.groups;

      currentInstrument.groups = [];

      if (groups) {
        for (const group of groups) {
          const groupName = group.name;
          const groupBlocks = group.blocks;

          currentInstrument.groups.push({
            name: groupName,
            blocks: [],
          });

          for (const block of groupBlocks) {
            const newBlock = blocks.find((b) => b.name === block);

            const completePV = new PV(newBlock.pv);
            completePV.human_readable_name = newBlock.name;
            completePV.runcontrol_enabled = newBlock.runcontrol;
            completePV.low_rc = newBlock.lowlimit;
            completePV.high_rc = newBlock.highlimit;
            completePV.visible = newBlock.visible;

            currentInstrument.groups[
              currentInstrument.groups.length - 1
            ].blocks.push(completePV);
            const block_address =
              currentInstrument.prefix +
              "CS:SB:" +
              completePV.human_readable_name;
            sendJsonMessage({
              type: "subscribe",
              pvs: [
                block_address,
                block_address + ":RC:ENABLE",
                block_address + ":RC:INRANGE",
              ],
            });
          }
        }
      }
    } else {
      let pvVal;
      if (updatedPV.text != null) {
        //string
        pvVal = updatedPV.text;
      } else if (updatedPV.value != null) {
        //anything else
        pvVal = updatedPV.value;
      } else {
        return;
      }

      if (currentInstrument.dictLongerInstPVs.has(updatedPVName)) {
        // This is a top bar label PV
        if (!currentInstrument.topBarPVs.has(updatedPVName) && updatedPV.text) {
          let prefixRemoved = updatedPVName.split(
            currentInstrument.dashboard_prefix
          )[1];
          let row = prefixRemoved[0];
          let col = prefixRemoved[2];
          currentInstrument.topBarPVs.set(updatedPVName, [
            row,
            col,
            updatedPV.text,
            null,
          ]);
          // first update, lets now subscribe to the 'value' part of the dashboard label
          let value_pv = currentInstrument.dictLongerInstPVs.get(updatedPVName);
          sendJsonMessage({
            type: "subscribe",
            pvs: [value_pv],
          });
        }
      } else if (currentInstrument.columnZeroPVs.has(updatedPVName)) {
        // this is a top bar column zero value
        const row = updatedPVName.endsWith("TITLE") ? 0 : 1; // if title, column 1
        currentInstrument.topBarPVs.set(updatedPVName, [
          row,
          0,
          currentInstrument.columnZeroPVs.get(updatedPVName),
          updatedPV.text,
        ]);
      } else if (
        Array.from(currentInstrument.dictLongerInstPVs.values()).includes(
          updatedPVName
        )
      ) {
        // this is a top bar value
        for (const [labelPV, valuePV] of currentInstrument.dictLongerInstPVs) {
          if (valuePV == updatedPVName) {
            currentInstrument.topBarPVs.get(labelPV)[3] = updatedPV.text;
          }
        }
      } else if (currentInstrument.runInfoMap.has(updatedPVName)) {
        currentInstrument.runInfoPVs.set(
          currentInstrument.runInfoMap.get(updatedPVName),
          pvVal
        );
      } else {
        // This is a block - check if in groups

        for (const group of currentInstrument.groups) {
          for (const block of group.blocks) {
            let block_full_pv_name =
              currentInstrument.prefix + "CS:SB:" + block.human_readable_name;
            if (updatedPVName == block_full_pv_name) {
              let prec = updatedPV.precision;

              if (prec != null && prec > 0 && !block.precision) {
                // this is likely the first update, and contains precision information which is not repeated on a normal value update - store this in the block for later truncation (see below)
                block.precision = prec;
              }

              if (block.precision && typeof pvVal == "number") {
                // if a block has precision truncate it here
                block.value = pvVal.toPrecision(block.precision);
              } else {
                block.value = pvVal;
              }

              if (updatedPV.units) {
                block.units = updatedPV.units;
              }

              if (updatedPV.severity) {
                block.severity = updatedPV.severity;
              }

              const pv = document.getElementById(
                block.human_readable_name + "_CIRCLE"
              );

              if (!pv) return;

              if (pv.classList.contains("text-green-500")) return;
              pv.classList.remove("text-transparent");
              pv.classList.add("text-green-500");

              setTimeout(() => {
                pv.classList.remove("text-green-500");
                pv.classList.add("text-transparent");
              }, 2000);
            } else if (updatedPVName == block_full_pv_name + ":RC:INRANGE") {
              block.runcontrol_inrange = updatedPV.value == 1;
              return;
            } else if (updatedPVName == block_full_pv_name + ":RC:ENABLE") {
              block.runcontrol_enabled = updatedPV.value == 1;
              return;
            }
          }
        }
      }
    }
  }, [lastJsonMessage, currentInstrument, sendJsonMessage]);

  const [showHiddenBlocks, setShowHiddenBlocks] = useState(false);
  const onShowHiddenBlocksCheckboxChange = () => {
    setShowHiddenBlocks(!showHiddenBlocks);
  };

  if (!instName || instName==null|| !currentInstrument) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="p-8 w-full mx-auto max-w-7xl">
      <TopBar
        monitoredPVs={currentInstrument.topBarPVs}
        instName={instName}
        runInfoPVs={currentInstrument.runInfoPVs}
      />
      <Groups
        groupsMap={currentInstrument.groups}
        instName={instName}
        showHiddenBlocks={showHiddenBlocks}
      />
      <div className="pt-4">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showHiddenBlocks}
            onChange={onShowHiddenBlocksCheckboxChange}
            className="sr-only peer"
          />
          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-900">
            Show hidden blocks?
          </span>
        </label>
      </div>
    </div>
  );
}
