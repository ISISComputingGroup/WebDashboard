import { render } from "@testing-library/react";
import TargetStation from "@/app/components/TargetStation";

it("renders targetstation unchanged", () => {
  const { container } = render(
    <TargetStation
      name={"TS5"}
      beamCurrent={1234.5678}
      instruments={[
        { name: "Instrument", runstate: "RESUMING" },
        {
          name: "Instrument2",
          runstate: "VETOING",
        },
      ]}
    />,
  );
  expect(container).toMatchSnapshot();
});
