import React from "react";
import TopBar from "./TopBar";
import Groups from "./Groups";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useWebSocket from "react-use-websocket";


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
    this.low_rc= null;
    this.high_rc = null;

  }
}

class Instrument { 
  constructor(instrumentName) {

    this.prefix = `IN:${instrumentName}:`


    this.topBarMap = new Map(
      Object.entries({
        [`${this.prefix}DAE:RUNSTATE`]: "Run state",
        [`${this.prefix}DAE:RUNNUMBER`]: "Run number",
        [`${this.prefix}DAE:STARTTIME`]: "Start number",
        [`${this.prefix}DAE:TITLE`]: "Title",
        [`${this.prefix}DAE:GOODFRAMES`]: "a",
        [`${this.prefix}DAE:GOODFRAMES_PD`]: "v",
        [`${this.prefix}DAE:MONITORCOUNTS`]: "s",
        [`${this.prefix}DAE:RUNDURATION`]: "d",
        [`${this.prefix}DAE:_USERNAME`]: "e",
        [`${this.prefix}DAE:RAWFRAMES`]: "gh",
        [`${this.prefix}DAE:BEAMCURRENT`]: "d",
        [`${this.prefix}DAE:TOTALUAMPS`]: "total uamps",
        [`sim://sine`]: "sine",

      })
    );

    this.topBarPVs = new Map();

    this.groups = [];
    this.configname =  null;
  }

}

export default function InstrumentData() {
  // set up the different states for the instrument data
  // const [socket, setSocket] = useState(null);

  const router = useRouter();
  const socketURL = process.env.NEXT_PUBLIC_WS_URL;
  const [instName, setInstName] = useState(null);



  const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketURL, {
    shouldReconnect: (closeEvent) => true
  })

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
    setInstrument_name_upper(a => {

      console.log(router.query.slug);
      setInstName(router.query.slug[0]);

      let instrument = new Instrument(router.query.slug[0].toUpperCase())
      setCurrentInstrument(instrument)

      let prefix = `IN:${router.query.slug[0].toUpperCase()}:`

      sendJsonMessage({ "type": "subscribe", "pvs": [`${prefix}${CONFIG_DETAILS}`] });
      sendJsonMessage({ "type": "subscribe", "pvs": [`${prefix}DAE:RUNSTATE_STR`] });
      for (const pv of instrument.topBarMap.keys()) {
        sendJsonMessage({ "type": "subscribe", "pvs": [pv] })
  
      }

      return router.query.slug[0].toUpperCase();

    })

  }, [router.query.slug, sendJsonMessage])



  useEffect(() => {

    if (!lastJsonMessage) {
      return;
    }
      const updatedPV = lastJsonMessage;
      const updatedPVName = updatedPV.pv;


      if (updatedPVName == `${currentInstrument.prefix}${CONFIG_DETAILS}` && updatedPV.text != null) {
        let raw = updatedPV.text;

        fetch("/api/decompress", {
          method: 'POST', 
          body: raw
        }).then(response => response.json())
        .then(response => {
          //parse it here
          //create PV objects for currentinstrument.groups
            //subscribe to pvs
        const ConfigOutput = response;
        // console.log(response)
          const blocks = ConfigOutput.blocks;
      const groups = ConfigOutput.groups;
      
          // console.log(groups)

     
      // console.log(currentInstrument);

      // console.log(groups)

      currentInstrument.groups = [];

      for (const group of groups) {
        const groupName = group.name;
        const groupBlocks = group.blocks;
        // const groupComponent = group.component


        currentInstrument.groups.push({
          name: groupName,
          blocks: [],
        });

        // console.log(currentInstrument)

        for (const block of groupBlocks) {
          // console.log("Block:", block);
          const newBlock = blocks.find((b) => b.name === block);
          // console.log("NewBlock:", newBlock);

          const completePV = new PV(newBlock.pv);
          completePV.human_readable_name = newBlock.name;
          completePV.runcontrol_enabled = newBlock.runcontrol;
          completePV.low_rc = newBlock.lowlimit;
          completePV.high_rc = newBlock.highlimit;
          completePV.visible = newBlock.visible;

          currentInstrument.groups[currentInstrument.groups.length - 1].blocks.push(completePV);
          sendJsonMessage({ "type": "subscribe", "pvs": [currentInstrument.prefix + "CS:SB:" + completePV.human_readable_name] })
        }

        

      }

        })
      } else {

        let pvVal;
      if (updatedPV.value == null) {
        pvVal = updatedPV.text
      }
      else {
        pvVal = updatedPV.value
      }

      if (pvVal) {


      if (currentInstrument.topBarMap.has(updatedPVName)) {
        // This is a top bar PV
        const human_readable_name = currentInstrument.topBarMap.get(updatedPVName)
        currentInstrument.topBarPVs[human_readable_name] = pvVal;
        
      } else { 
        //check if in groups

        // console.log(currentInstrument.groups)

        // consol

        for (const group of currentInstrument.groups) {
          // console.log(group)
          for (const block of group.blocks) {

            console.log("block: " + block.human_readable_name + "updatedpvname: " + updatedPVName )
            if (currentInstrument.prefix + "CS:SB:" + block.human_readable_name == updatedPVName) {
              console.log("got here")
              block.value = pvVal

              const pv = document.getElementById(block.human_readable_name + "_CIRCLE");

              if (!pv) return;
        
              if (pv.classList.contains("text-green-500")) return;
              pv.classList.remove("text-transparent");
              pv.classList.add(
        
                "text-green-500"
        
              );
        
              setTimeout(() => {
                pv.classList.remove("text-green-500");
                pv.classList.add("text-transparent");
              }, 2000);


            }
          }

        }



      }

      


    }
      
      }


      

    
  }, [lastJsonMessage])


  if (!instName) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="p-8 w-full mx-auto max-w-7xl">
      <TopBar monitoredPVs={currentInstrument.topBarPVs} instName={instName} />
      <Groups groupsMap={currentInstrument.groups} />
    </div>
  );
}
