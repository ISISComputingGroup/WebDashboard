import { ConfigOutput, IfcPVWSRequest } from "@/app/types";
import {
  CSSB,
  getGroupsWithBlocksFromConfigOutput,
  RC_ENABLE,
  RC_INRANGE,
  subscribeToBlockPVs,
} from "@/app/components/InstrumentPage";

test("subscribeToBlockPVs subscribes to all run control PVs", () => {
  const mockSendJsonMessage = jest.fn();
  const aBlock = "INST:CS:SB:SomeBlock";
  subscribeToBlockPVs(mockSendJsonMessage, aBlock);
  expect(mockSendJsonMessage.mock.calls.length).toBe(1);
  const expectedCall: IfcPVWSRequest = {
    type: "subscribe",
    pvs: [aBlock, aBlock + RC_ENABLE, aBlock + RC_INRANGE],
  };
  expect(JSON.stringify(mockSendJsonMessage.mock.calls[0][0])).toBe(
    JSON.stringify(expectedCall),
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
