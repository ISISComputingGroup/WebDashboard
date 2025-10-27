import { render } from "@testing-library/react";
import InstrumentWallCard from "@/app/components/InstrumentWallCard";
import { instListEntryWithRunstatePVandValue } from "@/app/types";

it("renders instrumentwallcard unchanged", () => {
  const instrument: instListEntryWithRunstatePVandValue = {
    name: "Instrument",
    runStateValue: "RUNNING",
    pvPrefix: "",
    runStatePV: "",
    groups: ["EXCITATIONS"],
    isScheduled: true,
    seci: false,
    hostName: "",
    targetStation: "TS5",
  };
  const { container } = render(<InstrumentWallCard instrument={instrument} />);
  expect(container).toMatchSnapshot();
});

it("renders instrumentwallcard unchanged when runstate is unknown", () => {
  const instrument: instListEntryWithRunstatePVandValue = {
    name: "Instrument1",
    runStateValue: "",
    pvPrefix: "",
    runStatePV: "",
    groups: ["EXCITATIONS"],
    isScheduled: true,
    seci: false,
    hostName: "",
    targetStation: "TS5",
  };
  const { container } = render(<InstrumentWallCard instrument={instrument} />);
  expect(container).toMatchSnapshot();
});
