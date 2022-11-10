"use client";

import { ReactNode, useCallback, useEffect, useRef } from "react";
import { themeChange } from "theme-change";
import clsx from "clsx";
import Header from "./header";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function ClientRootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const drawerToggleLink = useRef<HTMLInputElement>(null);

  useEffect(() => {
    themeChange(false);
  }, []);

  const isActiveLink = useCallback(
    (url: string) => {
      return url === "/" ? pathname === url : pathname?.includes(url);
    },
    [pathname]
  );

  return (
    <>
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        defaultChecked={false}
        ref={drawerToggleLink}
      />
      <div className={clsx("drawer-content", "flex", "flex-col", "h-screen")}>
        {!pathname?.includes("auth") && <Header />}
        {children}
      </div>
      <section className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
          {routes.map((route) => (
            <li key={route.url}>
              <Link
                className={clsx({ "bg-base-300": isActiveLink(route.url) })}
                href={route.url}
                onClick={() => drawerToggleLink.current?.click()}
              >
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
