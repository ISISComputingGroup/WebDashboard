import React, { useState } from "react";

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

  const [showFullTables, setShowFullTables] = useState(false);

  const toggleFullTables = () => {
    setShowFullTables(!showFullTables);
  };

  return (
    <div
      id="top_bar"
      className="w-full bg-gray-700 text-black rounded-lg text-md "
    >
      <div id="inst_name">
        <h2 class={`text-center bg-green-500 p-4 text-xl rounded-t-lg`}>
          {slug[0].toUpperCase()} is <span>{instPvs["RUNSTATE"]["value"]}</span>
        </h2>
      </div>
      <div className="flex-col flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-cols-3 overflow-x-auto">
          <div className="bg-gray-200">
            <h1 className="text-lg w-full text-white bg-gray-400 border-gray-500 border-2 md:border-r-none p-3 font-semibold px-7">
              Soft
            </h1>
            <div className={`p-3 bg-gray-200 `}>
              <table className={`text-sm `}>
                <thead>
                  <tr className="bg-gray-200 text-gray-800">
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Value</th>
                  </tr>
                </thead>
                <tbody className={`text-gray-800 `}>
                  {" "}
                  {pvSet1.map((block) => (
                    <tr
                      key={block[0]}
                      className="border-b border-gray-300 transition duration-100 hover:bg-gray-700 hover:text-gray-200"
                    >
                      <td className="py-1 px-4">{block[0]}</td>
                      <td className="py-1 px-4">{block[1]["value"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-200">
            <h1 className="text-lg w-full text-white bg-gray-400 border-gray-500 border-2 p-3 font-semibold px-7">
              Technical
            </h1>
            <div className={`p-3 bg-gray-200 `}>
              <table className={`text-sm `}>
                <thead>
                  <tr className="bg-gray-200 text-gray-800">
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Value</th>
                  </tr>
                </thead>
                <tbody className={`text-gray-800 `}>
                  {pvSet2.map((block) => (
                    <tr
                      key={block[0]}
                      className="border-b border-gray-300 transition duration-100 hover:bg-gray-700 hover:text-gray-200"
                    >
                      <td className="py-1 px-4">{block[0]}</td>
                      <td className="py-1 px-4">{block[1]["value"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-gray-200">
            <h1 className="text-lg w-full text-white bg-gray-400 border-gray-500 border-2 p-3 font-semibold px-7">
              Time
            </h1>
            <div className={`p-3 bg-gray-200 `}>
              <table className={`text-sm `}>
                <thead>
                  <tr className="bg-gray-200 text-gray-800">
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Value</th>
                  </tr>
                </thead>
                <tbody className={`text-gray-800 `}>
                  {pvSet3.map((block) => (
                    <tr
                      key={block[0]}
                      className="border-b border-gray-300 transition duration-100 hover:bg-gray-700 hover:text-gray-200"
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
        {/* <div className="bg-gray-200 flex items-center justify-center min-w-full p-6 rounded-b-md">
          <svg
            className={`text-black w-12 h-12 p-4 rounded-full bg-white ${
              showFullTables ? "rotate-180" : ""
            }`}
            fill="currentColor"
            clip-rule="evenodd"
            fill-rule="evenodd"
            stroke-linejoin="round"
            stroke-miterlimit="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            onClick={toggleFullTables}
          >
            <path
              d="m5.214 14.522s4.505 4.502 6.259 6.255c.146.147.338.22.53.22s.384-.073.53-.22c1.754-1.752 6.249-6.244 6.249-6.244.144-.144.216-.334.217-.523 0-.193-.074-.386-.221-.534-.293-.293-.766-.294-1.057-.004l-4.968 4.968v-14.692c0-.414-.336-.75-.75-.75s-.75.336-.75.75v14.692l-4.979-4.978c-.289-.289-.761-.287-1.054.006-.148.148-.222.341-.221.534 0 .189.071.377.215.52z"
              fill-rule="nonzero"
            />
          </svg>
        </div> */}
      </div>
    </div>
  );
}
