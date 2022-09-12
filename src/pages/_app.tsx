import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ReactElement, ReactNode, useEffect } from "react";
import { themeChange } from "theme-change";
import Layout from "../components/Layout";
import { NextPage } from "next";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  // eslint-disable-next-line no-unused-vars
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout || (page => page);

  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <SessionProvider session={session}>
      <Layout>
        {getLayout(<Component {...pageProps} />)}
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
