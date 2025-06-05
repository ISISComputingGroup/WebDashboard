import TopBar, { getRunstate, runStateStr } from "@/app/components/TopBar";
import { tBlockMapping } from "@/app/types";
import { render } from "@testing-library/react";
import { Instrument } from "@/app/components/Instrument";

test("GetRunstate returns the runstate when it exists and is of string type", () => {
  const prefix = "TESTING:";

  const expected = "SETUP";
  let blocks: tBlockMapping = new Map();
  blocks.set(prefix + "DAE:RUNSTATE_STR", {
    pvaddress: prefix + "DAE:RUNSTATE_STR",
    value: expected,
    human_readable_name: runStateStr,
  });
  expect(getRunstate(prefix, blocks)).toBe(expected);
});

test("GetRunstate returns unknown when no runstate PV in array", () => {
  expect(getRunstate("", new Map())).toBe("UNREACHABLE");
});

it("renders topbar unchanged", () => {
  const prefix = "TESTING:";

  let instrument = new Instrument(prefix);
  const instName = "Instrument";
  const { container } = render(
    TopBar({
      dashboard: instrument.dashboard,
      instName: instName,
      runInfoPVs: instrument.runInfoPVs,
      prefix: prefix,
    }),
  );
  expect(container).toMatchSnapshot();
});

it("draws instName expectedly", () => {
  const prefix = "TESTING:";

  let instrument = new Instrument(prefix);
  const instName = "Instrument";
  const { container } = render(
    TopBar({
      dashboard: instrument.dashboard,
      instName: instName,
      runInfoPVs: instrument.runInfoPVs,
      prefix: prefix,
    }),
  );
  expect(container.querySelector("#instNameLabel")!.innerHTML).toContain(
    instName.toUpperCase(),
  );
});

it("draws configName expectedly", () => {
  const prefix = "TESTING:";
  let instrument = new Instrument(prefix);
  let configNamePV = instrument.runInfoPVs.get(
    prefix + "CS:BLOCKSERVER:CURR_CONFIG_NAME",
  );
  const expectedConfigName = "Aconfig";
  configNamePV!.value = expectedConfigName;
  const { container } = render(
    TopBar({
      dashboard: instrument.dashboard,
      instName: "Instrument",
      runInfoPVs: instrument.runInfoPVs,
      prefix: prefix,
    }),
  );
  expect(container.querySelector("#configNameSpan")!.innerHTML).toBe(
    expectedConfigName,
  );
});
