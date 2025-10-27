import { tGroups } from "@/app/types";
import Group from "./Group";

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
    <div className="rounded-xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-2">
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
