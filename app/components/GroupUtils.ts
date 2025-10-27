import { tBlockMapping } from "@/app/types";

export function checkIfAllBlocksInGroupAreHidden(
  blocks: tBlockMapping,
): boolean {
  return Array.from(blocks.values()).every((block) => block.visible === false);
}
