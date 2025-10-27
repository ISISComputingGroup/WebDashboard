import { createInstrumentGroups } from "@/app/components/InstrumentsDisplay";
import { instList } from "@/app/types";

test("createInstrumentGroups adds two instruments from different target stations to the same science group", () => {
  const instrument1Name = "INST1";
  const instrument2Name = "INST2";
  const commonScienceGroup = "MOLSPEC";
  const instrument1 = {
    name: instrument1Name,
    groups: [commonScienceGroup],
    targetStation: "TS0",
    hostName: "",
    pvPrefix: "",
    isScheduled: true,
    seci: false,
    runStatePV: "",
    runStateValue: "",
  };
  const instrument2 = {
    name: instrument2Name,
    groups: [commonScienceGroup],
    targetStation: "TS0",
    hostName: "",
    pvPrefix: "",
    isScheduled: true,
    seci: false,
    runStatePV: "",
    runStateValue: "",
  };
  const targetStations: instList = [instrument1, instrument2];
  const result = createInstrumentGroups(targetStations);

  expect(result.get(commonScienceGroup)!.sort()).toStrictEqual(
    [instrument1, instrument2].sort(),
  );
});

test("createInstrumentGroups ignores instrument without any groups", () => {
  const instrument1Name = "INST1";
  const commonScienceGroup = "MOLSPEC";
  const instrument1 = {
    name: instrument1Name,
    groups: [commonScienceGroup],
    targetStation: "TS0",
    hostName: "",
    pvPrefix: "",
    isScheduled: true,
    seci: false,
    runStatePV: "",
    runStateValue: "",
  };
  const instrument2 = {
    name: "someinstrumentwithnogroups",
    targetStation: "TS0",
    hostName: "",
    pvPrefix: "",
    isScheduled: true,
    seci: false,
    runStatePV: "",
    runStateValue: "",
    groups: [],
  };
  const targetStations: instList = [instrument1, instrument2];
  const result = createInstrumentGroups(targetStations);

  expect(result.get(commonScienceGroup)!.sort()).toStrictEqual(
    [instrument1].sort(),
  );
});

test("createInstrumentGroups ignores instrument which is a support machine", () => {
  const instrument1Name = "INST1";
  const commonScienceGroup = "MOLSPEC";
  const instrument1 = {
    name: instrument1Name,
    groups: [commonScienceGroup],
    targetStation: "TS0",
    hostName: "",
    pvPrefix: "",
    isScheduled: true,
    seci: false,
    runStatePV: "",
    runStateValue: "",
  };
  const instrument2 = {
    name: "someinstrumentwithnogroups",
    groups: ["SUPPORT"],
    targetStation: "TS3",
    hostName: "",
    pvPrefix: "",
    isScheduled: true,
    seci: false,
    runStatePV: "",
    runStateValue: "",
  };
  const targetStations: instList = [instrument1, instrument2];
  const result = createInstrumentGroups(targetStations);

  expect(result.get(commonScienceGroup)!.sort()).toStrictEqual(
    [instrument1].sort(),
  );
});
