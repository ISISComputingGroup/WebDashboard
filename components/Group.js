export default function Group({ groupName, group }) {
  if (!group || typeof group !== "object") {
    return <h1>Loading...</h1>;
  }

  console.log(group);
  //   {
  //     "KEYENCE": {
  //         "status": "Connected",
  //         "value": "0.0000",
  //         "alarm": "INVALID/TIMEOUT_ALARM",
  //         "visibility": true,
  //         "rc_low": "0.0",
  //         "rc_high": "0.0",
  //         "rc_inrange": "YES",
  //         "rc_enabled": "NO"
  //     },
  //     "Julabo01_T_EXT": {
  //         "status": "Connected",
  //         "value": "0.0 C",
  //         "alarm": "INVALID/CALC_ALARM",
  //         "visibility": true,
  //         "rc_low": "0.0",
  //         "rc_high": "0.0",
  //         "rc_inrange": "YES",
  //         "rc_enabled": "NO"
  //     }
  // }

  const visible_blocks = Object.fromEntries(
    Object.entries(group).filter(([_, block]) => block["visibility"])
  );

  const hidden_blocks = Object.fromEntries(
    Object.entries(group).filter(([_, block]) => !block["visibility"])
  );

  return (
    <div className="w-full bg-gray-700 shadow-md rounded-xl flex flex-col overflow-x-auto">
      <h1 className="p-4 bg-gray-600 rounded-t-lg min-w-full">{groupName}</h1>
      <table className="text-sm">
        <thead>
          <tr className="bg-blue-gray-100 text-gray-100">
            <th className="py-3 px-4 text-left">Block Name</th>
            <th className="py-3 px-4 text-left">Value</th>
            <th className="py-3 px-4 text-left">In-Range</th>
          </tr>
        </thead>
        <tbody className="text-gray-200 ">
          {Object.entries(visible_blocks).map(([blockName, block]) => (
            <tr
              key={blockName}
              className="border-b border-blue-gray-200 transition duration-300 hover:bg-gray-100 hover:text-black"
            >
              <td className="py-1 px-4">{blockName}</td>
              <td className="py-1 px-4">{block["value"]}</td>
              <td className="py-1 px-4">{block["rc_inrange"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
