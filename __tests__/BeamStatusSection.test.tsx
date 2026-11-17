import { render } from "@testing-library/react";
import BeamStatusSection, {
  getSeverityClass,
} from "@/app/components/BeamStatusSection";
import type { IfcPV } from "@/app/types";

const rows = [
  {
    label: "Beam Current",
    pv: "AC:TS1:BEAM:CURR",
    grafanaMetric: "ACCEL_ts1_beam_curr",
  },
  { label: "Methane Moderator Temp", pv: "TG:TS1:MOD:METH:TEMP" },
  { label: "Not connected", pv: "SOME:MISSING:PV" },
];

const pvs = new Map<string, IfcPV>([
  [
    "AC:TS1:BEAM:CURR",
    {
      pvaddress: "AC:TS1:BEAM:CURR",
      value: "123.456",
      units: "uA",
      severity: "NONE",
    },
  ],
  [
    "TG:TS1:MOD:METH:TEMP",
    {
      pvaddress: "TG:TS1:MOD:METH:TEMP",
      value: "151.000",
      units: "K",
      severity: "MAJOR",
    },
  ],
]);

it("renders beam status section unchanged", () => {
  const { container } = render(
    <BeamStatusSection title={"TS1"} rows={rows} pvs={pvs} />,
  );
  expect(container).toMatchSnapshot();
});

it("renders value with units", () => {
  const { container } = render(
    <BeamStatusSection title={"TS1"} rows={rows} pvs={pvs} />,
  );
  expect(
    container.querySelector("[id='AC:TS1:BEAM:CURR_VALUE']")!.textContent,
  ).toBe("123.456 uA");
});

it("renders a dash for a PV with no value", () => {
  const { container } = render(
    <BeamStatusSection title={"TS1"} rows={rows} pvs={pvs} />,
  );
  expect(
    container.querySelector("[id='SOME:MISSING:PV_VALUE']")!.textContent,
  ).toBe("-");
});

it("renders a value in alarm with alarm styling", () => {
  const { container } = render(
    <BeamStatusSection title={"TS1"} rows={rows} pvs={pvs} />,
  );
  expect(
    container.querySelector("[id='TG:TS1:MOD:METH:TEMP_VALUE']")!.className,
  ).toContain("text-red-400");
  expect(
    container.querySelector("[id='AC:TS1:BEAM:CURR_VALUE']")!.className,
  ).not.toContain("text-red-400");
});

it("renders a grafana link only for rows with a grafana metric", () => {
  const { container } = render(
    <BeamStatusSection title={"TS1"} rows={rows} pvs={pvs} />,
  );
  const links = container.getElementsByTagName("a");
  expect(links.length).toBe(1);
  expect(links[0].textContent).toBe("Beam Current");
  expect(links[0].getAttribute("href")).toBe(
    "https://shadow.nd.rl.ac.uk/grafana/d/xWibHehGk/value-history?viewPanel=2&orgId=1&var-metric=ACCEL_ts1_beam_curr",
  );
});

test.each([
  ["MINOR", "text-amber-500 font-bold"],
  ["MAJOR", "text-red-400 font-bold"],
  ["INVALID", "text-red-400 font-bold"],
  ["NONE", ""],
  [undefined, ""],
])("getSeverityClass for %s returns '%s'", (severity, expected) => {
  expect(getSeverityClass(severity)).toBe(expected);
});
