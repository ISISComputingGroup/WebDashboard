import { IfcGroup } from "./IfcGroup";

export function checkIfAllBlocksInGroupAreHidden(group: IfcGroup): boolean {
  let blocksAllHidden = group.blocks
    .map((block) => block.visible)
    .every((v) => v === false);
  return blocksAllHidden;
}
