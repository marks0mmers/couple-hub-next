import Head from "next/head";
import { ReactNode } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

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
  return (
    <main id="weddings-page" className="p-4 flex-1 bg-base-200 flex flex-col">
      <Head>
        <title>Wedding</title>
      </Head>
      <article className="prose max-w-none text-center mb-4">
        <h2>Wedding</h2>
      </article>
      <div className="tabs justify-center">
        {tabs.map(tab => (
          <div
            key={tab.label}
            className={`tab tab-lifted w-40 ${router.pathname === `/wedding${tab.url}` ? "tab-active" : ""}`}
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
