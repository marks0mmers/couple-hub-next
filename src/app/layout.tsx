"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
} from "react";
import "./global.css";
import { themeChange } from "theme-change";
import { SessionProvider } from "next-auth/react";
import Header from "./header";
import clsx from "clsx";
import Link from "next/link";

const routes = [
  {
    url: "/",
    label: "Home",
  },
  {
    url: "/couple",
    label: "Couple",
  },
  {
    url: "/wedding",
    label: "Wedding",
  },
];

const ThemeContext = createContext<[string, Dispatch<SetStateAction<string>>]>(["light", (x) => x]);

export const useTheme = () => {
  return useContext(ThemeContext);
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const drawerToggleLink = useRef<HTMLInputElement>(null);

  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <html lang="en" data-theme="light">
      <head>
        <title>Couple Planner</title>
      </head>
      <body>
        <SessionProvider>
          <nav className="drawer">
            <input
              id="my-drawer"
              type="checkbox"
              className="drawer-toggle"
              ref={drawerToggleLink}
            />
            <div
              className={clsx(
                "drawer-content",
                "flex",
                "flex-col",
                "h-screen",
                "[&>div]:h-full",
                "[&>div]:flex",
                "[&>div>div]:h-full",
                "[&>div>div]:w-full",
                "[&>div>div]:flex"
              )}
            >
              <Header />
              {children}
            </div>
            <section className="drawer-side">
              <label htmlFor="my-drawer" className="drawer-overlay"></label>
              <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
                {routes.map((route) => (
                  <li key={route.url} className={clsx({ "bg-base-300": false })}>
                    <Link href={route.url}>
                      <div onClick={() => drawerToggleLink.current?.click()}>{route.label}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </nav>
        </SessionProvider>
      </body>
    </html>
  );
}
