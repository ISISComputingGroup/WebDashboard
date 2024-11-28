import createInstrumentGroupsFromInstlist from "@/app/instruments/utils";
import { instList } from "@/app/types";

test("createInstrumentGroupsFromInstlist adds an instrument to a group if it has one", () => {
  const instName = "ANINST";
  const groups = ["GROUP1"];
  const instList: instList = [
    {
      name: instName,
      hostName: "blah",
      groups: groups,
      isScheduled: true,
      seci: false,
      pvPrefix: "SOME:PREFIX",
    },
  ];
  const result = createInstrumentGroupsFromInstlist(instList);
  expect(result.get(groups[0])).toEqual([instName]);
});

test("createInstrumentGroupsFromInstlist ignores instrument if it has no group", () => {
  const instName = "ANINST";
  const groups: Array<string> = [];
  const instList: instList = [
    {
      name: instName,
      hostName: "blah",
      groups: groups,
      isScheduled: true,
      seci: false,
      pvPrefix: "SOME:PREFIX",
    },
  ];
  const result = createInstrumentGroupsFromInstlist(instList);
  expect(result.size).toEqual(0);
});

test("createInstrumentGroupsFromInstlist adds to a group if it already exists", () => {
  const instName1 = "BOB";
  const instName2 = "ALICE";
  const groups: Array<string> = ["GROUP1"];
  const instList: instList = [
    {
      name: instName1,
      hostName: "blah",
      groups: groups,
      isScheduled: true,
      seci: false,
      pvPrefix: "SOME:PREFIX",
    },
    {
      name: instName2,
      hostName: "blah",
      groups: groups,
      isScheduled: true,
      seci: false,
      pvPrefix: "SOME:PREFIX",
    },
  ];
  const result = createInstrumentGroupsFromInstlist(instList);
  expect(result.get(groups[0])).toEqual([instName1, instName2]);
});
