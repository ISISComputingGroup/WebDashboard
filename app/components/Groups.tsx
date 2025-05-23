import Group from "./Group";

import { IfcGroup } from "@/app/types";

export default function Groups({
  groupsMap,
  instName,
  showHiddenBlocks,
}: {
  groupsMap: Array<IfcGroup>;
  instName: string;
  showHiddenBlocks: boolean;
}) {
  return (
    <div className="rounded-xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-2">
      {groupsMap.map((group) => {
        return (
          <Group
            key={group.name}
            group={group}
            instName={instName}
            showHiddenBlocks={showHiddenBlocks}
          />
        );
      })}
    </div>
  );
}
