import {
  IfcPVWSRequest,
  instListEntry,
  PVWSRequestType,
  targetStation,
} from "@/app/types";

/**
 * Copy the original array, update the given runstate PV's runstate value, then return the copied array.
 * @param prev the previous array of target stations, containing instruments.
 * @param updatedPVName the runstate PV address
 * @param updatedPVvalue the runstate
 */
export function updateInstrumentRunstate(
  prev: Array<targetStation>,
  updatedPVName: string,
  updatedPVvalue: string,
) {
  const newData: Array<targetStation> = [...prev];
  newData.forEach((targetStation) => {
    const foundInstrument = targetStation.instruments.find(
      (instrument) => instrument.runstatePV === updatedPVName,
    );
    if (foundInstrument) foundInstrument.runstate = updatedPVvalue;
  });
  return newData;
}

/**
 * Copy an original array then update an instrument's runstate PV, then subscribe to it. return the copied array.
 * @param prev the original array of target stations containing instrument runstate information
 * @param instListEntry the instrument to change
 * @param runstatePV the new runstate PV to update the array with and subscribe to
 * @param sendJsonMessage a callback to subscribe to the runstate PV
 */
export function updateInstrumentRunstatePV(
  prev: Array<targetStation>,
  instListEntry: instListEntry,
  runstatePV: string,
  sendJsonMessage: (a: IfcPVWSRequest) => void,
) {
  const newData: Array<targetStation> = [...prev];
  // Iterate through instruments in the instlist, get the runstate PV and subscribe
  newData.forEach((targetStation) => {
    const foundInstrument = targetStation.instruments.find(
      (instrument) => instrument.name === instListEntry.name,
    );
    if (foundInstrument) {
      foundInstrument.runstatePV = instListEntry.pvPrefix + runstatePV;
      foundInstrument.scienceGroups = instListEntry.groups;
      // Subscribe to the instrument's runstate PV
      sendJsonMessage({
        type: PVWSRequestType.subscribe,
        pvs: [foundInstrument.runstatePV],
      });
    }
  });
  return newData;
}
