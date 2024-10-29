import { findPVByAddress, IfcPV } from "@/app/components/IfcPV";

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

// test("findPVByHumanReadableName finds a PV and returns it", () => {
//     const prefix = "UNITTESTING"
//
//     expect(result).toBe(undefined);
// });
//
//
// test("findPVByHumanReadableName does not find a nonexistant PV and returns undefined", () => {
//     const prefix = "UNITTESTING"
//
//     expect(result).toBe(undefined);
// });
