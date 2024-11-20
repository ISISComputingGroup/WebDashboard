import { IfcPV } from "@/app/types";
import {
  findPVByAddress,
  findPVByHumanReadableName,
  ExponentialOnThresholdFormat,
} from "@/app/components/PVutils";

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

// Test of ExponentialOnThresholdFormat ported from ibex_gui Java code
test("GIVEN value 0.1 which is above lower threshold WHEN formatting with precision 3 THEN no exponential notation used", () => {
  expect(ExponentialOnThresholdFormat(0.1)).toBe("0.100");
});

test("GIVEN negative value 0.1 which is above lower threshold WHEN formatting with precision 3 THEN no exponential notation used", () => {
  expect(ExponentialOnThresholdFormat(-0.1)).toBe("-0.100");
});

test("GIVEN value 0.01 which is above lower threshold WHEN formatting with precision 3 THEN no exponential notation used", () => {
  expect(ExponentialOnThresholdFormat(0.01)).toBe("0.010");
});

test("GIVEN value equal to lower threshold WHEN formatting with precision 3 THEN no exponential notation used", () => {
  expect(ExponentialOnThresholdFormat(0.001)).toBe("0.001");
});

test("GIVEN negative value equal to lower threshold WHEN formatting with precision 3 THEN no exponential notation used", () => {
  expect(ExponentialOnThresholdFormat(-0.001)).toBe("-0.001");
});

test("GIVEN value above lower threshold with extra fractioanl digits WHEN formatting with precision 3 THEN no exponential notation used and some digits are lost", () => {
  expect(ExponentialOnThresholdFormat(0.01234)).toBe("0.012");
});

test("GIVEN value above lower threshold with integer part WHEN formatting with precision 5 THEN no exponential notation used", () => {
  expect(ExponentialOnThresholdFormat(1234.56, 5)).toBe("1234.56000");
});

test("GIVEN value above lower threshold with integer part and extra fractional digits WHEN formatting with precision 3 THEN no exponential notation used", () => {
  expect(ExponentialOnThresholdFormat(12.5678)).toBe("12.568");
});

test("GIVEN value below lower threshold WHEN formatting with precision 3 THEN exponential notation used", () => {
  expect(ExponentialOnThresholdFormat(0.0009)).toBe("9.000E-4");
});

test("GIVEN very small value WHEN formatting with precision 5 THEN exponential notation used", () => {
  expect(ExponentialOnThresholdFormat(0.000000001234567, 5)).toBe("1.23457E-9");
});

test("GIVEN very small negative value WHEN formatting with precision 5 THEN exponential notation used", () => {
  expect(ExponentialOnThresholdFormat(-0.000000001234567, 5)).toBe(
    "-1.23457E-9",
  );
});

test("GIVEN value just below higher threshold WHEN formatting with precision 3 THEN no exponential notation used", () => {
  expect(ExponentialOnThresholdFormat(999999.1234)).toBe("999999.123");
});

test("GIVEN negative value just below higher threshold WHEN formatting with precision 3 THEN no exponential notation used", () => {
  expect(ExponentialOnThresholdFormat(-999999.1234)).toBe("-999999.123");
});

// TypeScript does not have separate integer/float types - for integers never use exponential so change test a bit
test("GIVEN value equal to higher threshold WHEN formatting with precision 3 THEN exponential notation used", () => {
  //expect(ExponentialOnThresholdFormat(1000000)).toBe("1.000E6");
  expect(ExponentialOnThresholdFormat(1000000.1)).toBe("1.000E6");
});

test("GIVEN negative value equal to higher threshold WHEN formatting with precision 3 THEN exponential notation used", () => {
  expect(ExponentialOnThresholdFormat(-1000000.1)).toBe("-1.000E6");
});

test("GIVEN value above higher threshold WHEN formatting with precision 5 THEN exponential notation used", () => {
  //expect(ExponentialOnThresholdFormat(123456789, 5)).toBe("1.23457E8");
  expect(ExponentialOnThresholdFormat(123456789.1, 5)).toBe("1.23457E8");
});

test("GIVEN negative value above higher threshold WHEN formatting with precision 5 THEN exponential notation used", () => {
  //expect(ExponentialOnThresholdFormat(-123456789, 5)).toBe("-1.23457E8");
  expect(ExponentialOnThresholdFormat(-123456789.1, 5)).toBe("-1.23457E8");
});

// TypeScript does not have separate integer/float types - so ignore next two tests.
//it("GIVEN value 0 WHEN formatting THEN no exponential notation used", () => {
//  expect(ExponentialOnThresholdFormat(0)).toBe("0.000");
//});
//
//it("GIVEN negative value 0 WHEN formatting THEN no exponential notation used", () => {
//  expect(ExponentialOnThresholdFormat(-0)).toBe("0.000");
//});

test("GIVEN integer below higher threshold WHEN formatting THEN no exponential notation used", () => {
  expect(ExponentialOnThresholdFormat(13)).toBe("13");
});

test("GIVEN negative integer below higher threshold WHEN formatting THEN no exponential notation used", () => {
  expect(ExponentialOnThresholdFormat(-13)).toBe("-13");
});

test("GIVEN integer just below higher threshold WHEN formatting THEN no exponential notation used", () => {
  expect(ExponentialOnThresholdFormat(999999)).toBe("999999");
});

test("GIVEN integer equal to higher threshold WHEN formatting THEN no exponential notation used", () => {
  expect(ExponentialOnThresholdFormat(1000000)).toBe("1000000");
});

test("GIVEN negative integer equal to higher threshold WHEN formatting THEN no exponential notation used", () => {
  expect(ExponentialOnThresholdFormat(-1000000)).toBe("-1000000");
});

test("GIVEN integer above higher threshold WHEN formatting THEN no exponential notation used", () => {
  expect(ExponentialOnThresholdFormat(123456789)).toBe("123456789");
});

test("GIVEN negative integer above higher threshold WHEN formatting THEN no exponential notation used", () => {
  expect(ExponentialOnThresholdFormat(-123456789)).toBe("-123456789");
});

test("GIVEN integer equal to 0 WHEN formatting THEN no exponential notation used", () => {
  expect(ExponentialOnThresholdFormat(0)).toBe("0");
});

test("GIVEN negative integer equal to 0 WHEN formatting THEN no exponential notation used", () => {
  expect(ExponentialOnThresholdFormat(-0)).toBe("0");
});
