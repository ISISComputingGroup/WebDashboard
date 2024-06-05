import { Inter } from "next/font/google";
import Link from "next/link";
import { motion } from "framer-motion";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen bg-gray-100 dark:bg-zinc-800 flex-col items-center justify-between ${inter.className}`}
    >
      <section className=" rounded-xl w-full  p-12 ">
        <div className="px-12 mx-auto max-w-7xl">
          <div className="w-full mx-auto text-left md:w-11/12 xl:w-9/12 md:text-center">
            <div className="mb-8 flex flex-col text-4xl font-extrabold leading-none tracking-normal text-gray-900 dark:text-white md:text-6xl md:tracking-tight">
              <h1>Experiment Controls</h1>{" "}
              <h1 className="block w-full mt-2 py-2 text-transparent bg-clip-text leading-12 bg-gradient-to-r from-green-400 to-purple-500 lg:inline">
                Web Dashboard
              </h1>{" "}
              {/* <span>around your product ?</span> */}
            </div>
            <p className="px-0 mb-8 text-lg text-gray-600 dark:text-white md:text-xl lg:px-24">
              Use this dashboard to monitor run and block information of your
              experiment
            </p>
            <div className="mb-4 space-x-0 md:space-x-2 md:mb-8">
              <div class="relative inline-flex  group">
                <div class="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>

                <Link
                  href="/instruments/"
                  class="relative inline-flex gap-4 items-center justify-center px-8 py-4 text-lg font-bold text-gray-900 dark:text-white transition-all duration-200 bg-white dark:bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:focus:ring-gray-900"
                  target="_self"
                  role="button"
                >
                  View instruments
                  <svg
                    className="fill-current w-6 h-6"
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    stroke-linejoin="round"
                    stroke-miterlimit="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m14.523 18.787s4.501-4.505 6.255-6.26c.146-.146.219-.338.219-.53s-.073-.383-.219-.53c-1.753-1.754-6.255-6.258-6.255-6.258-.144-.145-.334-.217-.524-.217-.193 0-.385.074-.532.221-.293.292-.295.766-.004 1.056l4.978 4.978h-14.692c-.414 0-.75.336-.75.75s.336.75.75.75h14.692l-4.979 4.979c-.289.289-.286.762.006 1.054.148.148.341.222.533.222.19 0 .378-.072.522-.215z"
                      fill-rule="nonzero"
                    />
                  </svg>
                </Link>
              </div>
              {/* <Link
                href="/instruments/"
                className="inline-flex items-center justify-center border-4 border-gray-100 focus:border-green-400 transition-all duration-20 w-full px-6 py-3 mb-2 text-lg text-white bg-green-400 hover:bg-green-500 rounded-2xl sm:w-auto sm:mb-0"
              >
                View instruments
                <svg
                  className="w-4 h-4 ml-1"
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
              </Link> */}
              {/* <Link
                href="https://www.isis.stfc.ac.uk/Pages/Instruments.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center transition-all duration-200 border-4 border-gray-100 focus:border-gray-300 justify-center w-full px-6 py-3 mb-2 text-lg bg-gray-300 hover:bg-gray-400 rounded-2xl sm:w-auto sm:mb-0"
              >
                Learn More
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  ></path>
                </svg>
              </Link> */}
            </div>
          </div>
          <div className=" mx-auto mt-20 w-full">
            <section class="">
              <div class="container px-6  mx-auto">
                {/* <h1 class="text-2xl font-semibold text-zinc-800 capitalize lg:text-4xl dark:text-white">
                  explore our <br /> awesome{" "}
                  <span class="underline decoration-blue-500">Components</span>
                </h1>

                <p class="mt-4 text-zinc-500 xl:mt-6 dark:text-zinc-300">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Nostrum quam voluptatibus
                </p> */}

                <div class="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 md:grid-cols-2 xl:grid-cols-3">
                  <motion.div
                    whileHover={{ y: -10 }}
                    class="p-8 space-y-3 border-2 border-blue-400 dark:border-blue-300 rounded-xl bg-white dark:bg-zinc-900"
                  >
                    <span class="inline-block text-blue-500 dark:text-blue-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-8 h-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                        />
                      </svg>
                    </span>

                    <h1 class="text-xl font-semibold text-zinc-700 capitalize dark:text-white">
                      Neutron and Muon Source of STFC
                    </h1>

                    <p class="text-zinc-500 dark:text-zinc-300">
                      The Science and Technology Facilities Council (STFC)
                      operates world-class neutron and muon sources, providing
                      advanced research capabilities for scientists across
                      various disciplines. These facilities enable the study of
                      materials at the atomic level.
                    </p>

                    <a
                      href="#"
                      class="inline-flex p-2 text-blue-500 capitalize transition-colors duration-200 transform bg-blue-100 rounded-full dark:bg-blue-500 dark:text-white hover:underline hover:text-blue-600 dark:hover:text-blue-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </a>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -10 }}
                    class="p-8 space-y-3 border-2 border-blue-400 dark:border-blue-300 rounded-xl bg-white dark:bg-zinc-900"
                  >
                    <span class="inline-block text-blue-500 dark:text-blue-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-8 h-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                        />
                      </svg>
                    </span>

                    <h1 class="text-xl font-semibold text-zinc-700 capitalize dark:text-white">
                      IBEX Control System
                    </h1>

                    <p class="text-zinc-500 dark:text-zinc-300">
                      The IBEX Control System is used to manage and control the
                      instruments at the neutron and muon sources of STFC. It
                      provides a user-friendly interface for scientists to
                      configure experiments, monitor data collection, and adjust
                      parameters in real-time, ensuring precise and efficient
                      operation.
                    </p>

                    <a
                      href="#"
                      class="inline-flex p-2 text-blue-500 capitalize transition-colors duration-200 transform bg-blue-100 rounded-full dark:bg-blue-500 dark:text-white hover:underline hover:text-blue-600 dark:hover:text-blue-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </a>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -10 }}
                    class="p-8 space-y-3 border-2 border-blue-400 dark:border-blue-300 rounded-xl bg-white dark:bg-zinc-900"
                  >
                    <span class="inline-block text-blue-500 dark:text-blue-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-8 h-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                    </span>

                    <h1 class="text-xl font-semibold text-zinc-700 capitalize dark:text-white">
                      Data Flow from PHOEBUS to Users
                    </h1>

                    <p class="text-zinc-500 dark:text-zinc-300">
                      Data from experiments is collected and processed by the
                      PHOEBUS system, which uses PV WebSockets to stream
                      real-time data to users' PCs. This ensures immediate
                      access to experimental results and facilitates quick
                      analysis and adjustments.
                    </p>

                    <Link
                      href="#"
                      class="inline-flex p-2 text-blue-500 capitalize transition-colors duration-200 transform bg-blue-100 rounded-full dark:bg-blue-500 dark:text-white hover:underline hover:text-blue-600 dark:hover:text-blue-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* <div class="fixed inset-x-0 lg:inset-x-auto bottom-6 lg:right-8 xl:right-10 xl:bottom-8">
              <div class="lg:w-72 px-6 lg:px-0">
                <div class="p-2 bg-blue-600 rounded-lg shadow-lg sm:p-3">
                  <div class="flex flex-wrap items-center justify-between">
                    <a
                      target="_blank"
                      href="https://www.buymeacoffee.com/khatabwedaa"
                      class="flex items-center flex-1 w-0"
                    >
                      <span class="flex p-2 bg-blue-800 rounded-lg">
                        <svg
                          class="h-6 w-6 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.12954 3.00772C5.48563 2.38457 6.14831 2 6.86603 2H17.134C17.8517 2 18.5144 2.38457 18.8704 3.00772L20.0133 5.00772C20.6612 6.14163 20.0618 7.51107 18.9235 7.89532C18.9276 7.97661 18.9269 8.0591 18.9209 8.14249L18.0638 20.1425C17.989 21.1891 17.1181 22 16.0689 22H7.9311C6.88182 22 6.01094 21.1891 5.93618 20.1425L5.07904 8.14249C5.07308 8.0591 5.07231 7.97661 5.07645 7.89531C3.93813 7.51105 3.33874 6.14162 3.98668 5.00772L5.12954 3.00772ZM7.07396 8L7.28824 11H16.7117L16.926 8H7.07396ZM7.71681 17L7.9311 20H16.0689L16.2831 17H7.71681ZM18.2768 6L17.134 4L6.86603 4L5.72317 6H18.2768Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </span>

                      <p class="ml-3 font-medium tracking-wide text-white truncate">
                        By me a coffee
                      </p>
                    </a>
                  </div>
                </div>
              </div>
            </div> */}

            {/* <div className="relative z-0 w-full mt-8">
              <div className="flex justify-center items-center overflow-hidden shadow-2xl ">
                <img
                  src="/ibex_example.jpg"
                  class=" w-full max-h-[500px] object-cover"
                />
              </div>
            </div> */}
          </div>
        </div>
      </section>
    </main>
  );
}
