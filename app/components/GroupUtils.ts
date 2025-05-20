import { tBlockMapping } from "@/app/types";

export function checkIfAllBlocksInGroupAreHidden(
  blocks: tBlockMapping,
): boolean {
  return Array.from(blocks.values())
    .map((block) => block.visible)
    .every((v) => v === false);
}
