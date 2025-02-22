import {
  updateInstrumentRunstate,
  updateInstrumentRunstatePV,
  updateTargetStationBeamCurrent,
} from "@/app/wall/utils";
import { IfcInstrumentStatus, instListEntry, targetStation } from "@/app/types";

test("updateInstrumentRunstate returns new array with runstate of instrument changed", () => {
  const instrumentName = "anInstrumentName";
  const runStatePV = "AN:INST:DAE:RUNSTATE";
  const instrument: IfcInstrumentStatus = {
    name: instrumentName,
    runstatePV: runStatePV,
  };
  const original: targetStation = {
    targetStation: "Target station -1",
    instruments: [instrument],
  };
  const expectedValue = "RUNNING";
  expect(
    updateInstrumentRunstate([original], runStatePV, expectedValue)[0]
      .instruments[0].runstate,
  ).toBe(expectedValue);
});

test("updateTargetStationBeamCurrent returns new array with beam current of target station changed", () => {
  const beamCurrPv = "AC:TS123:BEAM:CURR";
  const original: targetStation = {
    targetStation: "Target station 123",
    beamCurrentPv: beamCurrPv,
    beamCurrent: 0.0,
  };
  const expectedValue = 3.14159265358979;
  expect(
    updateTargetStationBeamCurrent([original], beamCurrPv, expectedValue)[0]
      .beamCurrent,
  ).toBe(expectedValue);
});

test("updateInstrumentRunstate returns untouched array if runstate PV is not found", () => {
  const runStatePV = "AN:INST:DAE:RUNSTATE";
  const instrument: IfcInstrumentStatus = {
    name: "notThatInstrument",
    runstatePV: "BLAH",
  };
  const original: targetStation = {
    targetStation: "Target station 42",
    instruments: [instrument],
  };
  const expectedValue = "RUNNING";
  expect(
    updateInstrumentRunstate([original], runStatePV, expectedValue)[0]
      .instruments[0].runstate,
  ).toBe(undefined);
});

test("updateInstrumentRunstatePV returns untouched array if instrument is not found", () => {
  const runStatePvThatShouldNeverGetUsed = "INV:RUNSTATE";
  const mockSendJsonMessage = jest.fn();
  const invalidInstrument: instListEntry = {
    name: "invalidInstrument",
    groups: [],
    pvPrefix: "invalidPrefix",
    isScheduled: true,
    seci: false,
    hostName: "invalidHostname",
  };
  const original: targetStation = {
    targetStation: "Target station 3",
    instruments: [],
  };
  const returned = updateInstrumentRunstatePV(
    [original],
    invalidInstrument,
    runStatePvThatShouldNeverGetUsed,
    mockSendJsonMessage,
  );
  expect(returned[0].instruments.length).toBe(0);
  expect(mockSendJsonMessage).toHaveBeenCalledTimes(0);
});

test("updateInstrumentRunstatePV returns new array with runstate PV updated and subscribed to", () => {
  const runStatePvThatShouldGetUsed = "NEW:RUNSTATE";
  const mockSendJsonMessage = jest.fn();
  const inst: instListEntry = {
    name: "instrument",
    groups: [],
    pvPrefix: "prefix",
    isScheduled: true,
    seci: false,
    hostName: "hostname",
  };
  const original: targetStation = {
    targetStation: "Target station 4",
    instruments: [inst],
  };
  const returned = updateInstrumentRunstatePV(
    [original],
    inst,
    runStatePvThatShouldGetUsed,
    mockSendJsonMessage,
  );
  expect(returned[0].instruments.length).toBe(1);
  expect(returned[0].instruments[0].runstatePV).toBe(
    inst.pvPrefix + runStatePvThatShouldGetUsed,
  );
  expect(mockSendJsonMessage).toHaveBeenCalledTimes(1);
  expect(mockSendJsonMessage).toHaveBeenCalledWith({
    type: "subscribe",
    pvs: [inst.pvPrefix + runStatePvThatShouldGetUsed],
  });
});
