import { checkIfAllBlocksInGroupAreHidden } from "./GroupUtils";
import { IfcGroup } from "./IfcGroup";

class MockGroup implements IfcGroup {
  blocks: MockBlock[];
  name: "test";
  constructor(blocks: Array<MockBlock>, name:string = "test") {
    this.blocks = blocks;
    this.name = name;
  }
}

class MockBlock {
  visible: boolean;
  constructor(visible: boolean) {
    this.visible = visible;
  }
}

test("group with all hidden blocks returns true", () => {
  let group = new MockGroup([]);
  group.blocks.push(new MockBlock(false));

  const result = checkIfAllBlocksInGroupAreHidden(group);
  expect(result).toBe(true);
});

test("group with all visible blocks returns true", () => {
  let group = new MockGroup([]);
  group.blocks.push(new MockBlock(true));

  const result = checkIfAllBlocksInGroupAreHidden(group);
  expect(result).toBe(false);
});

test("group with mixed visible blocks returns true", () => {
  let group = new MockGroup([]);
  group.blocks.push(new MockBlock(false));
  group.blocks.push(new MockBlock(true));

  const result = checkIfAllBlocksInGroupAreHidden(group);
  expect(result).toBe(false);
});
