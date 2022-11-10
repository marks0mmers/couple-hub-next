"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

export const ThemeContext = createContext<[string, Dispatch<SetStateAction<string>>]>([
  "light",
  (x) => x,
]);

export const useTheme = () => {
  return useContext(ThemeContext);
};

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useState("light");

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
