import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { themeChange } from "theme-change";
import Layout from "../components/Layout";
import { NextPage } from "next";
import Head from "next/head";

const ThemeContext = createContext<[string, Dispatch<SetStateAction<string>>]>(["light", x => x]);

export const useTheme = () => {
  return useContext(ThemeContext);
};

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
  const [theme, setTheme] = useState("light");

  const getLayout = Component.getLayout || (page => page);

  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <SessionProvider session={session}>
      <ThemeContext.Provider value={[theme, setTheme]}>
        <Head>
          <title>Couple Planner</title>
          <meta name="description" content="An application to help couples plan their lives together" />
        </Head>
        <Layout>
          {getLayout(<Component {...pageProps} />)}
        </Layout>
      </ThemeContext.Provider>
    </SessionProvider>
  );
}

export default MyApp;
