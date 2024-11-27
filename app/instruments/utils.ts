import { instList } from "@/app/types";

export default function createInstrumentGroupsFromInstlist(
  jsonInstList: instList,
): Map<string, Array<string>> {
  let newInstrumentGroups: Map<string, Array<string>> = new Map();
  for (let inst of jsonInstList) {
    for (let group of inst["groups"]) {
      if (!newInstrumentGroups.has(group)) {
        newInstrumentGroups.set(group, []);
      }
      newInstrumentGroups.get(group)!.push(inst["name"]);
    }
  }
  return newInstrumentGroups;
}
