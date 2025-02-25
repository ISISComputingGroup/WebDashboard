import { render } from "@testing-library/react";
import ScienceGroup from "@/app/components/ScienceGroup";

it("renders sciencegroup unchanged", () => {
  const { container } = render(
    <ScienceGroup
      name={"EXCITATIONS"}
      instruments={[
        {
          name: "Instrument",
          runStateValue: "RUNNING",
          pvPrefix: "",
          runStatePV: "",
          groups: ["EXCITATIONS"],
          isScheduled: true,
          seci: false,
          hostName: "",
          targetStation: "TS5",
        },
        {
          name: "Instrument2",
          runStateValue: "WAITING",
          pvPrefix: "",
          runStatePV: "",
          groups: ["EXCITATIONS"],
          isScheduled: true,
          seci: false,
          hostName: "",
          targetStation: "TS5",
        },
      ]}
    />,
  );
  expect(container).toMatchSnapshot();
});
