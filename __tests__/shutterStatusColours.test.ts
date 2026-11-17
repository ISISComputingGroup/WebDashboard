import { getShutterColour } from "@/app/components/shutterStatusColours";

test.each([
  ["OPEN", "bg-[#90EE90] text-black"],
  ["CLOSED", "bg-red-500 text-white"],
  ["MOVING", "bg-[#FFFF00] text-black"],
  ["FAULT", "bg-orange-500 text-black"],
  ["INVALID", "bg-orange-500 text-black"],
  ["DEACT", "bg-gray-400 text-black"],
])("getShutterColour for %s returns %s", (status, expected) => {
  expect(getShutterColour(status)).toBe(expected);
});

test("getShutterColour returns default colour for unknown status", () => {
  expect(getShutterColour("SOMETHING_ELSE")).toBe("bg-gray-200 text-black");
});

test("getShutterColour returns default colour for undefined status", () => {
  expect(getShutterColour(undefined)).toBe("bg-gray-200 text-black");
});
