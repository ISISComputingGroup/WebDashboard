import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <section className="bg-white">
      <div className="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8">
        <nav className="flex flex-wrap justify-center -mx-5 -my-2">
          <div className="px-5 py-2">
            <Link
              href="#"
              className="text-base leading-6 text-gray-500 hover:text-gray-900"
            >
              Instruments
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link
              href="#"
              className="text-base leading-6 text-gray-500 hover:text-gray-900"
            >
              How to use
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link
              href="#"
              className="text-base leading-6 text-gray-500 hover:text-gray-900"
            >
              Terms
            </Link>
          </div>
        </nav>
        <p className="mt-8 text-base leading-6 text-center text-gray-400">
          © 2021 Experiment Controls at ISIS. All rights reserved.
        </p>
      </div>
    </section>
  );
}
