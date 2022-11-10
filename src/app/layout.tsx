import { ReactNode } from "react";
import "./global.css";
import AuthProvider from "./(contexts)/auth-context";
import ThemeProvider from "./(contexts)/theme-context";
import PageTitleProvider from "./(contexts)/page-title-context";
import ClientRootLayout from "./client-layout";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <title>Couple Planner</title>
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <PageTitleProvider>
              <nav className="drawer">
                <ClientRootLayout>{children}</ClientRootLayout>
              </nav>
            </PageTitleProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
