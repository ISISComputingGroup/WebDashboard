import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
  // set class based on the user system preference
  const [theme, setTheme ] = useState("dark");

  useEffect(() => {
    console.log("useEffect");
    const button = document.getElementById("theme-switch")!;

    button.addEventListener("click", (event) => {
      handleThemeSwitch();
    });

    const userPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    console.log("userPrefersDark", userPrefersDark);
    if (userPrefersDark) {
      document.getElementsByTagName("body")[0].classList.add("dark");
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.getElementsByTagName("body")[0].classList.add("dark");
    } else {
      document.getElementsByTagName("body")[0].classList.remove("dark");
    }
  }, [theme]);

  const handleThemeSwitch = () => {
    console.log("changing theme");
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // useEffect(() => {
  //   const userPrefersDark = window.matchMedia(
  //     "(prefers-color-scheme: dark)"
  //   ).matches;
  //   console.log("userPrefersDark", userPrefersDark);
  //   if (userPrefersDark) {
  //     document.getElementsByTagName("body").classList.add("dark");
  //     setThemeClass("dark");
  //   }
  // }, []);

  // const changeTheme = () => {
  //   console.log("changing theme");
  //   if (themeClass === "dark") {
  //     document.getElementsByTagName("body").classList.remove("dark");
  //     setThemeClass("light");
  //   } else {
  //     document.getElementsByTagName("body").classList.add("dark");
  //     setThemeClass("dark");
  //   }
  // };

  return (
    <header className="items-center bg-white dark:bg-zinc-900 py-4 px-8 shadow-xl justify-between sm:flex hidden">
      <Link
        href="/"
        aria-label="Home"
        className="flex items-center gap-4 bg-white dark:bg-[#18171e] rounded-lg px-4"
      >
        <Image
          src="/IBEX_logo.png"
          alt="IBEX Logo"
          className="h-16 w-auto"
          height={100}
          width={100}
        />

        <h1 className="text-black dark:text-white font-bold text-2xl">
          Web Dashboard
        </h1>
      </Link>

      <div className="md:flex hidden gap-2">
        <Link
          className="block py-2 px-3 rounded text-black dark:text-white hover:text-white hover:bg-zinc-800"
          href="/"
        >
          Home
        </Link>
        <Link
          className="block py-2 px-3 rounded text-black dark:text-white hover:text-white hover:bg-zinc-800"
          href="/instruments"
        >
          Instrument Status
        </Link>
        <Link
          className="block py-2 px-3 rounded text-black dark:text-white hover:text-white hover:bg-zinc-800"
          href="/wall"
        >
          The Wall
        </Link>
        <Link
          className="block py-2 px-3 rounded text-black dark:text-white hover:text-white hover:bg-zinc-800"
          href="/support"
        >
          Support
        </Link>
        <Link
          className="block py-2 px-3 rounded text-black dark:text-white hover:text-white hover:bg-zinc-800"
          href="https://www.isis.stfc.ac.uk/Pages/Beam-Status.aspx"
          target="_blank"
        >
          Beam status
        </Link>
        <Link
          className="block py-2 px-3 rounded text-black dark:text-white hover:text-white hover:bg-zinc-800"
          href="https://github.com/ISISComputingGroup/WebDashboard"
        >
          <svg
            className="fill-current w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </Link>
        <button
          type="button"
          title="Toggle Dark Mode"
          className="p-2 rounded focus:outline-none text-black dark:text-white hover:text-white hover:bg-zinc-800"
          // onClick={handleThemeSwitch}
          id="theme-switch"
        >
          {theme === "light" ? (
            <svg
              className="fill-current w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M4.069 13h-4.069v-2h4.069c-.041.328-.069.661-.069 1s.028.672.069 1zm3.034-7.312l-2.881-2.881-1.414 1.414 2.881 2.881c.411-.529.885-1.003 1.414-1.414zm11.209 1.414l2.881-2.881-1.414-1.414-2.881 2.881c.528.411 1.002.886 1.414 1.414zm-6.312-3.102c.339 0 .672.028 1 .069v-4.069h-2v4.069c.328-.041.661-.069 1-.069zm0 16c-.339 0-.672-.028-1-.069v4.069h2v-4.069c-.328.041-.661.069-1 .069zm7.931-9c.041.328.069.661.069 1s-.028.672-.069 1h4.069v-2h-4.069zm-3.033 7.312l2.88 2.88 1.415-1.414-2.88-2.88c-.412.528-.886 1.002-1.415 1.414zm-11.21-1.415l-2.88 2.88 1.414 1.414 2.88-2.88c-.528-.411-1.003-.885-1.414-1.414zm2.312-4.897c0 2.206 1.794 4 4 4s4-1.794 4-4-1.794-4-4-4-4 1.794-4 4zm10 0c0 3.314-2.686 6-6 6s-6-2.686-6-6 2.686-6 6-6 6 2.686 6 6z" />
            </svg>
          ) : (
            <svg
              className="fill-current w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 10.999c1.437.438 2.562 1.564 2.999 3.001.44-1.437 1.565-2.562 3.001-3-1.436-.439-2.561-1.563-3.001-3-.437 1.436-1.562 2.561-2.999 2.999zm8.001.001c.958.293 1.707 1.042 2 2.001.291-.959 1.042-1.709 1.999-2.001-.957-.292-1.707-1.042-2-2-.293.958-1.042 1.708-1.999 2zm-1-9c-.437 1.437-1.563 2.562-2.998 3.001 1.438.44 2.561 1.564 3.001 3.002.437-1.438 1.563-2.563 2.996-3.002-1.433-.437-2.559-1.564-2.999-3.001zm-7.001 22c-6.617 0-12-5.383-12-12s5.383-12 12-12c1.894 0 3.63.497 5.37 1.179-2.948.504-9.37 3.266-9.37 10.821 0 7.454 5.917 10.208 9.37 10.821-1.5.846-3.476 1.179-5.37 1.179z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
