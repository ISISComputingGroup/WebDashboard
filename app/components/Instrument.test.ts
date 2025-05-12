import {
  CSSB,
  findPVInDashboard,
  findPVInGroups,
  getGroupsWithBlocksFromConfigOutput,
  RC_ENABLE,
  RC_INRANGE,
  SP_RBV,
  storePrecision,
  getExtraPVsForBlock,
  toPrecision,
  yesToBoolean,
  getAllBlockPVs,
  Instrument,
} from "@/app/components/Instrument";
import {
  ConfigOutput,
  DashboardArr,
  IfcBlock,
  IfcGroup,
  IfcPV,
  IfcPVWSMessage,
} from "@/app/types";

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

test("findPVInGroups returns a block when it finds one", () => {
  const blockName = "blockName";
  const prefix = "IN:INSTRUMENT";
  const groups: Array<IfcGroup> = [
    {
      name: "aGroup",
      blocks: [
        {
          human_readable_name: blockName,
          pvaddress: "some:underlying:pv:name",
        },
      ],
    },
  ];

  findPVInGroups(groups, prefix, prefix + CSSB + blockName);
});

test("toPrecision does nothing to string value ", () => {
  const expectedValue = "untouched";
  const aBlock: IfcBlock = {
    pvaddress: "SOME:BLOCK:STR",
    value: expectedValue,
  };
  expect(toPrecision(aBlock, expectedValue)).toBe(expectedValue);
});

test("toPrecision does nothing to block without pv ", () => {
  const expectedValue = 0.00123456;
  const aBlock: IfcBlock = {
    pvaddress: "SOME:BLOCK:STR",
    value: expectedValue,
  };
  expect(toPrecision(aBlock, expectedValue)).toBe(expectedValue);
});

test("toPrecision truncates block if it has precision", () => {
  const originalValue = 0.00123456;
  const precision = 3;
  const aBlock: IfcBlock = {
    pvaddress: "SOME:BLOCK:STR",
    value: originalValue,
    precision: precision,
  };
  expect(toPrecision(aBlock, originalValue)).toBe(
    originalValue.toFixed(precision),
  );
});

test("yesToBoolean works with YES as value", () => {
  expect(yesToBoolean("YES")).toBe(true);
});

test("yesToBoolean works with NO as value", () => {
  expect(yesToBoolean("NO")).toBe(false);
});

test("getGroupsWithBlocksFromConfigOutput gets blocks from blockserver groups", () => {
  const blockNameToTest = "aBlock";
  const groupNameToTest = "aGroup";

  const configOutput: ConfigOutput = {
    groups: [{ blocks: [blockNameToTest], name: groupNameToTest }],
    blocks: [
      {
        name: blockNameToTest,
        component: "",
        local: true,
        pv: "A:BLOCK",
        set_block: false,
        highlimit: 0,
        lowlimit: 0,
        log_rate: 0,
        log_deadband: 0,
        log_periodic: true,
        runcontrol: true,
        suspend_on_invalid: true,
        visible: true,
      },
    ],
    components: [],
    description: "",
    name: "",
    configuresBlockGWAndArchiver: false,
    iocs: [],
    isDynamic: false,
    isProtected: false,
    synoptic: "",
    component_iocs: [],
    history: [],
  };
  const groups = getGroupsWithBlocksFromConfigOutput(configOutput);
  expect(groups[0].name).toBe(groupNameToTest);
  expect(groups[0].blocks[0].human_readable_name).toBe(blockNameToTest);
});

test("subscribeToBlockPVs subscribes to blocks, their run control and their SP:RBV PVs", () => {
  const blockAddress = "IN:INST:CS:SB:Block1";
  expect(getExtraPVsForBlock(blockAddress)).toEqual(
    expect.arrayContaining([
      blockAddress,
      blockAddress + RC_ENABLE,
      blockAddress + RC_INRANGE,
      blockAddress + SP_RBV,
    ]),
  );
});

test("storePrecision adds precision to a block if it is the first update", () => {
  const precision = 3;
  const message: IfcPVWSMessage = {
    type: "update",
    pv: "",
    precision: precision,
  };
  let blockWithoutPrecision: IfcBlock = { pvaddress: "" };
  storePrecision(message, blockWithoutPrecision);
  expect(blockWithoutPrecision.precision).toEqual(precision);
});

test("getAllBlockPVs returns flat list of blocks, their RC and SPRBV pvs", () => {
  const block1Name = "blockName";
  const block2Name = "block2Name";
  const prefix = "IN:TEST:";

  let inst = new Instrument(prefix);

  inst.groups = [
    {
      name: "aGroup",
      blocks: [
        {
          human_readable_name: block1Name,
          pvaddress: "some:underlying:pv:name",
        },
      ],
    },
    {
      name: "aDifferentGroup",
      blocks: [
        {
          human_readable_name: block2Name,
          pvaddress: "someother:underlying:pv:name",
        },
      ],
    },
  ];

  const res = getAllBlockPVs(inst);

  expect(res.length).toBe(2 * 4); // 2 blocks, which means 4 PVs to subscribe to

  expect(res).toEqual(
    expect.arrayContaining([
      prefix + CSSB + block1Name,
      prefix + CSSB + block1Name + RC_ENABLE,
      prefix + CSSB + block1Name + RC_INRANGE,
      prefix + CSSB + block1Name + SP_RBV,
      prefix + CSSB + block2Name,
      prefix + CSSB + block2Name + RC_ENABLE,
      prefix + CSSB + block2Name + RC_INRANGE,
      prefix + CSSB + block2Name + SP_RBV,
    ]),
  );
});
