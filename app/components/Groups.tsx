import Group from "./Group";
import { tGroups } from "@/app/types";

export default function Groups({
  groupsMap,
  instName,
  showHiddenBlocks,
}: {
  groupsMap: tGroups;
  instName: string;
  showHiddenBlocks: boolean;
}) {
  return (
    <div className="rounded-xl columns-sm gap-4 mt-2 p-4">
      {Array.from(groupsMap.entries()).map(([group, blocks]) => {
        return (
          <Group
            key={group}
            group={group}
            blocks={blocks}
            instName={instName}
            showHiddenBlocks={showHiddenBlocks}
          />
        );
      })}
    </div>
  );
}
