import { render } from "@testing-library/react";
import ScienceGroup from "@/app/components/ScienceGroup";

it("renders sciencegroup unchanged", () => {
  const { container } = render(
    <ScienceGroup
      name={"EXCITATIONS"}
      instruments={[
        { name: "Instrument", runstate: "RUNNING" },
        {
          name: "Instrument2",
          runstate: "WAITING",
        },
      ]}
    />,
  );
  expect(container).toMatchSnapshot();
});
