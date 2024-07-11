import { getForegroundColor, getStatusColor } from "./getRunstateColours";

const runStateStr = "Run state STR";
const configName = "Config name";

const TopBar = ({ monitoredPVs, instName, configName, runStateStr }) => {
  if (!monitoredPVs || !monitoredPVs.size) {
    return (
      <h1 className="text-lg w-full text-white bg-gray-400 border-gray-500 border-2 p-3 font-semibold px-7 animate-pulse">
        Loading...
      </h1>
    );
  }

  return (
    <div
      id="top_bar"
      className="w-full bg-white  shadow-lg text-black rounded-xl text-md"
    >
      <div className="text-left mb-4">
        <h1 className="text-black text-2xl">
          Instrument:{" "}
          <span className="font-semibold">{instName.toUpperCase()}</span>
        </h1>
        <h1 className="text-black text-lg">
          Config:{" "}
          <span className="font-semibold">
            {monitoredPVs.has(configName)
              ? monitoredPVs.get(configName)[0]
              : "UNKNOWN"}
          </span>
        </h1>
      </div>
      <div
        id="inst_name"
        className="w-full flex justify-center items-center flex-col"
      >
        <h2
          className={`text-center p-4 text-xl rounded-t-lg w-full 
          ${getStatusColor(runStateStr ? monitoredPVs.get(runStateStr)[0] : "UNKNOWN")} ${getForegroundColor(
            monitoredPVs.has(runStateStr)
              ? monitoredPVs.get(runStateStr)[0]
              : "UNKNOWN"
          )}
          
          `}
        >
          {instName.toUpperCase()} is{" "}
          <span>
            {monitoredPVs.has(runStateStr)
              ? monitoredPVs.get(runStateStr)[0]
              : "UNKNOWN"}
          </span>
        </h2>
        <div className="bg-gray-50 border-2 border-gray-800 m-4 p-4 shadow-md flex flex-col">
          <table className="text-sm w-full table-fixed flex">
            <thead>
              <tr className="bg-blue-gray-100 text-gray-700"></tr>
            </thead>

            <tbody className="text-gray-200 ">
              <tr>
                {[0, 1, 2].map((index) => (
                  <th key={index} id={index}>
                    {getMonitoredPVs(index, monitoredPVs)}
                  </th>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        {}
      </div>
    </div>
  );
};

function getMonitoredPVs(index, monitoredPVs) {
  let dom = [];

  for (var i = 0; i <= 3; i++) {
    for (const pvarr of monitoredPVs.values()) {
      const col = pvarr[1];
      const row = pvarr[0];

      if (col == index && row == i) {
        const label = pvarr[2];
        const value = pvarr[3];

        dom.push(
          <tr
            id={label}
            key={label}
            className="border-b border-gray-300 text-black transition duration-100 hover:bg-gray-700 hover:text-white"
          >
            <td className="py-1 px-4 flex">{label}</td>
            <td className="py-1 px-4 flex justify-between items-center">
              <span className="font-light">{value}</span>
              <svg
                id={label + "_VALUE"}
                className="min-w-2 min-h-2 max-w-2 max-h-2 transition-all text-transparent text-sm"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="12" />
              </svg>
            </td>
          </tr>
        );
      }
    }
  }
  return dom;
}

export default TopBar;
