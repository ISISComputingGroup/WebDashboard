import React, { useState, useCallback, useEffect } from "react";
import io from "socket.io-client";

const TopBar = ({ instPvs, slug }) => {
  if (!instPvs || !slug) {
    return <h1>Loading...</h1>;
  }

  // socket work
  const [instData, setInstData] = useState({});

  const updateInstData = async (data) => {
    //  const pvInfo = {
    //   pvName: pvList[index],
    //   value: data,
    //   // Add more information as needed
    // };

    // is what data is

    // check if the data is already in the state
    // if it is, update it
    // if it isn't, add it
    await setInstData((prevData) => {
      return {
        ...prevData,
        [data["pvName"]]: data,
      };
    });

    // find the pv with its id and make bg greenf or 2 seconds
    // const pv = document.getElementById(data["pvName"] + "_VALUE");

    // if (!pv) return;

    // pv.classList.add(
    //   // "bg-green-500",
    //   "transition-all",
    //   // "duration-1000",
    //   "ease-in-out",
    //   "font-bold"
    // );

    // setTimeout(() => {
    //   // pv.classList.remove("bg-green-500");
    //   pv.classList.remove("transition-all");
    //   pv.classList.remove("font-bold");
    // }, 2000);
  };

  const [socket, setSocket] = useState(null);
  // const socket = io("http://localhost:5000");

  useEffect(() => {
    if (!socket) {
      setSocket(io("http://localhost:5000"));
    }

    return () => {
      socket?.disconnect();
    };
  }, [socket]);

  const startGrabbingData = () => {
    socket.on("connect", () => {
      console.log("Connected to server as  " + socket.id);
      socket.emit("intitalRequest", slug[0]);
    });

    socket.on("instData", (data) => {
      console.log("InstData received:", data);
      // update the data structure to be displayed in the top bar
      updateInstData(data);
    });
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("Connected to server as " + socket.id);
      socket.emit("intitalRequest", slug[0]);
    });

    socket.on("instData", (data) => {
      console.log("InstData received:", data);
      // update the data structure to be displayed in the top bar
      updateInstData(data);
    });

    return () => {
      socket.off("connect");
      socket.off("instData");
    };
  }, [socket]);

  // useEffect(() => {
  //   startGrabbingData();
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  // template work
  // create some pvs just so we can see the tables etc and develop the page
  const pvs = Object.entries(instPvs);
  const pvLength = pvs.length;
  // Example of item in a pvSet:
  // [
  //     "RUNSTATE",
  //     {
  //         "status": "Connected",
  //         "value": 1,
  //         "alarm": "",
  //         "visibility": true,
  //         "rc_enabled": "NO"
  //     }
  // ],
  const pvSet1 = pvs.slice(0, Math.floor(pvLength / 3));
  const pvSet2 = pvs.slice(
    Math.floor(pvLength / 3),
    Math.floor((pvLength / 3) * 2)
  );
  const pvSet3 = pvs.slice(Math.floor((pvLength / 3) * 2), pvLength);

  // search functionality, will be split into components later to not have this repetition
  const [search, setSearch] = useState("");
  const [search2, setSearch2] = useState("");
  const [search3, setSearch3] = useState("");

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };
  const handleSearch2 = (event) => {
    setSearch2(event.target.value);
  };
  const handleSearch3 = (event) => {
    setSearch3(event.target.value);
  };

  const filteredPv3 = pvSet3.filter(([block]) => {
    return block.toLowerCase().includes(search3.toLowerCase());
  });

  const filteredPv2 = pvSet2.filter(([block]) => {
    return block.toLowerCase().includes(search2.toLowerCase());
  });

  const filteredPv1 = pvSet1.filter(([block]) => {
    return block.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div
      id="top_bar"
      className="w-full bg-white  shadow-lg text-black rounded-xl text-md"
    >
      <div id="inst_name">
        <h2 className={`text-center bg-green-500 p-4 text-xl rounded-t-lg`}>
          {slug[0].toUpperCase()} is <span>{instPvs["RUNSTATE"]["value"]}</span>
        </h2>
        {/* <h1 className="text-center text-white bg-gray-400 border-gray-500 border-2 p-3 font-semibold px-7">
         
        </h1> */}
        <div className="bg-gray-50 border-2 border-gray-800 m-4 p-4 shadow-md w-1/2">
          <h2 className="px-4 font-semibold text-lg ">Test Data:</h2>
          <table className="text-sm w-full table-fixed ">
            <thead>
              <tr className="bg-blue-gray-100 text-gray-700">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Value</th>
              </tr>
            </thead>
            <tbody className="text-gray-200 ">
              {Object.keys(instData).map((pv) => (
                <tr
                  id={pv}
                  key={pv}
                  className="border-b border-gray-300 text-black transition duration-100 hover:bg-gray-700 hover:text-white"
                >
                  <td className="py-1 px-4">{pv}</td>
                  <td id={pv + "_VALUE"} className="py-1 px-4">
                    {instData[pv]["value"]}
                  </td>
                </tr>
                // <tr
                //   key={block[0]}
                //   className="border-b border-gray-300 text-black transition duration-100 hover:bg-gray-700 hover:text-white"
                // >
                //   <td className="py-1 px-4">{block[0]}</td>
                //   <td className="py-1 px-4">{block[1]["value"]}</td>
                // </tr>
              ))}
            </tbody>
          </table>
          {/* <ul>
            {Object.keys(instData).map((pv) => (
              <li id={pv} key={pv}>
                {pv}: {instData[pv]["value"]}
              </li>
            ))}
          </ul> */}
        </div>
      </div>
      <div className="flex-col flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 overflow-x-auto   w-full">
          <div className="bg-gray-200">
            <h1 className="text-lg w-full text-white bg-gray-400 border-gray-500 border-2 p-3 font-semibold px-7">
              Soft
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
                onChange={handleSearch}
                type="search"
                value={search}
                id="search"
                autoComplete="off"
                className="block w-full p-4 ps-10 text-sm text-gray-900  bg-gray-50 focus:ring-blue-500  "
                placeholder="Search for PV name"
              />
            </div>
            <div className={`text-sm bg-gray-200 `}>
              <table className="text-sm">
                <thead>
                  <tr className="bg-blue-gray-100 text-gray-700">
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Value</th>
                  </tr>
                </thead>
                <tbody className="text-gray-200 ">
                  {filteredPv1.map((block) => (
                    <tr
                      key={block[0]}
                      className="border-b border-gray-300 text-black transition duration-100 hover:bg-gray-700 hover:text-white"
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
                onChange={handleSearch2}
                type="search"
                value={search2}
                id="search2"
                autoComplete="off"
                className="block w-full p-4 ps-10 text-sm text-gray-900  bg-gray-50 focus:ring-blue-500  "
                placeholder="Search for PV name"
              />
            </div>
            <div className={`p-3 bg-gray-200 `}>
              <table className="text-sm">
                <thead>
                  <tr className="bg-blue-gray-100 text-gray-700">
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Value</th>
                  </tr>
                </thead>
                <tbody className="text-gray-200 ">
                  {filteredPv2.map((block) => (
                    <tr
                      key={block[0]}
                      className="border-b border-gray-300 text-black transition duration-100 hover:bg-gray-700 hover:text-white"
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
                onChange={handleSearch3}
                type="search"
                value={search3}
                id="search3"
                autoComplete="off"
                className="block w-full p-4 ps-10 text-sm text-gray-900  bg-gray-50 focus:ring-blue-500  "
                placeholder="Search for PV name"
              />
            </div>
            <div className={`p-3 bg-gray-200 `}>
              <table className="text-sm">
                <thead>
                  <tr className="bg-blue-gray-100 text-gray-700">
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Value</th>
                  </tr>
                </thead>
                <tbody className="text-gray-200 ">
                  {filteredPv3.map((block) => (
                    <tr
                      key={block[0]}
                      className="border-b border-gray-300 text-black transition duration-100 hover:bg-gray-700 hover:text-white"
                    >
                      <td className="py-1 px-4">{block[0]}</td>
                      <td className="py-1 px-4">{block[1]["value"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
