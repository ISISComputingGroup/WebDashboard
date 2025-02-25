import { render } from "@testing-library/react";
import TargetStation from "@/app/components/TargetStation";

it("renders targetstation unchanged", () => {
  const { container } = render(
    <TargetStation
      name={"TS5"}
      beamCurrent={1234.5678}
      instruments={[
        { name: "Instrument", runStateValue: "RESUMING", pvPrefix:"",runStatePV:"",groups:["EXCITATIONS"], isScheduled:true,seci:false,hostName:"",targetStation:"TS5" },
        {
          name: "Instrument2",
          runStateValue: "VETOING", pvPrefix:"",runStatePV:"",groups:["EXCITATIONS"], isScheduled:true,seci:false,hostName:"",targetStation:"TS5"
        },
      ]}
    />,
  );
  expect(container).toMatchSnapshot();
});
