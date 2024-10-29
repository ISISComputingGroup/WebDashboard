import {
  findPVByAddress,
  findPVByHumanReadableName,
  IfcPV,
} from "@/app/components/IfcPV";

test("findPVByAddress finds a PV and returns it", () => {
  const pvAddressToTest = "SOME:PV";
  const myPVs: Array<IfcPV> = [
    { pvaddress: pvAddressToTest },
    { pvaddress: "SOME:OTHER:PV" },
  ];
  const result = findPVByAddress(myPVs, pvAddressToTest);

  expect(result?.pvaddress).toBe(pvAddressToTest);
});

test("findPVByAddress does not find a nonexistant PV and returns undefined", () => {
  const pvAddressToTest = "SOME:PV";
  const myPVs: Array<IfcPV> = [{ pvaddress: "THE:ONLY:PV" }];
  const result = findPVByAddress(myPVs, pvAddressToTest);

  expect(result).toBe(undefined);
});

test("findPVByHumanReadableName finds a PV and returns it", () => {
  const humanReadableNameToTest = "thisIsAUsefulPV";
  const myPVs: Array<IfcPV> = [
    { pvaddress: "SOME:PV", human_readable_name: humanReadableNameToTest },
    {
      pvaddress: "SOME:OTHER:PV",
      human_readable_name: "andThisIsNotAUsefulPV",
    },
  ];
  const result = findPVByHumanReadableName(myPVs, humanReadableNameToTest);

  expect(result?.human_readable_name).toBe(humanReadableNameToTest);
});

test("findPVByHumanReadableName does not find a nonexistant PV and returns undefined", () => {
  const humanReadableNameToTest = "SOME:PV";
  const myPVs: Array<IfcPV> = [
    { pvaddress: "THE:ONLY:PV", human_readable_name: "theOnlyPV" },
  ];
  const result = findPVByHumanReadableName(myPVs, humanReadableNameToTest);

  expect(result).toBe(undefined);
});
