import { createContext } from "react";

const ThemeContext = createContext({
  themeClass: null,
  setThemeClass: null,
});

export default ThemeContext;
