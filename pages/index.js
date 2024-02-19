import Image from "next/image";
import { Inter } from "next/font/google";
import Group from "@/components/Group";
import TopBar from "@/components/TopBar";
import { useRouter } from "next/router";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen bg-gray-100 flex-col items-center justify-between ${inter.className}`}
    >
      <section class=" rounded-xl w-full  p-12 ">
        <div class="px-12 mx-auto max-w-7xl">
          <div class="w-full mx-auto text-left md:w-11/12 xl:w-9/12 md:text-center">
            <div class="mb-8 flex flex-col text-4xl font-extrabold leading-none tracking-normal text-gray-900 md:text-6xl md:tracking-tight">
              <h1>Experiment Controls</h1>{" "}
              <h1 class="block w-full mt-2 py-2 text-transparent bg-clip-text leading-12 bg-gradient-to-r from-green-400 to-purple-500 lg:inline">
                Web Dashboard
              </h1>{" "}
              {/* <span>around your product ?</span> */}
            </div>
            <p class="px-0 mb-8 text-lg text-gray-600 md:text-xl lg:px-24">
              Use this dashboard to monitor run and block information of your
              experiment
            </p>
            <div class="mb-4 space-x-0 md:space-x-2 md:mb-8">
              <Link
                href="/instruments/inter"
                class="inline-flex items-center justify-center border-4 border-white focus:border-green-400 transition-all duration-20 w-full px-6 py-3 mb-2 text-lg text-white bg-green-400 hover:bg-green-500 rounded-2xl sm:w-auto sm:mb-0"
              >
                View instruments
                <svg
                  class="w-4 h-4 ml-1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </Link>
              <Link
                href="/"
                class="inline-flex items-center transition-all duration-200 border-4 border-white focus:border-gray-300 justify-center w-full px-6 py-3 mb-2 text-lg bg-gray-300 hover:bg-gray-400 rounded-2xl sm:w-auto sm:mb-0"
              >
                Learn More
                <svg
                  class="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  ></path>
                </svg>
              </Link>
            </div>
          </div>
          <div class="w-full mx-auto mt-20 text-center md:w-10/12">
            <div class="relative z-0 w-full mt-8">
              <div class="relative overflow-hidden shadow-2xl">
                {/* <div class="flex items-center flex-none px-4 bg-green-400 rounded-b-none h-11 rounded-xl">
                  <div class="flex space-x-1.5">
                    <div class="w-3 h-3 border-2 border-white rounded-full"></div>
                    <div class="w-3 h-3 border-2 border-white rounded-full"></div>
                    <div class="w-3 h-3 border-2 border-white rounded-full"></div>
                  </div>
                </div> */}
                <img src="/ibex.jpg" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
