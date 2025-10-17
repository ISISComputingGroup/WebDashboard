import Block from "./Block";
import { checkIfAllBlocksInGroupAreHidden } from "./GroupUtils";

import { tBlockMapping } from "@/app/types";
import {memo, useState} from "react";

const Group = memo(function Group({
  group,
  blocks,
  instName,
  showHiddenBlocks,
}: {
  group: string;
  blocks: tBlockMapping;
  instName: string;
  showHiddenBlocks: boolean;
}) {
  let [minimised, setMinimised] = useState(false);

  if (!group) {
    return <h1>Loading...</h1>;
  }

  // Check if all the blocks in this group are hidden. If so, hide the group.
  if (checkIfAllBlocksInGroupAreHidden(blocks) && !showHiddenBlocks) {
    return null;
  }

  return (
    <div className="my-2 w-full bg-gray-700 shadow-md rounded-xl flex flex-col overflow-x-auto min-w-full">
      <div className="bg-gray-600 cursor-pointer" onClick={() => {setMinimised(!minimised)}}>
        <h1 className="p-4 min-w-full text-white">
          {group}
          <span className="float-right font-bold text-xl">
            {minimised ? "+" : "-"}
          </span>
        </h1>
      </div>
      { (!minimised) && (
        <table className="text-sm ">
        <thead className="sticky">
        <tr className="bg-blue-gray-100 text-gray-100 border-b-2 border-b-gray-400">
        <th className="py-2 px-2 text-left w-1/3">Block</th>
        <th className="py-2 px-2 text-left w-7/12">Value</th>
        <th className="py-2 px-2 text-left"></th>
        </tr>
        </thead>
        <tbody className="text-gray-200 sticky">
      {
        Array.from(blocks.values()).map((pv) => {
        return (
                  <Block
                  key={pv.human_readable_name}
                  pv={pv}
                  instName={instName}
                  showHiddenBlocks={showHiddenBlocks}
                />
              );
            })
            }
            </tbody>
            </table>
          )
      }
    </div>
  );
});

export default Group;
