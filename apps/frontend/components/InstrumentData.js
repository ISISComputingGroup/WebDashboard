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
    this.visible = null;
    this.suspend_on_invald = null;
    this.low_rc = null;
    this.high_rc = null;
  }
}

class Instrument {
  constructor(instrumentName) {
    this.prefix = `IN:${instrumentName}:`;

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
  // const [socket, setSocket] = useState(null);

  const router = useRouter();
  const socketURL = process.env.NEXT_PUBLIC_WS_URL;
  const [instName, setInstName] = useState(null);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketURL, {
    shouldReconnect: (closeEvent) => true,
  });

  //   // sub to config PV

  //   // based on config PV reload/set group/block data array and subscriptions

  //   //permanent subscriptions
  //   //dae shit
  //   //blocks

  //   //adhoc subscriptions
  //   //dictionary of pv names for blocks etc -> websocket last data

  const [instrument_name_upper, setInstrument_name_upper] = useState("");
  const CONFIG_DETAILS = "CS:BLOCKSERVER:GET_CURR_CONFIG_DETAILS";
  const [currentInstrument, setCurrentInstrument] = useState(null);

  useEffect(() => {
    if (!router.query.slug || !router.query.slug[0]) {
      return;
    }
    setInstrument_name_upper((a) => {
      setInstName(router.query.slug[0]);

      let instrument = new Instrument(router.query.slug[0].toUpperCase());
      setCurrentInstrument(instrument);

      let prefix = `IN:${router.query.slug[0].toUpperCase()}:`;

      sendJsonMessage({
        type: "subscribe",
        pvs: [`${prefix}${CONFIG_DETAILS}`],
      });
      sendJsonMessage({
        type: "subscribe",
        pvs: [`${prefix}DAE:RUNSTATE_STR`],
      });
      for (const pv of instrument.topBarMap.keys()) {
        sendJsonMessage({ type: "subscribe", pvs: [pv] });
      }

      return router.query.slug[0].toUpperCase();
    });
  }, [router.query.slug, sendJsonMessage]);

  useEffect(() => {
    if (!lastJsonMessage) {
      return;
    }
    const updatedPV = lastJsonMessage;
    const updatedPVName = updatedPV.pv;

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
            sendJsonMessage({
              type: "subscribe",
              pvs: [
                currentInstrument.prefix +
                  "CS:SB:" +
                  completePV.human_readable_name,
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

      if (currentInstrument.topBarMap.has(updatedPVName)) {
        // This is a top bar PV

        const pv = currentInstrument.topBarMap.get(updatedPVName);
        const human_readable_name = pv[0];
        const col = pv[1];

        currentInstrument.topBarPVs.set(human_readable_name, [pvVal, col]);
      } else {
        // This is a block - check if in groups

        for (const group of currentInstrument.groups) {
          for (const block of group.blocks) {
            if (
              currentInstrument.prefix + "CS:SB:" + block.human_readable_name ==
              updatedPVName
            ) {
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
                block.units = updatedPV.units
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
            }
          }
        }
      }
    }
  }, [lastJsonMessage]);

  const [showHiddenBlocks, setShowHiddenBlocks] = useState(false);
  const onShowHiddenBlocksCheckboxChange = () => {
    setShowHiddenBlocks(!showHiddenBlocks);
  };

  if (!instName) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="p-8 w-full mx-auto max-w-7xl">
      <TopBar monitoredPVs={currentInstrument.topBarPVs} instName={instName} />
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
