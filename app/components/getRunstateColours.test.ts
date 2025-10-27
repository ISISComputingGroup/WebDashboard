import {
  getForegroundColour,
  getStatusColour,
  UNREACHABLE,
} from "@/app/components/getRunstateColours";

test("getForegroundColor when runstate requires white text returns white text", () => {
  const runstate = "RESUMING";
  const result = getForegroundColour(runstate);
  expect(result).toBe("text-white");
});

test("getForegroundColor when runstate requires black text returns black text", () => {
  const runstate = "SETUP";
  const result = getForegroundColour(runstate);
  expect(result).toBe("text-black");
});

test("getForegroundColor when runstate requires black text returns black text", () => {
  const runstate = "BEGINNING";
  const result = getForegroundColour(runstate);
  expect(result).toBe("text-black");
});

test("getStatusColour when runstate unknown returns expected colour", () => {
  const result = getStatusColour(UNREACHABLE);
  expect(result).toBe("bg-[#F08080]");
});

test("getStatusColour when runstate not expected returns expected colour", () => {
  const result = getStatusColour("blah123");
  expect(result).toBe("bg-[#F08080]");
});

test("getStatusColour when runstate expected returns expected colour", () => {
  const result = getStatusColour("SETUP");
  expect(result).toBe("bg-[#ADD8E6]");
});
