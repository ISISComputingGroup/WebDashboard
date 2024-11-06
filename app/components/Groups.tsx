import React from "react";
import Group from "./Group";

import { IfcGroup } from "@/app/types";

export default function Groups({
  groupsMap,
  instName,
  showHiddenBlocks,
  showSetpoints,
}: {
  groupsMap: Array<IfcGroup>;
  instName: string;
  showHiddenBlocks: boolean;
  showSetpoints: boolean;
}) {
  if (!groupsMap) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="rounded-xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  gap-4 mt-2">
      {groupsMap.map((group) => {
        return (
          <Group
            key={group.name}
            group={group}
            instName={instName}
            showHiddenBlocks={showHiddenBlocks}
            showSetpoints={showSetpoints}
          />
        );
      })}
    </div>
  );
}
