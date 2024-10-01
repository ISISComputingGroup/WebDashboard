import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <section className="bg-white dark:bg-zinc-900  ">
      <div className="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8 w-full flex flex-col justify-center items-center ">
        <Link href="/" className="flex items-center justify-center ">
          <Image
            src="/WebDashboard/IBEX_logo.png"
            alt="IBEX Logo"
            className="h-16 w-auto"
            width={128}
            height={128}
          />
        </Link>
        <nav className="flex flex-wrap justify-center -mx-5 -my-2">
          <Link
            href="#"
            className="text-base leading-6 text-gray-500 hover:text-gray-900  dark:text-white dark:hover:text-gray-400 transition-color duration-100 px-5 py-2"
          >
            Home
          </Link>
          <Link
            href="/instruments"
            className="text-base leading-6 text-gray-500 hover:text-gray-900  dark:text-white dark:hover:text-gray-400 transition-color duration-100 px-5 py-2"
          >
            Instrument statuses
          </Link>

          <Link
            href="/wall"
            className="text-base leading-6 text-gray-500 hover:text-gray-900  dark:text-white dark:hover:text-gray-400 transition-color duration-100 px-5 py-2"
          >
            The Wall
          </Link>

          <Link
            href="#"
            className="text-base leading-6 text-gray-500 hover:text-gray-900  dark:text-white dark:hover:text-gray-400 transition-color duration-100 px-5 py-2"
          >
            Terms
          </Link>
        </nav>
        <p className="mt-8 text-base leading-6 text-center text-gray-400">
          © 2024 Experiment Controls at ISIS. All rights reserved.
        </p>
      </div>
    </section>
  );
}
