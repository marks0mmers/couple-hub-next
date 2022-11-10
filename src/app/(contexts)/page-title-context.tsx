"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

export const PageTitleContext = createContext<[string, Dispatch<SetStateAction<string>>]>([
  "Couple Planner",
  (x) => x,
]);

export const usePageTitle = () => {
  return useContext(PageTitleContext);
};

export default function PageTitleProvider({ children }: { children: ReactNode }) {
  const [pageTitle, setPageTitle] = useState("Couple Planner");

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <PageTitleContext.Provider value={[pageTitle, setPageTitle]}>
      {children}
    </PageTitleContext.Provider>
  );
}
