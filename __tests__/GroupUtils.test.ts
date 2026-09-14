import { checkIfAllBlocksInGroupAreHidden } from "@/app/components/GroupUtils";
import type { tBlockMapping } from "@/app/types";

test("group with all hidden blocks returns true", () => {
  const blocks: tBlockMapping = new Map();
  blocks.set("testing", { pvaddress: "", visible: false });
  const result = checkIfAllBlocksInGroupAreHidden(blocks);
  expect(result).toBe(true);
});

test("group with all visible blocks returns false", () => {
  const blocks: tBlockMapping = new Map();
  blocks.set("testing", { pvaddress: "testing", visible: true });
  const result = checkIfAllBlocksInGroupAreHidden(blocks);
  expect(result).toBe(false);
});

test("group with mixed visible blocks returns false", () => {
  const blocks: tBlockMapping = new Map();
  blocks.set("block1", { pvaddress: "block1", visible: false });
  blocks.set("block2", { pvaddress: "block2", visible: true });
  const result = checkIfAllBlocksInGroupAreHidden(blocks);
  expect(result).toBe(false);
});
