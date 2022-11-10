"use client";

import { useCallback } from "react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const tabs = [
  {
    label: "Home",
    url: "",
  },
  {
    label: "Venues",
    url: "/venues",
  },
  {
    label: "Guests",
    url: "/guests",
  },
  {
    label: "Budget",
    url: "/budget",
  },
  {
    label: "Seating",
    url: "/seating",
  },
  {
    label: "To-Do List",
    url: "/todos",
  },
];

export default function ClientWeddingLayout() {
  const pathname = usePathname();

  const isTabActive = useCallback(
    (tab: { label: string; url: string }) => {
      if (pathname) {
        if (tab.url === "") {
          return pathname === "/wedding";
        }
        return pathname.includes(`/wedding${tab.url}`);
      }
      return false;
    },
    [pathname]
  );

  return (
    <div className="tabs justify-center">
      {tabs.map((tab) => (
        <div
          key={tab.label}
          className={clsx("tab", "tab-lifted", "w-40", { "tab-active": isTabActive(tab) })}
        >
          <Link prefetch={false} href={`/wedding${tab.url}`}>
            {tab.label}
          </Link>
        </div>
      ))}
    </div>
  );
}
