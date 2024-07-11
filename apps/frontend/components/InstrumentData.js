import React from "react";
import TopBar from "./TopBar";
import Groups from "./Groups";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useWebSocket from "react-use-websocket";
import { dehex_and_decompress } from "./dehex_and_decompress";

class PV {
  constructor(pvaddress) {
    this.pvaddress = pvaddress;
    this.human_readable_name = null;
    this.severity = null;
    this.units = null;
    this.description = null;
    this.precision = null;
    this.min = null;
    this.max = null;
    this.warn_low = null;
    this.warn_high = null;
    this.alarm_low = null;
    this.alarm_high = null;
    this.value = null;
    this.runcontrol_enabled = null;
    this.runcontrol_inrange = null;
    this.visible = null;
    this.suspend_on_invald = null;
    this.low_rc = null;
    this.high_rc = null;
  }
}

const DASHBOARD = "CS:DASHBOARD:TAB:"

class Instrument {
  constructor(prefix) {
    this.prefix = prefix;
    this.dashboard_prefix = `${this.prefix}${DASHBOARD}`

    this.columnZeroPVs = new Map(
      Object.entries({
        [`${this.prefix}DAE:TITLE`]: "Title:",
        [`${this.prefix}DAE:_USERNAME`]: "Users:",
      })
    )

    this.dictLongerInstPVs = new Map(
      Object.entries({
      [`${this.dashboard_prefix}1:1:LABEL`] : `${this.dashboard_prefix}1:1:VALUE`,
      [`${this.dashboard_prefix}2:1:LABEL`] : `${this.dashboard_prefix}2:1:VALUE`,
      [`${this.dashboard_prefix}3:1:LABEL`] : `${this.dashboard_prefix}3:1:VALUE`,
      [`${this.dashboard_prefix}1:2:LABEL`] : `${this.dashboard_prefix}1:2:VALUE`,
      [`${this.dashboard_prefix}2:2:LABEL`] : `${this.dashboard_prefix}2:2:VALUE`,
      [`${this.dashboard_prefix}3:2:LABEL`] : `${this.dashboard_prefix}3:2:VALUE`,
  }))

    // PV name: [human readable name, column in top bar(null is monitor but don't show)]
    this.topBarMap = new Map(
      Object.entries({
        [`${this.prefix}CS:BLOCKSERVER:CURR_CONFIG_NAME`]: [
          "Config name",
          null,
        ],
        [`${this.prefix}DAE:RUNSTATE`]: ["Run state", null],
        [`${this.prefix}DAE:RUNSTATE_STR`]: ["Run state STR", null],
        [`${this.prefix}DAE:RUNNUMBER`]: ["Run number", null],
        [`${this.prefix}DAE:STARTTIME`]: ["Start number", null],
        [`${this.prefix}DAE:TITLE`]: ["Title", 0],
        [`${this.prefix}DAE:_USERNAME`]: ["Users", 0],

        [`${this.prefix}DAE:GOODFRAMES`]: ["Good frames", 1],
        [`${this.prefix}DAE:RAWFRAMES`]: ["Raw frames", 1],
        [`${this.prefix}DAE:BEAMCURRENT`]: ["Current(uamps)", 1],
        [`${this.prefix}DAE:TOTALUAMPS`]: ["Total(uamps)", 1],
        [`${this.prefix}DAE:MONITORCOUNTS`]: ["Monitor counts", 1],

        [`${this.prefix}DAE:STARTTIME`]: ["Start time", 2],
        [`${this.prefix}DAE:RUNDURATION_PD`]: ["Run time", 2],
        [`${this.prefix}DAE:PERIOD`]: ["Period", 2],
        [`${this.prefix}DAE:NUMPERIODS`]: ["Num periods", 2],

        [`sim://sine`]: ["sine", null],
        [`CS:INSTLIST`]: ["instlist", null],
      })
    );

    this.topBarPVs = new Map();

    this.groups = [];
    this.configname = null;
  }
}

let lastUpdate = "";

export default function InstrumentData() {
  // set up the different states for the instrument data

  const router = useRouter();
  const socketURL = process.env.NEXT_PUBLIC_WS_URL;
  const [instName, setInstName] = useState(null);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketURL, {
    shouldReconnect: (closeEvent) => true,
  });

  const CONFIG_DETAILS = "CS:BLOCKSERVER:GET_CURR_CONFIG_DETAILS";
  const [instlist, setInstlist] = useState(null);
  const [currentInstrument, setCurrentInstrument] = useState(null);

  useEffect(() => {
    if (!router.query.slug || !router.query.slug[0]) {
      return;
    }

    setInstName(router.query.slug[0]);

    sendJsonMessage({
      type: "subscribe",
      pvs: ["CS:INSTLIST"],
    });

  }, [router.query.slug, sendJsonMessage]);


  useEffect(() => {
    if (!instName) {
      return;
    }

    if (instlist == null) {
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

      for (const pv of instrument.columnZeroPVs.keys()){
        sendJsonMessage({ type: "subscribe", pvs: [pv] });
      }

      // subscribe to top bar label PVs 
      for (const pv of instrument.dictLongerInstPVs.keys()) {
        sendJsonMessage({ type: "subscribe", pvs: [pv] });
      }


    }
  }, [instlist, instName, sendJsonMessage]);

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
            const block_address = currentInstrument.prefix + "CS:SB:" + completePV.human_readable_name;
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
          let prefixRemoved = updatedPVName.split(currentInstrument.dashboard_prefix)[1]
          let row = prefixRemoved[0]
          let col = prefixRemoved[2]
          currentInstrument.topBarPVs.set(updatedPVName, [row, col, updatedPV.text, null]);
          // first update, lets now subscribe to the 'value' part of the dashboard label
          let value_pv = currentInstrument.dictLongerInstPVs.get(updatedPVName)
          sendJsonMessage({
            type: "subscribe",
            pvs: [
              value_pv
            ],
          });
        }
      } else if (currentInstrument.columnZeroPVs.has(updatedPVName)) {
        // this is a top bar column zero value
        const row = updatedPVName.endsWith("TITLE") ? 0 : 1; // if title, column 1
        currentInstrument.topBarPVs.set(updatedPVName, [row, 0, currentInstrument.columnZeroPVs.get(updatedPVName), updatedPV.text]);
      } else if(Array.from(currentInstrument.dictLongerInstPVs.values()).includes(updatedPVName)) {
        // this is a top bar value
        for (const [labelPV, valuePV] of currentInstrument.dictLongerInstPVs) {
          if (valuePV == updatedPVName){
            currentInstrument.topBarPVs.get(labelPV)[3] = updatedPV.text;
          }
        }

      } else {
        // This is a block - check if in groups

        for (const group of currentInstrument.groups) {
          for (const block of group.blocks) {
            let block_full_pv_name = currentInstrument.prefix + "CS:SB:" + block.human_readable_name
            if (updatedPVName == block_full_pv_name) {
              let prec = updatedPV.precision;

              if (prec != null && prec > 0 && !block.precision) {
                // this is likely the first update, and contains precision information - store this in the block for later truncation (see below)
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
            }
            else if (updatedPVName == block_full_pv_name + ":RC:ENABLE") {
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

  if (!instName || !currentInstrument) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="p-8 w-full mx-auto max-w-7xl">
      <TopBar monitoredPVs={currentInstrument.topBarPVs} instName={instName} configName={currentInstrument.configName} runStateStr={currentInstrument.runStateStr} />
      <Groups
        groupsMap={currentInstrument.groups}
        instName={instName}
        showHiddenBlocks={showHiddenBlocks}
      />
      <div className="pt-4">
        <label class="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showHiddenBlocks}
            onChange={onShowHiddenBlocksCheckboxChange}
            class="sr-only peer"
          />
          <div class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span class="ms-3 text-sm font-medium text-gray-900">
            Show hidden blocks?
          </span>
        </label>
      </div>
    </div>
  );
}
