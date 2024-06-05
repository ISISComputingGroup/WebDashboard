import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Html, Head, Main, NextScript } from "next/document";
import ThemeContext from "@/components/ThemeContext";
import { useState } from "react";

export default function Document() {
  const [themeClass, setThemeClass] = useState("light"); // change the default here

  return (
    <Html lang="en">
      <Head />
      {/* <ThemeContext.Provider value={{ themeClass, setThemeClass }}> */}
      <body>
        <NavBar />
        <Main />
        <Footer />
        <NextScript />
      </body>
      {/* </ThemeContext.Provider> */}
    </Html>
  );
}
