import React, { useState, useCallback, useEffect } from "react";
import io from "socket.io-client";

const TopBar = ({ monitoredPVs, instName }) => {
  if (!monitoredPVs) {
    return "";
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
          Config: <span className="font-semibold">CONFIG</span>
        </h1>
      </div>
      <div
        id="inst_name"
        className="w-full flex justify-center items-center flex-col"
      >
        <h2
          className={`text-center bg-green-500 p-4 text-xl rounded-t-lg w-full`}
        >
          {instName.toUpperCase()} is{" "}
          <span>
            {monitoredPVs["IN:" + instName.toUpperCase() + ":DAE:RUNSTATE_STR"] 
              }
          </span>
        </h2>
        {/* <h1 className="text-center text-white bg-gray-400 border-gray-500 border-2 p-3 font-semibold px-7">
         
        </h1> */}
        <div className="bg-gray-50 border-2 border-gray-800 m-4 p-4 shadow-md ">
          <h2 className="px-4 font-semibold text-lg ">Test Data:</h2>
          <table className="text-sm w-full table-fixed ">
            <thead>
              <tr className="bg-blue-gray-100 text-gray-700">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Value</th>
              </tr>
            </thead>
            <tbody className="text-gray-200 ">
              {Object.keys(monitoredPVs).map((pv) => (
                <tr
                  id={pv}
                  key={pv}
                  className="border-b border-gray-300 text-black transition duration-100 hover:bg-gray-700 hover:text-white"
                >
                  <td className="py-1 px-4">{pv}</td>
                  <td className="py-1 px-4 flex justify-between items-center">
                    <span>{monitoredPVs[pv]}</span>
                    <svg
                      id={pv + "_VALUE"}
                      className="min-w-2 min-h-2 max-w-2 max-h-2 transition-all text-transparent"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="12" />
                    </svg>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {}
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="w-full bg-gray-700 text-black rounded-lg text-md">
    <div id="inst_name">
      <h2 className="text-center bg-green-500 p-4 text-xl rounded-t-lg animate-pulse">
        Loading...
      </h2>
    </div>
    <div className="flex-col flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 overflow-x-auto w-full">
        {[1, 2, 3].map((index) => (
          <div key={index} className="bg-gray-200">
            <h1 className="text-lg w-full text-white bg-gray-400 border-gray-500 border-2 p-3 font-semibold px-7 animate-pulse">
              Loading...
            </h1>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id={`search${index}`}
                className="block w-full p-4 ps-10 text-sm text-gray-900 bg-gray-50 focus:ring-blue-500 animate-pulse"
                placeholder="Loading..."
                readOnly
              />
            </div>
            <div className="text-sm bg-gray-200 animate-pulse">
              <table className="text-sm">
                <thead>
                  <tr className="bg-blue-gray-100 text-gray-700">
                    <th className="py-3 px-4 text-left">Loading...</th>
                    <th className="py-3 px-4 text-left">Loading...</th>
                  </tr>
                </thead>
                <tbody className="text-gray-200">
                  {[1, 2, 3].map((item) => (
                    <tr
                      key={item}
                      className="border-b border-gray-300 text-black transition duration-100 hover:bg-gray-700 hover:text-white animate-pulse"
                    >
                      <td className="py-1 px-4">Loading...</td>
                      <td className="py-1 px-4">Loading...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default TopBar;
