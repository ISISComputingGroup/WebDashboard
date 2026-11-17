import {
  BEAM_STATUS_SECTIONS,
  getBeamStatusPVs,
  getShutterInstruments,
  getShutterPVs,
  grafanaLink,
  instrumentPageLink,
  shutterModePV,
  shutterStatusPV,
  vatStatusPV,
} from "@/app/components/BeamStatusPVs";
import type { instListEntry } from "@/app/types";

function makeInstrument(
  name: string,
  targetStation: string,
  overrides: Partial<instListEntry> = {},
): instListEntry {
  return {
    name: name,
    hostName: "NDX" + name,
    pvPrefix: `IN:${name}:`,
    isScheduled: true,
    seci: false,
    groups: [],
    targetStation: targetStation,
    ...overrides,
  };
}

const alf = makeInstrument("ALF", "TS1");
const sandals = makeInstrument("SANDALS", "TS1");
const polref = makeInstrument("POLREF", "TS2");
const zoom = makeInstrument("ZOOM", "TS2");
const emu = makeInstrument("EMU", "MUON");
const irisSetup = makeInstrument("IRIS_SETUP", "TS1", {
  pvPrefix: "IN:IRIS_S29:",
  isScheduled: false,
});
const selab = makeInstrument("SELAB", "MISC", {
  groups: ["SUPPORT"],
  isScheduled: false,
});
const scheduledMisc = makeInstrument("SOMEMISC", "MISC");

const instList = [
  zoom,
  sandals,
  emu,
  alf,
  polref,
  irisSetup,
  selab,
  scheduledMisc,
];

test("grafanaLink gives link to value history dashboard for metric", () => {
  expect(grafanaLink("ACCEL_ts1_beam_curr")).toBe(
    "https://shadow.nd.rl.ac.uk/grafana/d/xWibHehGk/value-history?viewPanel=2&orgId=1&var-metric=ACCEL_ts1_beam_curr",
  );
});

test("instrumentPageLink gives link to this dashboard's instrument page", () => {
  expect(instrumentPageLink("ALF")).toBe("/instrument?name=ALF");
});

test("grafana metrics are unique", () => {
  const metrics = BEAM_STATUS_SECTIONS.flatMap((section) =>
    section.rows.map((row) => row.grafanaMetric),
  ).filter((metric) => metric !== undefined);
  expect(new Set(metrics).size).toBe(metrics.length);
});

test("shutter PV helpers use the instrument's PV prefix", () => {
  expect(shutterStatusPV(alf)).toBe("IN:ALF:SHTR:STAT");
  expect(vatStatusPV(polref)).toBe("IN:POLREF:VAT:STAT");
  expect(shutterModePV(polref)).toBe("IN:POLREF:SHTR:MODE");
});

test("getShutterInstruments returns sorted scheduled instruments on the given target station", () => {
  expect(getShutterInstruments(instList, "TS1")).toStrictEqual([alf, sandals]);
  expect(getShutterInstruments(instList, "TS2")).toStrictEqual([polref, zoom]);
});

test("getShutterInstruments excludes unscheduled instruments", () => {
  expect(getShutterInstruments(instList, "TS1")).not.toContain(irisSetup);
});

test("getShutterInstruments excludes instruments on other target stations", () => {
  const ts1AndTs2 = getShutterInstruments(instList, "TS1").concat(
    getShutterInstruments(instList, "TS2"),
  );
  expect(ts1AndTs2).not.toContain(emu);
  expect(ts1AndTs2).not.toContain(selab);
  expect(ts1AndTs2).not.toContain(scheduledMisc);
});

test("getShutterInstruments returns nothing for an empty instlist", () => {
  expect(getShutterInstruments([], "TS1")).toStrictEqual([]);
});

test("getShutterPVs gives shutter PVs for TS1 and shutter, VAT and mode PVs for TS2", () => {
  expect(getShutterPVs(instList)).toStrictEqual([
    "IN:ALF:SHTR:STAT",
    "IN:SANDALS:SHTR:STAT",
    "IN:POLREF:SHTR:STAT",
    "IN:POLREF:VAT:STAT",
    "IN:POLREF:SHTR:MODE",
    "IN:ZOOM:SHTR:STAT",
    "IN:ZOOM:VAT:STAT",
    "IN:ZOOM:SHTR:MODE",
  ]);
});

test("getBeamStatusPVs has no duplicates and contains all section PVs", () => {
  const pvs = getBeamStatusPVs();
  expect(new Set(pvs).size).toBe(pvs.length);
  for (const section of BEAM_STATUS_SECTIONS) {
    for (const row of section.rows) {
      expect(pvs).toContain(row.pv);
    }
  }
  expect(pvs).toContain("AC:TS1:BEAM:CURR");
  expect(pvs).toContain("AC:MUON:BEAM:CURR");
});
