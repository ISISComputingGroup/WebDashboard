import React from "react";
import Link from "next/link";

export default function NavBar() {
  return (
    <>
      <div className="bg-gray-100 shadow w-full hidden sm:flex  ">
        <div className="container mx-auto px-4 w-full max-w-7xl">
          <div className="flex justify-between items-center py-4 w-full">
            <div className="flex  justify-start w-full ">
              <Link href="/" className="flex items-center justify-center ">
                <img
                  src="/ibex_logo.png"
                  alt="IBEX Logo"
                  className="h-16 w-auto"
                />
              </Link>
              <div className="flex flex-col justify-center items-center divide-y">
                <Link
                  href="/"
                  className="text-left text-lg w-full transition-all duration-200 font-semibold  py-2 text-black hover:text-blue-600"
                >
                  IBEX Web Dashboard
                </Link>
                <div className="flex items-start  justify-left text-left w-full text-lg">
                  <Link
                    href="/instruments"
                    className="text-gray-700  font-semibold  text-left hover:text-blue-600 mr-4 transition-all duration-200"
                  >
                    Instruments
                  </Link>
                  {/* <Link
                    href="/how-to-use"
                    className="text-gray-700  font-semibold  text-left hover:text-blue-600 transition-all duration-200"
                  >
                    How to use
                  </Link> */}
                </div>
              </div>

              <div className="flex items-center justify-end"></div>
            </div>

            <svg
              fill="currentColor"
              className="h-16 w-auto text-[#18334b] hover:text-blue-600 transition-all duration-200"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1326.99 700.65"
            >
              <g id="logo">
                <path
                  id="S"
                  className="cls-1"
                  d="M1062.59,316.3l45.6-54.88c25.52,21.73,58.09,36.95,87.41,36.95,33.11,0,49.41-13.05,49.41-34.24,0-22.29-20.09-29.34-51-42.41l-46.14-19.54c-36.39-14.69-71.14-45.13-71.14-96.75,0-58.71,52.13-105.44,126-105.44,40.72,0,83.6,16.3,114,46.73L1276,97.27C1252.62,79.33,1230.89,69,1202.66,69c-27.69,0-45.08,11.94-45.08,32.07,0,21.73,23.37,29.34,53.76,41.84l45.6,18.48c42.91,17.4,70,46.2,70,96.2,0,58.69-48.87,109.78-133.56,109.78-46.14,0-95-17.4-130.84-51.09"
                />
                <path
                  id="C"
                  className="cls-1"
                  d="M767.77,185.85C767.77,68.48,845.39,0,935,0c45.6,0,82.51,21.74,106.39,46.19L999.05,97.27C981.13,81,962.13,69,936.61,69c-48.32,0-86.85,42.91-86.85,114.12,0,72.82,33.64,115.22,85.75,115.22,28.79,0,51.57-14.68,69-33.15l42.36,50c-29.33,34.24-68.44,52.18-114.56,52.18-89.58,0-164.5-62.51-164.5-181.54"
                />
                <rect
                  id="I"
                  className="cls-1"
                  x="621.15"
                  y="6.51"
                  width="79.81"
                  height="354.37"
                />
                <path
                  id="P"
                  className="cls-1"
                  d="M416.45,177.16c44,0,65.15-19.57,65.15-56.52s-23.9-50.55-67.33-50.55H377.34V177.16ZM297.56,6.51H419.15c77.64,0,140.61,28.27,140.61,114.13,0,83.15-63.51,120.11-138.44,120.11h-44V360.87H297.56Z"
                />
                <polygon
                  id="E"
                  className="cls-1"
                  points="0 6.51 0 360.87 226.94 360.87 226.94 293.48 79.81 293.48 79.81 211.94 200.33 211.94 200.33 145.09 79.81 145.09 79.81 73.9 221.51 73.9 221.51 6.51 0 6.51"
                />
                <polygon
                  id="signe"
                  className="cls-1"
                  points="1084.31 421.26 1084.31 629.69 1012.93 629.69 1012.93 421.26 770.24 421.26 770.24 629.69 699.03 629.69 699.03 421.26 0 421.26 0 700.65 242.68 700.65 242.68 492.22 314.07 492.22 314.07 700.65 556.73 700.65 556.73 492.22 628.09 492.22 628.09 700.65 1326.99 700.65 1326.99 421.26 1084.31 421.26"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* MOBILE NAV BAR */}
      <div className="bg-gray-100 shadow w-full flex sm:hidden   ">
        <div className="container mx-auto px-4 w-full max-w-7xl">
          <div className="flex justify-between items-center py-4 w-full">
            <div className="flex flex-col sm:flex-row items-start  sm:items-center justify-start w-full ">
              <div className="flex flex-col justify-center items-center divide-y">
                <Link
                  href="/"
                  className="text-left text-lg w-full transition-all duration-200 font-semibold  py-2 text-black hover:text-blue-600"
                >
                  IBEX Web Dashboard
                </Link>
                <div className="flex items-start  justify-left text-left w-full text-lg">
                  <Link
                    href="/instruments"
                    className="text-gray-700  font-semibold  text-left hover:text-blue-600 mr-4 transition-all duration-200"
                  >
                    Instruments
                  </Link>
                  {/* <Link
                    href="/how-to-use"
                    className="text-gray-700  font-semibold  text-left hover:text-blue-600 transition-all duration-200"
                  >
                    How to use
                  </Link> */}
                </div>
              </div>
            </div>
            <Link href="/" className="flex items-center justify-center ">
              <img
                src="/ibex_logo.png"
                alt="IBEX Logo"
                className="h-16 w-auto"
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
