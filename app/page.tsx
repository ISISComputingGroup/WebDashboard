"use client";
import { Inter } from "next/font/google";
import Link from "next/link";
import { motion } from "framer-motion";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex bg-gray-100 dark:bg-zinc-800 flex-col items-center justify-between ${inter.className}`}
    >
      <section className=" rounded-xl  p-2 md:p-12 ">
        <div className="px-12 mx-auto">
          <div className="w-full mx-auto text-left md:w-11/12 xl:w-9/12 md:text-center">
            <div className="mb-8 flex flex-col text-4xl font-extrabold leading-none tracking-normal text-gray-900 dark:text-white md:text-6xl md:tracking-tight">
              <h1>Experiment Controls</h1>{" "}
              <h1 className="block w-full mt-2 py-2 text-transparent bg-clip-text leading-12 bg-gradient-to-r from-green-400 to-purple-500 lg:inline">
                Web Dashboard
              </h1>{" "}
            </div>
            <div className="mb-4 space-x-0 md:space-x-2 md:mb-8">
              <div className="relative inline-flex  group">
                <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>

                <Link
                  href="/instruments/"
                  className="relative inline-flex gap-4 items-center justify-center px-8 py-4 text-lg font-bold text-gray-900 dark:text-white transition-all duration-200 bg-white dark:bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:focus:ring-gray-900"
                  target="_self"
                  role="button"
                >
                  View Instruments
                  <svg
                    className="fill-current w-6 h-6"
                    clipRule="evenodd"
                    fillRule="evenodd"
                    strokeLinejoin="round"
                    strokeMiterlimit="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m14.523 18.787s4.501-4.505 6.255-6.26c.146-.146.219-.338.219-.53s-.073-.383-.219-.53c-1.753-1.754-6.255-6.258-6.255-6.258-.144-.145-.334-.217-.524-.217-.193 0-.385.074-.532.221-.293.292-.295.766-.004 1.056l4.978 4.978h-14.692c-.414 0-.75.336-.75.75s.336.75.75.75h14.692l-4.979 4.979c-.289.289-.286.762.006 1.054.148.148.341.222.533.222.19 0 .378-.072.522-.215z"
                      fillRule="nonzero"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className=" mx-auto mt-20 w-full">
            <section className="">
              <div className="container md:px-6 mx-auto">
                <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 md:grid-cols-2 xl:grid-cols-3">
                  <motion.div
                    whileHover={{ y: -10 }}
                    className="p-8 space-y-3 border-2 border-blue-400 dark:border-blue-300 rounded-xl bg-white dark:bg-zinc-900"
                  >
                    <span className="inline-block text-blue-500 dark:text-blue-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                        />
                      </svg>
                    </span>

                    <h1 className="text-xl font-semibold text-zinc-700 capitalize dark:text-white">
                      Quick Links
                    </h1>

                    <p className="text-zinc-500 dark:text-zinc-300">
                      View instrument scientist quick links (requires login).
                    </p>

                    <a
                      href="https://stfc365.sharepoint.com/sites/isis-hub/SitePages/Instrument-Quick-Links.aspx"
                      className="inline-flex p-2 text-blue-500 capitalize transition-colors duration-200 transform bg-blue-100 rounded-full dark:bg-blue-500 dark:text-white hover:underline hover:text-blue-600 dark:hover:text-blue-500"
                      target="_blank"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </a>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -10 }}
                    className="p-8 space-y-3 border-2 border-blue-400 dark:border-blue-300 rounded-xl bg-white dark:bg-zinc-900"
                  >
                    <span className="inline-block text-blue-500 dark:text-blue-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                        />
                      </svg>
                    </span>

                    <h1 className="text-xl font-semibold text-zinc-700 capitalize dark:text-white">
                      Instrument Journals
                    </h1>

                    <p className="text-zinc-500 dark:text-zinc-300">
                      View recent instrument journal entries (requires login).
                    </p>

                    <a
                      href="https://shadow.nd.rl.ac.uk/journals/"
                      className="inline-flex p-2 text-blue-500 capitalize transition-colors duration-200 transform bg-blue-100 rounded-full dark:bg-blue-500 dark:text-white hover:underline hover:text-blue-600 dark:hover:text-blue-500"
                      target="_blank"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </a>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -10 }}
                    className="p-8 space-y-3 border-2 border-blue-400 dark:border-blue-300 rounded-xl bg-white dark:bg-zinc-900"
                  >
                    <span className="inline-block text-blue-500 dark:text-blue-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                    </span>

                    <h1 className="text-xl font-semibold text-zinc-700 capitalize dark:text-white">
                      Beam status & MCR News
                    </h1>

                    <p className="text-zinc-500 dark:text-zinc-300">
                      View current beam status & recent MCR news updates.
                    </p>

                    <a
                      href="https://www.isis.stfc.ac.uk/Pages/Beam-Status.aspx"
                      className="inline-flex p-2 text-blue-500 capitalize transition-colors duration-200 transform bg-blue-100 rounded-full dark:bg-blue-500 dark:text-white hover:underline hover:text-blue-600 dark:hover:text-blue-500"
                      target="_blank"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </a>
                  </motion.div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
