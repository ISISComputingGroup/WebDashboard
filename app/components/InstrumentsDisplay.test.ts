import { createInstrumentGroups } from "@/app/components/InstrumentsDisplay";
import { targetStation } from "@/app/types";

test("createInstrumentGroups adds two instruments from different target stations to the same science group", () => {
  const instrument1Name = "INST1";
  const instrument2Name = "INST2";
  const commonScienceGroup = "MOLSPEC";
  const instrument1 = {
    name: instrument1Name,
    scienceGroups: [commonScienceGroup],
  };
  const instrument2 = {
    name: instrument2Name,
    scienceGroups: [commonScienceGroup],
  };
  const targetStations: Array<targetStation> = [
    { targetStation: "TS0", instruments: [instrument1] },
    { targetStation: "TS3", instruments: [instrument2] },
  ];
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
    scienceGroups: [commonScienceGroup],
  };
  const instrument2 = { name: "someinstrumentwithnogroups", scienceGroups: [] };
  const targetStations: Array<targetStation> = [
    { targetStation: "TS0", instruments: [instrument1] },
    { targetStation: "TS3", instruments: [instrument2] },
  ];
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
    scienceGroups: [commonScienceGroup],
  };
  const instrument2 = {
    name: "someinstrumentwithnogroups",
    scienceGroups: ["SUPPORT"],
  };
  const targetStations: Array<targetStation> = [
    { targetStation: "TS0", instruments: [instrument1] },
    { targetStation: "TS3", instruments: [instrument2] },
  ];
  const result = createInstrumentGroups(targetStations);

  expect(result.get(commonScienceGroup)!.sort()).toStrictEqual(
    [instrument1].sort(),
  );
});
