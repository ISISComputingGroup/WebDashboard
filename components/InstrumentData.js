import React from "react";
import TopBar from "./TopBar";
import Groups from "./Groups";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useWebSocket from "react-use-websocket";

export default function InstrumentData() {
  // set up the different states for the instrument data
  // const [socket, setSocket] = useState(null);

  const router = useRouter();
  const [slug, setSlug] = useState(null);
  const socketURL = process.env.NEXT_PUBLIC_WS_URL;
  const [instName, setInstName] = useState(null);



  const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketURL, {
    shouldReconnect: (closeEvent) => true
  })




  // useEffect(() => {


  //   // sub to config PV

  //   // based on config PV reload/set group/block data array and subscriptions

  //   //permanent subscriptions
  //   //dae shit
  //   //blocks

  //   //adhoc subscriptions
  //   //dictionary of pv names for blocks etc -> websocket last data




  // }, [router.query.slug]);

  const [monitoredPVs, setMonitoredPVs] = useState([]);

  const [instrument_name_upper, setInstrument_name_upper] = useState("");
  const CONFIG_DETAILS = "CS:BLOCKSERVER:GET_CURR_CONFIG_DETAILS";
  const [prefix, setPrefix] = useState("");

  useEffect(() => {

    if (!router.query.slug || !router.query.slug[0]) {
      return;
    }
    setInstrument_name_upper(a => {

      setSlug(router.query.slug);
      console.log(router.query.slug);
      setInstName(router.query.slug[0]);
      // TODO: use the instlist for this - it's not going to work for dev machines
      setPrefix(`IN:${router.query.slug[0].toUpperCase()}:`)

      return router.query.slug[0].toUpperCase();

    })


  }, [router.query.slug])




  useEffect(() => {

    if (!instrument_name_upper || !prefix) {
      return;
    }


    const topBarMap = new Map(
      Object.entries({
        [`${prefix}DAE:RUNSTATE`]: "Run state",
        [`${prefix}DAE:RUNNUMBER`]: "Run number",
        [`${prefix}DAE:STARTTIME`]: "Start number",
        [`${prefix}DAE:TITLE`]: "Title",
        [`${prefix}DAE:TITLE:DISPLAY`]: "",
        [`${prefix}DAE:GOODFRAMES`]: "",
        [`${prefix}DAE:GOODFRAMES_PD`]: "",
        [`${prefix}DAE:MONITORCOUNTS`]: "",
        [`${prefix}DAE:RUNDURATION`]: "",
        // [`${prefix}DAE:RUNDURATION_PD`]: "",
        [`${prefix}DAE:_USERNAME`]: "",
        [`${prefix}DAE:RAWFRAMES`]: "",
        // [`${prefix}DAE:RAWFRAMES_PD`]: "",
        // [`${prefix}DAE:PERIOD`]: "",
        // [`${prefix}DAE:NUMPERIODS`]: "",
        // [`${prefix}DAE:GOODUAH`]: "",
        // [`${prefix}DAE:GOODUAH_PD`]: "",
        // [`${prefix}DAE:COUNTRATE`]: "",
        // [`${prefix}DAE:NPRATIO`]: "",
        // [`${prefix}DAE:DAETIMINGSOURCE`]: "",
        // [`${prefix}DAE:PERIODTYPE`]: "",
        // [`${prefix}DAE:NUMTIMECHANNELS`]: "",
        // [`${prefix}DAE:DAEMEMORYUSED`]: "",
        // [`${prefix}DAE:NUMSPECTRA`]: "", 
        // [`${prefix}DAE:MONITORCOUNTS`]: "",
        // [`${prefix}DAE:PERIODSEQ`]: "",
        [`${prefix}DAE:BEAMCURRENT`]: "",
        [`${prefix}DAE:TOTALUAMPS`]: "",
        // [`${prefix}DAE:MEVENTS`]: "",
        // [`${prefix}DAE:TOTALDAECOUNTS`]: "",
        // [`${prefix}DAE:EVENTMODEFRACTION`]: "",
        // [`${prefix}DAE:EVENTMODEBUFUSED`]: "",
        // [`${prefix}DAE:MONITORSPECTRUM`]: "",
        // [`${prefix}DAE:MONITORFROM`]: "",
        // [`${prefix}DAE:MONITORTO`]: "",
        // [`${prefix}DAE:NUMSPECTRA`]: "",
        // [`${prefix}DAE:NUMTIMECHANNELS`]: "",
        // [`${prefix}DAE:RUNSTATE_STR`]: "",
        // [`${prefix}DAE:STATETRANS`]: "",
        // [`${prefix}DAE:STATE:CHANGING`]: "",
        // [`${prefix}DAE:STATETRANS:TIME`]: "",
        // [`${prefix}DAE:VETOSTATUS`]: "",
        // [`${prefix}DAE:VETOPC`]: "",
        // [`sim://sine`]: "",

      })
    );


    for (const pv of topBarMap.keys()) {
      // console.log("subscribing to " + pv)
      sendJsonMessage({ "type": "subscribe", "pvs": [pv] })

    }

    sendJsonMessage({ "type": "subscribe", "pvs": [`${prefix}${CONFIG_DETAILS}`] });

    sendJsonMessage({ "type": "subscribe", "pvs": [`${prefix}DAE:RUNSTATE_STR`] });

  }, [router.query.slug, sendJsonMessage, instrument_name_upper, prefix])

  useEffect(() => {

    if (!instrument_name_upper) {
      return;
    }


    // console.log(lastJsonMessage)
    if (lastJsonMessage !== null) {
      // console.log(lastJsonMessage)
      const updatedPV = lastJsonMessage;
      const updatedPVName = updatedPV.pv;
      let pvVal;
      if (updatedPV.value == null) {
        pvVal = updatedPV.text
      }
      else {
        pvVal = updatedPV.value


      }
      if (updatedPV.pv == `${prefix}${CONFIG_DETAILS}` && updatedPV.text != null) {
        let raw = updatedPV.text;

        fetch("/api/decompress", {
          method: 'POST', 
          body: raw
        }).then(response => console.log(response.text()))




        //TODO send API request to decompress here
        //TODO clear existing array for blocks
        //TODO reset subscriptions and setup new ones


      }


      setMonitoredPVs(prevMonitoredPVs => ({
        ...prevMonitoredPVs,
        [updatedPVName]: pvVal
      }));

      const pv = document.getElementById(updatedPVName + "_VALUE");

      if (!pv) return;

      // if pv already has a green bg, dont do anything
      if (pv.classList.contains("text-green-500")) return;
      pv.classList.remove("text-transparent");
      pv.classList.add(
        // "bg-green-500",
        // "transition-all",
        "text-green-500"
        // "duration-1000",
        // "ease-in-out",
        // "font-bold"
      );

      setTimeout(() => {
        // pv.classList.remove("bg-green-500");
        pv.classList.remove("text-green-500");
        pv.classList.add("text-transparent");
      }, 2000);

      // setMonitoredPVs(prevMonitoredPVs => ({
      //     ...prevMonitoredPVs,
      //     [updatedPVName]: pvVal
      // }));
    }
  }, [sendJsonMessage, lastJsonMessage, instrument_name_upper, prefix])


  if (!slug || !instName) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="p-8 w-full mx-auto max-w-7xl">
      <TopBar monitoredPVs={monitoredPVs} instName={instName} />
      <Groups />
    </div>
  );
}
