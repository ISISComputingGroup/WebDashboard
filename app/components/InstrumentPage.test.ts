import {
  ConfigOutput,
  IfcBlock,
  IfcPVWSRequest,
  PVWSRequestType,
} from "@/app/types";
import {
  getGroupsWithBlocksFromConfigOutput,
  RC_ENABLE,
  RC_INRANGE,
  SP_RBV,
  subscribeToBlockPVs,
  toPrecision,
} from "@/app/components/InstrumentPage";

test("subscribeToBlockPVs subscribes to all run control PVs", () => {
  const mockSendJsonMessage = jest.fn();
  const aBlock = "INST:CS:SB:SomeBlock";
  subscribeToBlockPVs(mockSendJsonMessage, aBlock);
  expect(mockSendJsonMessage.mock.calls.length).toBe(1);
  const expectedCall: IfcPVWSRequest = {
    type: PVWSRequestType.subscribe,
    pvs: [aBlock, aBlock + RC_ENABLE, aBlock + RC_INRANGE, aBlock + SP_RBV],
  };
  expect(JSON.stringify(mockSendJsonMessage.mock.calls[0][0])).toBe(
    JSON.stringify(expectedCall),
  );
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

test("getGroupsWithBlocksFromConfigOutput gets blocks from blockserver groups", () => {
  const blockNameToTest = "aBlock";
  const groupNameToTest = "aGroup";
  const prefix = "TESTING";
  const mockSendJsonMessage = jest.fn();

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
  const groups = getGroupsWithBlocksFromConfigOutput(
    configOutput,
    mockSendJsonMessage,
    prefix,
  );
  expect(groups[0].name).toBe(groupNameToTest);
  expect(groups[0].blocks[0].human_readable_name).toBe(blockNameToTest);
});
