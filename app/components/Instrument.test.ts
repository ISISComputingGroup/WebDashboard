import {
	CSSB,
	findPVInGroups,
	getExtraPVsForBlock,
	getGroupsWithBlocksFromConfigOutput,
	Instrument,
	RC_ENABLE,
	RC_INRANGE,
	SP_RBV,
	storePrecision,
	toPrecision,
	yesToBoolean,
} from "@/app/components/Instrument";
import {
	ConfigOutput,
	IfcBlock,
	IfcPVWSMessage,
	tBlockMapping,
	tGroups,
} from "@/app/types";

test("findPVInGroups returns a block when it finds one", () => {
	const blockName = "blockName";
	const prefix = "IN:INSTRUMENT";
	let groups: tGroups = new Map();
	let group1Blocks: tBlockMapping = new Map();
	group1Blocks.set(blockName, {
		human_readable_name: blockName,
		pvaddress: "some:underlying:pv:name",
	});
	groups.set("aGroup", group1Blocks);
	findPVInGroups(groups, prefix + CSSB + blockName);
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
	const prefix = "TESTING:";

	const configOutput: ConfigOutput = {
		groups: [{ blocks: [blockNameToTest], name: groupNameToTest }],
		blocks: [
			{
				name: blockNameToTest,
				component: "",
				local: true,
				pv: prefix + "A:BLOCK",
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
	const groups = getGroupsWithBlocksFromConfigOutput(prefix, configOutput);
	expect(Array.from(groups.keys())[0]).toBe(groupNameToTest);
	expect(
		Array.from(Array.from(groups.values())[0].values())[0].human_readable_name,
	).toBe(blockNameToTest);
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
	const prefix = "IN:TEST:";
	const block1Name = prefix + CSSB + "blockName";
	const block2Name = prefix + CSSB + "block2Name";

	let inst = new Instrument(prefix);

	let group1Blocks: tBlockMapping = new Map();
	group1Blocks.set(block1Name, {
		human_readable_name: block1Name,
		pvaddress: "some:underlying:pv:name",
	});
	inst.groups.set("aGroup", group1Blocks);

	let group2Blocks: tBlockMapping = new Map();
	group2Blocks.set(block2Name, {
		human_readable_name: block2Name,
		pvaddress: "someother:underlying:pv:name",
	});
	inst.groups.set("aDifferentGroup", group2Blocks);

	const res = inst.getAllBlockPVs();

	expect(res.length).toBe(2 * 4); // 2 blocks, which means 4 PVs to subscribe to

	expect(res).toEqual(
		expect.arrayContaining([
			block1Name,
			block1Name + RC_ENABLE,
			block1Name + RC_INRANGE,
			block1Name + SP_RBV,
			block2Name,
			block2Name + RC_ENABLE,
			block2Name + RC_INRANGE,
			block2Name + SP_RBV,
		]),
	);
});
