import React from "react";
import TopBar from "./TopBar";
import Groups from "./Groups";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function InstrumentData() {
  // set up the different states for the instrument data
  const [socket, setSocket] = useState(null);

  const router = useRouter();
  const [slug, setSlug] = useState(null);
  const socketURL = process.env.NEXT_PUBLIC_WS_URL;
  const [instName, setInstName] = useState(null);



  const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketURL, {
    shouldReconnect: (closeEvent) => true
  })




  useEffect(() => {
    if (!router.query.slug) {
      return;
    }
    setSlug(router.query.slug);
    console.log(router.query.slug);
    setInstName(router.query.slug[0]);

    // sub to config PV
    
    // based on config PV reload/set group/block data array and subscriptions

    

    //permanent subscriptions
    //dae shit
    //blocks

    //adhoc subscriptions
    //dictionary of pv names for blocks etc -> websocket last data


    
    // prefix - TODO move this to function
    const prefix = `IN:${this.inst_name.toUpperCase()}:`

    const CONFIG_DETAILS = "CS:BLOCKSERVER:GET_CURR_CONFIG_DETAILS";
    
    const perm_pvs = [
      `${prefix}${CONFIG_DETAILS}`,
      `${prefix}DAE:RUNSTATE`,
      // all the other dae/topbar pvs here
    ]


    sendJsonMessage({ "type": "subscribe", "pvs": perm_pvs })

    useEffect(() => {
      if (lastJsonMessage !== null) {
          const updatedPV = lastJsonMessage;
          const updatedPVName = updatedPV.pv;
          let pvVal;
          if (updatedPV.value == null) {
              pvVal = updatedPV.text
          }
           else {
          pvVal = updatedPV.value
      }
      if (updatedPV.pv == `${prefix}${CONFIG_DETAILS}` && updatedPV.text != null){
          let raw = updatedPV.text;

          
          //TODO send API request to decompress here
          //TODO clear existing array for blocks
          //TODO reset subscriptions and setup new ones


      }

      setMonitoredPVs(prevMonitoredPVs => ({
          ...prevMonitoredPVs,
          [updatedPVName]: pvVal
      }));
          }
  }, [lastJsonMessage])




      


    return () => {
      socket?.disconnect();
    };
  }, [router.query.slug]);

  if (!socket || !slug || !instName) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="p-8 w-full mx-auto max-w-7xl">
      <TopBar socket={socket} instName={instName} />
      <Groups socket={socket} />
    </div>
  );
}
