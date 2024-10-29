import { IfcGroup } from "@/app/types";

export function checkIfAllBlocksInGroupAreHidden(group: IfcGroup): boolean {
  return group.blocks.map((block) => block.visible).every((v) => v === false);
}
