import { render } from "@testing-library/react";
import ShutterStatus from "@/app/components/ShutterStatus";
import type { IfcPV, instListEntry } from "@/app/types";

function makeInstrument(name: string, targetStation: string): instListEntry {
  return {
    name: name,
    hostName: "NDX" + name,
    pvPrefix: `IN:${name}:`,
    isScheduled: true,
    seci: false,
    groups: [],
    targetStation: targetStation,
  };
}

const ts1Instruments = [
  makeInstrument("ALF", "TS1"),
  makeInstrument("SANDALS", "TS1"),
];

const ts2Instruments = [
  makeInstrument("POLREF", "TS2"),
  makeInstrument("ZOOM", "TS2"),
];

const pvs = new Map<string, IfcPV>([
  ["IN:ALF:SHTR:STAT", { pvaddress: "IN:ALF:SHTR:STAT", value: "CLOSED" }],
  [
    "IN:SANDALS:SHTR:STAT",
    { pvaddress: "IN:SANDALS:SHTR:STAT", value: "OPEN" },
  ],
  ["IN:ZOOM:SHTR:STAT", { pvaddress: "IN:ZOOM:SHTR:STAT", value: "FAULT" }],
  ["IN:ZOOM:VAT:STAT", { pvaddress: "IN:ZOOM:VAT:STAT", value: "OPEN" }],
  ["IN:ZOOM:SHTR:MODE", { pvaddress: "IN:ZOOM:SHTR:MODE", value: "BEAMLINE" }],
]);

it("renders TS1 shutter status unchanged", () => {
  const { container } = render(
    <ShutterStatus
      name={"TS1 Shutters"}
      instruments={ts1Instruments}
      pvs={pvs}
    />,
  );
  expect(container).toMatchSnapshot();
});

it("renders TS2 shutter status with VAT and mode unchanged", () => {
  const { container } = render(
    <ShutterStatus
      name={"TS2 Shutters"}
      instruments={ts2Instruments}
      pvs={pvs}
      showVatAndMode={true}
    />,
  );
  expect(container).toMatchSnapshot();
});

it("renders shutter status from the instrument's shutter PV", () => {
  const { container } = render(
    <ShutterStatus
      name={"TS1 Shutters"}
      instruments={ts1Instruments}
      pvs={pvs}
    />,
  );
  expect(container.querySelector("#ALF_SHUTTER")!.textContent).toContain(
    "CLOSED",
  );
  expect(container.querySelector("#SANDALS_SHUTTER")!.textContent).toContain(
    "OPEN",
  );
});

it("links each instrument to its instrument page", () => {
  const { container } = render(
    <ShutterStatus
      name={"TS1 Shutters"}
      instruments={ts1Instruments}
      pvs={pvs}
    />,
  );
  expect(container.querySelector("#ALF_SHUTTER")!.getAttribute("href")).toBe(
    "/instrument?name=ALF",
  );
  expect(
    container.querySelector("#SANDALS_SHUTTER")!.getAttribute("href"),
  ).toBe("/instrument?name=SANDALS");
});

it("does not render VAT and mode when not requested", () => {
  const { container } = render(
    <ShutterStatus
      name={"TS1 Shutters"}
      instruments={ts1Instruments}
      pvs={pvs}
    />,
  );
  expect(container.querySelector("#ALF_VAT")).toBeNull();
  expect(container.querySelector("#ALF_MODE")).toBeNull();
});

it("renders VAT, mode, and a dash for missing values", () => {
  const { container } = render(
    <ShutterStatus
      name={"TS2 Shutters"}
      instruments={ts2Instruments}
      pvs={pvs}
      showVatAndMode={true}
    />,
  );
  expect(container.querySelector("#ZOOM_VAT")!.textContent).toBe("VAT: OPEN");
  expect(container.querySelector("#ZOOM_MODE")!.textContent).toBe("BEAMLINE");
  expect(container.querySelector("#POLREF_SHUTTER")!.textContent).toContain(
    "-",
  );
  expect(container.querySelector("#POLREF_VAT")!.textContent).toBe("VAT: -");
});

it("renders no instruments for an empty instrument list", () => {
  const { container } = render(
    <ShutterStatus name={"TS1 Shutters"} instruments={[]} pvs={pvs} />,
  );
  expect(container.getElementsByTagName("a").length).toBe(0);
});
