import React from "react";
import Block from "./Block";
import { checkIfAllBlocksInGroupAreHidden } from "./GroupUtils";

import { IfcGroup } from "@/app/types";

export default function Group({
  group,
  instName,
  showHiddenBlocks,
}: {
  group: IfcGroup;
  instName: string;
  showHiddenBlocks: boolean;
}) {
  if (!group) {
    return <h1>Loading...</h1>;
  }

  // Check if all the blocks in this group are hidden. If so, hide the group.
  if (checkIfAllBlocksInGroupAreHidden(group) && !showHiddenBlocks) {
    return null;
  }

  return (
    <div className="w-full bg-gray-700 shadow-md rounded-xl flex flex-col overflow-x-auto">
      <h1 className="p-4 bg-gray-600 rounded-t-lg min-w-full text-white">
        {group.name}
      </h1>
      <table className="text-sm table-fixed">
        <thead>
          <tr className="bg-blue-gray-100 text-gray-100">
            <th className="py-3 px-4 text-left">Block</th>
            <th className="py-3 px-4 text-left">Value</th>
            <th className="py-3 px-4 text-left">In-Range</th>
          </tr>
        </thead>
        <tbody className="text-gray-200 ">
          {group.blocks.map((pv) => {
            return (
              <Block
                key={pv.human_readable_name}
                pv={pv}
                instName={instName}
                showHiddenBlocks={showHiddenBlocks}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
