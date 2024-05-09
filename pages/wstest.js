import React, { Fragment, useCallback, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";




export default function wstest() {

    const { sendJsonMessage, lastJsonMessage } = useWebSocket("ws://localhost:8080/pvws/pv", {
        shouldReconnect: (closeEvent) => true
    })

    const instrumentNames = [
        "imat",
        "inter",
        "let",
        "sandals",
        "polref",
        "larmor",
        "wish",
        "enginx",
        "gem",
        "ines",
        "pearl",
        "polaris",
        "alf",
        "crisp",
        "loq",
        "sans2d",
        "offspec",
        "surf",
        "zoom",
        "iris",
        // "iris_setup",
        "osiris",
        "tosca",
        "vesuvio",
        "emu",
        "musr",
        "nimrod",
        "wish_setup",
        "chronus",
        "motion",
        "maps",
        "merlin",
        "scidemo",
        "rikenfe",
        "muonfe",
      ];


    
class Instrument {
    /**
     * Instrument object containing the map of instrument PVs
     * @param {*} name
     */
    constructor(name) {
      this.inst_name = name;
      this.prefix = `IN:${this.inst_name.toUpperCase()}:`;
  
      this.topBarMap = new Map(
        Object.entries({
          [`${this.prefix}DAE:RUNSTATE`]: true,
          [`${this.prefix}DAE:RUNNUMBER`]: false,
          [`${this.prefix}DAE:IRUNNUMBER`]: false,
          [`${this.prefix}DAE:STARTTIME`]: false,
          [`${this.prefix}DAE:TITLE`]: false,
          [`${this.prefix}DAE:TITLE:DISPLAY`]: false,
          [`${this.prefix}DAE:GOODFRAMES`]: false,
          [`${this.prefix}DAE:GOODFRAMES_PD`]: false,
          [`${this.prefix}DAE:MONITORCOUNTS`]: false,
          [`${this.prefix}DAE:RUNDURATION`]: false,
          [`${this.prefix}DAE:RUNDURATION_PD`]: false,
          [`${this.prefix}DAE:_USERNAME`]: false,
          [`${this.prefix}DAE:_USERNAME:SP`]: false,
          [`${this.prefix}DAE:_USERNAME:SP:RBV`]: false,
          [`${this.prefix}DAE:RAWFRAMES`]: false,
          [`${this.prefix}DAE:RAWFRAMES_PD`]: false,
          [`${this.prefix}DAE:PERIOD`]: false,
          [`${this.prefix}DAE:NUMPERIODS`]: false,
          [`${this.prefix}DAE:GOODUAH`]: false,
          [`${this.prefix}DAE:GOODUAH_PD`]: false,
          [`${this.prefix}DAE:COUNTRATE`]: false,
          [`${this.prefix}DAE:NPRATIO`]: false,
          [`${this.prefix}DAE:DAETIMINGSOURCE`]: false,
          [`${this.prefix}DAE:PERIODTYPE`]: false,
        //   [`${this.prefix}CS:BLOCKSERVER:GET_CURR_CONFIG_DETAILS`]: false,

        //   [`${this.prefix}DAE:NUMTIMECHANNELS`]: false,
        //   [`${this.prefix}DAE:DAEMEMORYUSED`]: false,
        //   [`${this.prefix}DAE:NUMSPECTRA`]: false, 
        //   [`${this.prefix}DAE:MONITORCOUNTS`]: false,
        //   [`${this.prefix}DAE:PERIODSEQ`]: false,
        //   [`${this.prefix}DAE:BEAMCURRENT`]: false,
        //   [`${this.prefix}DAE:TOTALUAMPS`]: false,
        //   [`${this.prefix}DAE:MEVENTS`]: false,
        //   [`${this.prefix}DAE:TOTALDAECOUNTS`]: false,
        //   [`${this.prefix}DAE:EVENTMODEFRACTION`]: false,
        //   [`${this.prefix}DAE:EVENTMODEBUFUSED`]: false,
        //   [`${this.prefix}DAE:MONITORSPECTRUM`]: false,
        //   [`${this.prefix}DAE:MONITORFROM`]: false,
        //   [`${this.prefix}DAE:MONITORTO`]: false,
        //   [`${this.prefix}DAE:NUMSPECTRA`]: false,
        //   [`${this.prefix}DAE:NUMTIMECHANNELS`]: false,
        //   [`${this.prefix}DAE:RUNSTATE_STR`]: false,

        //   [`${this.prefix}DAE:STATETRANS`]: false,

        //   [`${this.prefix}DAE:STATE:CHANGING`]: false,

        //   [`${this.prefix}DAE:STATETRANS:TIME`]: false,

        // //   [`${this.prefix}DAE:VETOSTATUS`]: false,
        //   [`${this.prefix}DAE:VETOPC`]: false,
        //   [`${this.prefix}DAE:ALLMSGS`]: false,
        //   [`${this.prefix}DAE:SPECTRA_FILE`]: false,
        //   [`${this.prefix}DAE:DETECTOR_FILE`]: false,
        //   [`${this.prefix}DAE:WIRING_FILE`]: false,
        //   [`${this.prefix}DAE:ERRMSGS`]: false,
        //   [`${this.prefix}DAE:WIRING_DIR`]: false,
        //   [`${this.prefix}DAE:WIRINGTABLES`]: false,

        })
      );
    }
}

const instruments = [];

for (var inst of instrumentNames) {
    // add all monitors here with callbacks that may do something
    instruments.push(new Instrument(inst));
  }

  const allpvs = [];
  for (var inst of instruments) {
    for (var pv of inst.topBarMap.keys()) {
        allpvs.push(pv);
    }
  }
  



//   allpvs.push("sim://sine")

  console.log(allpvs.length);

  let raw = allpvs.at(0);



  
    useEffect(() => {
        for (pv of allpvs) {
        sendJsonMessage({ "type": "subscribe", "pvs": [pv] })
        }
    }, [sendJsonMessage])

    const [monitoredPVs, setMonitoredPVs] = useState([])

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
        // if (updatedPV.pv == "IN:IMAT:CS:BLOCKSERVER:GET_CURR_CONFIG_DETAILS" && updatedPV.text != null){
        //     let raw = updatedPV.text;
        //     console.log(raw)
        //     let toascii = Buffer.from(raw, 'hex');
        //     console.log("TO ASCII:")
        //     console.log(toascii);


        // }

        setMonitoredPVs(prevMonitoredPVs => ({
            ...prevMonitoredPVs,
            [updatedPVName]: pvVal
        }));
            }
    }, [lastJsonMessage])

    
    
    
  return (
    <main
      className={`flex min-h-screen bg-black-100 flex-col items-center justify-between`}
    >
{/* <p className="text-xl">
    {JSON.stringify(monitoredPVs)}
</p> */}
<table>
        <thead>
          <tr className="bg-blue-gray-100 text-gray-100">
            <th className="py-3 px-4 text-left">PV Name</th>
            <th className="py-3 px-4 text-left">Value</th>
          </tr>
        </thead>
<tbody className="text-gray-200 ">
    
{Object.entries(monitoredPVs).map(([name, value]) => (
  <tr key={name} className="hover:bg-gray-100 hover:text-black">
    <td className="py-1 px-4">{name}</td>
    <td className="py-1 px-4">{value}</td>
  </tr>
))}
        </tbody>
        </table>


    </main>
  )

};

