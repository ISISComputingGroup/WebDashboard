import { checkIfAllBlocksInGroupAreHidden } from "./GroupUtils";
import { IfcGroup } from "./IfcGroup";
import IfcBlock from "@/app/components/IfcBlock";

test("group with all hidden blocks returns true", () => {
  const aHiddenBlock: IfcBlock = { pvaddress: "", visible: false };
  let group: IfcGroup = { name: "testing", blocks: [aHiddenBlock] };
  const result = checkIfAllBlocksInGroupAreHidden(group);
  expect(result).toBe(true);
});

test("group with all visible blocks returns true", () => {
  let group: IfcGroup = {
    name: "testing",
    blocks: [{ pvaddress: "", visible: true }],
  };
  const result = checkIfAllBlocksInGroupAreHidden(group);
  expect(result).toBe(false);
});

test("group with mixed visible blocks returns true", () => {
  let group: IfcGroup = {
    name: "testing",
    blocks: [
      { pvaddress: "", visible: false },
      { pvaddress: "", visible: true },
    ],
  };
  const result = checkIfAllBlocksInGroupAreHidden(group);
  expect(result).toBe(false);
});
