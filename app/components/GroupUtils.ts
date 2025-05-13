import { IfcBlock } from "@/app/types";

export function checkIfAllBlocksInGroupAreHidden(
  blocks: Array<IfcBlock>,
): boolean {
  return blocks.map((block) => block.visible).every((v) => v === false);
}
