import Head from "next/head";
import { ReactNode, useCallback } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import clsx from "clsx";

type Props = {
  children: ReactNode;
}

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
];

const WeddingLayout = ({ children }: Props) => {
  const router = useRouter();

  const isTabActive = useCallback((tab: { label: string, url: string }) => {
    if (tab.url === "") {
      return router.pathname === "/wedding";
    }
    return router.pathname.includes(`/wedding${tab.url}`);
  }, [router]);

  return (
    <main id="weddings-page" className="p-4 flex-1 bg-base-200 flex flex-col overflow-hidden">
      <Head>
        <title>Wedding</title>
      </Head>
      <div className="tabs justify-center">
        {tabs.map(tab => (
          <div
            key={tab.label}
            className={clsx("tab", "tab-lifted", "w-40", { "tab-active": isTabActive(tab) })}
          >
            <Link href={`/wedding${tab.url}`}>
              {tab.label}
            </Link>
          </div>
        ))}
      </div>
      <section className="bg-base-100 flex-1 overflow-scroll flex flex-col">
        {children}
      </section>
    </main>
  );
};

export default WeddingLayout;
