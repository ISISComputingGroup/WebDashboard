export default function TopBar({ instPvs, slug }) {
  if (!instPvs || !slug) {
    return <h1>Loading...</h1>;
  }

  // divide instPvs list into 3 parts just for the sake of displaying right now
  const pvs = Object.entries(instPvs);
  const pvLength = pvs.length;
  const pvSet1 = pvs.slice(0, Math.floor(pvLength / 3));
  const pvSet2 = pvs.slice(
    Math.floor(pvLength / 3),
    Math.floor((pvLength / 3) * 2)
  );
  const pvSet3 = pvs.slice(Math.floor((pvLength / 3) * 2), pvLength);

  return (
    <div
      id="top_bar"
      className="w-full bg-gray-700 text-black rounded-xl text-md "
    >
      <div id="inst_name">
        <h2 class={`text-center bg-green-500 p-4 text-xl rounded-t-lg`}>
          {slug} is <span>{instPvs["RUNSTATE"]["value"]}</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-cols-3 overflow-x-auto ">
        <div className="bg-gray-200">
          <h1 className="text-lg w-full text-white bg-gray-500 p-3 font-semibold px-7">
            Soft
          </h1>
          <div className="p-3 bg-gray-200">
            <table className="text-sm">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Value</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 ">
                {pvSet1.map((block) => (
                  <tr
                    key={block[0]}
                    className="border-b border-gray-600 transition duration-300 hover:bg-gray-700 hover:text-gray-200"
                  >
                    <td className="py-1 px-4">{block[0]}</td>
                    <td className="py-1 px-4 ">{block[1]["value"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-200">
          <h1 className="text-lg w-full text-white bg-gray-500 p-3 font-semibold px-7">
            Technical
          </h1>
          <div className="p-3 bg-gray-200">
            <table className="text-sm">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Value</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 ">
                {pvSet2.map((block) => (
                  <tr
                    key={block[0]}
                    className="border-b border-gray-600 transition duration-300 hover:bg-gray-700 hover:text-gray-200"
                  >
                    <td className="py-1 px-4">{block[0]}</td>
                    <td className="py-1 px-4 ">{block[1]["value"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-gray-200">
          <h1 className="text-lg w-full text-white bg-gray-500 p-3 font-semibold px-7">
            Time
          </h1>
          <div className="p-3 bg-gray-200">
            <table className="text-sm">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Value</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 ">
                {pvSet3.map((block) => (
                  <tr
                    key={block[0]}
                    className="border-b border-gray-600 transition duration-300 hover:bg-gray-700 hover:text-gray-200"
                  >
                    <td className="py-1 px-4">{block[0]}</td>
                    <td className="py-1 px-4 ">{block[1]["value"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
