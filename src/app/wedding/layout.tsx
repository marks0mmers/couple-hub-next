import { ReactNode } from "react";
import ClientWeddingLayout from "./client-layout";

type Props = {
  children: ReactNode;
};

export default function ServerWeddingLayout({ children }: Props) {
  return (
    <main id="weddings-page" className="p-4 flex-1 bg-base-200 flex flex-col overflow-hidden">
      <ClientWeddingLayout />
      <section className="bg-base-100 flex-1 overflow-scroll flex flex-col">{children}</section>
    </main>
  );
}
