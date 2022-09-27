import { ReactNode, useRef } from "react";
import Header from "./Header";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";

type Props = {
  children: ReactNode
}

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

const Layout = ({ children }: Props) => {
  const router = useRouter();

  const drawerToggleLink = useRef<HTMLInputElement>(null);

  if (router.pathname.includes("auth")) {
    return <>{children}</>;
  }

  return (
    <nav className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" ref={drawerToggleLink}/>
      <div className="drawer-content flex flex-col">
        <Header/>
        {children}
      </div>
      <section className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
          {routes.map(route => (
            <li key={route.url} className={clsx({ "bg-base-300": router.pathname === route.url })}>
              <Link href={route.url}>
                <div onClick={() => drawerToggleLink.current?.click()}>{route.label}</div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </nav>
  );
};

export default Layout;
