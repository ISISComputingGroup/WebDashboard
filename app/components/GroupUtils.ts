import { IfcGroup } from "./IfcGroup";

export function checkIfAllBlocksInGroupAreHidden(group: IfcGroup): boolean {
  return group.blocks.map((block) => block.visible).every((v) => v === false);
}
