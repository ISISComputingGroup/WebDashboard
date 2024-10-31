import { findPVInDashboard } from "@/app/components/Instrument";
import { DashboardArr, IfcPV } from "@/app/types";

test("findPVinDashboard finds a pv in the dashboard and returns it", () => {
  const prefix = "UNITTESTING";
  const pvToTestFor: IfcPV = { pvaddress: `${prefix}1:1:LABEL` };
  let dashboard: DashboardArr = [
    //column 0
    [
      [{ pvaddress: "", value: "Title:" }, { pvaddress: `${prefix}DAE:TITLE` }],
      [
        { pvaddress: "", value: "Users:" },
        { pvaddress: `${prefix}DAE:_USERNAME` },
      ],
    ],
    //column 1
    [
      [pvToTestFor, { pvaddress: `${prefix}1:1:VALUE` }],
      [
        { pvaddress: `${prefix}2:1:LABEL` },
        { pvaddress: `${prefix}2:1:VALUE` },
      ],
      [
        { pvaddress: `${prefix}3:1:LABEL` },
        { pvaddress: `${prefix}3:1:VALUE` },
      ],
    ],
    //column 2
    [
      [
        { pvaddress: `${prefix}1:2:LABEL` },
        { pvaddress: `${prefix}1:2:VALUE` },
      ],
      [
        { pvaddress: `${prefix}2:2:LABEL` },
        { pvaddress: `${prefix}2:2:VALUE` },
      ],
      [
        { pvaddress: `${prefix}3:2:LABEL` },
        { pvaddress: `${prefix}3:2:VALUE` },
      ],
    ],
  ];

  const result = findPVInDashboard(dashboard, pvToTestFor.pvaddress);
  expect(result).toBe(pvToTestFor);
});

test("findPVinDashboard does not find a PV in the dashboard and returns undefined", () => {
  const prefix = "UNITTESTING";
  const pvToTestFor: IfcPV = { pvaddress: `${prefix}1:4:LABEL` };
  let dashboard: DashboardArr = [
    [
      [
        { pvaddress: `${prefix}1:2:LABEL` },
        { pvaddress: `${prefix}1:2:VALUE` },
      ],
      [
        { pvaddress: `${prefix}2:2:LABEL` },
        { pvaddress: `${prefix}2:2:VALUE` },
      ],
      [
        { pvaddress: `${prefix}3:2:LABEL` },
        { pvaddress: `${prefix}3:2:VALUE` },
      ],
    ],
  ];

  const result = findPVInDashboard(dashboard, pvToTestFor.pvaddress);
  expect(result).toBe(undefined);
});
