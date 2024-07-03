import Block from "./Block";

export default function Group({ group, instName, showHiddenBlocks }) {
  if (!group) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="w-full bg-gray-700 shadow-md rounded-xl flex flex-col overflow-x-auto">
      <h1 className="p-4 bg-gray-600 rounded-t-lg min-w-full">{group.name}</h1>
      <table className="text-sm table-fixed">
        <thead>
          <tr className="bg-blue-gray-100 text-gray-100">
            <th className="py-3 px-4 text-left">Block Name</th>
            <th className="py-3 px-4 text-left">Value</th>
            <th className="py-3 px-4 text-left">In-Range</th>
          </tr>
        </thead>
        <tbody className="text-gray-200 ">
          {group.blocks.map((pv) => Block(pv, instName, showHiddenBlocks))}
        </tbody>
      </table>
    </div>
  );
}
