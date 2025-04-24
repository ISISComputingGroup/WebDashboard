import TopBar, {
  configName,
  getRunstate,
  runStateStr,
} from "@/app/components/TopBar";
import { IfcPV } from "@/app/types";
import { render } from "@testing-library/react";
import { Instrument } from "@/app/components/Instrument";
import { findPVByHumanReadableName } from "@/app/components/PVutils";

test("GetRunstate returns the runstate when it exists and is of string type", () => {
  const expected = "SETUP";
  const PVToTest: IfcPV = {
    pvaddress: "",
    value: expected,
    human_readable_name: runStateStr,
  };
  const PVArr = [PVToTest];
  expect(getRunstate(PVArr)).toBe(expected);
});

test("GetRunstate returns unknown when no runstate PV in array", () => {
  const PVArr: Array<IfcPV> = [];
  expect(getRunstate(PVArr)).toBe("UNREACHABLE");
});

it("renders topbar unchanged", () => {
  let instrument = new Instrument("TESTING");
  const instName = "Instrument";
  const { container } = render(
    TopBar({
      dashboard: instrument.dashboard,
      instName: instName,
      runInfoPVs: instrument.runInfoPVs,
    }),
  );
  expect(container).toMatchSnapshot();
});

it("draws instName expectedly", () => {
  let instrument = new Instrument("TESTING");
  const instName = "Instrument";
  const { container } = render(
    TopBar({
      dashboard: instrument.dashboard,
      instName: instName,
      runInfoPVs: instrument.runInfoPVs,
    }),
  );
  expect(container.querySelector("#instNameLabel")!.innerHTML).toContain(
    instName.toUpperCase(),
  );
});

it("draws configName expectedly", () => {
  let instrument = new Instrument("TESTING");
  let configNamePV = findPVByHumanReadableName(
    instrument.runInfoPVs,
    configName,
  )!;
  const expectedConfigName = "Aconfig";
  configNamePV.value = expectedConfigName;
  const { container } = render(
    TopBar({
      dashboard: instrument.dashboard,
      instName: "Instrument",
      runInfoPVs: instrument.runInfoPVs,
    }),
  );
  expect(container.querySelector("#configNameSpan")!.innerHTML).toBe(
    expectedConfigName,
  );
});
