import { IfcInstrumentStatus } from "@/app/types";
import { render } from "@testing-library/react";
import InstrumentWallCard from "@/app/components/InstrumentWallCard";

it("renders instrumentwallcard unchanged", () => {
  const instrument: IfcInstrumentStatus = {
    name: "Instrument",
    runstate: "RUNNING",
  };
  const { container } = render(<InstrumentWallCard instrument={instrument} />);
  expect(container).toMatchSnapshot();
});
